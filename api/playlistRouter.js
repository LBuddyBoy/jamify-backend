import express from "express";
import requireBody from "#middleware/requireBody";
import {
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getPlaylists,
  getPlaylistsByName,
  updatePlaylist,
} from "#db/query/playlists";
import {
  addToPlaylist,
  getPlaylistSongs,
  removeFromPlaylist,
} from "#db/query/playlist_songs";
import { getSongById } from "#db/query/songs";
import { requireUser } from "#middleware/requireUser";
import requireQuery from "#middleware/requireQuery";

const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).json(await getPlaylists(req.query));
});

router.post("/", requireUser, requireBody(["name"]), async (req, res) => {
  const playlist = await createPlaylist({ ...req.body, owner_id: req.user.id });

  if (!playlist) {
    return res.status(400);
  }

  res.status(201).json(playlist);
});

router.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id);

  if (!playlist)
    return res.status(404).send("Couldn't find a playlist with that id.");

  if (!playlist.is_public && playlist.owner_id !== req.user?.id)
    return res.status(401).send("Access denied.");

  req.playlist = playlist;
  next();
});

router
  .route("/:id")
  .get(async (req, res) => {
    res.status(200).json(req.playlist);
  })
  .delete(requireUser, async (req, res) => {
    if (req.playlist.owner_id !== req.user?.id)
      return res.status(401).send("Access denied.");

    res.status(204).json(await deletePlaylist(req.playlist.id));
  })
  .put(requireUser, async (req, res) => {
    if (req.playlist.owner_id !== req.user?.id)
      return res.status(401).send("Access denied.");

    const playlist = await updatePlaylist(req.playlist.id, req.body);
    res.status(200).json(playlist);
  });

router.get("/:id/songs", async (req, res) => {
  res.status(200).json(
    await getPlaylistSongs({
      playlist_id: req.playlist.id,
      ...req.query,
    })
  );
});

router.param("songId", async (req, res, next, id) => {
  const song = await getSongById(id);

  if (!song) return res.status(404).send("Couldn't find a song with that id.");

  req.song = song;
  next();
});

router
  .route("/:id/songs/:songId")
  .post(async (req, res) => {
    if (req.playlist.owner_id !== req.user?.id)
      return res.status(401).send("Access denied.");

    const playlist_song = await addToPlaylist({
      playlist_id: req.playlist.id,
      song_id: req.song.id,
    });

    res.status(200).json(playlist_song);
  })
  .delete(async (req, res) => {
    if (req.playlist.owner_id !== req.user?.id)
      return res.status(401).send("Access denied.");

    const playlist_song = await removeFromPlaylist({
      playlist_id: req.playlist.id,
      song_id: req.song.id,
    });

    if (!playlist_song) {
      return res.status(404).send("Couldn't find a song to delete.");
    }

    res.status(204);
  });

export default router;
