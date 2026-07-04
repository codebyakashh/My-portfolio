/* ============================================================
   PORTFOLIO — script.js
   Akash Kumar | Full Stack Developer
   ============================================================ */

'use strict';

/* ============================================================
   1. NAVBAR — scroll shadow + hamburger menu
   ============================================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  updateActiveLink();
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const open  = navLinks.classList.contains('open');
  spans[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity   = open ? '0' : '1';
  spans[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
  });
});

/* ============================================================
   2. ACTIVE NAV LINK — based on scroll position
   ============================================================ */
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 100;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-links a[href="#${id}"]`);

    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

/* ============================================================
   3. REVEAL ANIMATIONS — intersection observer
   ============================================================ */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay for sibling elements in the same parent
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const index    = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${index * 0.1}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

/* ============================================================
   4. PROJECTS CAROUSEL
   ============================================================ */
const track   = document.getElementById('projectsTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;

function getVisibleCount() {
  if (window.innerWidth <= 768)  return 1;
  if (window.innerWidth <= 1100) return 2;
  return 3;
}

function getCardWidth() {
  const cards = track.querySelectorAll('.project-card');
  if (!cards.length) return 0;
  const style = getComputedStyle(cards[0]);
  return cards[0].offsetWidth + parseInt(style.marginRight || 20);
}

function getTotalCards() {
  return track.querySelectorAll('.project-card').length;
}

function updateCarousel(animate = true) {
  const visible = getVisibleCount();
  const total   = getTotalCards();
  const maxIdx  = Math.max(0, total - visible);
  currentIndex  = Math.max(0, Math.min(currentIndex, maxIdx));

  const cardW = getCardWidth();
  const gap   = 20;
  const offset = currentIndex * (cardW);

  track.style.transition = animate ? 'transform 0.45s cubic-bezier(.4,0,.2,1)' : 'none';
  track.style.transform  = `translateX(-${offset}px)`;

  prevBtn.style.opacity      = currentIndex === 0 ? '0.35' : '1';
  nextBtn.style.opacity      = currentIndex >= maxIdx ? '0.35' : '1';
  prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
  nextBtn.style.pointerEvents = currentIndex >= maxIdx ? 'none' : 'auto';
}

prevBtn.addEventListener('click', () => { currentIndex--; updateCarousel(); });
nextBtn.addEventListener('click', () => { currentIndex++; updateCarousel(); });

window.addEventListener('resize', () => { currentIndex = 0; updateCarousel(false); });

// Touch/swipe support
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend',   e => {
  const delta = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(delta) > 40) {
    if (delta > 0) nextBtn.click();
    else           prevBtn.click();
  }
});

// Init carousel
updateCarousel(false);

/* ============================================================
   5. CONTACT FORM
   ============================================================ */
const contactForm = document.getElementById("contactForm");

emailjs.init("mWzWcUPQbrZ0gC4qT");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector(
    'button[type="submit"]'
  );

  const original = btn.innerHTML;

  btn.innerHTML =
    'Sending... <i class="fas fa-spinner fa-spin"></i>';

  btn.disabled = true;

  const templateParams = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
  };

  try {
    await emailjs.send(
      "service_amryo1p",
      "template_3z32oo8",
      templateParams
    );

    btn.innerHTML =
      'Message Sent! <i class="fas fa-check"></i>';

    btn.style.background = "#22c55e";

    contactForm.reset();

  } catch (error) {

    console.error(error);

    btn.innerHTML = "Failed to Send";

    btn.style.background = "#ef4444";

  }

  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = "";
    btn.disabled = false;
  }, 3000);
});

/* ============================================================
   6. TYPING EFFECT — Hero subtitle
   ============================================================ */
const typingTarget = document.querySelector('.hero-sub');
if (typingTarget) {
  const text    = typingTarget.textContent;
  const speed   = 55;
  let   charIdx = 0;

  typingTarget.textContent = '';
  typingTarget.style.borderRight = '2px solid #ff2d55';
  typingTarget.style.display = 'inline-block';

  function type() {
    if (charIdx < text.length) {
      typingTarget.textContent += text[charIdx++];
      setTimeout(type, speed);
    } else {
      // Blink cursor then remove
      let blinks = 0;
      const blink = setInterval(() => {
        typingTarget.style.borderRight =
          blinks % 2 === 0 ? '2px solid transparent' : '2px solid #ff2d55';
        if (++blinks >= 6) {
          clearInterval(blink);
          typingTarget.style.borderRight = 'none';
        }
      }, 500);
    }
  }

  // Delay typing until hero is visible
  setTimeout(type, 800);
}

/* ============================================================
   7. PARALLAX — hero orb subtle movement on mouse
   ============================================================ */
const heroOrb = document.querySelector('.hero-orb');
if (heroOrb) {
  document.addEventListener('mousemove', (e) => {
    const { innerWidth: w, innerHeight: h } = window;
    const x = (e.clientX / w - 0.5) * 14;
    const y = (e.clientY / h - 0.5) * 14;
    heroOrb.style.transform = `translate(${x}px, ${y}px)`;
  });
}

/* ============================================================
   8. SKILL ITEMS — animated entrance
   ============================================================ */
const skillItems = document.querySelectorAll('.skill-item');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll('.skill-item');
      items.forEach((item, i) => {
        item.style.opacity   = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s`;
        requestAnimationFrame(() => {
          item.style.opacity   = '1';
          item.style.transform = 'translateY(0)';
        });
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const skillsGrid = document.querySelector('.skills-grid');
if (skillsGrid) skillObserver.observe(skillsGrid);

/* ============================================================
   9. SMOOTH SCROLL for anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   10. COUNTER ANIMATION — stat numbers
   ============================================================ */
function animateCounter(el, target, duration = 1200) {
  let start     = 0;
  const step    = Math.ceil(target / (duration / 16));
  const interval = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + '+';
      clearInterval(interval);
    } else {
      el.textContent = start + '+';
    }
  }, 16);
}

const statNums = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el  = entry.target;
      const val = parseInt(el.textContent);
      if (!isNaN(val)) animateCounter(el, val);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statObserver.observe(el));

/* ============================================================
   11. CURSOR GLOW — subtle neon trail (desktop only)
   ============================================================ */
if (window.innerWidth > 768) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,45,85,0.055) 0%, transparent 70%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: left 0.08s ease, top 0.08s ease;
    left: -999px; top: -999px;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

/* ============================================================
   12. NAVBAR — active state on page load
   ============================================================ */
updateActiveLink();

/* ============================================================
   13. FLOATING ICONS — extra subtle pulse on hover over orb
   ============================================================ */
const floatIcons = document.querySelectorAll('.float-icon');
floatIcons.forEach(icon => {
  icon.addEventListener('mouseenter', () => {
    icon.style.background    = 'rgba(255,45,85,0.25)';
    icon.style.borderColor   = 'rgba(255,45,85,0.8)';
    icon.style.boxShadow     = '0 0 20px rgba(255,45,85,0.5)';
    icon.style.transform     = 'scale(1.2)';
    icon.style.transition    = 'all 0.3s ease';
  });
  icon.addEventListener('mouseleave', () => {
    icon.style.background    = '';
    icon.style.borderColor   = '';
    icon.style.boxShadow     = '';
    icon.style.transform     = '';
  });
});

/* ============================================================
   14. TIMELINE ITEMS — stagger entrance
   ============================================================ */
const timelineItems = document.querySelectorAll('.timeline-item');
const tlObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll('.timeline-item');
      items.forEach((item, i) => {
        item.style.opacity   = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `opacity 0.5s ease ${i * 0.15}s, transform 0.5s ease ${i * 0.15}s`;
        setTimeout(() => {
          item.style.opacity   = '1';
          item.style.transform = 'translateX(0)';
        }, 50);
      });
      tlObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.timeline').forEach(tl => tlObserver.observe(tl));

/* ============================================================
   15. PAGE LOAD — fade-in
   ============================================================ */
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.6s ease';
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});