import db from "#db/client";

export async function createAlbum({ name, thumbnail_url, artist_id }) {
  const SQL = `
    INSERT INTO albums(name, thumbnail_url, artist_id)
    VALUES($1, $2, $3)
    RETURNING *
    `;

  const {
    rows: [album],
  } = await db.query(SQL, [name, thumbnail_url, artist_id]);

  return album;
}

export async function deleteAlbum(id) {
  const SQL = `
    DELETE FROM albums
    WHERE id = $1
    RETURNING *
    `;

  const {
    rows: [album],
  } = await db.query(SQL, [id]);

  return album;
}

export async function updateAlbum(id, fields) {
  const updates = Object.entries(fields).filter(
    ([k, v]) => v !== undefined && v !== null
  );

  const sets = updates.map(([key], i) => `${key} = $${i + 2}`);
  const values = updates.map(([_, value]) => value);

  const SQL = `
    UPDATE albums
    SET ${sets.join(", ")}
    WHERE id = $1
    RETURNING *
    `;

  const {
    rows: [album],
  } = await db.query(SQL, [id, ...values]);

  return album;
}

export async function getAlbums({ page = 1, limit = 10 }) {
  const SQL = `
    SELECT * FROM albums
    LIMIT $1 OFFSET $2
    `;

  const { rows } = await db.query(SQL, [limit, (page - 1) * limit]);

  return rows;
}

export async function getAlbumById(id) {
  const SQL = `
    SELECT * FROM albums
    WHERE id = $1
    `;

  const {
    rows: [album],
  } = await db.query(SQL, [id]);

  return album;
}

export async function getAlbumSongs(id) {
  const SQL = `
    SELECT albums.*, json_agg(songs) AS songs
    FROM albums
    JOIN songs ON songs.album_id = $1
    WHERE albums.id = $1
    GROUP BY albums.id
    `;

  const { rows } = await db.query(SQL, [id, start, limit]);

  return rows;
}
