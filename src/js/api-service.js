const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "34914660-1ce656d5c1aa04c203bf31af5";

export class ApiPixaby {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalPages = 0;
  }

  fetchArticles() {
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        this.incrementPage();
        return data.hits;
      });
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

  setTotal(total) {
    this.totalPages = total;
  }
}