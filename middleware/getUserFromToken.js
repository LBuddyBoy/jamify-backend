import { getUserById } from "#db/query/users";
import { verifyJWT } from "#util/jwt";

export default async function getUserFromToken(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next();
  }

  const token = authorization.split(" ")[1];
  try {
    const { id } = verifyJWT(token);
    const user = await getUserById(id);
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    res.status(401).send("Invalid token.");
  }
}
