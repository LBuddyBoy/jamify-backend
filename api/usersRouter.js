import { createUser, getUserById, updateUser, verifyUser } from "#db/query/users";
import requireBody from "#middleware/requireBody";
import { createJWT, verifyJWT } from "#util/jwt";
import express from "express";
const router = express.Router();

router.post(
  "/register",
  requireBody(["username", "email", "password"]),
  async (req, res) => {
    res.status(201).json(await createUser(req.body));
  }
);

router.post("/login", requireBody(["email", "password"]), async (req, res) => {
  const user = await verifyUser(req.body);

  if (!user) return res.status(404).send("Invalid credentials.");

  const jwt = createJWT(user.id);

  res.status(200).json({
    jwt,
    user,
  });
});

router.post("/me", requireBody(["jwt"]), async (req, res) => {
  const { jwt } = req.body;
  const { id } = verifyJWT(jwt);

  if (!id)
    return res.status(404).send("That JWT has either expired or is invalid.");

  const user = await getUserById(id);

  if (!user) return res.status(404).send("User not found.");

  res.status(200).json(user);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const user = await updateUser(id, req.body);
  res.status(200).json(user);
});

export default router;
