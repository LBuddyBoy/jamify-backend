import db from "#db/client";

export async function createUser({ username, email, password }) {
  const SQL = `
    INSERT INTO users(username, email, password)
    VALUES($1, $2, crypt($3, gen_salt('bf')))
    RETURNING *
    `;

  const {
    rows: [user],
  } = await db.query(SQL, [username, email, password]);

  return user;
}

export async function getUserById(id) {
  const SQL = `
    SELECT * 
    FROM users
    WHERE id = $1 
    `;

  const {
    rows: [user],
  } = await db.query(SQL, [id]);

  return user;
}

export async function updateUser(id, fields) {
  const updates = Object.entries(fields).filter(
    ([k, v]) => v !== undefined && v !== null
  );

  const sets = updates.map(([key], i) => `${key} = $${i + 2}`);
  const values = updates.map(([_, value]) => value);

  const SQL = `
    UPDATE users
    SET ${sets.join(", ")}
    WHERE id = $1
    RETURNING *
    `;

  const {
    rows: [user],
  } = await db.query(SQL, [id, ...values]);

  return user;
}

export async function verifyUser({ email, password }) {
  const SQL = `
    SELECT *
    FROM users
    WHERE email = $1 AND password = crypt($2, password)
    `;

  const {
    rows: [user],
  } = await db.query(SQL, [email, password]);

  return user;
}
