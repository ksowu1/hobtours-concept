const navButton = document.querySelector('.menu-button');
const nav = document.querySelector('#primary-nav');
const planner = document.querySelector('#trip-planner');
const plannerForm = document.querySelector('#planner-form');
const formSuccess = document.querySelector('.form-success');
const interestSelect = document.querySelector('#interest-select');

document.querySelector('#year').textContent = new Date().getFullYear();

navButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navButton.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  navButton.setAttribute('aria-expanded', 'false');
}));

function openPlanner(interest = '') {
  nav.classList.remove('open');
  navButton.setAttribute('aria-expanded', 'false');
  if (interest) interestSelect.value = interest;
  document.body.classList.add('modal-open');
  planner.showModal();
}

function closePlanner() {
  planner.close();
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('.js-open-planner').forEach(button => button.addEventListener('click', () => openPlanner()));
document.querySelectorAll('.experience-item').forEach(button => button.addEventListener('click', () => openPlanner(button.dataset.interest)));
document.querySelector('.planner-close').addEventListener('click', closePlanner);
document.querySelector('.planner-done').addEventListener('click', closePlanner);
planner.addEventListener('click', event => { if (event.target === planner) closePlanner(); });

plannerForm.addEventListener('submit', event => {
  event.preventDefault();
  plannerForm.hidden = true;
  formSuccess.hidden = false;
});

document.querySelectorAll('.region-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.region-tab').forEach(item => {
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const region = tab.dataset.region;
    document.querySelector('.destination-grid').classList.toggle('filtered', region !== 'all');
    document.querySelectorAll('.destination-card').forEach(card => {
      card.hidden = region !== 'all' && card.dataset.region !== region;
    });
  });
});
