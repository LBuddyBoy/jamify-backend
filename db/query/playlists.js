import db from "#db/client";

export async function createPlaylist({ name, owner_id }) {
  const SQL = `
    INSERT INTO playlists(name, owner_id)
    VALUES($1, $2)
    RETURNING *
    `;

  const {
    rows: [playlist],
  } = await db.query(SQL, [name, owner_id]);

  return playlist;
}

export async function deletePlaylist(id) {
  const SQL = `
    DELETE FROM playlists
    WHERE id = $1
    RETURNING *
    `;

  const {
    rows: [playlist],
  } = await db.query(SQL, [id]);

  return playlist;
}

export async function updatePlaylist(id, fields) {
  const updates = Object.entries(fields).filter(
    ([k, v]) => v !== undefined && v !== null
  );

  const sets = updates.map(([key], i) => `${key} = $${i + 2}`);
  const values = updates.map(([_, value]) => value);

  const SQL = `
    UPDATE playlists
    SET ${sets.join(", ")}
    WHERE id = $1
    RETURNING *
    `;

  const {
    rows: [playlist],
  } = await db.query(SQL, [id, ...values]);

  return playlist;
}
export async function getPlaylists({ page, limit, userId }) {
  const whereClauses = [];
  const params = [];
  let pagination = ``;

  if (userId) {
    params.push(userId);
    whereClauses.push(`(owner_id = $${params.length} OR is_public = true)`);
  } else {
    whereClauses.push(`is_public = true`);
  }

  if (page && limit) {
    const offset = (page - 1) * limit;

    params.push(limit, offset); // order matters: LIMIT first, then OFFSET
    pagination = `LIMIT $${params.length - 1} OFFSET $${params.length}`;
  }

  const SQL = `
    SELECT * FROM playlists
    WHERE ${whereClauses.join(" AND ")}
    ${pagination}
  `;

  console.log(SQL, params);

  const { rows } = await db.query(SQL, params);

  return rows;
}

export async function getAllPlaylists() {
  const SQL = `
    SELECT * FROM playlists
    `;

  const { rows } = await db.query(SQL);

  return rows;
}

export async function getPlaylistsByName(name, limit, offset) {
  const SQL = `
  SELECT * FROM playlists
  WHERE name ILIKE $1
  LIMIT $2 OFFSET $3
  `;

  const { rows } = await db.query(SQL, [`%${name}%`, limit, offset]);

  return rows;
}

export async function getPlaylistById(id) {
  const SQL = `
    SELECT 
        playlists.*,
        json_build_object(
            'id', users.id,
            'username', users.username,
            'avatar_url', users.avatar_url
        ) AS owner,
        COALESCE(
           json_agg(playlist_songs.song) 
            FILTER (WHERE playlist_songs.song IS NOT NULL), 
            '[]'
        ) AS songs
    FROM playlists
    JOIN users ON playlists.owner_id = users.id
    LEFT JOIN (
        SELECT 
            playlist_songs.playlist_id,
            json_build_object(
                'added_at', playlist_songs.added_at,
                'id', songs.id,
                'artist_id', songs.artist_id,
                'title', songs.title,
                'duration', songs.duration,
                'listens', songs.listens,
                'thumbnail_url', songs.thumbnail_url,
               'uploaded_at', songs.uploaded_at
           ) AS song
       FROM playlist_songs
       JOIN songs ON songs.id = playlist_songs.song_id
    ) playlist_songs ON playlist_songs.playlist_id = playlists.id
    WHERE playlists.id = $1
    GROUP BY playlists.id, users.id;
    `;

  const {
    rows: [playlist],
  } = await db.query(SQL, [id]);

  return playlist;
}
