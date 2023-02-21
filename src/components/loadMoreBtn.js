export default class LoadMoreBtn {
  constructor({ selector, isHidden }) {
    this.button = this.getButton(selector);
      if (isHidden) {
        this.isHidden();
    } 
    else this.isShown();
  }

  getButton(selector) {
    return document.querySelector(selector);
  }

  isHidden() {
    this.button.classList.add('hidden');
  }

  isShown() {
    this.button.classList.remove('hidden');
    this.button.textContent = 'Load more'
  }

  disable() {
    this.button.disabled = true; 
    this.button.textContent = 'Page is loading...';
  }

  enable() {
    this.button.disabled = false;
    this.button.textContent = 'Load more'
  }
}