const pageCount = 26;
const slide = document.querySelector('#slide');
const back = document.querySelector('#back');
const next = document.querySelector('#next');
const progress = document.querySelector('#progress');
let page = 1;
let upcomingPage;

function slidePath(number) {
  return 'slides/' + String(number).padStart(2, '0') + '.webp';
}

function preloadNextPage() {
  if (page < pageCount) {
    upcomingPage = new Image();
    upcomingPage.src = slidePath(page + 1);
  }
}

function turnPage(offset) {
  const target = page + offset;
  if (target < 1 || target > pageCount) {
    return;
  }

  page = target;
  slide.src = slidePath(page);
  slide.alt = 'Storybook page ' + page;
  progress.textContent = 'Page ' + page + ' of ' + pageCount;
  back.disabled = page === 1;
  next.disabled = page === pageCount;
  preloadNextPage();
}

back.addEventListener('click', () => turnPage(-1));
next.addEventListener('click', () => turnPage(1));

document.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
    return;
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    turnPage(-1);
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    turnPage(1);
  }
});

preloadNextPage();
