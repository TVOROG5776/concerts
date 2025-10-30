import { renderPagination } from "./pagination";

const events = document.querySelector(".cards");
const form = document.querySelector(".header-form");
const searchInput = document.getElementById("search");

let currentKeyword = "";

async function data(page = 0, keyword = "") {
  currentKeyword = keyword;

  const params = new URLSearchParams({
    apikey: "L1jPPLF7E3w1Bs5yPVnSQz5OqfouKgX8",
    page,
    size: 20
  });

  if (keyword) {
    params.append("keyword", keyword);
  }

  const BASE_URL = `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`;

  try {
    const response = await fetch(BASE_URL);
    const result = await response.json();

    const eventList = result._embedded?.events || [];

    const validEvents = eventList.filter(card =>
      card.images.length &&
      card.name &&
      card.dates.start.localDate &&
      card._embedded.venues.length
    );

    if (validEvents.length === 0) {
      events.innerHTML = '<p class="no-results">Ничего не найдено</p>';
      return;
    }

    let totalPages;
    if (keyword) {
      totalPages = Math.min(result.page.totalPages, 5);
    } else {
      totalPages = Math.min(result.page.totalPages, 50);
    }

    let currentPage;
    if (typeof result.page?.number === "number") {
      currentPage = result.page.number;
    } else {
      currentPage = 0;
    }

    renderPagination(totalPages, currentPage, (page) => data(page, currentKeyword));
    createCards(validEvents);
  } catch (error) {
    console.log(`Ошибка с базой данных: ${error}`);
  }
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate__animated", "animate__bounceIn");
      observer.unobserve(entry.target)
    } else {
      entry.target.classList.remove("animate__bounceIn");
    }
  });
}, {
  threshold: 0.1
});

export function createCards(content) {
  try {
    events.innerHTML = '';
    content.forEach(card => {
      const parent = document.createElement("a");
      parent.href = card.url;
      parent.setAttribute("target", "_blank");
      parent.classList.add("card");

      const cardImg = document.createElement("img");
      cardImg.src = card.images[0].url;
      cardImg.alt = card.name;
      cardImg.classList.add("card__img");

      const cardTitle = document.createElement("h2");
      cardTitle.textContent = card.name;
      cardTitle.classList.add("card__title");

      const cardData = document.createElement("h5");
      cardData.textContent = card.dates.start.localDate;
      cardData.classList.add("card__time");

      const cardPlace = document.createElement("p");
      cardPlace.textContent = card._embedded.venues[0].name;
      cardPlace.classList.add("card__place");

      const rectangle = document.createElement("div");
      rectangle.classList.add("rectangle");

      parent.append(cardImg, cardTitle, cardData, cardPlace, rectangle);
      events.append(parent);
      observer.observe(parent);
    });
  } catch (error) {
    console.log(`Ошибка в генерации карточек: ${error}`);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const keyword = searchInput.value.trim();
  data(0, keyword);
});

data();