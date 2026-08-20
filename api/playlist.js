import fs from "fs";
import path from "path";
import { parseFile } from "music-metadata";
import ffmpeg from "fluent-ffmpeg";
import ffprobeStatic from "ffprobe-static";

ffmpeg.setFfprobePath(ffprobeStatic.path);

function getVideoMetadata(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      resolve({
        duration: metadata.format.duration,
        size: metadata.format.size
      });
    });
  });
}

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
            duration: metadata.format.duration, // detik
            url: "/music/" + f
          };
        })
    );

    // video
    const videoFiles = await Promise.all(
      fs.readdirSync(videoDir)
        .filter(f => f.endsWith(".mp4"))
        .map(async f => {
          const filePath = path.join(videoDir, f);
          const meta = await getVideoMetadata(filePath);
          return {
            title: f,
            duration: meta.duration, // detik
            size: meta.size,         // byte
            url: "/video/" + f
          };
        })
    );

    res.status(200).json({ audio: audioFiles, video: videoFiles });
  } catch (err) {
    console.error("Error ambil playlist:", err);
    res.status(500).json({ error: "Gagal ambil playlist" });
  }
}
