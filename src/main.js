import './index.css';

// Prevent browser from restoring scroll position or jumping to previous anchors on reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
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

  // GSAP subtle entrance animations
  if (typeof gsap !== 'undefined') {
    gsap.from('#brand-logo', {
      opacity: 0,
      y: -15,
      duration: 0.6,
      ease: 'power2.out',
    });
    gsap.from('#desktop-menu', {
      opacity: 0,
      scale: 0.95,
      duration: 0.7,
      delay: 0.1,
      ease: 'power2.out',
    });
    gsap.from('#desktop-auth-actions', {
      opacity: 0,
      y: -15,
      duration: 0.6,
      delay: 0.15,
      ease: 'power2.out',
    });
    gsap.from('#hero-title', {
      opacity: 0,
      y: 25,
      duration: 0.8,
      delay: 0.25,
      ease: 'power3.out',
    });
    gsap.from('#hero-subtitle', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.45,
      ease: 'power3.out',
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

  // Navigation tab selection (desktop & mobile)
  function setActiveNavTab(tabName) {
    // Desktop tabs
    $('.nav-tab-btn').each(function () {
      const $btn = $(this);
      if ($btn.data('tab') === tabName) {
        $btn
          .removeClass('text-gray-400 hover:text-gray-800')
          .addClass('bg-[#2b2b2b] text-white shadow-xs');
      } else {
        $btn
          .removeClass('bg-[#2b2b2b] text-white shadow-xs')
          .addClass('text-gray-400 hover:text-gray-800');
      }
    });

    // Mobile tabs
    $('.mobile-nav-tab-btn').each(function () {
      const $btn = $(this);
      if ($btn.data('tab') === tabName) {
        $btn
          .removeClass('text-gray-600 hover:bg-gray-50 hover:text-gray-900')
          .addClass('bg-neutral-900 text-white');
      } else {
        $btn
          .removeClass('bg-neutral-900 text-white')
          .addClass('text-gray-600 hover:bg-gray-50 hover:text-gray-900');
      }
    });

    // Handle modals for interactive tabs
    if (tabName === 'Booking') {
      openInfoModal('booking');
    } else if (tabName === 'Tentang') {
      openInfoModal('tentang');
    } else if (tabName === 'Credits') {
      openInfoModal('credits');
    }
  }

  $('.nav-tab-btn, .mobile-nav-tab-btn').on('click', function () {
    const tabName = $(this).data('tab');
    setActiveNavTab(tabName);
    if (isMobileMenuOpen) {
      $mobileMenu.fadeOut(150, () => {
        $mobileMenu.addClass('hidden');
      });
      $menuIcon.removeClass('fa-xmark').addClass('fa-bars');
      isMobileMenuOpen = false;
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
});
