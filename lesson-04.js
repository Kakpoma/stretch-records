"use strict";

const artistApiBase = "http://127.0.0.1:3000";
const labelApiBase = "http://127.0.0.1:4000";
const status = document.getElementById("loading-status");
const cardsContainer = document.querySelector(".grid");
const form = document.getElementById("artist-form");
const labelSummary = document.getElementById("label-summary");

function buildArtistCard(artist) {
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
  return article;
}

function renderArtists(artists) {
  if (!cardsContainer) return;
  cardsContainer.innerHTML = "";
  artists.forEach((artist) =>
    cardsContainer.appendChild(buildArtistCard(artist)),
  );
}

function renderLabel(label) {
  if (!labelSummary) return;
  labelSummary.innerHTML = `<h3>${label.name}</h3><p>${label.city}</p><p>${label.description}</p>`;
}

async function fetchArtists() {
  status.textContent = "Loading artists...";
  status.classList.add("is-loading");

  try {
    const response = await fetch(`${artistApiBase}/artists`);
    console.log("Artist response", response);
    console.log("ok", response.ok, "status", response.status);
    console.log(
      "Access-Control-Allow-Origin",
      response.headers.get("access-control-allow-origin"),
    );

    if (!response.ok) {
      throw new Error(`Artist request failed with status ${response.status}`);
    }

    const data = await response.json();
    const artists = Array.isArray(data) ? data : (data.artists ?? []);
    renderArtists(artists);
    status.textContent = "Artists loaded.";
    return artists;
  } catch (error) {
    console.error("Artist loader failed", error);
    status.textContent = "Could not load artists. Please try again.";
    throw error;
  } finally {
    status.classList.remove("is-loading");
  }
}

async function fetchLabel() {
  const response = await fetch(`${labelApiBase}/label`);
  if (!response.ok)
    throw new Error(`Label request failed with status ${response.status}`);

  const data = await response.json();
  return data.label ?? data;
}

async function loadPageData() {
  try {
    const [artists, label] = await Promise.all([fetchArtists(), fetchLabel()]);
    renderArtists(artists);
    renderLabel(label);
  } catch (error) {
    console.error("Could not load page data", error);
  }
}

loadPageData();

async function probeMissingPath() {
  const response = await fetch(`${artistApiBase}/artistzz`);
  console.log("Wrong path response", response);
  console.log("Wrong path fulfilled with status", response.status);

  if (!response.ok) {
    throw new Error(`Wrong path failed with status ${response.status}`);
  }
}

probeMissingPath().catch((error) => {
  console.error("Probe handled", error.message);
});

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("artist-name-input").value.trim();
    const genre = document.getElementById("artist-genre-input").value.trim();
    const image = document.getElementById("artist-image-input").value.trim();

    if (!name || !genre) {
      status.textContent = "Please enter a name and genre.";
      return;
    }

    const newArtist = {
      name,
      genre,
      image: image || "images/pinkfong.jpeg",
      total: "0:00",
      description: "Added from the form",
    };

    try {
      const response = await fetch(`${artistApiBase}/artists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArtist),
      });
      console.log("POST response", response);
      console.log("POST status", response.status);

      if (!response.ok) {
        throw new Error(`POST failed with status ${response.status}`);
      }

      const createdArtist = await response.json();
      console.log("Created artist", createdArtist);
      await loadPageData();
      status.textContent = `Added ${createdArtist.name}.`;
    } catch (error) {
      console.error("Could not add artist", error);
      status.textContent = "Could not add artist.";
    }
  });
}
