const navButton = document.querySelector('.menu-button');
const nav = document.querySelector('#primary-nav');
const planner = document.querySelector('#trip-planner');
const plannerForm = document.querySelector('#planner-form');
const formSuccess = document.querySelector('.form-success');
const interestSelect = document.querySelector('#interest-select');
const destinationInput = document.querySelector('#destination-input');
const hero = document.querySelector('.hero');
const heroSlides = [...document.querySelectorAll('.hero-media')];
const heroDots = [...document.querySelectorAll('.hero-dot')];
const heroSlideLabel = document.querySelector('.hero-slide-label');
const promise = document.querySelector('.promise');
const promiseSlides = [...document.querySelectorAll('.promise-image')];
const promisePoints = [...document.querySelectorAll('.promise-point')];
const promiseCurrent = document.querySelector('.promise-current');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelector('#year').textContent = new Date().getFullYear();

const heroLabels = ['Safari & wildlife', 'West Africa', 'North Africa', 'Southern Africa'];
let heroIndex = 0;
let heroTimer;

function showHeroSlide(index) {
  heroIndex = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === heroIndex));
  heroDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === heroIndex;
    dot.classList.toggle('is-active', isActive);
    dot.setAttribute('aria-pressed', String(isActive));
  });
  heroSlideLabel.innerHTML = `<span>${String(heroIndex + 1).padStart(2, '0')}</span> ${heroLabels[heroIndex]}`;
}

function startHeroSlideshow() {
  window.clearInterval(heroTimer);
  if (!reduceMotion) heroTimer = window.setInterval(() => showHeroSlide(heroIndex + 1), 6500);
}

heroDots.forEach(dot => dot.addEventListener('click', () => {
  showHeroSlide(Number(dot.dataset.slide));
  startHeroSlideshow();
}));
hero.addEventListener('mouseenter', () => window.clearInterval(heroTimer));
hero.addEventListener('mouseleave', startHeroSlideshow);
hero.addEventListener('focusin', () => window.clearInterval(heroTimer));
hero.addEventListener('focusout', startHeroSlideshow);
startHeroSlideshow();

let promiseIndex = 0;
let promiseTimer;

function showPromiseSlide(index) {
  promiseIndex = (index + promiseSlides.length) % promiseSlides.length;
  promiseSlides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === promiseIndex));
  promisePoints.forEach((point, pointIndex) => {
    const isActive = pointIndex === promiseIndex;
    point.classList.toggle('is-active', isActive);
    point.setAttribute('aria-pressed', String(isActive));
  });
  promiseCurrent.textContent = String(promiseIndex + 1).padStart(2, '0');
}

function startPromiseSlideshow() {
  window.clearInterval(promiseTimer);
  if (!reduceMotion) promiseTimer = window.setInterval(() => showPromiseSlide(promiseIndex + 1), 7000);
}

promisePoints.forEach(point => point.addEventListener('click', () => {
  showPromiseSlide(Number(point.dataset.promiseSlide));
  startPromiseSlideshow();
}));
promise.addEventListener('mouseenter', () => window.clearInterval(promiseTimer));
promise.addEventListener('mouseleave', startPromiseSlideshow);
promise.addEventListener('focusin', () => window.clearInterval(promiseTimer));
promise.addEventListener('focusout', startPromiseSlideshow);
startPromiseSlideshow();

navButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navButton.setAttribute('aria-expanded', String(isOpen));
  navButton.querySelector('.sr-only').textContent = isOpen ? 'Close navigation' : 'Open navigation';
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  navButton.setAttribute('aria-expanded', 'false');
}));

function openPlanner(interest = '', destination = '') {
  nav.classList.remove('open');
  navButton.setAttribute('aria-expanded', 'false');
  if (interest) interestSelect.value = interest;
  if (destination) destinationInput.value = destination;
  plannerForm.hidden = false;
  formSuccess.hidden = true;
  document.body.classList.add('modal-open');
  planner.showModal();
  window.setTimeout(() => plannerForm.querySelector('input[name="name"]').focus(), 50);
}

function closePlanner() {
  planner.close();
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('.js-open-planner').forEach(button => button.addEventListener('click', () => openPlanner()));
document.querySelectorAll('.experience-item').forEach(button => button.addEventListener('click', () => openPlanner(button.dataset.interest)));
document.querySelectorAll('.destination-action[data-destination]').forEach(button => button.addEventListener('click', () => openPlanner('', button.dataset.destination)));
document.querySelector('.planner-close').addEventListener('click', closePlanner);
document.querySelector('.planner-done').addEventListener('click', closePlanner);
planner.addEventListener('click', event => { if (event.target === planner) closePlanner(); });
planner.addEventListener('cancel', () => document.body.classList.remove('modal-open'));

plannerForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(plannerForm);
  const lines = [
    'Hello HOBTOURS, I would like help planning an Africa journey.',
    '',
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Destination: ${data.get('destination')}`,
    `Experience: ${data.get('interest') || 'Open to recommendations'}`,
    `Travellers: ${data.get('travellers')}`,
    `Ideal timing: ${data.get('timing') || 'Flexible'}`,
    `Notes: ${data.get('notes') || 'None provided'}`
  ];
  const whatsappUrl = `https://wa.me/22898854118?text=${encodeURIComponent(lines.join('\n'))}`;
  const whatsappWindow = window.open(whatsappUrl, '_blank');
  if (whatsappWindow) whatsappWindow.opener = null;
  else window.location.href = whatsappUrl;
  plannerForm.hidden = true;
  formSuccess.hidden = false;
});

document.querySelectorAll('.region-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.region-tab').forEach(item => {
      item.classList.remove('active');
      item.setAttribute('aria-pressed', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-pressed', 'true');
    const region = tab.dataset.region;
    document.querySelector('.destination-grid').classList.toggle('filtered', region !== 'all');
    document.querySelectorAll('.destination-card').forEach(card => {
      card.hidden = region !== 'all' && card.dataset.region !== region;
    });
  });
});
