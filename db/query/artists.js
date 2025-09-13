import db from "#db/client";

export async function createArtist({ name, bio }) {
  const SQL = `
    INSERT INTO artists(name, bio)
    VALUES($1, $2)
    RETURNING *
    `;

  const {
    rows: [artist],
  } = await db.query(SQL, [name, bio]);

  return artist;
}

export async function deleteArtist(id) {
  const SQL = `
    DELETE FROM artists
    WHERE id = $1
    RETURNING *
    `;

  const {
    rows: [artist],
  } = await db.query(SQL, [id]);

  return artist;
}

export async function updateArtist(id, fields) {
  const updates = Object.entries(fields).filter(
    ([k, v]) => v !== undefined && v !== null
  );

  const sets = updates.map(([key], i) => `${key} = $${i + 2}`);
  const values = updates.map(([_, value]) => value);

  const SQL = `
    UPDATE artists
    SET ${sets.join(", ")}
    WHERE id = $1
    RETURNING *
    `;

  const {
    rows: [artist],
  } = await db.query(SQL, [id, ...values]);

  return artist;
}

export async function getArtists() {
  const SQL = `
    SELECT * FROM artists
    `;

  const { rows } = await db.query(SQL);

  return rows;
}

export async function getArtistById(id) {
  const SQL = `
    SELECT * FROM artists
    WHERE id = $1
    `;

  const {
    rows: [artist],
  } = await db.query(SQL, [id]);

  return artist;
}

export async function getArtistSongs(id) {
  const SQL = `
  SELECT songs.*
  FROM songs
  JOIN artists ON artists.id = $1
  WHERE songs.artist_id = artists.id
  GROUP BY songs.id
  `;

  const { rows } = await db.query(SQL, [id]);

  return rows;
}

export async function getArtistAlbums(id) {
  const SQL = `
  SELECT albums.*, row_to_json(artists) AS artist
  FROM albums
  JOIN artists ON artists.id = $1
  WHERE albums.artist_id = artists.id
  GROUP BY albums.id, artists.*
  `;

  const { rows } = await db.query(SQL, [id]);

  return rows;
}
