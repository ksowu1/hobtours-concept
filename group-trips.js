const navButton = document.querySelector('.menu-button');
const nav = document.querySelector('#primary-nav');
const interestSection = document.querySelector('#group-interest');
const interestForm = document.querySelector('#group-interest-form');
const activitySelect = document.querySelector('#group-activity-select');
const formSuccess = document.querySelector('.group-form-success');

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

document.querySelectorAll('[data-group-interest]').forEach(button => {
  button.addEventListener('click', () => {
    activitySelect.value = button.dataset.groupInterest;
    interestSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => activitySelect.focus(), 450);
  });
});

interestForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(interestForm);
  const lines = [
    'Hello HOBTOURS, I am interested in a group trip or activity.',
    '',
    `Name: ${data.get('name')}`,
    `Contact: ${data.get('contact')}`,
    `Activity: ${data.get('activity')}`,
    `Destination or region: ${data.get('destination') || 'Open to recommendations'}`,
    `Estimated group size: ${data.get('travellers')}`,
    `Preferred timing: ${data.get('timing') || 'Flexible'}`,
    `Notes: ${data.get('notes') || 'None provided'}`
  ];
  const whatsappUrl = `https://wa.me/22898854118?text=${encodeURIComponent(lines.join('\n'))}`;
  const whatsappWindow = window.open(whatsappUrl, '_blank');
  if (whatsappWindow) whatsappWindow.opener = null;
  else window.location.href = whatsappUrl;
  interestForm.hidden = true;
  formSuccess.hidden = false;
});
