import db from "#db/client";

export async function addToPlaylist({ playlist_id, song_id }) {
  const SQL = `
    INSERT INTO playlist_songs(playlist_id, song_id)
    VALUES($1, $2)
    RETURNING *
    `;

  const {
    rows: [playlist_song],
  } = await db.query(SQL, [playlist_id, song_id]);

  return playlist_song;
}

export async function removeFromPlaylist({ playlist_id, song_id }) {
  const SQL = `
    DELETE FROM playlist_songs
    WHERE playlist_id = $1 AND song_id = $2
    RETURNING *
    `;

  const {
    rows: [playlist_song],
  } = await db.query(SQL, [playlist_id, song_id]);

  return playlist_song;
}

export async function getPlaylistSongs({ playlist_id }) {
  
  const SQL = `
    SELECT playlist_songs.*, row_to_json(songs.*) AS song
    FROM playlist_songs
    JOIN songs ON songs.id = playlist_songs.song_id
    WHERE playlist_songs.playlist_id = $1
    `;

  const { rows } = await db.query(SQL, [playlist_id]);

  return rows;
}
