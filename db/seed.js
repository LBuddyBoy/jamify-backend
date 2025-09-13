import db from "#db/client";
import { base, de, de_CH, en, Faker } from "@faker-js/faker";
import { createPlaylist, getAllPlaylists, getPlaylists } from "./query/playlists.js";
import { createSong, getSongs } from "./query/songs.js";
import { addToPlaylist } from "./query/playlist_songs.js";
import { createArtist, updateArtist } from "./query/artists.js";
import { createAlbum } from "./query/albums.js";
import { createUser } from "./query/users.js";

const customLocale = {
  title: "My custom locale",
  internet: {
    domainSuffix: ["test"],
  },
};

export const customFaker = new Faker({
  locale: [customLocale, de_CH, de, en, base],
});

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const users = [
    {
      username: "Ethan",
      email: "ethantoups05@gmail.com",
      password: "password123",
    },
  ];
  const playlists = [
    { name: "Chill", owner_id: 1 },
    { name: "Summer", owner_id: 1 },
    { name: "Vibes", owner_id: 1 },
  ];

  const albums = [
    // Bryson Tiller
    {
      name: "TRAPSOUL",
      artist_id: 1,
      thumbnail_url: "https://m.media-amazon.com/images/I/71EQ8ybUfzL.jpg",
    },
    {
      name: "True to Self",
      artist_id: 1,
      thumbnail_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/TRS_Bryson.jpg/1200px-TRS_Bryson.jpg",
    },
    {
      name: "Anniversary",
      artist_id: 1,
      thumbnail_url:
        "https://upload.wikimedia.org/wikipedia/en/7/72/Bryson_Tiller_-_Anniversary.png",
    },

    // Jhené Aiko
    {
      name: "Trip",
      artist_id: 2,
      thumbnail_url:
        "https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Jhen%C3%A9_Aiko_-_Trip.png/250px-Jhen%C3%A9_Aiko_-_Trip.png" /* :contentReference[oaicite:0]{index=0} */,
    },
    {
      name: "Souled Out",
      artist_id: 2,
      thumbnail_url:
        "https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Jheneaiko_souledout.png/250px-Jheneaiko_souledout.png" /* :contentReference[oaicite:1]{index=1} */,
    },
    {
      name: "Chilombo",
      artist_id: 2,
      thumbnail_url:
        "https://upload.wikimedia.org/wikipedia/en/thumb/1/15/Jhen%C3%A9_Aiko_-_Chilombo.png/250px-Jhen%C3%A9_Aiko_-_Chilombo.png" /* :contentReference[oaicite:2]{index=2} */,
    },

    // Miguel
    {
      name: "Wildheart",
      artist_id: 3,
      thumbnail_url:
        "https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/Miguel_-_WILDHEART.jpg/250px-Miguel_-_WILDHEART.jpg" /* :contentReference[oaicite:3]{index=3} */,
    },
    {
      name: "Kaleidoscope Dream",
      artist_id: 3,
      thumbnail_url:
        "https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Miguel-Kaleidoscope_Dream.jpg/250px-Miguel-Kaleidoscope_Dream.jpg" /* :contentReference[oaicite:4]{index=4} */,
    },
    {
      name: "War & Leisure",
      artist_id: 3,
      thumbnail_url:
        "https://upload.wikimedia.org/wikipedia/en/thumb/3/3d/Miguel_-_War_and_Leisure.jpeg/250px-Miguel_-_War_and_Leisure.jpeg" /* :contentReference[oaicite:5]{index=5} */,
    },

    // SZA
    {
      name: "Z",
      artist_id: 4,
      thumbnail_url:
        "https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/SZA_-_Z.png/250px-SZA_-_Z.png" /* :contentReference[oaicite:6]{index=6} */,
    },
    {
      name: "Ctrl",
      artist_id: 4,
      thumbnail_url:
        "https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/SZA_-_Ctrl_cover.png/250px-SZA_-_Ctrl_cover.png" /* :contentReference[oaicite:7]{index=7} */,
    },
    {
      name: "SOS",
      artist_id: 4,
      thumbnail_url:
        "https://upload.wikimedia.org/wikipedia/en/thumb/2/2c/SZA_-_S.O.S.png/250px-SZA_-_S.O.S.png" /* :contentReference[oaicite:8]{index=8} */,
    },

    // Tory Lanez
    {
      name: "Chixtape 5",
      artist_id: 5,
      thumbnail_url:
        "https://upload.wikimedia.org/wikipedia/en/thumb/5/57/Tory_Lanez_-_Chixtape_5.png/250px-Tory_Lanez_-_Chixtape_5.png",
    },
    {
      name: "I Told You",
      artist_id: 5,
      thumbnail_url:
        "https://upload.wikimedia.org/wikipedia/en/thumb/0/0d/Tory_Lanez_-_I_Told_You.png/250px-Tory_Lanez_-_I_Told_You.png",
    },
    {
      name: "Memories Don't Die",
      artist_id: 5,
      thumbnail_url:
        "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Tory_Lanez_-_Memories_Don%27t_Die.png/250px-Tory_Lanez_-_Memories_Don%27t_Die.png",
    },

    // Vedo
    {
      name: "For You",
      artist_id: 6,
      thumbnail_url:
        "https://i.scdn.co/image/ab67616d0000b2739b7e6a1ee15c55a550166e15",
    },
    {
      name: "Vedo",
      artist_id: 6,
      thumbnail_url:
        "https://i.scdn.co/image/ab67616d0000b27305ce623168ebcccacc0da317",
    },
    {
      name: "1320",
      artist_id: 6,
      thumbnail_url:
        "https://i.scdn.co/image/ab67616d0000b273ce4c20d24103beede6288806",
    },
  ];

  const artists = [
    {
      name: "Bryson Tiller",
      bio: customFaker.lorem.paragraph(),
      avatar_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Bryson_Tiller_August_2018_(cropped).jpg/250px-Bryson_Tiller_August_2018_(cropped).jpg",
    },
    {
      name: "Jhene Aiko",
      bio: customFaker.lorem.paragraph(),
      avatar_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Jhen%C3%A9_Aiko_%2828652537575%29_%28cropped%29.jpg/250px-Jhen%C3%A9_Aiko_%2828652537575%29_%28cropped%29.jpg",
    },
    {
      name: "Miguel",
      bio: customFaker.lorem.paragraph(),
      avatar_url: "https://i8.amplience.net/i/naras/MI0004336408-MN0002570457",
    },
    {
      name: "SZA",
      bio: customFaker.lorem.paragraph(),
      avatar_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Glaston2024_2806_300624_%28158_of_173%29_%2853836776232%29_%28cropped%29.jpg/250px-Glaston2024_2806_300624_%28158_of_173%29_%2853836776232%29_%28cropped%29.jpg",
    },
    {
      name: "Tory Lanes",
      bio: customFaker.lorem.paragraph(),
      avatar_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Tory_Lanez_2500x1669.jpg/250px-Tory_Lanez_2500x1669.jpg",
    },
    {
      name: "Vedo",
      bio: customFaker.lorem.paragraph(),
      avatar_url:
        "https://cdn.prod.website-files.com/62ee0bbe0c783a903ecc0ddb/6472d1d9f31619b8d7cf7f70_Vedo%2BPic%2B4.jpeg",
    },
  ];

  const songs = [
    {
      title: "Let Em' Know",
      duration: 60.0 * 4.0 + 23.0,
      file_url: `songs/https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/songs/Bryson Tiller - Let Em' Know (Audio).mp4`,
      artist_id: 1,
      thumbnail_url: "https://www.gravatar.com/avatar/?d=mp&s=32",
      album_id: 1,
    },
    {
      title: "Moments",
      duration: 60.0 * 3.0,
      file_url: `songs/https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/songs/Jhené Aiko - Moments ft. Big Sean (Official Audio).mp4`,
      artist_id: 2,
      thumbnail_url: "https://www.gravatar.com/avatar/?d=mp&s=32",
      album_id: 2,
    },
    {
      title: "coffee",
      duration: 60.0 * 4.0 + 48.0,
      file_url: `songs/https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/songs/Miguel - coffee (Official Audio).mp4`,
      artist_id: 3,
      thumbnail_url: "https://www.gravatar.com/avatar/?d=mp&s=32",
      album_id: 3,
    },
    {
      title: "2AM",
      duration: 60.0 * 4.0 + 4.0,
      file_url: `songs/https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/songs/SZA - 2AM (Official Audio).mp4`,
      artist_id: 4,
      thumbnail_url: "https://www.gravatar.com/avatar/?d=mp&s=32",
      album_id: 4,
    },
    {
      title: "And This is Just The Intro",
      duration: 60.0 * 5.0 + 26.0,
      file_url: `songs/https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/songs/Tory Lanez - And This is Just The Intro [Official Visualizer].mp4`,
      artist_id: 5,
      thumbnail_url: "https://www.gravatar.com/avatar/?d=mp&s=32",
      album_id: 5,
    },
    {
      title: "You Got It",
      duration: 60.0 * 3.0 + 40.0,
      file_url: `songs/https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/songs/Vedo - You Got It (Official Music Video).mp4`,
      artist_id: 6,
      thumbnail_url: "https://www.gravatar.com/avatar/?d=mp&s=32",
      album_id: 6,
    },
  ];

  for (const index in users) {
    const user = users[index];

    await createUser(user);
  }

  for (const index in playlists) {
    const playlist = playlists[index];

    await createPlaylist(playlist);
  }

  for (const index in artists) {
    const artist = artists[index];
    const created = await createArtist(artist);

    await updateArtist(created.id, { avatar_url: artist.avatar_url });
  }

  for (const index in albums) {
    const album = albums[index];

    await createAlbum(album);
  }

  for (const index in songs) {
    const song = songs[index];

    await createSong(song);
  }

  await seedPlaylistSongs();
}

async function seedPlaylistSongs() {
  const playlists = await getAllPlaylists();
  const songs = await getSongs();

  for (const playlist_index in playlists) {
    const playlist = playlists[playlist_index];

    for (let index = 0; index < 3; index++) {
      const song = songs[getRandomInt(0, songs.length - 1)];

      try {
        await addToPlaylist({ playlist_id: playlist.id, song_id: song.id });
      } catch (error) {}
    }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
