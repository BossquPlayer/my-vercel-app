import fs from "fs";
import path from "path";
import { parseFile } from "music-metadata";

export default async function handler(req, res) {
  try {
    const audioDir = path.join(process.cwd(), "public", "music");
    const videoDir = path.join(process.cwd(), "public", "video");

    // audio
    const audioFiles = await Promise.all(
      fs.readdirSync(audioDir)
        .filter(f => f.endsWith(".mp3"))
        .map(async f => {
          const metadata = await parseFile(path.join(audioDir, f));
          return {
            title: metadata.common.title || f,
            artist: metadata.common.artist || "Unknown",
            duration: metadata.format.duration, // dalam detik
            url: "/music/" + f
          };
        })
    );

    // video (pakai fs.stat untuk ukuran, atau ffprobe untuk durasi)
    const videoFiles = fs.readdirSync(videoDir)
      .filter(f => f.endsWith(".mp4"))
      .map(f => ({
        title: f,
        url: "/video/" + f
        // durasi bisa ditambahkan dengan ffprobe
      }));

    res.status(200).json({ audio: audioFiles, video: videoFiles });
  } catch (err) {
    console.error("Error ambil playlist:", err);
    res.status(500).json({ error: "Gagal ambil playlist" });
  }
}
