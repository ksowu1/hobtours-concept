const navButton = document.querySelector('.menu-button');
const nav = document.querySelector('#primary-nav');

document.querySelector('#year').textContent = new Date().getFullYear();

navButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navButton.setAttribute('aria-expanded', String(isOpen));
  navButton.querySelector('.sr-only').textContent = isOpen ? 'Close navigation' : 'Open navigation';
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  navButton.setAttribute('aria-expanded', 'false');
}));
