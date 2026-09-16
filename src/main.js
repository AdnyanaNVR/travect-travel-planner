import '@fortawesome/fontawesome-free/css/all.min.css';
import $ from 'jquery';
import './index.css';

// Expose jQuery globally for any inline event handlers or plugins
if (typeof window !== 'undefined') {
  window.$ = $;
  window.jQuery = $;
}

// Prevent browser from restoring scroll position or jumping to previous anchors on reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

function initApp() {
  // Ensure we start at top of homepage on initial load or reload
  if (window.location.hash && window.location.hash !== '#beranda') {
    history.replaceState(null, '', window.location.pathname);
  }
  window.scrollTo(0, 0);

  // Initialize Lenis Smooth Scroll
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Bi-directional Scroll-linked Video Playback:
  // Play forward when scrolling down, play backward (rewind) when scrolling up, pause when stationary.
  const heroVideo = document.getElementById('hero-background-video');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.pause();

    let targetTime = 0;
    let isSeeking = false;
    let isReady = false;

    const onMetadataLoaded = () => {
      isReady = true;
      const duration = heroVideo.duration || 1;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const scrollRatio = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      targetTime = scrollRatio * duration;
      heroVideo.currentTime = targetTime;
    };

    if (heroVideo.readyState >= 1) {
      onMetadataLoaded();
    } else {
      heroVideo.addEventListener('loadedmetadata', onMetadataLoaded);
    }

    const updateVideoTimeline = () => {
      if (isReady && heroVideo.duration) {
        const duration = heroVideo.duration;
        const maxScroll = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1
        );

        // Get smooth scroll position from Lenis
        const currentScrollY = lenis ? lenis.scroll : window.scrollY;
        const scrollRatio = Math.min(Math.max(currentScrollY / maxScroll, 0), 1);
        targetTime = scrollRatio * (duration - 0.04);

        const diff = targetTime - heroVideo.currentTime;
        if (Math.abs(diff) > 0.008 && !isSeeking) {
          isSeeking = true;
          // Direct fastSeek if available in browser for instant hardware-accelerated seek
          const nextTime = Math.min(
            Math.max(heroVideo.currentTime + diff * 0.45, 0),
            duration - 0.02
          );

          if (typeof heroVideo.fastSeek === 'function') {
            heroVideo.fastSeek(nextTime);
          } else {
            heroVideo.currentTime = nextTime;
          }
        }
      }
      requestAnimationFrame(updateVideoTimeline);
    };

    heroVideo.addEventListener('seeked', () => {
      isSeeking = false;
    });

    requestAnimationFrame(updateVideoTimeline);
  }

  // Smooth anchor link scrolling via Lenis
  $('a[href^="#"]').on('click', function (e) {
    const targetId = $(this).attr('href');
    if (targetId && targetId !== '#') {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(targetElement, { offset: 0, duration: 1.2 });
        } else {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  });

  // Initialize AOS (Animate On Scroll) if loaded
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      once: true,
      easing: 'ease-out-cubic',
    });
  }

  // GSAP subtle entrance & interactive animations
  if (typeof gsap !== 'undefined') {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('#brand-logo', {
      opacity: 0,
      y: -20,
      duration: 0.7,
    })
    .from('#desktop-menu', {
      opacity: 0,
      y: -15,
      scale: 0.94,
      duration: 0.7,
    }, '-=0.5')
    .from('#desktop-auth-actions', {
      opacity: 0,
      y: -15,
      duration: 0.6,
    }, '-=0.5')
    .from('#hero-title span', {
      opacity: 0,
      y: 35,
      duration: 0.9,
      stagger: 0.08,
    }, '-=0.3')
    .from('#hero-subtitle', {
      opacity: 0,
      y: 25,
      duration: 0.8,
    }, '-=0.6');

    // Subtle 3D tilt interaction for interactive cards on desktop
    const tiltCards = document.querySelectorAll('#destination-carousel-card, .testimoni-card');
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 1024) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(card, {
          rotationY: x * 0.03,
          rotationX: -y * 0.03,
          transformPerspective: 1000,
          duration: 0.4,
          ease: 'power1.out',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      });
    });
  }

  // Mobile Menu Toggle (using jQuery)
  let isMobileMenuOpen = false;
  const $mobileMenu = $('#mobile-menu');
  const $menuIcon = $('#menu-icon');

  $('#mobile-menu-btn').on('click', () => {
    isMobileMenuOpen = !isMobileMenuOpen;
    if (isMobileMenuOpen) {
      $mobileMenu.removeClass('hidden').hide().fadeIn(150);
      $menuIcon.removeClass('fa-bars').addClass('fa-xmark');
    } else {
      $mobileMenu.fadeOut(150, () => {
        $mobileMenu.addClass('hidden');
      });
      $menuIcon.removeClass('fa-xmark').addClass('fa-bars');
    }
  });

  // Page Navigation State
  let currentPage = 'Beranda';

  function navigateToPage(pageName, scrollToTop = true) {
    currentPage = pageName;
    if (pageName === 'Tentang') {
      $('#page-beranda').addClass('hidden');
      $('#page-tentang').removeClass('hidden');

      // Update Nav Buttons
      $('.nav-tab-btn').each(function () {
        const $btn = $(this);
        if ($btn.data('tab') === 'Tentang') {
          $btn
            .removeClass('text-gray-400 hover:text-gray-800')
            .addClass('bg-[#2b2b2b] text-white shadow-xs');
        } else {
          $btn
            .removeClass('bg-[#2b2b2b] text-white shadow-xs')
            .addClass('text-gray-400 hover:text-gray-800');
        }
      });

      $('.mobile-nav-tab-btn').each(function () {
        const $btn = $(this);
        if ($btn.data('tab') === 'Tentang') {
          $btn
            .removeClass('text-gray-600 hover:bg-gray-50 hover:text-gray-900')
            .addClass('bg-neutral-900 text-white');
        } else {
          $btn
            .removeClass('bg-neutral-900 text-white')
            .addClass('text-gray-600 hover:bg-gray-50 hover:text-gray-900');
        }
      });

      if (history.pushState) {
        history.pushState(null, '', '#tentang');
      }

      if (scrollToTop) {
        if (lenis) {
          lenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }
      }
    } else {
      $('#page-tentang').addClass('hidden');
      $('#page-beranda').removeClass('hidden');

      // Update Nav Buttons
      $('.nav-tab-btn').each(function () {
        const $btn = $(this);
        if ($btn.data('tab') === 'Beranda') {
          $btn
            .removeClass('text-gray-400 hover:text-gray-800')
            .addClass('bg-[#2b2b2b] text-white shadow-xs');
        } else {
          $btn
            .removeClass('bg-[#2b2b2b] text-white shadow-xs')
            .addClass('text-gray-400 hover:text-gray-800');
        }
      });

      $('.mobile-nav-tab-btn').each(function () {
        const $btn = $(this);
        if ($btn.data('tab') === 'Beranda') {
          $btn
            .removeClass('text-gray-600 hover:bg-gray-50 hover:text-gray-900')
            .addClass('bg-neutral-900 text-white');
        } else {
          $btn
            .removeClass('bg-neutral-900 text-white')
            .addClass('text-gray-600 hover:bg-gray-50 hover:text-gray-900');
        }
      });

      if (history.pushState) {
        history.pushState(null, '', '#beranda');
      }

      if (scrollToTop) {
        if (lenis) {
          lenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }
      }
    }

    if (typeof AOS !== 'undefined') {
      setTimeout(() => AOS.refresh(), 80);
    }
  }

  // Navigation tab click handler
  $('.nav-tab-btn, .mobile-nav-tab-btn').on('click', function () {
    const tabName = $(this).data('tab');
    if (tabName === 'Beranda') {
      navigateToPage('Beranda');
    } else if (tabName === 'Tentang') {
      navigateToPage('Tentang');
    } else if (tabName === 'Booking') {
      openInfoModal('booking');
    } else if (tabName === 'Credits') {
      openInfoModal('credits');
    }

    if (isMobileMenuOpen) {
      $mobileMenu.fadeOut(150, () => {
        $mobileMenu.addClass('hidden');
      });
      $menuIcon.removeClass('fa-xmark').addClass('fa-bars');
      isMobileMenuOpen = false;
    }
  });

  // Direct brand logo clicks
  $('#brand-logo').on('click', (e) => {
    e.preventDefault();
    navigateToPage('Beranda');
  });

  // Footer Tentang button
  $(document).on('click', '.footer-tentang-btn', (e) => {
    e.preventDefault();
    navigateToPage('Tentang');
  });

  // Tentang page interactive buttons
  $('#tentang-btn-jelajah').on('click', () => {
    navigateToPage('Beranda');
    setTimeout(() => {
      const el = document.getElementById('kenapa-travect');
      if (el) {
        if (lenis) {
          lenis.scrollTo(el);
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 120);
  });

  $('#tentang-btn-konsultasi').on('click', () => {
    openInfoModal('booking');
  });

  // Handle cross-page hash links for Beranda sections
  $('a[href^="#"]').on('click', function (e) {
    const targetHash = $(this).attr('href');
    if (!targetHash) return;

    if (targetHash === '#beranda') {
      e.preventDefault();
      navigateToPage('Beranda');
    } else if (targetHash === '#kenapa-travect' || targetHash === '#testimoni' || targetHash === '#destinasi') {
      if (currentPage === 'Tentang') {
        e.preventDefault();
        navigateToPage('Beranda', false);
        setTimeout(() => {
          const targetEl = document.querySelector(targetHash);
          if (targetEl) {
            if (lenis) {
              lenis.scrollTo(targetEl);
            } else {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }, 120);
      }
    }
  });

  // Hash change / initial load check
  if (window.location.hash === '#tentang') {
    navigateToPage('Tentang');
  } else {
    navigateToPage('Beranda', false);
  }

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#tentang') {
      navigateToPage('Tentang');
    } else if (window.location.hash === '#beranda' && currentPage !== 'Beranda') {
      navigateToPage('Beranda');
    }
  });

  // Auth Modal Handling
  const $authModal = $('#auth-modal');
  const $authTitle = $('#auth-modal-title');
  const $authDescription = $('#auth-modal-description');
  const $authSubmitBtn = $('#auth-submit-btn-text');
  const $authNameField = $('#auth-name-container');
  const $authSwitchPrompt = $('#auth-switch-prompt');
  const $authSwitchBtn = $('#auth-switch-btn');
  const $authForm = $('#auth-form');
  const $authSuccess = $('#auth-success-state');

  let currentAuthMode = 'masuk';

  function openAuthModal(mode) {
    if (isMobileMenuOpen) {
      $mobileMenu.fadeOut(150, () => {
        $mobileMenu.addClass('hidden');
      });
      $menuIcon.removeClass('fa-xmark').addClass('fa-bars');
      isMobileMenuOpen = false;
    }

    currentAuthMode = mode;
    $authSuccess.addClass('hidden');
    $authForm.removeClass('hidden');

    if (mode === 'masuk') {
      $authTitle.text('Selamat Datang Kembali');
      $authDescription.text('Masuk ke akun Travect untuk mengelola rencana perjalanan Anda');
      $authSubmitBtn.text('Masuk');
      $authNameField.addClass('hidden');
      $('#auth-name-input').removeAttr('required');
      $authSwitchPrompt.text('Belum punya akun?');
      $authSwitchBtn.text('Daftar sekarang');
    } else {
      $authTitle.text('Mulai Petualangan Anda');
      $authDescription.text('Daftar sekarang dan dapatkan penawaran eksklusif destinasi pilihan');
      $authSubmitBtn.text('Daftar Akun');
      $authNameField.removeClass('hidden');
      $('#auth-name-input').attr('required', 'required');
      $authSwitchPrompt.text('Sudah memiliki akun?');
      $authSwitchBtn.text('Masuk di sini');
    }

    $authModal.removeClass('hidden').hide().fadeIn(150);
  }

  function closeAuthModal() {
    $authModal.fadeOut(150, () => {
      $authModal.addClass('hidden');
    });
  }

  $('#btn-masuk-desktop, #btn-masuk-mobile').on('click', () => openAuthModal('masuk'));
  $('#btn-bergabung-desktop, #btn-bergabung-mobile, #cta-btn-bergabung').on('click', () => openAuthModal('bergabung'));

  $('#hero-mobile-cta-btn').on('click', () => {
    const target = document.querySelector('#kenapa-travect');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });

  $('#cta-btn-booking, .footer-booking-btn').on('click', () => openInfoModal('booking'));
  $('.footer-tentang-btn').on('click', () => openInfoModal('tentang'));
  $('.footer-credits-btn').on('click', () => openInfoModal('credits'));

  $('#close-auth-modal, #auth-modal-backdrop').on('click', () => closeAuthModal());

  $authSwitchBtn.on('click', () => {
    openAuthModal(currentAuthMode === 'masuk' ? 'bergabung' : 'masuk');
  });

  $authForm.on('submit', (e) => {
    e.preventDefault();
    $authForm.addClass('hidden');
    $authSuccess.removeClass('hidden');
    $('#auth-success-title').text(
      currentAuthMode === 'masuk' ? 'Berhasil Masuk!' : 'Pendaftaran Berhasil!'
    );

    setTimeout(() => {
      closeAuthModal();
    }, 1200);
  });

  // Info Modal Handling
  const $infoModal = $('#info-modal');
  const $infoBookingContent = $('#info-booking-content');
  const $infoTentangContent = $('#info-tentang-content');
  const $infoCreditsContent = $('#info-credits-content');

  function openInfoModal(type) {
    $infoBookingContent.addClass('hidden');
    $infoTentangContent.addClass('hidden');
    $infoCreditsContent.addClass('hidden');

    if (type === 'booking') {
      $infoBookingContent.removeClass('hidden');
    } else if (type === 'tentang') {
      $infoTentangContent.removeClass('hidden');
    } else if (type === 'credits') {
      $infoCreditsContent.removeClass('hidden');
    }

    $infoModal.removeClass('hidden').hide().fadeIn(150);
  }

  function closeInfoModal() {
    $infoModal.fadeOut(150, () => {
      $infoModal.addClass('hidden');
      setActiveNavTab('Beranda');
    });
  }

  $('#close-info-modal, #info-modal-backdrop, .close-info-btn').on('click', () => closeInfoModal());

  // Interactive Destination Carousel Logic
  let currentCarouselIndex = 0;
  const $slides = $('.carousel-slide');
  const totalSlides = $slides.length;
  const $dots = $('.carousel-dot');
  const $indexDisplay = $('#carousel-current-index');
  let carouselAutoTimer = null;

  function showSlide(index) {
    if (index < 0) {
      currentCarouselIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentCarouselIndex = 0;
    } else {
      currentCarouselIndex = index;
    }

    $slides.each(function (i) {
      const $slide = $(this);
      if (i === currentCarouselIndex) {
        $slide.removeClass('inactive').addClass('active');
      } else {
        $slide.removeClass('active').addClass('inactive');
      }
    });

    $dots.each(function (i) {
      const $dot = $(this);
      if (i === currentCarouselIndex) {
        $dot.removeClass('w-2 bg-neutral-300').addClass('w-6 bg-neutral-900');
      } else {
        $dot.removeClass('w-6 bg-neutral-900').addClass('w-2 bg-neutral-300');
      }
    });

    if ($indexDisplay.length) {
      $indexDisplay.text(currentCarouselIndex + 1);
    }
  }

  function nextSlide() {
    showSlide(currentCarouselIndex + 1);
  }

  function prevSlide() {
    showSlide(currentCarouselIndex - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    carouselAutoTimer = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    if (carouselAutoTimer) {
      clearInterval(carouselAutoTimer);
      carouselAutoTimer = null;
    }
  }

  $('#carousel-next-btn').on('click', () => {
    nextSlide();
    startAutoPlay();
  });

  $('#carousel-prev-btn').on('click', () => {
    prevSlide();
    startAutoPlay();
  });

  $dots.on('click', function () {
    const targetIdx = parseInt($(this).data('target'), 10);
    showSlide(targetIdx);
    startAutoPlay();
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  const carouselCard = document.getElementById('destination-carousel-container');

  if (carouselCard) {
    carouselCard.addEventListener('mouseenter', stopAutoPlay);
    carouselCard.addEventListener('mouseleave', startAutoPlay);

    carouselCard.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    carouselCard.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoPlay();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }
  }

  startAutoPlay();

  // Booking action from destination card
  $(document).on('click', '.destination-book-btn', function () {
    const dest = $(this).data('destination');
    openInfoModal('booking');
  });

  // Close modals on Escape key
  $(document).on('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAuthModal();
      closeInfoModal();
      if (isMobileMenuOpen) {
        $mobileMenu.fadeOut(150, () => {
          $mobileMenu.addClass('hidden');
        });
        $menuIcon.removeClass('fa-xmark').addClass('fa-bars');
        isMobileMenuOpen = false;
      }
    }
  });

  // Close mobile dropdown when tapping/clicking outside header
  $(document).on('click touchstart', (e) => {
    if (isMobileMenuOpen) {
      if (!$(e.target).closest('#header-nav').length) {
        $mobileMenu.fadeOut(150, () => {
          $mobileMenu.addClass('hidden');
        });
        $menuIcon.removeClass('fa-xmark').addClass('fa-bars');
        isMobileMenuOpen = false;
      }
    }
  });

  // ==========================================
  // SIDE-SCROLLABLE AUTO-SCROLL WITH INFINITE WRAP & SNAP
  // ==========================================
  const $testimonialContainer = $('#testimonial-scroll-container');
  const testimonialContainer = $testimonialContainer[0];
  const $testiPrev = $('#testimonial-scroll-prev');
  const $testiNext = $('#testimonial-scroll-next');
  const $dotsContainer = $('#testimonial-dots-container');

  if (testimonialContainer) {
    // Clone original cards to create seamless infinite loop buffer
    const $originalCards = $testimonialContainer.children('.testimoni-card');
    const originalCount = $originalCards.length;

    $originalCards.each(function () {
      $testimonialContainer.append($(this).clone(true));
    });

    let isUserInteracting = false;
    let isDragging = false;
    let resumeTimeout = null;
    let autoScrollRaf = null;
    const autoScrollSpeed = 0.65; // pixels per frame for elegant reading speed

    function getCardSnapDistance() {
      const allCards = testimonialContainer.querySelectorAll('.testimoni-card');
      if (allCards.length < 2) return 320;
      const first = allCards[0].getBoundingClientRect();
      const second = allCards[1].getBoundingClientRect();
      return Math.round(second.left - first.left) || 320;
    }

    function getHalfWidth() {
      return testimonialContainer.scrollWidth / 2;
    }

    // Wrap scroll position seamlessly at both ends
    function checkInfiniteWrap() {
      const halfWidth = getHalfWidth();
      if (halfWidth <= 0) return;
      if (testimonialContainer.scrollLeft >= halfWidth) {
        testimonialContainer.scrollLeft -= halfWidth;
      } else if (testimonialContainer.scrollLeft <= 0) {
        testimonialContainer.scrollLeft += halfWidth;
      }
    }

    // Generate pagination dots for the original items
    if ($dotsContainer.length > 0 && originalCount > 0) {
      $dotsContainer.empty();
      for (let i = 0; i < originalCount; i++) {
        const $dot = $(`
          <button
            type="button"
            class="testi-dot transition-all duration-300 rounded-full h-2 ${i === 0 ? 'w-6 bg-neutral-900' : 'w-2 bg-neutral-300 hover:bg-neutral-400'} cursor-pointer focus:outline-hidden"
            data-index="${i}"
            aria-label="Testimoni ${i + 1}"
          ></button>
        `);
        $dotsContainer.append($dot);
      }

      $dotsContainer.on('click', '.testi-dot', function () {
        const targetIdx = parseInt($(this).data('index'), 10);
        isUserInteracting = true;
        scrollToDotIndex(targetIdx);
        scheduleResumeAutoScroll(3500);
      });
    }

    function updateDots(activeIdx) {
      if (!$dotsContainer.length) return;
      const normalizedIdx = ((activeIdx % originalCount) + originalCount) % originalCount;
      $dotsContainer.find('.testi-dot').each(function (i) {
        if (i === normalizedIdx) {
          $(this).removeClass('w-2 bg-neutral-300 bg-neutral-400').addClass('w-6 bg-neutral-900');
        } else {
          $(this).removeClass('w-6 bg-neutral-900').addClass('w-2 bg-neutral-300');
        }
      });
    }

    function scrollToDotIndex(targetIdx) {
      const snapDist = getCardSnapDistance();
      const halfWidth = getHalfWidth();
      checkInfiniteWrap();

      const currentIdx = Math.round(testimonialContainer.scrollLeft / snapDist);
      const currentNormalized = ((currentIdx % originalCount) + originalCount) % originalCount;
      let diff = targetIdx - currentNormalized;

      // Find shortest path in loop
      if (diff > originalCount / 2) diff -= originalCount;
      if (diff < -originalCount / 2) diff += originalCount;

      const targetScroll = testimonialContainer.scrollLeft + diff * snapDist;
      testimonialContainer.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
      updateDots(targetIdx);
    }

    function scheduleResumeAutoScroll(delay = 3000) {
      if (resumeTimeout) clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        if (!isDragging) {
          isUserInteracting = false;
        }
      }, delay);
    }

    // Continuous Animation Frame Auto-Scroll Loop
    function runAutoScroll() {
      if (!isUserInteracting && !isDragging && document.visibilityState === 'visible') {
        testimonialContainer.scrollLeft += autoScrollSpeed;
        checkInfiniteWrap();

        const snapDist = getCardSnapDistance();
        if (snapDist > 0) {
          const rawIdx = Math.round(testimonialContainer.scrollLeft / snapDist);
          updateDots(rawIdx);
        }
      }
      autoScrollRaf = requestAnimationFrame(runAutoScroll);
    }

    // Start continuous auto-scroll loop
    autoScrollRaf = requestAnimationFrame(runAutoScroll);

    // Hover pauses auto-scroll and allows inspection
    $testimonialContainer.on('mouseenter', () => {
      isUserInteracting = true;
      if (resumeTimeout) clearTimeout(resumeTimeout);
    });

    $testimonialContainer.on('mouseleave', () => {
      if (!isDragging) {
        scheduleResumeAutoScroll(1500);
      }
    });

    // Handle manual scroll/wheel
    testimonialContainer.addEventListener('scroll', () => {
      if (isUserInteracting) {
        checkInfiniteWrap();
        const snapDist = getCardSnapDistance();
        if (snapDist > 0) {
          const rawIdx = Math.round(testimonialContainer.scrollLeft / snapDist);
          updateDots(rawIdx);
        }
      }
    }, { passive: true });

    testimonialContainer.addEventListener('wheel', () => {
      isUserInteracting = true;
      scheduleResumeAutoScroll(3500);
    }, { passive: true });

    // Arrow Controls with seamless wrap navigation
    $testiPrev.on('click', () => {
      isUserInteracting = true;
      checkInfiniteWrap();
      const snapDist = getCardSnapDistance();
      testimonialContainer.scrollBy({ left: -snapDist, behavior: 'smooth' });
      scheduleResumeAutoScroll(3500);
    });

    $testiNext.on('click', () => {
      isUserInteracting = true;
      checkInfiniteWrap();
      const snapDist = getCardSnapDistance();
      testimonialContainer.scrollBy({ left: snapDist, behavior: 'smooth' });
      scheduleResumeAutoScroll(3500);
    });

    // Keyboard accessibility navigation
    testimonialContainer.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        $testiNext.trigger('click');
      } else if (e.key === 'ArrowLeft') {
        $testiPrev.trigger('click');
      }
    });

    // Drag-to-scroll & Touch Support with seamless loop & snap
    let startX = 0;
    let initialScrollLeft = 0;
    let dragStartTime = 0;

    const startDrag = (pageX) => {
      isDragging = true;
      isUserInteracting = true;
      startX = pageX;
      initialScrollLeft = testimonialContainer.scrollLeft;
      dragStartTime = Date.now();
      if (resumeTimeout) clearTimeout(resumeTimeout);
      testimonialContainer.style.scrollBehavior = 'auto';
      testimonialContainer.classList.add('cursor-grabbing');
    };

    const moveDrag = (pageX) => {
      if (!isDragging) return;
      const diff = pageX - startX;
      testimonialContainer.scrollLeft = initialScrollLeft - diff;
      checkInfiniteWrap();
    };

    const endDrag = (pageX) => {
      if (!isDragging) return;
      isDragging = false;
      testimonialContainer.classList.remove('cursor-grabbing');
      testimonialContainer.style.scrollBehavior = 'smooth';

      const diff = (pageX || startX) - startX;
      const duration = Date.now() - dragStartTime;
      const snapDist = getCardSnapDistance();

      let targetPos = testimonialContainer.scrollLeft;
      // If quick flick with momentum
      if (duration < 250 && Math.abs(diff) > 30) {
        if (diff < 0) {
          targetPos += snapDist * 0.8;
        } else {
          targetPos -= snapDist * 0.8;
        }
      }

      const nearestCardIdx = Math.round(targetPos / snapDist);
      testimonialContainer.scrollTo({
        left: nearestCardIdx * snapDist,
        behavior: 'smooth'
      });

      scheduleResumeAutoScroll(3000);
    };

    // Mouse drag events
    $testimonialContainer.on('mousedown', (e) => {
      startDrag(e.pageX);
    });

    $(window).on('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        moveDrag(e.pageX);
      }
    });

    $(window).on('mouseup', (e) => {
      if (isDragging) {
        endDrag(e.pageX);
      }
    });

    // Touch events for mobile/tablet
    testimonialContainer.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        startDrag(e.touches[0].pageX);
      }
    }, { passive: true });

    testimonialContainer.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches && e.touches.length > 0) {
        moveDrag(e.touches[0].pageX);
      }
    }, { passive: true });

    testimonialContainer.addEventListener('touchend', (e) => {
      const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].pageX : startX;
      endDrag(endX);
    }, { passive: true });
  }
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

