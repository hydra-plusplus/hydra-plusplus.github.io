document.addEventListener('DOMContentLoaded', () => {
  const internalLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  const tocItems = Array.from(document.querySelectorAll('.toc-nav li'));
  const sections = Array.from(document.querySelectorAll('[data-toc-title]'));

  internalLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${targetId}`);
    });
  });

  if (!('IntersectionObserver' in window) || sections.length === 0) {
    return;
  }

  const activateTocItem = (id) => {
    tocItems.forEach((item) => {
      const link = item.querySelector('a');
      item.classList.toggle('active', link && link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visible.length > 0) {
      activateTocItem(visible[0].target.id);
    }
  }, {
    rootMargin: '-25% 0px -55% 0px',
    threshold: [0.1, 0.25, 0.5, 0.75],
  });

  sections.forEach((section) => observer.observe(section));
});
