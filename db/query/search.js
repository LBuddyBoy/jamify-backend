import db from "#db/client";

// Accept limit and offset as params, default to 5 results per section
export async function search(
  value,
  artistsOffset = 0,
  songsOffset = 0,
  albumsOffset = 0
) {
  const limit = 5;

  const artistsSQL = `
    SELECT * FROM artists
    WHERE name ILIKE $1
    LIMIT $2 OFFSET $3
  `;
  const songsSQL = `
    SELECT songs.*, json_agg(artists) AS artist
    FROM songs
    JOIN artists ON artists.id = songs.artist_id
    WHERE songs.title ILIKE $1 OR artists.name ILIKE $1
    GROUP BY songs.id
    LIMIT $2 OFFSET $3
  `;
  const albumsSQL = `
    SELECT albums.*, row_to_json(artists) AS artist
    FROM albums
    JOIN artists ON artists.id = albums.artist_id
    WHERE albums.name ILIKE $1 OR artists.name ILIKE $1
    GROUP BY albums.id, artists.id
    LIMIT $2 OFFSET $3
  `;

  const [artists, songs, albums] = await Promise.all([
    db.query(artistsSQL, [`%${value}%`, limit, artistsOffset]),
    db.query(songsSQL, [`%${value}%`, limit, songsOffset]),
    db.query(albumsSQL, [`%${value}%`, limit, albumsOffset]),
  ]);

  return {
    artists: artists.rows,
    songs: songs.rows,
    albums: albums.rows,
  };
}
