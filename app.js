import express from "express";
import cors from "cors";
import morgan from "morgan";
import usersRouter from "#api/usersRouter";
import playlistRouter from "#api/playlistRouter";
import songsRouter from "#api/songsRouter";
import artistsRouter from "#api/artistsRouter";
import { search } from "#db/query/search";
import requireBody from "#middleware/requireBody";
import getUserFromToken from "#middleware/getUserFromToken";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(getUserFromToken);

app.use("/users", usersRouter);
app.use("/playlists", playlistRouter);
app.use("/songs", songsRouter);
app.use("/artists", artistsRouter);

app.get("/", (req, res) => {
  res.send("Jamify Online ✅");
});

app.post(
  "/search/:query",
  requireBody(["artistsOffset", "songsOffset", "albumsOffset"]),
  async (req, res) => {
    const { query } = req.params;
    let { artistsOffset, songsOffset, albumsOffset } = req.body;

    if (!artistsOffset) artistsOffset = 0;
    if (!songsOffset) songsOffset = 0;
    if (!albumsOffset) albumsOffset = 0;

    const data = await search(query, artistsOffset, songsOffset, albumsOffset);

    res.status(200).json(data);
  }
);

app.use((err, req, res, next) => {
  switch (err.code) {
    case "23505":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});

export default app;
