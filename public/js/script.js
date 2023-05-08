var TxtRotate = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  };
  
  TxtRotate.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];
  
    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }
  
    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
  
    var that = this;
    var delta = 300 - Math.random() * 100;
  
    if (this.isDeleting) { delta /= 2; }
  
    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }
  
    setTimeout(function() {
      that.tick();
    }, delta);
  };
  
  window.onload = function() {
    var elements = document.getElementsByClassName('txt-rotate');
    for (var i=0; i<elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-rotate');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtRotate(elements[i], JSON.parse(toRotate), period);
      }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
    document.body.appendChild(css);
  };
  //lanyard data
  const id = "294870523438170112";
const lanyardUrl = `https://api.lanyard.rest/v1/users/${id}`;
const Op = {
  Event: 0,
  Hello: 1,
  Initalize: 2,
  Heartbeat: 3,
};

const Event = {
  InitState: 'INIT_STATE',
  PresenceUpdate: 'PRESENCE_UPDATE',
};

let lanyardHeartbeat;
let spotifyInterval;
let regInterval;
function msToMinutesAndSeconds(ms) {
  let minutes = Math.floor(ms / 60000);
  let seconds = Number(((ms % 60000) / 1000).toFixed(0));
  return seconds == 60
    ? minutes + 1 + ":00"
    : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
function mstoHMS(ms) {
return new Date(ms).toISOString().substring(11, 19);
}
function presenceUpdate(presence) {
  console.log(presence);
    if (presence) {
      if (presence.listening_to_spotify) {
        const songURL = `https://open.spotify.com/track/${presence.spotify.track_id}`
        const songName = presence.spotify.song || "Unknown Song";
        const artistName = presence.spotify.artist || "Unknown Artist";
        const albumName = presence.spotify.album || "Unknown Album";       
        const spotifyPresence = document.querySelector(".presence.spotify");
        spotifyPresence.querySelector(".status").innerHTML = `<a href="${songURL}">🎶 · ${songName}<br />🎤 · ${artistName}<br />💽 · ${albumName}</a>`;
        spotifyPresence.style.display = "flex";
        function updateTimestamp() {
        spotifyPresence.querySelector(".duration").innerText = `${msToMinutesAndSeconds(
          new Date().getTime() - presence.spotify.timestamps.start,
        )} - ${msToMinutesAndSeconds(presence.spotify.timestamps.end - presence.spotify.timestamps.start)}`;
      }

      clearInterval(spotifyInterval);
      spotifyInterval = setInterval(() => updateTimestamp(), 800);
      updateTimestamp();
 
      } 
      else {
        const spotifyPresence = document.querySelector(".presence.spotify");
        spotifyPresence.style.display = "none";
      }
      if (presence.activities?.length > 0) {
        presence.activities.forEach(activity => {

          if (activity.type === 0 && activity.application_id === "383226320970055681") {
            const vscodePresence = document.querySelector(".presence.vscode");
            vscodePresence.querySelector(".status").innerHTML = `${ activity.state ? `${activity.state} <br />` : ""} ${activity.details}`;
            vscodePresence.style.display = "flex";
            function regupdateTimestamp() {
            vscodePresence.querySelector(".duration").innerText = `${mstoHMS(
              new Date().getTime() - activity.timestamps.start,
            )} elapsed`;
          }
          clearInterval(regInterval);
          regInterval = setInterval(() => regupdateTimestamp(), 800);
          regupdateTimestamp();
          }
          else {
            const vscodePresence = document.querySelector(".presence.vscode");
            vscodePresence.style.display = "none";
          }
        });
      }
      else {
        const vscodePresence = document.querySelector(".presence.vscode");
        vscodePresence.style.display = "none";
      }
      if (!presence.listening_to_spotify && !(presence.activities?.length > 0)) {
        const widget = document.querySelector(".widget");
        widget.style.display = "none";
      }
    } else {
      console.error(`Error fetching presence data: ${presence.message}`);
    }
  }
  function connect() {
    const socket = new WebSocket('wss://api.lanyard.rest/socket');

    function send(op, d) {
      if (socket.readyState != socket.OPEN) return;
      return socket.send(JSON.stringify({ op, d }));
    }

    socket.onopen = () => {
      console.log('Connected to socket');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.op) {
        case Op.Hello: {
          console.log('Got hello op');

          lanyardHeartbeat = setInterval(() => send(Op.Heartbeat), data.d.heartbeat_interval);

          send(Op.Initalize, { subscribe_to_id: id || '156114103033790464' });

          break;
        }
        case Op.Event: {
          switch (data.t) {
            case Event.InitState:
            case Event.PresenceUpdate: {
              presenceUpdate(data.d);
              break;
            }
          }

          break;
        }
      }
    };

    socket.onclose = (event) => {
      clearInterval(lanyardHeartbeat);
      clearInterval(spotifyInterval);

      console.log('Socket closed', event.reason, event.code);
      connect();
    };
  }
  connect();