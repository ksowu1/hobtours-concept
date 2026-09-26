const googleReviewUrl = 'https://maps.app.goo.gl/5UBW8x34UdKTEWgF7?g_st=iwb';
const reviewDismissedKey = 'hobtours-review-dismissed-at-v1';
const reviewWeek = 7 * 24 * 60 * 60 * 1000;

const googleReviews = [
  {
    name: 'Raphael Law',
    time: '8 months ago',
    quote: '“What a great experience!”',
    summary: 'A last-minute Togo and Benin journey was arranged smoothly and felt warm, personal and memorable.'
  },
  {
    name: 'Santhoshy axis',
    time: '3 months ago',
    quote: '“They are the best.”',
    summary: 'From pickup to drop-off, the itinerary brought together Togoville, markets, monuments and a local food experience.'
  },
  {
    name: 'Brian Parrott',
    time: '7 months ago',
    quote: '“So much packed in”',
    summary: 'Five days across Togo combined history, village life, beaches, mountain scenery and thoughtful local support.'
  },
  {
    name: 'Raman Evazians',
    time: '7 months ago',
    quote: '“Great tour and a lot of fun”',
    summary: 'English-language guidance, local knowledge and strong community connections made the experience easy and enjoyable.'
  },
  {
    name: 'JD Mpofu',
    time: '6 months ago',
    quote: '“The service has been incredible”',
    summary: 'Responsive, professional support helped make the visa application process feel fast and seamless.'
  }
];

const reviewShell = document.createElement('div');
reviewShell.innerHTML = `
  <button class="review-launcher" type="button" aria-expanded="false" aria-controls="google-review-popup">
    <span aria-hidden="true">★</span> 5.0 Google reviews
  </button>
  <aside class="review-popup" id="google-review-popup" aria-label="Recent Google review" hidden>
    <div class="review-popup-topline">
      <div><span class="review-google-mark">G</span><strong>Google Reviews</strong></div>
      <button class="review-close" type="button" aria-label="Close reviews">×</button>
    </div>
    <div class="review-rating"><span aria-label="5 out of 5 stars">★★★★★</span><strong>5.0</strong><small>21 reviews</small></div>
    <div class="review-copy" aria-live="polite">
      <blockquote></blockquote>
      <p></p>
      <div><strong class="review-name"></strong><span class="review-time"></span></div>
    </div>
    <div class="review-controls">
      <div class="review-dots" aria-label="Choose a review"></div>
      <div><button class="review-prev" type="button" aria-label="Previous review">←</button><button class="review-next" type="button" aria-label="Next review">→</button></div>
    </div>
    <a class="review-google-link" href="${googleReviewUrl}" target="_blank" rel="noopener">Read all reviews on Google <span aria-hidden="true">↗</span></a>
  </aside>`;

document.body.append(reviewShell);

const reviewPopup = document.querySelector('.review-popup');
const reviewLauncher = document.querySelector('.review-launcher');
const reviewQuote = document.querySelector('.review-copy blockquote');
const reviewSummary = document.querySelector('.review-copy > p');
const reviewName = document.querySelector('.review-name');
const reviewTime = document.querySelector('.review-time');
const reviewDots = document.querySelector('.review-dots');
const reduceReviewMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let reviewIndex = 0;
let reviewTimer;

googleReviews.forEach((review, index) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.setAttribute('aria-label', `Show review ${index + 1} from ${review.name}`);
  dot.addEventListener('click', () => showGoogleReview(index));
  reviewDots.append(dot);
});

function showGoogleReview(index) {
  reviewIndex = (index + googleReviews.length) % googleReviews.length;
  const review = googleReviews[reviewIndex];
  reviewQuote.textContent = review.quote;
  reviewSummary.textContent = review.summary;
  reviewName.textContent = review.name;
  reviewTime.textContent = review.time;
  [...reviewDots.children].forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === reviewIndex));
}

function startReviewRotation() {
  window.clearInterval(reviewTimer);
  if (!reduceReviewMotion) reviewTimer = window.setInterval(() => showGoogleReview(reviewIndex + 1), 6000);
}

function openReviewPopup() {
  reviewPopup.hidden = false;
  reviewLauncher.setAttribute('aria-expanded', 'true');
  startReviewRotation();
}

function closeReviewPopup() {
  reviewPopup.hidden = true;
  reviewLauncher.setAttribute('aria-expanded', 'false');
  window.clearInterval(reviewTimer);
  try { localStorage.setItem(reviewDismissedKey, String(Date.now())); } catch {}
  reviewLauncher.focus();
}

reviewLauncher.addEventListener('click', () => reviewPopup.hidden ? openReviewPopup() : closeReviewPopup());
document.querySelector('.review-close').addEventListener('click', closeReviewPopup);
document.querySelector('.review-prev').addEventListener('click', () => { showGoogleReview(reviewIndex - 1); startReviewRotation(); });
document.querySelector('.review-next').addEventListener('click', () => { showGoogleReview(reviewIndex + 1); startReviewRotation(); });
reviewPopup.addEventListener('mouseenter', () => window.clearInterval(reviewTimer));
reviewPopup.addEventListener('mouseleave', startReviewRotation);

showGoogleReview(0);

let reviewWasRecentlyDismissed = false;
try {
  const dismissedAt = Number(localStorage.getItem(reviewDismissedKey));
  reviewWasRecentlyDismissed = Number.isFinite(dismissedAt) && Date.now() - dismissedAt < reviewWeek;
} catch {}

if (!reviewWasRecentlyDismissed) window.setTimeout(openReviewPopup, 9000);
