import axios from 'axios';

const ENDPOINT = 'https://pixabay.com/api';
const API_KEY = '33721850-c6fdd091d70b8ca25b72e0c80';
const OPTIONS = 'image_type=photo&orientation=horizontal&safesearch=true';

export default class ApiService {
  constructor() {
    this.query = '';
    this.page = 1;
    this.per_page = 40;
  }

  async getImage() {
    try {
      const url = await axios.get(
        `${ENDPOINT}/?key=${API_KEY}&q=${this.query}&${OPTIONS}&per_page=${this.per_page}&page=${this.page}`
      );

      this.nextPage();
        return url.data;
        
    } catch (error) {
      console.error(error.message);
    }
  }

  nextPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}