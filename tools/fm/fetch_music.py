"""Pull listening data from stats.fm and resolve each CD against Apple's catalogue.

A CD's track comes from Apple's own track list for that exact album, so a preview can
never be a different song or a different record. Output is committed, so a build never
depends on either service.
"""
import json
import re
import time
import unicodedata
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
COVERS = ROOT / "public/fm/covers"
STATS = "https://api.stats.fm/api/v1/users/buh"

# id, album artist, title, and a track to prefer when plays do not settle it
CDS = [
    ("melt", "Denzel Curry", "Melt My Eyez See Your Future"),
    ("sankofa", "redveil", "sankofa"),
    ("wgo", "Marvin Gaye", "What's Going On", "What's Going On"),
    ("hoes", "JPEGMAFIA", "Scaring the Hoes"),
    ("spergy", "Daniel Caesar", "Son of Spergy", "Have a Baby (With Me)"),
    ("nine", "Damien Rice", "9", "9 Crimes"),
    ("demon", "Gorillaz", "Demon Days", "Dirty Harry"),
    ("ftbyh", "James Blake", "Friends That Break Your Heart"),
    ("bewitched", "Laufey", "Bewitched: The Goddess Edition"),
    ("poster", "Charlie Bennett", "Posterboy"),
]


# Each station gets a different corner of the listening history. Artists are in the order
# to try: the first with a clean, playable track of his own wins.
DIAL = [
    ("marcus", "Alternative hip-hop", ["redveil", "JPEGMAFIA", "Danny Brown", "Tyler, The Creator", "MIKE"]),
    ("sendix", "R&B", ["Daniel Caesar", "emawk", "Mac Ayres", "Masego"]),
    ("ncr", "UK grime", ["Knucks", "slowthai", "Dave", "BexBlu"]),
    ("yarn", "Bedroom pop", ["beabadoobee", "Clairo", "Garrett Sparrow", "Still Woozy"]),
    ("pollo", "Electronic", ["KAYTRANADA", "FKJ", "James Blake"]),
    ("poeapi", "Hyperpop", ["Lucy Bedroque", "Skyte", "Jane Remover", "marshall4", "9lives"]),
    ("goodcode", "Classic soul", ["Marvin Gaye", "Stevie Wonder", "Donny Hathaway", "Barry White"]),
    ("unclaimed", "Jazz rap", ["The Alchemist", "colin!", "Boldy James", "Westside Gunn", "MF DOOM"]),
    ("jotter", "Bossa nova", ["Antônio Carlos Jobim", "Johnny Alf", "Evinha", "João Gilberto"]),
    ("fluxfile", "Italian film score", ["Piero Piccioni", "Stelvio Cipriani", "Piero Umiliani"]),
    ("trackside", "UK garage", ["Paul Stephan", "Zuko Rosemeid", "KiLLOWEN", "KYLE", "scruz"]),
    ("recordbox", "Vocal jazz", ["Frank Sinatra", "Laufey", "Louis Armstrong", "The Four Freshmen"]),
    ("workshop", "K-pop", ["fromis_9", "NewJeans", "Red Velvet", "DEAN", "EXO"]),
]


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "aspekts.dev build"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.load(r)


CACHE = Path(__file__).parent / ".itunes-cache.json"
cache = json.loads(CACHE.read_text(encoding="utf8")) if CACHE.exists() else {}


def itunes(path, **params):
    """Apple allows about 20 calls a minute, so pace them and keep the answers."""
    url = f"https://itunes.apple.com/{path}?" + urllib.parse.urlencode({"country": "GB", **params})
    if url not in cache:
        time.sleep(3.3)
        cache[url] = get(url)["results"]
        CACHE.write_text(json.dumps(cache), encoding="utf8")
    return cache[url]


def norm(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    s = re.sub(r"\s*[-(\[].*?(ep|single|deluxe|remaster\w*|edition|version).*$", "", s)
    return re.sub(r"[^a-z0-9]+", "", s)


def track(item):
    t = item["track"]
    ids = t.get("externalIds") or {}
    album = (t.get("albums") or [{}])[0]
    return {
        "title": t["name"],
        "artist": ", ".join(a["name"] for a in t["artists"][:2]),
        "album": album.get("name"),
        "cover": album.get("image"),
        "preview": t.get("appleMusicPreview"),
        "explicit": t.get("explicit", False),
        "ms": t.get("durationMs", 0),
        "link": f"https://music.apple.com/gb/song/{ids['appleMusic'][0]}" if ids.get("appleMusic")
        else f"https://open.spotify.com/track/{ids['spotify'][0]}" if ids.get("spotify") else None,
        "plays": item.get("streams"),
    }


def is_album(a, title):
    name = a["collectionName"]
    return norm(name) == norm(title) and "Single" not in name and "Mix)" not in name


def find_album(artist, title):
    for term in (f"{title} {artist}", title):
        for a in itunes("search", term=term, entity="album", limit=25):
            if is_album(a, title) and norm(artist) in norm(a["artistName"]):
                return a
    for hit in itunes("search", term=artist, entity="musicArtist", limit=5):
        if norm(hit["artistName"]) != norm(artist):
            continue
        for a in itunes("lookup", id=hit["artistId"], entity="album", limit=200)[1:]:
            if is_album(a, title):
                return a
    return None


def same_artist(wanted, credited):
    """The whole name, not part of one: "MIKE" must not match "Mike Posner"."""
    return norm(wanted) in {norm(n) for n in re.split(r"\s*(?:,|&|\bx\b|feat\.?)\s*", credited, flags=re.I)}


def same_album(a, b):
    return bool(a) and norm(a) == norm(b or "")


def apple_preview(t, artist):
    """Find a clean Apple copy of this exact recording, or nothing.

    A title match alone found a different song by a different artist. It must now be
    the same artist, the same album and the same length.
    """
    for r in itunes("search", term=f"{t['title']} {artist}", entity="song", limit=15):
        if (norm(r["trackName"]) == norm(t["title"])
                and same_artist(artist, r["artistName"])
                and same_album(r.get("collectionName"), t["album"])
                and abs(r.get("trackTimeMillis", 0) - t["ms"]) < 4000
                and r.get("previewUrl") and r.get("trackExplicitness") != "explicit"):
            return r["previewUrl"], r["artworkUrl100"].replace("100x100bb", "300x300bb"), r["trackViewUrl"].split("?")[0]
    return None


def build_dial(ids):
    """For each genre, his most-played track across its artists that can play clean."""
    dial, used = {}, set()
    for station, genre, artists in DIAL:
        best = None
        for artist in artists:
            artist_id = ids.get(norm(artist))
            if not artist_id:
                continue
            for item in get(f"{STATS}/top/artists/{artist_id}/tracks?range=lifetime&limit=15")["items"]:
                t = track(item)
                if artist_id not in [a["id"] for a in item["track"]["artists"]] and not same_artist(artist, t["artist"]) and norm(artist) != "colin":
                    continue
                if best and t["plays"] <= best["plays"]:
                    break
                if norm(t["title"]) in used:
                    continue
                if t["explicit"] or not t["preview"]:
                    found = apple_preview(t, artist)
                    if not found:
                        continue
                    t["preview"], t["cover"], t["link"] = found
                    t["explicit"] = False
                    t["source"] = "apple, verified"
                t["source"] = t.get("source", "stats.fm")
                best = t
                break
        if best:
            used.add(norm(best["title"]))
            dial[station] = {**best, "genre": genre}
        print(f"{station:10s} {genre:20s}", f'{best["title"]} | {best["artist"]} | {best["album"]} | {best["plays"]} plays | {best["source"]}' if best else "NOTHING PLAYABLE", flush=True)
    return dial


def main():
    COVERS.mkdir(parents=True, exist_ok=True)

    lifetime = get(f"{STATS}/streams/stats?range=lifetime")["items"]
    top_artists = get(f"{STATS}/top/artists?range=lifetime&limit=1000")["items"]
    plays = {}
    for item in get(f"{STATS}/top/tracks?range=lifetime&limit=500")["items"]:
        for a in item["track"]["artists"]:
            key = norm(item["track"]["name"]), norm(a["name"])
            plays[key] = plays.get(key, 0) + item["streams"]

    # The global chart stops at 500, so ask for each CD's artist directly.
    ids = {norm(i["artist"]["name"]): i["artist"]["id"] for i in top_artists}
    for _, artist, *_ in CDS:
        if norm(artist) in ids:
            for item in get(f"{STATS}/top/artists/{ids[norm(artist)]}/tracks?range=lifetime&limit=200")["items"]:
                plays[norm(item["track"]["name"]), norm(artist)] = item["streams"]
            time.sleep(.3)

    rotation = [track(i) for rng in ("weeks", "months") for i in get(f"{STATS}/top/tracks?range={rng}&limit=50")["items"]]
    seen, playable = set(), []
    for t in rotation:
        key = norm(t["title"]) + norm(t["artist"])
        if t["preview"] and t["cover"] and not t["explicit"] and key not in seen:
            seen.add(key)
            playable.append(t)

    cds = {}
    for cd_id, artist, title, *prefer in CDS:
        album = find_album(artist, title)
        if not album:
            print("no album:", artist, title)
            continue
        cover = album["artworkUrl100"].replace("100x100bb", "600x600bb")
        urllib.request.urlretrieve(cover, COVERS / f"{cd_id}.jpg")
        songs = [s for s in itunes("lookup", id=album["collectionId"], entity="song", limit=60)[1:] if s.get("previewUrl")]
        wanted = norm(prefer[0]) if prefer else None
        mine = lambda s: plays.get((norm(s["trackName"]), norm(artist)), 0)
        songs.sort(key=lambda s: (-mine(s), not (wanted and norm(s["trackName"]).startswith(wanted))))
        song = songs[0] if songs else None
        cds[cd_id] = {
            "album": album["collectionName"],
            "albumArtist": album["artistName"],
            "albumUrl": album["collectionViewUrl"].split("?")[0],
            "title": song and song["trackName"],
            "preview": song and song["previewUrl"],
            "myPlays": song and mine(song),
        }
        print(f"{cd_id}: {album['collectionName']} / {album['artistName']} -> {song and song['trackName']} ({cds[cd_id]['myPlays']} plays)")

    dial = build_dial(ids)

    out = {
        "dial": dial,
        "stats": {
            "plays": lifetime["count"],
            "hours": round(lifetime["durationMs"] / 3.6e6),
            "artists": lifetime["cardinality"]["artists"],  # fail here rather than publish a gap
        },
        "rotation": playable[:24],
        "artists": [{"name": i["artist"]["name"], "plays": i["streams"], "image": i["artist"].get("image")} for i in top_artists[:8]],
        "cds": cds,
    }
    (ROOT / "src/content/music.generated.json").write_text(json.dumps(out, indent=1, ensure_ascii=False), encoding="utf8")
    print(out["stats"], len(playable), "playable")
    for t in playable[:12]:
        print(" ", t["title"], "|", t["artist"], "|", t["plays"])


if __name__ == "__main__":
    main()
