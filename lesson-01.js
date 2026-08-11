"use strict";

// The reload request made 16 requests
// index.html
// style.css
// pinkfong.jpeg

// JSON round-trip demonstration for the lesson exercise.
const artist = {
  name: "Burna Boy",
  genre: "Afrobeats",
  total: "3:12",
};

const artistText = JSON.stringify(artist);
console.log(artistText);

const parsedArtist = JSON.parse(artistText);
console.log(parsedArtist.genre);

// For the sixth-artist step, only stretch-records/artists.json changed; stretch-records/script.js
// and the page wiring did not need any edits because the loader already reads the JSON data file.
// That separation is the point because the roster lives in data, the rendering logic lives in JavaScript,
// and the lesson file is the place for the round-trip demonstration.
