document.addEventListener('DOMContentLoaded', () => {
  const internalLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  const tocItems = Array.from(document.querySelectorAll('.toc-nav li'));
  const sections = Array.from(document.querySelectorAll('[data-toc-title]'));
  const animatedBarBlocks = Array.from(document.querySelectorAll('[data-animate-bars]'));

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

  if (!('IntersectionObserver' in window)) {
    animatedBarBlocks.forEach((block) => block.classList.add('is-visible'));
    return;
  }

  if (sections.length > 0) {
    const activateTocItem = (id) => {
      tocItems.forEach((item) => {
        const link = item.querySelector('a');
        item.classList.toggle('active', link && link.getAttribute('href') === `#${id}`);
      });
    };

    const sectionObserver = new IntersectionObserver((entries) => {
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

    sections.forEach((section) => sectionObserver.observe(section));
  }

  if (animatedBarBlocks.length > 0) {
    const barObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -15% 0px',
      threshold: 0.18,
    });

    animatedBarBlocks.forEach((block) => barObserver.observe(block));
  }
});
