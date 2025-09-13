import express from "express";
import multer from "multer";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import {
  addListenToSong,
  createSong,
  deleteSong,
  getSongById,
  getSongs,
} from "#db/query/songs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import requireBody from "#middleware/requireBody";
import { extractDuration } from "#util/getVideoDuration";

const router = express.Router();
const upload = multer();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_BUCKET_NAME;

// Utility to extract the S3 object key from a full file URL
function extractKeyFromUrl(url) {
  // Handles https://bucket.s3.region.amazonaws.com/KEY
  return url.split(".amazonaws.com/")[1];
}

router.get("/", async (_req, res) => {
    const songs = await getSongs();
    
    res.json(songs);
});

router.post(
  "/",
  upload.single("file"),
  requireBody(["title", "artist_id", "album_id", "thumbnail_url"]),
  async (req, res) => {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const key = `songs/${Date.now()}_${file.originalname}`;
    const params = {
      Bucket: BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      await s3.send(new PutObjectCommand(params));
      const duration = await extractDuration(file);
      const file_url = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      const song = await createSong({
        ...req.body,
        duration,
        file_url,
      });
      res.status(201).json(song);
    } catch (err) {
      console.error("S3 error:", err);
      res
        .status(500)
        .json({ error: "File upload failed.", detail: err.message });
    }
  }
);

router.param("id", async (req, res, next, id) => {
  const song = await getSongById(id);

  if (!song) return res.status(404).send("Couldn't find a song with that id.");

  req.song = song;
  next();
});

router.get("/:id", (req, res) => {
  res.json(req.song);
});

// GET pre-signed stream URL for a song
router.get("/:id/stream", async (req, res) => {
  const key = extractKeyFromUrl(req.song.file_url);
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate stream URL" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const song = await deleteSong(req.song.id);
    const key = extractKeyFromUrl(song.file_url);

    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("There was an error processing your request.");
  }
});

router.put("/:id/listened", async (req, res) => {
  await addListenToSong(req.song.id);

  res.status(200).send("Successfully added a listen.");
});

export default router;
