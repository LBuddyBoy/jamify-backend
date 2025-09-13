import { createAlbum } from "#db/query/albums";
import {
  createArtist,
  deleteArtist,
  getArtistAlbums,
  getArtistById,
  getArtists,
  getArtistSongs,
  updateArtist,
} from "#db/query/artists";
import requireBody from "#middleware/requireBody";
import express from "express";

const router = express.Router();
export default router;

router.get("/", async (req, res) => {
  res.status(200).json(await getArtists());
});

router.post("/", requireBody(["name", "bio"]), async (req, res) => {
  const artist = await createArtist(req.body);

  if (!artist) {
    return res.status(400);
  }

  res.status(201).json(artist);
});

router.param("id", async (req, res, next, id) => {
  const artist = await getArtistById(id);

  if (!artist)
    return res.status(404).send("Couldn't find an artist with that id.");

  req.artist = artist;
  next();
});

router.get("/:id", async (req, res) => {
  res.status(200).json(req.artist);
});

router.get("/:id/songs", async (req, res) => {
  res.status(200).json(await getArtistSongs(req.artist.id));
});

router.get("/:id/albums", async (req, res) => {
  res.status(200).json(await getArtistAlbums(req.artist.id));
});

router.post("/:id/albums", requireBody(["name"]), async (req, res) => {
  const { name } = req.body;
  const album = await createAlbum({ name, artist_id: req.artist.id });

  res.status(201).json(album);
});

router.delete("/:id", async (req, res) => {
  res.status(204).json(await deleteArtist(req.artist.id));
});

router.put("/:id", async (req, res) => {
  const artist = await updateArtist(req.artist.id, req.body);
  
  res.status(200).json(artist);
});
