// ════════════════════════════════════════
//   EAMAN FATIMA PORTFOLIO — SCRIPT.JS
// ════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function () {

  // ── CUSTOM CURSOR ──────────────────────
  var dot   = document.getElementById('cursorDot');
  var ring  = document.getElementById('cursorRing');
  var label = document.getElementById('cursorLabel');

  // Guard: if elements don't exist, skip cursor setup
  if (!dot || !ring) {
    console.warn('Cursor elements not found.');
  } else {

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    // Position cursor at centre on load so it doesn't start at 0,0
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';

    // ── Trail dots ────────────────────────
    var TRAIL_COUNT = 8;
    var trails = [];
    var trailPositions = [];
    for (var t = 0; t < TRAIL_COUNT; t++) {
      var td = document.createElement('div');
      td.className = 'cursor-trail-dot';
      var scaleVal = 1 - t * (0.9 / TRAIL_COUNT);
      var alphaVal = 0.5 - t * (0.45 / TRAIL_COUNT);
      td.style.cssText = 'transform:translate(-50%,-50%) scale(' + scaleVal + ');opacity:' + alphaVal + ';left:' + mx + 'px;top:' + my + 'px;';
      document.body.appendChild(td);
      trails.push(td);
      trailPositions.push({ x: mx, y: my });
    }

    // ── Mouse move ────────────────────────
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
      if (label) {
        label.style.left = mx + 'px';
        label.style.top  = my + 'px';
      }
    });

    // ── Animate ring + trails ─────────────
    function animateCursor() {
      rx += (mx - rx) * 0.10;
      ry += (my - ry) * 0.10;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';

      for (var i = trails.length - 1; i > 0; i--) {
        trailPositions[i].x += (trailPositions[i - 1].x - trailPositions[i].x) * 0.35;
        trailPositions[i].y += (trailPositions[i - 1].y - trailPositions[i].y) * 0.35;
        trails[i].style.left = trailPositions[i].x + 'px';
        trails[i].style.top  = trailPositions[i].y + 'px';
      }
      trailPositions[0].x += (mx - trailPositions[0].x) * 0.35;
      trailPositions[0].y += (my - trailPositions[0].y) * 0.35;
      trails[0].style.left = trailPositions[0].x + 'px';
      trails[0].style.top  = trailPositions[0].y + 'px';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // ── Click: ripple + particles ─────────
    document.addEventListener('click', function (e) {
      // Ripple
      var rip = document.createElement('div');
      rip.className = 'cursor-ripple';
      rip.style.left = e.clientX + 'px';
      rip.style.top  = e.clientY + 'px';
      document.body.appendChild(rip);
      setTimeout(function () { rip.remove(); }, 700);

      // Particles
      for (var p = 0; p < 8; p++) {
        (function (idx) {
          var par   = document.createElement('div');
          par.className = 'cursor-particle';
          var angle = (idx / 8) * Math.PI * 2;
          var dist  = 30 + Math.random() * 24;
          par.style.left = e.clientX + 'px';
          par.style.top  = e.clientY + 'px';
          par.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
          par.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
          par.style.background = Math.random() > 0.5 ? '#F5A623' : '#fcd97a';
          document.body.appendChild(par);
          setTimeout(function () { par.remove(); }, 600);
        })(p);
      }

      dot.classList.add('clicking');
      ring.classList.add('clicking');
      setTimeout(function () {
        dot.classList.remove('clicking');
        ring.classList.remove('clicking');
      }, 200);
    });

    // ── Hover detection ───────────────────
    function attachHover(el) {
      var elLabel = el.getAttribute('data-cursor') || '';
      el.addEventListener('mouseenter', function () {
        dot.classList.add('hovering');
        ring.classList.add('hovering');
        if (label && elLabel) {
          label.textContent = elLabel;
          label.classList.add('visible');
        }
      });
      el.addEventListener('mouseleave', function () {
        dot.classList.remove('hovering');
        ring.classList.remove('hovering');
        if (label) label.classList.remove('visible');
      });
    }

    document.querySelectorAll(
      'a, button, .filter-btn, .project-card, .card-btn, .skill-card, .highlight-item, .tag, .social-btn, .contact-item'
    ).forEach(attachHover);

    // ── Hide/show on window leave/enter ───
    document.addEventListener('mouseleave', function () {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
      trails.forEach(function (td) { td.style.opacity = '0'; });
    });
    document.addEventListener('mouseenter', function () {
      dot.style.opacity  = '';
      ring.style.opacity = '';
      // trails opacity is controlled by their base style — restore
      for (var i = 0; i < trails.length; i++) {
        var a = 0.5 - i * (0.45 / TRAIL_COUNT);
        trails[i].style.opacity = String(Math.max(a, 0));
      }
    });

  } // end cursor guard

  // ── NAVBAR SCROLL ──────────────────────
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveNav();
  });

  // ── HAMBURGER ───────────────────────────
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      var spans  = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
      } else {
        spans.forEach(function (s) { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    document.querySelectorAll('.mobile-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(function (s) {
          s.style.transform = ''; s.style.opacity = '';
        });
      });
    });

    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(function (s) {
          s.style.transform = ''; s.style.opacity = '';
        });
      }
    });
  }

  // ── ACTIVE NAV LINK ─────────────────────
  function updateActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var scrollY  = window.scrollY + 100;
    sections.forEach(function (section) {
      var top    = section.offsetTop;
      var height = section.offsetHeight;
      var id     = section.getAttribute('id');
      var link   = document.querySelector('.nav-link[href="#' + id + '"]');
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  }

  // ── SCROLL REVEAL ───────────────────────
  var revealEls = document.querySelectorAll('.reveal');
  var vh = window.innerHeight;

  revealEls.forEach(function (el) {
    var rect = el.getBoundingClientRect();
    if (rect.top > vh) {
      el.classList.add('will-animate');
    }
  });

  function revealOnScroll() {
    revealEls.forEach(function (el) {
      if (!el.classList.contains('will-animate')) return;
      var rect = el.getBoundingClientRect();
      if (rect.top < vh - 40) {
        el.classList.add('visible');
        el.classList.remove('will-animate');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll, { passive: true });

  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          e.target.classList.remove('will-animate');
        }
      });
    }, { threshold: 0.05 });

    revealEls.forEach(function (el) {
      if (el.classList.contains('will-animate')) revealObs.observe(el);
    });
  }

  // ── SKILL BAR ANIMATION ─────────────────
  if ('IntersectionObserver' in window) {
    var skillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-fill').forEach(function (bar, i) {
            var w = parseFloat(bar.dataset.w) / 100;
            setTimeout(function () {
              bar.style.transform = 'scaleX(' + w + ')';
              bar.classList.add('animated');
            }, i * 100);
          });
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-card').forEach(function (card) {
      skillObserver.observe(card);
    });
  }

  // ── PROJECT FILTER ──────────────────────
  var filterBtns   = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.dataset.filter;
      projectCards.forEach(function (card) {
        var cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeUp 0.45s ease forwards';
        } else {
          card.classList.add('hidden');
          card.style.animation = '';
        }
      });
    });
  });

  // ── CONTACT FORM (Formspree) ─────────────
  var form      = document.getElementById('contactForm');
  var success   = document.getElementById('formSuccess');
  var errorBox  = document.getElementById('formError');
  var submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Hide previous messages
      if (success)  success.style.display  = 'none';
      if (errorBox) errorBox.style.display = 'none';

      // Button loading state
      if (submitBtn) {
        submitBtn.disabled     = true;
        submitBtn.innerHTML    = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
      }

      var data = new FormData(form);

      fetch(form.action, {
        method:  'POST',
        body:    data,
        headers: { 'Accept': 'application/json' }
      })
      .then(function (response) {
        if (response.ok) {
          // SUCCESS — show green message, reset form
          if (success)  success.style.display  = 'block';
          form.reset();
          if (submitBtn) {
            submitBtn.innerHTML = 'Message Sent <i class="fas fa-check"></i>';
            setTimeout(function () {
              submitBtn.disabled  = false;
              submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
            }, 4000);
          }
        } else {
          // SERVER ERROR
          return response.json().then(function (data) { throw data; });
        }
      })
      .catch(function () {
        // NETWORK / FORMSPREE ERROR
        if (errorBox) errorBox.style.display = 'block';
        if (submitBtn) {
          submitBtn.disabled  = false;
          submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
        }
      });
    });
  }

  // ── RESUME BUTTON ───────────────────────
  var resumeBtn    = document.getElementById('resumeBtn');
  var resumeMobile = document.querySelector('.resume-mobile');

  function handleResume(e) {

  }

  if (resumeBtn)    resumeBtn.addEventListener('click', handleResume);
  if (resumeMobile) resumeMobile.addEventListener('click', handleResume);

  // ── SMOOTH SCROLL ──────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href   = link.getAttribute('href');
      var target = document.querySelector(href);
      if (target && href !== '#') {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── COUNTER ANIMATION ──────────────────
  var statNums = document.querySelectorAll('.stat-num');

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el     = entry.target;
          var target = parseInt(el.textContent, 10);
          if (isNaN(target)) return;
          var current = 0;
          var step    = Math.ceil(target / 30);
          var timer   = setInterval(function () {
            current += step;
            if (current >= target) {
              el.textContent = target + '+';
              clearInterval(timer);
            } else {
              el.textContent = current + '+';
            }
          }, 40);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(function (el) { counterObserver.observe(el); });
  }

  // ── PROJECT CARD HOVER ─────────────────
  projectCards.forEach(function (card) {
    card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease, background 0.25s ease';
  });

  console.log('Portfolio loaded ✦ Eaman Fatima');

});
