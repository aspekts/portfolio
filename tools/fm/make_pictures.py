"""Build the picture each station transmits, at the 320x240 the signal carries."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont, ImageOps

HERE = Path(__file__).parent
DOCS = HERE.parents[2]
SENDIX = DOCS / "SendixMVP/marketing"
YARN = DOCS / "Yarn-Site"
OUT = HERE.parents[1] / "public/fm"
S = 4  # supersample, then reduce, so type survives the low resolution
W, H = 240 * S, 180 * S

YELLOW, INK, HOT, WHITE, BLACK = "#FFD400", "#0A23D8", "#FF3B1D", "#FFFFFF", "#111111"
GREEN, PINK, TEAL = "#00A651", "#FF7AC6", "#00B5B8"


def big(size):
    return ImageFont.truetype(str(HERE / "fonts/DelaGothicOne-Regular.ttf"), size * S)


def text_font(size, weight=600):
    f = ImageFont.truetype(str(HERE / "fonts/SplineSans.ttf"), size * S)
    f.set_variation_by_axes([weight])
    return f


def canvas(bg):
    img = Image.new("RGB", (W, H), bg)
    return img, ImageDraw.Draw(img)


def save(img, name):
    img.resize((320, 240), Image.LANCZOS).save(OUT / f"{name}.png", optimize=True)


def centred(d, y, text, font, fill):
    d.text((W / 2, y * S), text, font=font, fill=fill, anchor="mm")


def marcus():
    src = Image.open(HERE / "source/marcus.jpg").convert("RGB")
    w, h = src.size
    crop = src.crop((0, int(h * .44), w, int(h * .44) + int(w * .75)))
    crop = ImageEnhance.Color(crop.resize((320, 240), Image.LANCZOS)).enhance(1.12)
    crop.save(OUT / "marcus.png", optimize=True)
    full = ImageOps.exif_transpose(src)
    full.thumbnail((1200, 1600))
    full.save(OUT / "marcus-full.jpg", quality=84, optimize=True)


def sendix():
    art = Image.open(SENDIX / "brand-socials/export/landscape/sendix-logo-landscape-artwork.png").convert("RGB")
    art.crop((533, 0, 1867, 1000)).resize((320, 240), Image.LANCZOS).save(OUT / "sendix.png", optimize=True)


def capture(name):
    """A real screen from the project itself."""
    Image.open(HERE / f"source/{name}.jpg").convert("RGB").resize((320, 240), Image.LANCZOS).save(OUT / f"{name}.png", optimize=True)


def ncr():
    img, _ = canvas(WHITE)
    logo = Image.open(HERE / "source/ncr-logo.png").convert("RGB")
    logo = logo.crop(ImageOps.invert(logo.convert("L")).getbbox())
    width = 200 * S
    logo = logo.resize((width, logo.height * width // logo.width), Image.LANCZOS)
    img.paste(logo, ((W - logo.width) // 2, (H - logo.height) // 2))
    save(img, "ncr")


def goodcode():
    capture("goodcode")


def unclaimed():
    capture("unclaimed")


def jotter():
    capture("jotter")


def yarn():
    img, d = canvas("#D3A2A0")
    logo = Image.open(YARN / "public/yarn.jpeg").convert("RGB").resize((132 * S, 132 * S), Image.LANCZOS)
    img.paste(logo, (54 * S, 2 * S))
    centred(d, 140, "Yarn Development", big(19), WHITE)
    centred(d, 164, "Clients since I was 15", text_font(15, 700), WHITE)
    save(img, "yarn")


def pollo():
    img, d = canvas(YELLOW)
    logo = Image.open(HERE / "source/pollo.jpg").convert("RGB").resize((132 * S, 132 * S), Image.LANCZOS)
    mask = Image.new("L", logo.size, 0)
    ImageDraw.Draw(mask).ellipse((0, 0, logo.width, logo.height), fill=255)
    img.paste(logo, (54 * S, 4 * S), mask)
    centred(d, 156, "250,000+ users", big(24), INK)
    save(img, "pollo")


def poeapi():
    img, d = canvas(BLACK)
    centred(d, 52, "NO API?", big(36), HOT)
    centred(d, 104, "BUILT ONE", big(32), YELLOW)
    centred(d, 150, "PoeAPI, 70 stars", text_font(16, 700), WHITE)
    save(img, "poeapi")


def fluxfile():
    capture("fluxfile")


def trackside():
    src = Image.open(HERE / "source/karting.jpg").convert("RGB")
    w, h = src.size
    top = int(h * .17)
    crop = src.crop((0, top, w, top + int(w * .75)))
    wide = ImageEnhance.Brightness(crop).enhance(1.35)
    wide = ImageEnhance.Color(wide).enhance(1.2)
    wide.resize((320, 240), Image.LANCZOS).save(OUT / "trackside.png", optimize=True)


def recordbox():
    img, d = canvas(INK)
    ids = ["sankofa", "demon", "wgo", "hoes", "melt", "ftbyh", "spergy", "nine", "bewitched", "poster"]
    side = 48 * S
    for i, name in enumerate(ids):
        cover = Image.open(OUT / f"covers/{name}.jpg").convert("RGB").resize((side, side), Image.LANCZOS)
        img.paste(cover, ((i % 5) * side, (i // 5) * side))
    centred(d, 142, "The Shelf", big(24), YELLOW)
    centred(d, 166, "11 CDs I actually own", text_font(15, 700), WHITE)
    save(img, "recordbox")


def workshop():
    src = Image.open(HERE / "source/dinosaur.jpg").convert("RGB")
    w, h = src.size
    crop = src.crop((0, 0, int(h * 4 / 3), h))
    crop.resize((320, 240), Image.LANCZOS).save(OUT / "workshop.png", optimize=True)


def og():
    """The share card: 1200x630, name on the page colour beside the photo."""
    card = Image.new("RGB", (1200, 630), YELLOW)
    d = ImageDraw.Draw(card)
    photo = ImageOps.fit(Image.open(HERE / "source/marcus.jpg").convert("RGB"), (560, 630), Image.LANCZOS, centering=(.62, .78))
    card.paste(photo, (640, 0))
    d.text((48, 150), "Marcus", font=ImageFont.truetype(str(HERE / "fonts/DelaGothicOne-Regular.ttf"), 94), fill=INK)
    d.text((48, 262), "Kamuntu", font=ImageFont.truetype(str(HERE / "fonts/DelaGothicOne-Regular.ttf"), 94), fill=INK)
    f = ImageFont.truetype(str(HERE / "fonts/SplineSans.ttf"), 34)
    f.set_variation_by_axes([700])
    d.text((52, 398), "Software engineer and founder.", font=f, fill=INK)
    d.text((52, 442), "I collect music and make things.", font=f, fill=INK)
    card.save(OUT / "og.jpg", quality=86, optimize=True)


OUT.mkdir(exist_ok=True)
for draw in (og, marcus, sendix, ncr, yarn, pollo, poeapi, goodcode, unclaimed, jotter, fluxfile, trackside, recordbox, workshop):
    draw()
