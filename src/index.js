import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { ApiPixaby } from "./js/api-service";

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

searchForm.addEventListener("submit", onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

// Скриваємо кнопку
loadMoreBtn.style.display = "none";

const apiPixabay = new ApiPixaby();

async function onSubmit(evt) {
  evt.preventDefault();

  apiPixabay.query = evt.currentTarget.elements.searchQuery.value.trim();

  if (apiPixabay.query === "") {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }

  apiPixabay.resetPage();

  try {
    const response = await apiPixabay.fetchArticles();
    const hits = response.data.hits;
    const total = response.data.total;

    if (total === 0) {
      loadMoreBtn.style.display = "none";
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }

    clearHitsContainer();
    renderHitsMarkup(hits);

    loadMoreBtn.style.display = "block";
    lightbox.refresh();

    Notify.success(`Hooray! We found ${total} images.`);
  } catch (error) {
    clearHitsContainer();

    console.log(error.message);
    loadMoreBtn.style.display = "none";

    Notify.failure(`Sorry, there are no images matching your search query ${apiPixabay.query}. Please try again.`);
  }
}



async function onLoadMore() {
  apiPixabay.incrementPage();

  try {
    const response = await apiPixabay.fetchArticles();
    const hits = response.data.hits;

    // Перевіряємо користувача що він дійшов до кінця колекції, ховаємо кнопку і виводимо повідомлення
    if (hits.length < 40) {
      loadMoreBtn.style.display = "none";
      Notify.info("We're sorry, but you've reached the end of search results.");
    }

    renderHitsMarkup(hits);

    lightbox.refresh();
    scrollPage();
  } catch (error) {
    console.log(error.message);
  }
}

function renderHitsMarkup(hits) {
  const markup = hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `<a href="${largeImageURL}" class="gallery-item">
    <div class="photo-card">
      <img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes ${likes}</b></p>
        <p class="info-item"><b>Views ${views}</b></p>
        <p class="info-item"><b>Comments ${comments}</b></p>
        <p class="info-item"><b>Downloads ${downloads}</b></p>
      </div>
    </div>
    </a>`;
  }).join("");
  gallery.insertAdjacentHTML("beforeend", markup);
}

function clearHitsContainer() {
  gallery.innerHTML = "";
}

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();
  
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}





// Version 2
// // пошук елементів
// const searchForm = document.querySelector(".search-form");
// const gallery = document.querySelector(".gallery");
// const loadMoreBtn = document.querySelector(".load-more");

// // додаємо слухача подій
// searchForm.addEventListener("submit", onSubmit);
// loadMoreBtn.addEventListener('click', onLoadMore);

// // відображення модального вікна слайдера-зображень
// const lightbox = new SimpleLightbox('.gallery a', {
//   captionDelay: 250,
// });

// // Скриваємо кнопку
// loadMoreBtn.style.display = "none";

// // створюємо зміну проміса
// const apiPixabay = new ApiPixaby();

// // обробка події на кнопку пошук
// function onSubmit(evt) {
//   // відміняємо перезавантаження сторінки
//   evt.preventDefault();

//   // отримуємо значення з інпута
//   apiPixabay.query = evt.currentTarget.elements.searchQuery.valueю.trim();

//   // перевіряємо якщо уведено пусткий рядок(нічого не уведено)
//   if (apiPixabay.query === "") {
//     Notify.failure('Sorry, there are no images matching your search query. Please try again.');
//     return;
//   }
//   // скидаємо сторінку на початкову
//   apiPixabay.resetPage();

//   // отримання відповіді результату від бекенду
//   apiPixabay.fetchArticles()
//     .then(data => {
//       if (data.total === 0) {
//       loadMoreBtn.style.display = "none";
//         Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
//       }

//       clearHitsContainer();
//       renderHitsMarkup(data.hits);

//       loadMoreBtn.style.display = "block";
//       lightbox.refresh();

//       Notify.success(`Hooray! We found ${data.totalHits} images.`);
//     })
//     .catch(error => {
//       clearHitsContainer();

//       console.log(error.message);
//       loadMoreBtn.style.display = "none";

//       Notify.failure(`Sorry, there are no images matching your search query ${apiPixabay.query}. Please try again.`);
//     });
// }

// // обробка події кнопки завантажити ще
// function onLoadMore() {
//   apiPixabay.fetchArticles()
//     .then(data => {
//       // Перевіряємо користувача що він дійшов до кінця колекції, ховаємо кнопку і виводимо повідомлення
//       if (data.hits.length < 40) {
//         loadMoreBtn.style.display = "none";
//         Notify.info("We're sorry, but you've reached the end of search results.");
//       }

//       renderHitsMarkup(data.hits);

//       lightbox.refresh();
//       scrollPage();
//     })
//     .catch(error => {
//       console.log(error.message);
//     });
// }

// // рендеримо розмітку на сторінку
// function renderHitsMarkup(hits) {
//   const markup = hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
//     return `<a href="${largeImageURL}" class="gallery-item">
//     <div class="photo-card">
//       <img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" />
//       <div class="info">
//         <p class="info-item"><b>Likes ${likes}</b></p>
//         <p class="info-item"><b>Views ${views}</b></p>
//         <p class="info-item"><b>Comments ${comments}</b></p>
//         <p class="info-item"><b>Downloads ${downloads}</b></p>
//       </div>
//     </div>
//     </a>`;
//   }).join("");
//   gallery.insertAdjacentHTML("beforeend", markup);
// }
// // очищення попереднього вмісту галереї
// function clearHitsContainer() {
//   gallery.innerHTML = "";
// }

// // плавне прокручування сторінки після запиту і відтворення кожної наступної групи зображень
// function scrollPage() {
//   const { height: cardHeight } = document
//     .querySelector(".gallery")
//     .firstElementChild.getBoundingClientRect();
  
//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: "smooth",
//   });
// }

// // Перевіряємо користувача що він дійшов до кінця колекції, ховаємо кнопку і виводимо повідомлення
// // checkEnd(data.hits.length); // виклик функції у onLoadMore
// // function checkEnd(length) {
// //   if (length < 40) {
// //     loadMoreBtn.style.display = "none";
// //     Notify.info("We're sorry, but you've reached the end of search results.");
// //   }
// // }