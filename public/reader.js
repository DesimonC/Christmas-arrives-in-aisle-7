const storyPageCount = 26;
const pageCount = storyPageCount + 1;
const slideDurations = new Map([
  [1, 10_000],
  [2, 10_000],
  [9, 45_000],
  [12, 45_000],
]);
const slide = document.querySelector('#slide');
const websitePage = document.querySelector('#website-page');
const back = document.querySelector('#back');
const next = document.querySelector('#next');
const progress = document.querySelector('#progress');
const playback = document.querySelector('#playback');
let page = 1;
let upcomingPage;
let playbackTimer;

function slidePath(number) {
  return 'slides/' + String(number).padStart(2, '0') + '.webp';
}

function preloadNextPage() {
  if (page < storyPageCount) {
    upcomingPage = new Image();
    upcomingPage.src = slidePath(page + 1);
  }
}

function showPlayButton() {
  playback.textContent = page === pageCount ? 'Play from start' : 'Play slideshow';
}

function stopPlayback() {
  clearTimeout(playbackTimer);
  playbackTimer = undefined;
  showPlayButton();
}

function scheduleAdvance() {
  clearTimeout(playbackTimer);
  const defaultDuration = page >= 13 && page <= storyPageCount - 3 ? 40_000 : 30_000;
  const slideDuration = slideDurations.get(page) ?? defaultDuration;
  playbackTimer = setTimeout(() => turnPage(1), slideDuration);
}

function turnPage(offset) {
  const target = page + offset;
  if (target < 1 || target > pageCount) {
    return;
  }

  page = target;
  const isWebsitePage = page === pageCount;
  slide.hidden = isWebsitePage;
  websitePage.hidden = !isWebsitePage;
  if (!isWebsitePage) {
    slide.src = slidePath(page);
    slide.alt = 'Storybook page ' + page;
  }
  progress.textContent = 'Page ' + page + ' of ' + pageCount;
  back.disabled = page === 1;
  next.disabled = page === pageCount;
  preloadNextPage();

  if (isWebsitePage) {
    stopPlayback();
  } else if (playbackTimer === undefined) {
    showPlayButton();
  } else {
    scheduleAdvance();
  }
}

back.addEventListener('click', () => turnPage(-1));
next.addEventListener('click', () => turnPage(1));
playback.addEventListener('click', () => {
  if (playbackTimer !== undefined) {
    stopPlayback();
    return;
  }

  if (page === pageCount) {
    turnPage(1 - page);
  }
  playback.textContent = 'Pause slideshow';
  scheduleAdvance();
});

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
