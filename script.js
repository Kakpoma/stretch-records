"use strict";

const cardsContainer = document.querySelector(".grid");

fetch("artists.json")
  .then((response) => response.json())
  .then((artists) => {
    if (cardsContainer) {
      cardsContainer.innerHTML = "";
    }

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
  })
  .catch((error) => {
    console.error("Could not load artists", error);
  });
