import db from "#db/client";

export async function createSong({
  title,
  duration,
  file_url,
  artist_id,
  album_id,
  thumbnail_url,
}) {
  const SQL = `
    INSERT INTO songs(title, duration, file_url, artist_id, album_id, thumbnail_url)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *
    `;

  const {
    rows: [song],
  } = await db.query(SQL, [
    title,
    duration,
    file_url,
    artist_id,
    album_id,
    thumbnail_url,
  ]);

  return song;
}

export async function deleteSong(id) {
  const SQL = `
    DELETE FROM songs
    WHERE id = $1
    RETURNING *
    `;

  const {
    rows: [song],
  } = await db.query(SQL, [id]);

  return song;
}

export async function addListenToSong(songId) {
  const SQL = `
  UPDATE songs
  SET listens = listens + 1
  WHERE id = $1
  RETURNING *
  `;

  const {
    rows: [song],
  } = await db.query(SQL, [songId]);

  return song;
}

export async function updateSong(id, fields) {
  const updates = Object.entries(fields).filter(
    ([k, v]) => v !== undefined && v !== null
  );

  const sets = updates.map(([key], i) => `${key} = $${i + 2}`);
  const values = updates.map(([_, value]) => value);

  const SQL = `
    UPDATE songs
    SET ${sets.join(", ")}
    WHERE id = $1
    RETURNING *
    `;

  const {
    rows: [song],
  } = await db.query(SQL, [id, ...values]);

  return song;
}

export async function getSongById(id) {
  const SQL = `
    SELECT * FROM songs
    WHERE id = $1
    `;

  const {
    rows: [song],
  } = await db.query(SQL, [id]);

  return song;
}

export async function getSongs() {
  const SQL = `
    SELECT * FROM songs
    `;

  const { rows } = await db.query(SQL);

  return rows;
}
