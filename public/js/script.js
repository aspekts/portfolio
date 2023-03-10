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
  const userId = "294870523438170112";
const lanyardUrl = `https://api.lanyard.rest/v1/users/${userId}`;

fetch(lanyardUrl)
  .then(response => response.json())
  .then(presence => {
    if (presence.success) {
      if (presence.data.listening_to_spotify) {
        const songName = presence.data.spotify.song || "Unknown Song";
        const artistName = presence.data.spotify.artist || "Unknown Artist";
        const albumName = presence.data.spotify.album || "Unknown Album";

        const spotifyPresence = document.querySelector(".presence.spotify");
        spotifyPresence.querySelector(".status").textContent = `🎶 - ${songName}\n🎤 - ${artistName}\n💽 - ${albumName}`;
        spotifyPresence.style.display = "flex";
      } 
      else {
        const spotifyPresence = document.querySelector(".presence.spotify");
        spotifyPresence.style.display = "none";
      }
      if (presence.data.activities?.length > 0) {
        presence.data.activities.forEach(activity => {
          if (activity.type === 0 && activity.application_id === "383226320970055681") {
            const vscodePresence = document.querySelector(".presence.vscode");
            vscodePresence.querySelector(".status").textContent = `${ activity.state ? `${activity.state} -` : ""} ${activity.details}`;
            vscodePresence.style.display = "flex";
          }
        });
      }
      else {
        const vscodePresence = document.querySelector(".presence.vscode");
        vscodePresence.style.display = "none";
      }
      if (!presence.data.listening_to_spotify && !(presence.data.activities?.length > 0)) {
        const widget = document.querySelector(".widget");
        widget.style.display = "none";
      }
    } else {
      console.error(`Error fetching presence data: ${presence.message}`);
    }
  })
  .catch(error => console.error(`Error fetching presence data: ${error}`));
