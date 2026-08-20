import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    // folder audio & video
    const audioDir = path.join(process.cwd(), "public", "music");
    const videoDir = path.join(process.cwd(), "public", "video");

    // baca file audio
    const audioFiles = fs.readdirSync(audioDir)
      .filter(f => f.endsWith(".mp3"))
      .map(f => ({
        title: f,
        url: "/music/" + f
      }));

    // baca file video
    const videoFiles = fs.readdirSync(videoDir)
      .filter(f => f.endsWith(".mp4"))
      .map(f => ({
        title: f,
        url: "/video/" + f
      }));

    res.status(200).json({
      audio: audioFiles,
      video: videoFiles
    });
  } catch (err) {
    console.error("Error ambil playlist:", err);
    res.status(500).json({ error: "Gagal ambil playlist" });
  }
}
