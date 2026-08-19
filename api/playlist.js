<div id="audioPlaylist"></div>
<div id="videoPlaylist"></div>

<script>
  async function loadPlaylist() {
    try {
      const res = await fetch("/api/playlist");
      const data = await res.json();

      const audioDiv = document.getElementById("audioPlaylist");
      const videoDiv = document.getElementById("videoPlaylist");

      // Render audio
      audioDiv.innerHTML = data.audio.map(item =>
        `<div>
           <button onclick="playMedia('${item.url}', 'audio')">${item.title}</button>
         </div>`
      ).join("");

      // Render video
      videoDiv.innerHTML = data.video.map(item =>
        `<div>
           <button onclick="playMedia('${item.url}', 'video')">${item.title}</button>
         </div>`
      ).join("");

    } catch (err) {
      console.error("Gagal load playlist:", err);
    }
  }

  function playMedia(url, type) {
    const player = document.getElementById("mediaPlayer");
    player.src = url;
    player.type = type === "audio" ? "audio/mp3" : "video/mp4";
    player.play();
  }

  // Panggil saat halaman load
  loadPlaylist();
</script>
