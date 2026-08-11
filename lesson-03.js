"use strict";

// Ordering puzzle prediction before running:
// 1. Right — "Start" logs first because it is synchronous.
// 2. Wrong — the zero-delay timer does not beat the settled Promise reaction because Promise reactions run before timers once the current stack is clear.
// 3. Wrong — the final synchronous log comes before both queued callbacks.
// 4. Right — the Promise reaction runs before the timer callback.

console.log("Start");

const puzzle = Promise.resolve("Promise value");
puzzle.then(() => console.log("Promise reaction"));

setTimeout(() => {
  console.log("Timeout 0ms");
}, 0);

console.log("End");

// Actual order observed: Start, End, Promise reaction, Timeout 0ms.
// The Promise beat the timer because microtasks run before the browser processes the timer queue.

// Lesson 3 loader using the three handler methods.
const status = document.getElementById("loading-status");
const cardsContainer = document.querySelector(".grid");

function renderArtists(artists) {
  cardsContainer.innerHTML = "";

  artists.forEach((artist) => {
    const article = document.createElement("article");
    article.className = "card";

    const img = document.createElement("img");
    img.src = artist.image;
    img.alt = artist.name;
    img.style.width = "100%";
    img.style.borderRadius = "8px";

    const title = document.createElement("h3");
    title.textContent = artist.name;

    const genre = document.createElement("p");
    genre.textContent = artist.genre;

    const total = document.createElement("p");
    total.textContent = `Total runtime: ${artist.total}`;

    article.appendChild(img);
    article.appendChild(title);
    article.appendChild(genre);
    article.appendChild(total);
    cardsContainer.appendChild(article);
  });
}

function loadArtists() {
  status.textContent = "Loading artists...";

  fetch("artists.json")
    .then((response) => response.json())
    .then((artists) => {
      renderArtists(artists);
      status.textContent = "Artists loaded.";
    })
    .catch((error) => {
      console.error("Could not load artists", error);
      status.textContent = "Could not load artists. Please try again.";
    })
    .finally(() => {
      console.log("Loader finished.");
    });
}

loadArtists();

// Async/await version of the same loader.
async function loadArtistsAsync() {
  status.textContent = "Loading artists...";

  try {
    const response = await fetch("artists.json");
    const artists = await response.json();
    renderArtists(artists);
    status.textContent = "Artists loaded.";
  } catch (error) {
    console.error("Could not load artists", error);
    status.textContent = "Could not load artists. Please try again.";
  } finally {
    console.log("Async loader finished.");
  }
}

loadArtistsAsync();

// Custom error class for missing artist data.
class MissingArtistDataError extends Error {
  constructor(message) {
    super(message);
    this.name = "MissingArtistDataError";
  }
}

function validateArtist(artist) {
  if (!artist.name) {
    throw new MissingArtistDataError(
      "Artist data is missing a name; please fix the dataset entry.",
    );
  }
}

function showArtistSummary(artist) {
  try {
    validateArtist(artist);
    console.log(`Showing ${artist.name}`);
  } catch (error) {
    console.error("Artist page: could not show artist summary.", error.message);
  }
}

showArtistSummary({ genre: "Afrobeats" });

// Rethrowing with context.
function loadArtistWithContext(artist) {
  try {
    validateArtist(artist);
  } catch (error) {
    const wrappedError = new Error(
      `Artist page: failed while validating artist data. ${error.message}`,
    );
    wrappedError.stack = `${wrappedError.message}\n${error.stack}`;
    throw wrappedError;
  }
}

try {
  loadArtistWithContext({ genre: "Afrobeats" });
} catch (error) {
  console.error("Top-level handler:", error.message);
}

// Promise.all() example.
const taskOne = new Promise((resolve) =>
  setTimeout(() => resolve("Task 1 complete"), 1000),
);
const taskTwo = new Promise((resolve) =>
  setTimeout(() => resolve("Task 2 complete"), 1500),
);
const taskThree = new Promise((resolve) =>
  setTimeout(() => resolve("Task 3 complete"), 500),
);

Promise.all([taskOne, taskTwo, taskThree]).then((values) => {
  console.log("Promise.all result:", values);
});

// Promise.allSettled() example with one rejection.
const flakyTask = new Promise((resolve, reject) =>
  setTimeout(() => reject(new Error("Task 2 failed")), 1200),
);
const settledOne = new Promise((resolve) =>
  setTimeout(() => resolve("Task 1 complete"), 500),
);
const settledThree = new Promise((resolve) =>
  setTimeout(() => resolve("Task 3 complete"), 800),
);

Promise.allSettled([settledOne, flakyTask, settledThree]).then((results) => {
  console.log("Promise.allSettled results:", results);
});
