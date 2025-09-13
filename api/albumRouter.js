import { getAlbums } from "#db/query/albums";
import requireQuery from "#middleware/requireQuery";
import express from "express";

const router = express.Router();
export default router;

router.get("/", requireQuery(["page", "limit"]), async (req, res) => {
  res.status(200).json(await getAlbums(req.query));
});
