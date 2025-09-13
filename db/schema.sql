CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS liked_songs;

DROP TABLE IF EXISTS playlist_songs;

DROP TABLE IF EXISTS playlists;

DROP TABLE IF EXISTS songs;

DROP TABLE IF EXISTS albums;

DROP TABLE IF EXISTS artists;

DROP TABLE IF EXISTS users;

CREATE TABLE
    users (
        id serial PRIMARY KEY,
        username varchar(25) NOT NULL UNIQUE,
        email text NOT NULL UNIQUE,
        password text NOT NULL,
        avatar_url text NOT NULL DEFAULT 'https://www.gravatar.com/avatar/?d=mp&s=32',
        volume decimal(3, 2) NOT NULL DEFAULT 0.15
    );

CREATE TABLE
    playlists (
        id serial PRIMARY KEY,
        created_at timestamp DEFAULT now (),
        name varchar(25) NOT NULL,
        owner_id integer REFERENCES users (id) ON DELETE CASCADE,
        image_url text NOT NULL DEFAULT 'https://www.gravatar.com/avatar/?d=mp&s=32',
        is_public boolean NOT NULL DEFAULT false,
        description text DEFAULT ''
    );

CREATE TABLE
    artists (
        id serial PRIMARY KEY,
        created_at timestamp DEFAULT now (),
        name text NOT NULL,
        bio text NOT NULL,
        avatar_url text NOT NULL DEFAULT 'https://www.gravatar.com/avatar/?d=mp&s=32'
    );

CREATE TABLE
    albums (
        id serial PRIMARY KEY,
        created_at timestamp DEFAULT now (),
        name text NOT NULL,
        thumbnail_url text NOT NULL DEFAULT 'https://www.gravatar.com/avatar/?d=mp&s=32',
        artist_id integer REFERENCES artists (id)
    );

CREATE TABLE
    songs (
        id serial PRIMARY KEY,
        uploaded_at timestamp DEFAULT now (),
        title text NOT NULL,
        duration decimal(10, 2) NOT NULL,
        file_url text NOT NULL,
        artist_id integer REFERENCES artists (id) ON DELETE CASCADE,
        album_id integer REFERENCES albums (id) ON DELETE CASCADE,
        thumbnail_url text NOT NULL DEFAULT 'https://www.gravatar.com/avatar/?d=mp&s=32',
        listens integer DEFAULT 0
    );

CREATE TABLE
    queues (
        user_id integer PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
        song_ids integer[] NOT NULL DEFAULT '{}',
        current_index integer NOT NULL DEFAULT 0
    );

CREATE TABLE
    playlist_songs (
        playlist_id integer REFERENCES playlists (id) ON DELETE CASCADE,
        song_id integer REFERENCES songs (id) ON DELETE CASCADE,
        added_at timestamp DEFAULT now (),
        PRIMARY KEY (playlist_id, song_id)
    );

CREATE TABLE
    liked_songs (
        user_id integer REFERENCES users (id) ON DELETE CASCADE,
        song_id integer REFERENCES songs (id) ON DELETE CASCADE,
        liked_at timestamp DEFAULT now (),
        PRIMARY KEY (user_id, song_id)
    );

CREATE TABLE
    listened_songs (
        user_id integer REFERENCES users (id) ON DELETE CASCADE,
        artist_id integer REFERENCES artists (id) ON DELETE CASCADE,
        song_id integer REFERENCES songs (id) ON DELETE CASCADE,
        times_listened integer DEFAULT 1,
        PRIMARY KEY (user_id, artist_id, song_id)
    );