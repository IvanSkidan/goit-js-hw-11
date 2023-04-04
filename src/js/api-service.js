import axios from 'axios';

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "34914660-1ce656d5c1aa04c203bf31af5";

export class ApiPixaby {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchArticles() {
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

    const data = await axios.get(url);
    return data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}





// Version 2
// const BASE_URL = "https://pixabay.com/api/";
// const API_KEY = "34914660-1ce656d5c1aa04c203bf31af5";

// export class ApiPixaby {
//   constructor() {
//     this.searchQuery = '';
//     this.page = 1;
//     this.per_page = 40;
//   }

//   fetchArticles() {
//     const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
//     return fetch(url)
//       .then(response => response.json())
//       .then(data => {
//         // console.log(data);
//         this.incrementPage();
//         return data;
//       });
//   }

//   incrementPage() {
//     this.page += 1;
//   }

//   resetPage() {
//     this.page = 1;
//   }

//   get query() {
//     return this.searchQuery;
//   }

//   set query(newQuery) {
//     this.searchQuery = newQuery;
//   }
// }