import {Notify} from 'notiflix';
import ApiService from './components/apiService.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';
import LoadMoreBtn from './components/loadMoreBtn.js'

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const apiService = new ApiService();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', isHidden: true });
const lightbox = new SimpleLightbox(".gallery a", {
  captionsData: "alt",
  captionDelay: 250,
});
let page = undefined;
let limitPerPage = 0;

form.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', fetchArticles);
// window.addEventListener('scroll', throttle(infinityScroll, 500))

function onSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const value = form.elements.searchQuery.value.trim();
  if (value === '') {
    loadMoreBtn.isHidden();
    return
  }

  apiService.resetPage();
  clearImages();

  apiService.query = value;

  fetchArticles().finally(() => form.reset());
}

async function fetchArticles() {
  loadMoreBtn.disable();
  try {
    const data = await apiService.getImage();
    console.log(data);
    const hits = data.hits;
    console.log(hits);
    const totalHits = data.totalHits;
    console.log(totalHits);

    if (hits.length === 0) {
      throw new Error(
      Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
        ),
        loadMoreBtn.isHidden()
      )
    };

    createMarkup(hits);
    lightbox.refresh();  

    page = apiService.page - 1;
    limitPerPage = apiService.per_page;
    if (apiService.page - 1 === 1) {
      Notify.success(`Hooray! We found ${totalHits} images.`),
      loadMoreBtn.isShown()
    };
    
    const totalPages = totalHits / limitPerPage;
    if (page > totalPages) {
      throw new Error(
        Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
        )
      )
    }

    loadMoreBtn.enable();

  } catch (err) {
    return err;
  }

}

function clearImages() {
  gallery.innerHTML = '';
}

function createMarkup(arr) {
  const markup = arr.map(({
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads
  }) => {
    return `
  <div class="container">
    <div class="images">
    <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy"  /></a>
    </div>
    <div class="article">
    <h3>
      <b>Likes:</b>
      <b>${likes}</b>
    </h3>
    <h3>
      <b>Views:</b>
      <b>${views}</b>
    </h3>
    <h3>
      <b>Comments:</b>
      <b>${comments}</b>
    </h3>
    <h3>
      <b>Downloads:</b>
      <b>${downloads}</b>
    </h3>
  </div>
</div>`
  }).join('');

  gallery.insertAdjacentHTML('beforeend', markup)
};

function smoothScroll() {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

  window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
};

async function infinityScroll() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const threshold = height - screenHeight / 4;
  const position = scrolled + screenHeight;
  if (position >= threshold) {
    page++;
    fetchArticles()
  };

  // const documentRect = document.documentElement.getBoundingClientRect();
  // if (documentRect.bottom < document.documentElement.clientHeight + 150) {
  //   page = apiService.page + 1;
  //   fetchArticles();
  //   apiService.resetPage();
  // }
}
