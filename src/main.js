const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

window.addEventListener('DOMContentLoaded', () => {
  const heroRight = document.querySelector('.hero__right');
  const hamburgerButton = document.querySelector('.hero__hamburger');
  const heroMenu = document.querySelector('.hero__menu');
  const heroMenuLinks = document.querySelectorAll('.hero__menu a[href^="#"]');
  const aboutMoreTrigger = document.querySelector('.about__more');
  const aboutDetailPanel = document.querySelector('.about-detail-panel');
  const aboutDetailPanelInner = document.querySelector('.about-detail-panel__inner');
  const aboutSection = document.querySelector('#about');
  const contactSection = document.querySelector('#contact');
  const worksCircleStrip = document.querySelector('.works-circle-strip');
  const dimCloseButton = document.querySelector('.site-dim-close');
  const siteBody = document.body;
  const compactThreshold = 100;
  let lastScrollY = window.scrollY;
  let compactEnabled = false;
  let isCompactMode = false;
  let menuSwitchTimeline = null;

  const runMenuTransition = (toCompact) => {
    if (!heroRight || !hamburgerButton || !heroMenu || !gsap) {
      return;
    }

    if (menuSwitchTimeline) {
      menuSwitchTimeline.kill();
    }
    const wasOpen = heroRight.classList.contains('is-open');

    if (toCompact) {
      heroRight.classList.remove('is-open');
      hamburgerButton.setAttribute('aria-expanded', 'false');
      heroMenu.style.pointerEvents = 'none';
      siteBody.classList.remove('is-menu-open');

      menuSwitchTimeline = gsap.timeline();
      menuSwitchTimeline
        .to(heroMenu, {
          autoAlpha: 0,
          y: -12,
          duration: 0.22,
          ease: 'power2.out'
        })
        .add(() => {
          heroRight.classList.add('is-compact');
        })
        .to(hamburgerButton, {
          autoAlpha: 1,
          y: 0,
          duration: 0.24,
          ease: 'power2.out',
          onStart: () => {
            hamburgerButton.style.pointerEvents = 'auto';
          }
        }, '>-0.02');
      return;
    }

    menuSwitchTimeline = gsap.timeline({
      onComplete: () => {
        heroMenu.style.pointerEvents = 'auto';
        gsap.set(heroMenu, { clearProps: 'opacity,visibility' });
      }
    });

    if (wasOpen) {
      menuSwitchTimeline.to(heroMenu, {
        autoAlpha: 0,
        y: -8,
        duration: 0.18,
        ease: 'power2.out',
        onStart: () => {
          hamburgerButton.setAttribute('aria-expanded', 'false');
        },
        onComplete: () => {
          heroRight.classList.remove('is-open');
          heroMenu.style.pointerEvents = 'none';
          siteBody.classList.remove('is-menu-open');
        }
      }, 0);
    } else {
      heroRight.classList.remove('is-open');
      hamburgerButton.setAttribute('aria-expanded', 'false');
      heroMenu.style.pointerEvents = 'none';
      siteBody.classList.remove('is-menu-open');
    }

    menuSwitchTimeline
      .to(hamburgerButton, {
        autoAlpha: 0,
        y: 10,
        duration: 0.2,
        ease: 'power2.out',
        onComplete: () => {
          hamburgerButton.style.pointerEvents = 'none';
        }
      }, 0)
      .add(() => {
        // Move menu back to its normal (non-fixed) layout before fade-in.
        heroRight.classList.remove('is-compact');
        gsap.set(heroMenu, { y: 0 });
      })
      .to(heroMenu, {
        autoAlpha: 1,
        duration: 0.65,
        ease: 'power1.out',
        onStart: () => {
          heroMenu.style.pointerEvents = 'auto';
        }
      }, '>-0.02');
  };

  if (gsap && heroMenu && hamburgerButton) {
    gsap.set(heroMenu, { autoAlpha: 1, y: 0 });
    gsap.set(hamburgerButton, { autoAlpha: 0, y: 10 });
  }

  const applyInitialHeroMenuMode = () => {
    if (!heroRight || !hamburgerButton || !heroMenu) {
      return;
    }

    const currentScrollY = window.scrollY;
    const shouldCompact = currentScrollY >= compactThreshold;

    compactEnabled = shouldCompact;
    isCompactMode = shouldCompact;
    lastScrollY = currentScrollY;

    if (shouldCompact) {
      heroRight.classList.add('is-compact');
      heroRight.classList.remove('is-open');
      hamburgerButton.setAttribute('aria-expanded', 'false');
      heroMenu.style.pointerEvents = 'none';
      siteBody.classList.remove('is-menu-open');

      if (gsap) {
        gsap.set(heroMenu, { autoAlpha: 0, y: 0 });
        gsap.set(hamburgerButton, {
          autoAlpha: 1,
          y: 0,
          pointerEvents: 'auto'
        });
      } else {
        heroMenu.style.opacity = '0';
        heroMenu.style.visibility = 'hidden';
        hamburgerButton.style.opacity = '1';
        hamburgerButton.style.visibility = 'visible';
        hamburgerButton.style.pointerEvents = 'auto';
      }
      return;
    }

    heroRight.classList.remove('is-compact', 'is-open');
    hamburgerButton.setAttribute('aria-expanded', 'false');
    heroMenu.style.pointerEvents = 'auto';
    siteBody.classList.remove('is-menu-open');

    if (gsap) {
      gsap.set(heroMenu, { autoAlpha: 1, y: 0, pointerEvents: 'auto' });
      gsap.set(hamburgerButton, { autoAlpha: 0, y: 10, pointerEvents: 'none' });
    } else {
      heroMenu.style.opacity = '1';
      heroMenu.style.visibility = 'visible';
      hamburgerButton.style.opacity = '0';
      hamburgerButton.style.visibility = 'hidden';
      hamburgerButton.style.pointerEvents = 'none';
    }
  };

  const updateHeroMenuMode = () => {
    if (!heroRight || !hamburgerButton) {
      return;
    }

    const currentScrollY = window.scrollY;
    const isScrollingDown = currentScrollY > lastScrollY;

    if (isScrollingDown && currentScrollY >= compactThreshold) {
      compactEnabled = true;
    }

    if (currentScrollY < compactThreshold) {
      compactEnabled = false;
    }

    const shouldCompact = compactEnabled && currentScrollY >= compactThreshold;
    if (shouldCompact !== isCompactMode) {
      isCompactMode = shouldCompact;
      runMenuTransition(shouldCompact);
    }

    lastScrollY = currentScrollY;
  };

  if (hamburgerButton && heroRight) {
    hamburgerButton.addEventListener('click', () => {
      if (!heroRight.classList.contains('is-compact')) {
        return;
      }

      const isOpen = heroRight.classList.contains('is-open');
      if (!isOpen) {
        heroRight.classList.add('is-open');
        hamburgerButton.setAttribute('aria-expanded', 'true');
        siteBody.classList.add('is-menu-open');
        gsap.fromTo(
          heroMenu,
          { autoAlpha: 0, y: -8 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.22,
            ease: 'power2.out',
            onStart: () => {
              heroMenu.style.pointerEvents = 'auto';
            }
          }
        );
        return;
      }

      hamburgerButton.setAttribute('aria-expanded', 'false');
      gsap.to(heroMenu, {
        autoAlpha: 0,
        y: -8,
        duration: 0.18,
        ease: 'power2.out',
        onComplete: () => {
          heroRight.classList.remove('is-open');
          heroMenu.style.pointerEvents = 'none';
          siteBody.classList.remove('is-menu-open');
        }
      });
    });
  }

  if (heroMenuLinks.length) {
    heroMenuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        const href = link.getAttribute('href');
        if (!href || href === '#') {
          return;
        }

        const target = document.querySelector(href);
        if (!target) {
          return;
        }

        const isOpenInCompact =
          heroRight?.classList.contains('is-compact') &&
          heroRight.classList.contains('is-open');
        if (!isOpenInCompact) {
          return;
        }

        // Close menu immediately and let native anchor smooth-scroll run.
        hamburgerButton?.setAttribute('aria-expanded', 'false');
        heroRight.classList.remove('is-open');
        heroMenu.style.pointerEvents = 'none';
        siteBody.classList.remove('is-menu-open');
      });
    });
  }

  if (aboutMoreTrigger && siteBody) {
    aboutMoreTrigger.setAttribute('role', 'button');
    aboutMoreTrigger.setAttribute('tabindex', '0');

    const closeAboutDim = () => {
      siteBody.classList.remove('is-about-dim');
      aboutMoreTrigger.setAttribute('aria-expanded', 'false');
      aboutDetailPanel?.setAttribute('aria-hidden', 'true');
    };

    const toggleAboutDim = (event) => {
      event?.stopPropagation();
      const willOpen = !siteBody.classList.contains('is-about-dim');
      if (willOpen) {
        siteBody.classList.add('is-about-dim');
        aboutMoreTrigger.setAttribute('aria-expanded', 'true');
        aboutDetailPanel?.setAttribute('aria-hidden', 'false');
        return;
      }
      closeAboutDim();
    };

    aboutMoreTrigger.addEventListener('click', toggleAboutDim);
    aboutMoreTrigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleAboutDim(event);
      }
    });

    document.addEventListener('click', (event) => {
      if (!siteBody.classList.contains('is-about-dim')) {
        return;
      }
      if (aboutMoreTrigger.contains(event.target)) {
        return;
      }
      if (aboutDetailPanelInner?.contains(event.target)) {
        return;
      }
      if (dimCloseButton?.contains(event.target)) {
        return;
      }
      closeAboutDim();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeAboutDim();
      }
    });

    if (dimCloseButton) {
      dimCloseButton.addEventListener('click', (event) => {
        event.stopPropagation();
        closeAboutDim();
      });
    }
  }

  applyInitialHeroMenuMode();

  window.addEventListener('scroll', updateHeroMenuMode, { passive: true });

  if (!gsap) {
    return;
  }

  if (ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  if (heroMenu && !heroRight?.classList.contains('is-compact')) {
    gsap.fromTo(
      heroMenu,
      { autoAlpha: 0, y: -48 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.in' }
    );
  }

  const aboutContent = document.querySelector('.about__content');
  if (aboutContent && aboutSection && ScrollTrigger) {
    gsap.set(aboutContent, { autoAlpha: 0 });
    gsap.to(aboutContent, {
      autoAlpha: 1,
      duration: 2,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: aboutSection,
        start: 'top 70%',
        once: true
      }
    });
  }

  const processFlow = document.querySelector('.process__inner');
  const processSection = document.querySelector('.process');
  if (processFlow && processSection && ScrollTrigger) {
    gsap.set(processFlow, { autoAlpha: 0, filter: 'blur(10px)' });
    gsap.to(processFlow, {
      autoAlpha: 1,
      filter: 'blur(0px)',
      duration: 1.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: processSection,
        start: 'top 50%',
        toggleActions: 'play none none reverse'
      }
    });
  }

  if (siteBody && ScrollTrigger) {
    const scrollIndicatorHideTrigger = worksCircleStrip || contactSection;
    if (scrollIndicatorHideTrigger) {
      siteBody.classList.remove('is-scroll-indicator-hidden');
      ScrollTrigger.create({
        trigger: scrollIndicatorHideTrigger,
        start: 'top 92%',
        onEnter: () => {
          siteBody.classList.add('is-scroll-indicator-hidden');
        },
        onEnterBack: () => {
          siteBody.classList.add('is-scroll-indicator-hidden');
        },
        onLeaveBack: () => {
          siteBody.classList.remove('is-scroll-indicator-hidden');
        }
      });
    }
  }

  const worksImageWraps = document.querySelectorAll('.works-item__image-wrap');
  if (worksImageWraps.length && ScrollTrigger) {
    worksImageWraps.forEach((wrap, index) => {
      const isOddRow = index % 2 === 0;
      const fromX = isOddRow ? -72 : 72;

      gsap.fromTo(
        wrap,
        { x: fromX, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.35,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top 70%',
            once: true
          }
        }
      );
    });
  }

  gsap.from('.works-item', { y: 18, opacity: 0, stagger: 0.12, duration: 0.45, ease: 'power3.out' });
});
