"use strict";

// Prediction before running the mixed logging/timers program:
// 1. Right — "Start" logs first because it is synchronous.
// 2. Wrong — the 0ms timeout does not run before the synchronous "End" because all timers wait for the current call stack to finish first.
// 3. Wrong — the 10ms timer does not run before the final synchronous log for the same reason.
// 4. Wrong — the 5ms timer does not run before the 10ms timer because the queued callbacks are processed after the current stack completes.
// 5. Right — the final synchronous log runs before the queued timers.

console.log("Start");

setTimeout(() => {
  console.log("Timeout 0ms");
}, 0);

setTimeout(() => {
  console.log("Timeout 5ms");
}, 5);

setTimeout(() => {
  console.log("Timeout 10ms");
}, 10);

console.log("End");

// Actual order observed: Start, End, Timeout 0ms, Timeout 5ms, Timeout 10ms.
// The wrong predictions were the timer lines because all timers are queued after the current call stack completes,
// and the browser then runs those callbacks in order of their delay.

// Blocking loop demonstration:
// The button used to run a long loop and freeze the page, but the freeze was observed and the loop was removed.
// While it was active, the single-threaded JavaScript event loop was occupied, so the browser could not repaint,
// respond to clicks, or run queued tasks until the loop finished.

// Call stack diagram for the three-function program:
// 1. main() is called -> push main
// 2. main() calls first() -> push first
// 3. first() calls second() -> push second
// 4. second() runs and returns -> pop second
// 5. first() resumes and returns -> pop first
// 6. main() resumes and returns -> pop main

function second() {
  console.log("second start");
  const broken = undefined; // Intentionally cause an error inside the innermost function.
  console.log(broken.someProperty);
  console.log("second end");
}

function first() {
  console.log("first start");
  second();
  console.log("first end");
}

function main() {
  console.log("main start");
  first();
  console.log("main end");
}

try {
  main();
} catch (error) {
  console.error(error);
}

// The stack trace should show the error starting at second() and then first() and main(),
// matching the call stack diagram innermost first.

// Slow data source simulation for the artist page:
// The cards are delayed by two seconds, and a loading message is shown until the render completes.

const status = document.getElementById("loading-status");
const cardsContainer = document.querySelector(".grid");
const freezeButton = document.getElementById("freeze-button");

if (freezeButton) {
  freezeButton.addEventListener("click", () => {
    status.textContent = "The blocking loop was observed and removed.";
  });
}

if (status && cardsContainer) {
  status.textContent = "Loading artists...";

  setTimeout(() => {
    fetch("artists.json")
      .then((response) => response.json())
      .then((artists) => {
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

        status.textContent = "Artists loaded.";
      })
      .catch((error) => {
        console.error("Could not load artists", error);
        status.textContent = "Could not load artists.";
      });
  }, 2000);
}

// Countdown demonstration:
// Counts down from 10 to 0 using setInterval() and stops itself at zero.
let count = 10;
const countdown = setInterval(() => {
  console.log(count);
  count -= 1;

  if (count === 0) {
    clearInterval(countdown);
    console.log("Countdown complete.");
  }
}, 1000);

// The countdown stops itself at zero; no further logs should appear after the interval is cleared.
