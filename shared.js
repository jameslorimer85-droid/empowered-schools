window.addEventListener('scroll', () => {
  document.getElementById('main-nav').classList.toggle('is-scrolled', window.scrollY > 10);
});

document.querySelector('.nav-hamburger').addEventListener('click', () => {
  document.getElementById('nav-mobile').classList.toggle('is-open');
});
