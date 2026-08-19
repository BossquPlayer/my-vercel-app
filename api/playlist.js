// api/playlist.js
export default function handler(req, res) {
  // Contoh data playlist (bisa diganti dari database atau file JSON)
  const playlist = [
    { title: "Song A", artist: "Band X", url: "/music/song-a.mp3" },
    { title: "Song B", artist: "Band Y", url: "/music/song-b.mp3" },
    { title: "Song C", artist: "Band Z", url: "/music/song-c.mp3" }
  ];

  res.status(200).json({ playlist });
}
