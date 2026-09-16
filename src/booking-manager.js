// Travect Booking & Itinerary Studio Manager
import { PACKAGES, DEFAULT_CHECKLIST } from './booking-data.js';

class BookingManager {
  constructor() {
    this.packages = PACKAGES;
    this.selectedPackageId = null;
    this.departureDate = '';
    this.guestsCount = 2;
    this.currentDayIndex = 0;
    
    // Itinerary starts empty by default
    this.itinerary = [];
    
    // Budget extra expenses state
    this.budgetState = {
      customExpenses: []
    };
    
    // Checklist state starts empty by default
    this.checklist = [];
    
    // Countdown timer interval ID
    this.countdownInterval = null;
    
    // Modal state
    this.editingActivityId = null;
  }

  init() {
    this.renderPackages();
    this.initDateAndGuestsInputs();
    this.renderItineraryTabs();
    this.renderItineraryTimeline();
    this.renderRecommendations();
    this.renderBudgetCalculator();
    this.renderChecklist();
    this.updateProgressIndicator();
    this.startCountdown();
    this.bindEvents();
  }

  getSelectedPackage() {
    if (!this.selectedPackageId) return null;
    return this.packages.find(p => p.id === this.selectedPackageId) || null;
  }

  formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatDateIndo(dateStr) {
    if (!dateStr) return 'Tanggal belum ditentukan';
    const date = new Date(dateStr + 'T00:00:00');
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  // 1. Pilih Paket & Ringkasan
  renderPackages() {
    const $container = $('#booking-package-list');
    if (!$container.length) return;

    $container.empty();

    this.packages.forEach(pkg => {
      const isSelected = pkg.id === this.selectedPackageId;
      const cardHtml = `
        <div 
          class="package-card relative p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
            isSelected
              ? 'bg-neutral-900 text-white border-neutral-900 shadow-xl scale-[1.01]'
              : 'bg-white text-neutral-900 border-neutral-200/80 hover:border-neutral-400 hover:shadow-md'
          }"
          data-package-id="${pkg.id}"
        >
          <div class="flex items-center justify-between gap-3 mb-3">
            <span class="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
              isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-700'
            }">
              ${pkg.tag}
            </span>
          </div>

          <h3 class="font-heading text-lg sm:text-xl font-bold leading-snug mb-1.5 ${isSelected ? 'text-white' : 'text-neutral-900'}">
            ${pkg.title}
          </h3>

          <p class="text-xs leading-relaxed mb-4 line-clamp-2 ${isSelected ? 'text-neutral-300' : 'text-neutral-600'}">
            ${pkg.description}
          </p>

          <div class="pt-3 border-t ${isSelected ? 'border-neutral-800' : 'border-neutral-100'} flex items-center justify-between">
            <div>
              <span class="text-[10px] uppercase font-bold tracking-wider ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}">
                Harga Paket
              </span>
              <div class="text-base sm:text-lg font-bold ${isSelected ? 'text-white' : 'text-neutral-900'}">
                ${this.formatRupiah(pkg.pricePerPax)} <span class="text-xs font-normal opacity-80">/pax</span>
              </div>
            </div>

            <div class="w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
              isSelected
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'bg-neutral-100 text-neutral-400 group-hover:text-neutral-900'
            }">
              <i class="fa-solid ${isSelected ? 'fa-check' : 'fa-arrow-right'} text-xs"></i>
            </div>
          </div>
        </div>
      `;
      $container.append(cardHtml);
    });

    this.renderPackageSummary();
  }

  renderPackageSummary() {
    const pkg = this.getSelectedPackage();
    if (!pkg) {
      $('#summary-package-title').text('Belum dipilih');
      $('#summary-package-dest').text('-');
      $('#summary-package-duration').text('-');
      $('#summary-package-rate').text('Rp 0 / orang');
      this.updateEstimatedDates();
      return;
    }

    $('#summary-package-title').text(pkg.title);
    $('#summary-package-dest').text(pkg.destination);
    $('#summary-package-duration').text(`${pkg.durationDays} Hari ${pkg.durationNights} Malam`);
    $('#summary-package-rate').text(`${this.formatRupiah(pkg.pricePerPax)} / orang`);
    
    // Inclusions list
    const $inclusions = $('#booking-package-inclusions');
    if ($inclusions.length) {
      $inclusions.empty();
      pkg.inclusions.forEach(item => {
        $inclusions.append(`
          <li class="flex items-start gap-2 text-xs text-neutral-600">
            <i class="fa-solid fa-circle-check text-neutral-900 mt-0.5 text-[11px] shrink-0"></i>
            <span>${item}</span>
          </li>
        `);
      });
    }

    // Update estimated end date
    this.updateEstimatedDates();
  }

  selectPackage(packageId, preserveCustomItinerary = false) {
    if (this.selectedPackageId === packageId) {
      // Batalkan pilihan paket jika diklik kembali
      this.selectedPackageId = null;
      this.renderPackages();
      this.renderItineraryTabs();
      this.renderItineraryTimeline();
      this.renderRecommendations();
      this.renderBudgetCalculator();
      this.updateProgressIndicator();
      this.startCountdown();
      return;
    }

    this.selectedPackageId = packageId;

    this.renderPackages();
    this.renderItineraryTabs();
    this.renderItineraryTimeline();
    this.renderRecommendations();
    this.renderBudgetCalculator();
    this.updateProgressIndicator();
    this.startCountdown();
  }

  initDateAndGuestsInputs() {
    const $dateInput = $('#booking-departure-date');
    if ($dateInput.length) {
      $dateInput.val(this.departureDate || '');
      // Min date is tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      $dateInput.attr('min', tomorrow.toISOString().split('T')[0]);
    }

    this.updateGuestsDisplay();
    this.updateEstimatedDates();
  }

  updateGuestsDisplay() {
    $('#booking-guests-count').text(this.guestsCount);
    $('#summary-guests-count').text(`${this.guestsCount} Orang`);
  }

  updateEstimatedDates() {
    const pkg = this.getSelectedPackage();
    if (!this.departureDate) {
      $('#summary-departure-date').text('Belum ditentukan');
      $('#summary-return-date').text('-');
      return;
    }

    if (!pkg) {
      $('#summary-departure-date').text(this.formatDateIndo(this.departureDate));
      $('#summary-return-date').text('-');
      return;
    }

    const startDate = new Date(this.departureDate + 'T00:00:00');
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (pkg.durationDays - 1));

    $('#summary-departure-date').text(this.formatDateIndo(this.departureDate));
    $('#summary-return-date').text(this.formatDateIndo(endDate.toISOString().split('T')[0]));
  }

  // 2. Itinerary Builder
  renderItineraryTabs() {
    const $container = $('#itinerary-days-tabs');
    if (!$container.length) return;

    $container.empty();

    if (this.itinerary.length === 0) {
      $container.append(`
        <span class="text-xs text-neutral-400 italic py-1.5 px-2">Pilih paket di atas atau klik tambah hari</span>
      `);
    } else {
      this.itinerary.forEach((dayData, idx) => {
        const isActive = idx === this.currentDayIndex;
        const count = dayData.items ? dayData.items.length : 0;
        $container.append(`
          <button
            type="button"
            data-day-index="${idx}"
            class="itinerary-tab-btn px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              isActive
                ? 'bg-neutral-900 text-white shadow-sm font-semibold'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900'
            }"
          >
            <span>Hari ${dayData.day || idx + 1}</span>
            <span class="px-1.5 py-0.5 rounded-full text-[10px] ${
              isActive ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-600'
            }">
              ${count}
            </span>
          </button>
        `);
      });
    }

    // Add Day Button
    $container.append(`
      <button
        type="button"
        id="btn-add-itinerary-day"
        class="px-3.5 py-2.5 rounded-xl border border-dashed border-neutral-300 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
        title="Tambah Hari Baru"
      >
        <i class="fa-solid fa-plus text-[11px]"></i>
        <span>Tambah Hari</span>
      </button>
    `);
  }

  renderItineraryTimeline() {
    const dayData = this.itinerary[this.currentDayIndex];
    const $timeline = $('#itinerary-timeline-list');
    if (!$timeline.length) return;

    $timeline.empty();

    if (!dayData) {
      $('#active-day-title-display').text('Belum ada jadwal');
      $('#btn-delete-current-day').addClass('hidden');
      $timeline.append(`
        <div class="p-8 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 text-neutral-500">
          <i class="fa-solid fa-calendar-plus text-2xl text-neutral-400 mb-2"></i>
          <p class="text-xs sm:text-sm font-medium text-neutral-700">Rencana Perjalanan Masih Kosong</p>
          <p class="text-xs text-neutral-500 mt-1 max-w-md mx-auto">Klik "+ Tambah Hari" untuk mulai menyusun agenda harian secara manual, atau pilih langsung dari aktivitas kurator di bawah.</p>
        </div>
      `);
      return;
    }

    // Header info for active day
    $('#active-day-title-display').text(dayData.title || `Hari ${dayData.day || this.currentDayIndex + 1}`);
    $('#active-day-notes-input').val(dayData.notes || '');

    // Show or hide "Hapus Hari Ini" button
    if (this.itinerary.length >= 1) {
      $('#btn-delete-current-day').removeClass('hidden');
    } else {
      $('#btn-delete-current-day').addClass('hidden');
    }

    if (!dayData.items || dayData.items.length === 0) {
      $timeline.append(`
        <div class="p-8 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 text-neutral-500">
          <i class="fa-solid fa-map-location-dot text-2xl text-neutral-400 mb-2"></i>
          <p class="text-xs sm:text-sm font-medium text-neutral-700">Belum ada agenda di hari ini</p>
          <p class="text-xs text-neutral-500 mt-0.5">Tambahkan item manual di bawah atau pilih dari rekomendasi terdekat.</p>
        </div>
      `);
      return;
    }

    dayData.items.forEach((item, itemIdx) => {
      $timeline.append(`
        <div class="relative pl-7 pb-6 group last:pb-2">
          <!-- Timeline line & node -->
          <div class="absolute left-2.5 top-2 bottom-0 w-[2px] bg-neutral-200 group-last:hidden"></div>
          <div class="absolute left-1 top-2 w-3.5 h-3.5 rounded-full border-2 border-white bg-neutral-900 shadow-xs"></div>

          <!-- Item card -->
          <div class="bg-neutral-50 hover:bg-neutral-100/90 border border-neutral-200/70 p-4 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-neutral-200/80 text-neutral-800 rounded-md">
                  <i class="fa-regular fa-clock text-[10px]"></i> ${item.time || '--:--'}
                </span>
                <span class="text-[11px] text-neutral-400 font-medium">Aktivitas #${itemIdx + 1}</span>
              </div>

              <h4 class="font-heading text-sm sm:text-base font-bold text-neutral-900 leading-snug">
                ${item.activity}
              </h4>

              ${
                item.notes
                  ? `<p class="text-xs text-neutral-600 mt-1 leading-relaxed"><i class="fa-regular fa-note-sticky mr-1 text-neutral-400"></i>${item.notes}</p>`
                  : ''
              }
            </div>

            <!-- Action buttons -->
            <div class="flex items-center gap-1.5 self-end sm:self-start shrink-0">
              <button
                type="button"
                data-action="edit-activity"
                data-item-id="${item.id}"
                class="w-7 h-7 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-900 hover:text-white text-neutral-600 flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Ubah Aktivitas"
              >
                <i class="fa-solid fa-pen text-[10px]"></i>
              </button>
              <button
                type="button"
                data-action="delete-activity"
                data-item-id="${item.id}"
                class="w-7 h-7 rounded-lg bg-white border border-neutral-200 hover:bg-red-600 hover:text-white text-neutral-600 flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Hapus Aktivitas"
              >
                <i class="fa-regular fa-trash-can text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>
      `);
    });
  }

  renderRecommendations() {
    const pkg = this.getSelectedPackage();
    const $container = $('#recommended-activities-list');
    if (!$container.length) return;

    $container.empty();

    if (!pkg) {
      $container.append(`
        <div class="col-span-full p-6 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 text-neutral-500">
          <p class="text-xs font-medium text-neutral-700">Pilih paket di Langkah 1</p>
          <p class="text-[11px] text-neutral-400 mt-0.5">Rekomendasi aktivitas kurator akan otomatis tampil sesuai paket yang Anda pilih.</p>
        </div>
      `);
      return;
    }

    if (!pkg.recommendedActivities || pkg.recommendedActivities.length === 0) {
      $container.append('<p class="text-xs text-neutral-500">Tidak ada rekomendasi ekstra untuk paket ini.</p>');
      return;
    }

    pkg.recommendedActivities.forEach(rec => {
      const costText = rec.cost > 0 ? this.formatRupiah(rec.cost) : 'Termasuk / Gratis';
      const dayText = this.itinerary.length > 0 
        ? (this.itinerary[this.currentDayIndex]?.day || (this.currentDayIndex + 1))
        : 1;
      $container.append(`
        <div class="p-3.5 sm:p-4 rounded-2xl bg-white border border-neutral-200/80 hover:border-neutral-300 hover:shadow-xs transition-all flex flex-col justify-between group">
          <div>
            <div class="flex items-center justify-between gap-2 mb-1.5">
              <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-md">
                ${rec.category}
              </span>
              <span class="text-[11px] font-semibold text-neutral-500">
                ${costText}
              </span>
            </div>
            <h5 class="font-heading text-xs sm:text-sm font-bold text-neutral-900 mb-1">
              ${rec.title}
            </h5>
            <p class="text-[11px] text-neutral-500 leading-relaxed line-clamp-2 mb-3">
              ${rec.notes}
            </p>
          </div>

          <button
            type="button"
            data-action="add-recommendation"
            data-rec-id="${rec.id}"
            class="w-full py-2 bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <i class="fa-solid fa-plus text-[10px]"></i>
            <span>Tambah ke Hari ${dayText}</span>
          </button>
        </div>
      `);
    });
  }

  // Itinerary Actions
  addNewDay() {
    const nextDayNum = this.itinerary.length + 1;
    this.itinerary.push({
      day: nextDayNum,
      title: `Hari ${nextDayNum}: Eksplorasi Mandiri`,
      notes: '',
      items: []
    });

    this.currentDayIndex = this.itinerary.length - 1;
    this.renderItineraryTabs();
    this.renderItineraryTimeline();
    this.renderRecommendations();
    this.updateProgressIndicator();
  }

  deleteCurrentDay() {
    if (this.itinerary.length === 0) return;

    const removedDayNum = this.itinerary[this.currentDayIndex]?.day || (this.currentDayIndex + 1);

    if (this.itinerary.length <= 1) {
      this.itinerary = [];
      this.currentDayIndex = 0;
      this.renderItineraryTabs();
      this.renderItineraryTimeline();
      this.renderRecommendations();
      this.updateProgressIndicator();
      this.showSaveNotification(`Hari ${removedDayNum} berhasil dihapus`);
      return;
    }

    this.itinerary.splice(this.currentDayIndex, 1);
    
    // Re-index days
    this.itinerary.forEach((d, idx) => {
      d.day = idx + 1;
      if (d.title && d.title.startsWith('Hari ') && d.title.indexOf(':') !== -1) {
        d.title = `Hari ${idx + 1}` + d.title.substring(d.title.indexOf(':'));
      } else {
        d.title = `Hari ${idx + 1}: Eksplorasi Mandiri`;
      }
    });

    if (this.currentDayIndex >= this.itinerary.length) {
      this.currentDayIndex = Math.max(0, this.itinerary.length - 1);
    }

    this.renderItineraryTabs();
    this.renderItineraryTimeline();
    this.renderRecommendations();
    this.updateProgressIndicator();
    this.showSaveNotification(`Hari ${removedDayNum} berhasil dihapus`);
  }

  saveActiveDayNotes(notesText) {
    const dayData = this.itinerary[this.currentDayIndex];
    if (dayData) {
      dayData.notes = notesText;
      this.showSaveNotification('Catatan hari ini berhasil disimpan');
      this.updateProgressIndicator();
    }
  }

  addActivityItem(time, activity, notes) {
    if (!activity.trim()) return;

    if (this.itinerary.length === 0) {
      this.itinerary.push({
        day: 1,
        title: 'Hari 1: Eksplorasi Mandiri',
        notes: '',
        items: []
      });
      this.currentDayIndex = 0;
    }

    const dayData = this.itinerary[this.currentDayIndex];
    if (!dayData) return;

    if (!dayData.items) dayData.items = [];

    dayData.items.push({
      id: 'act-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      time: time ? time.trim() : '08:00',
      activity: activity.trim(),
      notes: notes ? notes.trim() : ''
    });

    // Sort items by time
    dayData.items.sort((a, b) => a.time.localeCompare(b.time));

    this.renderItineraryTabs();
    this.renderItineraryTimeline();
    this.updateProgressIndicator();
    this.showSaveNotification('Aktivitas ditambahkan ke Hari ' + (dayData.day || this.currentDayIndex + 1));
  }

  openEditActivityModal(itemId) {
    const dayData = this.itinerary[this.currentDayIndex];
    if (!dayData || !dayData.items) return;

    const item = dayData.items.find(i => i.id === itemId);
    if (!item) return;

    this.editingActivityId = itemId;
    $('#edit-act-time').val(item.time);
    $('#edit-act-name').val(item.activity);
    $('#edit-act-notes').val(item.notes || '');

    $('#edit-activity-modal').removeClass('hidden');
  }

  saveEditedActivity(time, activity, notes) {
    if (!this.editingActivityId) return;

    const dayData = this.itinerary[this.currentDayIndex];
    if (!dayData || !dayData.items) return;

    const item = dayData.items.find(i => i.id === this.editingActivityId);
    if (item) {
      item.time = time.trim() || '08:00';
      item.activity = activity.trim();
      item.notes = notes.trim();

      dayData.items.sort((a, b) => a.time.localeCompare(b.time));
    }

    this.editingActivityId = null;
    $('#edit-activity-modal').addClass('hidden');
    this.renderItineraryTimeline();
    this.updateProgressIndicator();
    this.showSaveNotification('Aktivitas berhasil diperbarui');
  }

  deleteActivityItem(itemId) {
    const dayData = this.itinerary[this.currentDayIndex];
    if (!dayData || !dayData.items) return;

    dayData.items = dayData.items.filter(i => i.id !== itemId);
    this.renderItineraryTabs();
    this.renderItineraryTimeline();
    this.updateProgressIndicator();
  }

  addRecommendationToActiveDay(recId) {
    const pkg = this.getSelectedPackage();
    const rec = pkg.recommendedActivities?.find(r => r.id === recId);
    if (!rec) return;

    this.addActivityItem(rec.time, rec.title, rec.notes);
  }

  // 3. Budget Calculator
  renderBudgetCalculator() {
    const pkg = this.getSelectedPackage();
    const guests = this.guestsCount;

    const packagePrice = pkg ? pkg.pricePerPax : 0;
    const packageSubtotal = packagePrice * guests;
    const customTotal = this.budgetState.customExpenses.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0);

    const grandTotal = packageSubtotal + customTotal;
    const perPersonEstimated = guests > 0 ? Math.round(grandTotal / guests) : 0;

    // Update UI labels and values
    $('#calc-pkg-rate').text(pkg ? this.formatRupiah(pkg.pricePerPax) : 'Rp 0');
    $('#calc-pkg-guests').text(`${guests} pax`);
    $('#calc-pkg-subtotal').text(this.formatRupiah(packageSubtotal));

    // Custom Expenses List
    const $customList = $('#calc-custom-expenses-list');
    if ($customList.length) {
      $customList.empty();
      if (this.budgetState.customExpenses.length === 0) {
        $customList.append(`
          <div class="p-3 text-center bg-neutral-50 rounded-xl border border-dashed border-neutral-200 text-neutral-400 text-[11px] italic">
            Belum ada pos pengeluaran mandiri tambahan
          </div>
        `);
      } else {
        this.budgetState.customExpenses.forEach(exp => {
          $customList.append(`
            <div class="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-neutral-200/70 text-xs min-w-0 max-w-full">
              <span class="font-medium text-neutral-800 truncate flex-1 min-w-0" title="${exp.name}">${exp.name}</span>
              <div class="flex items-center gap-2 shrink-0">
                <span class="font-semibold text-neutral-900 whitespace-nowrap">${this.formatRupiah(exp.amount)}</span>
                <button
                  type="button"
                  data-action="delete-custom-expense"
                  data-exp-id="${exp.id}"
                  class="text-neutral-400 hover:text-red-500 transition-colors p-1 cursor-pointer shrink-0"
                  title="Hapus Pengeluaran"
                >
                  <i class="fa-regular fa-trash-can text-[11px]"></i>
                </button>
              </div>
            </div>
          `);
        });
      }
    }

    // Totals
    $('.budget-grand-total-display').text(this.formatRupiah(grandTotal));
    $('#summary-total-per-pax').text(`${this.formatRupiah(perPersonEstimated)} / orang`);
  }

  updateBudget() {
    this.renderBudgetCalculator();
    this.renderPackageSummary();
  }

  addCustomExpense(name, amount) {
    if (!name.trim() || isNaN(amount) || amount <= 0) return;

    this.budgetState.customExpenses.push({
      id: 'exp-' + Date.now(),
      name: name.trim(),
      amount: Math.round(Number(amount))
    });

    this.renderBudgetCalculator();
    this.showSaveNotification('Biaya kustom berhasil ditambahkan');
  }

  deleteCustomExpense(expId) {
    this.budgetState.customExpenses = this.budgetState.customExpenses.filter(e => e.id !== expId);
    this.renderBudgetCalculator();
  }

  // 4. Trip Checklist
  renderChecklist() {
    const $container = $('#checklist-items-container');
    if (!$container.length) return;

    $container.empty();

    const completedCount = this.checklist.filter(c => c.checked).length;
    const totalCount = this.checklist.length;

    if (totalCount === 0) {
      $('#checklist-counter-badge').text('0 selesai');
      $('#summary-checklist-status').text('0 Item Siap');
      $container.append(`
        <div class="p-6 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 text-neutral-500">
          <i class="fa-solid fa-list-check text-2xl text-neutral-400 mb-2"></i>
          <p class="text-xs sm:text-sm font-medium text-neutral-700">Checklist Perlengkapan Masih Kosong</p>
          <p class="text-xs text-neutral-500 mt-1 max-w-md mx-auto">Tambahkan perlengkapan perjalanan Anda melalui formulir di atas sebelum menandainya.</p>
        </div>
      `);
      this.updateProgressIndicator();
      return;
    }

    $('#checklist-counter-badge').text(`${completedCount} dari ${totalCount} selesai`);
    $('#summary-checklist-status').text(`${completedCount} / ${totalCount} Item`);

    this.checklist.forEach(item => {
      $container.append(`
        <div class="flex items-center justify-between gap-3 p-3 bg-white hover:bg-neutral-50 rounded-xl border border-neutral-200/70 transition-colors group">
          <label class="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
            <input
              type="checkbox"
              data-checklist-id="${item.id}"
              class="checklist-checkbox w-4 h-4 rounded text-neutral-900 accent-neutral-900 border-neutral-300 focus:ring-neutral-900 cursor-pointer shrink-0"
              ${item.checked ? 'checked' : ''}
            />
            <span class="text-xs font-medium ${
              item.checked ? 'line-through text-neutral-400' : 'text-neutral-800'
            } truncate">
              ${item.text}
            </span>
          </label>

          <div class="flex items-center gap-2 shrink-0">
            <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded-md">
              ${item.category || 'Umum'}
            </span>
            <button
              type="button"
              data-action="delete-checklist-item"
              data-item-id="${item.id}"
              class="w-6 h-6 rounded flex items-center justify-center text-neutral-300 hover:text-red-600 transition-colors cursor-pointer"
              title="Hapus Item"
            >
              <i class="fa-regular fa-trash-can text-[11px]"></i>
            </button>
          </div>
        </div>
      `);
    });

    this.updateProgressIndicator();
  }

  toggleChecklistItem(itemId) {
    const item = this.checklist.find(c => c.id === itemId);
    if (item) {
      item.checked = !item.checked;
      this.renderChecklist();
    }
  }

  addChecklistItem(text, category = 'Pribadi') {
    if (!text.trim()) return;

    this.checklist.push({
      id: 'chk-' + Date.now(),
      text: text.trim(),
      category: category.trim() || 'Pribadi',
      checked: false
    });

    this.renderChecklist();
    this.showSaveNotification('Item perlengkapan ditambahkan');
  }

  deleteChecklistItem(itemId) {
    this.checklist = this.checklist.filter(c => c.id !== itemId);
    this.renderChecklist();
  }

  // 5. Countdown Trip
  startCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    const updateTimer = () => {
      if (!this.departureDate) {
        $('#countdown-status-text').text('Pilih tanggal keberangkatan');
        $('#countdown-days').text('--');
        $('#countdown-hours').text('--');
        $('#countdown-minutes').text('--');
        $('#countdown-seconds').text('--');
        return;
      }

      const target = new Date(this.departureDate + 'T08:00:00').getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        $('#countdown-status-text').text('🎉 Hari Keberangkatan Tiba! Selamat Menikmati Petualangan!');
        $('#countdown-days').text('00');
        $('#countdown-hours').text('00');
        $('#countdown-minutes').text('00');
        $('#countdown-seconds').text('00');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      $('#countdown-days').text(String(days).padStart(2, '0'));
      $('#countdown-hours').text(String(hours).padStart(2, '0'));
      $('#countdown-minutes').text(String(minutes).padStart(2, '0'));
      $('#countdown-seconds').text(String(seconds).padStart(2, '0'));
      const pkg = this.getSelectedPackage();
      const destName = pkg ? ` ke ${pkg.destination}` : '';
      $('#countdown-status-text').text(`Menuju keberangkatan${destName}`);
    };

    updateTimer();
    this.countdownInterval = setInterval(updateTimer, 1000);
  }

  // 6. Stepper Progress Indicator (Reflects Reference Style)
  updateProgressIndicator() {
    let currentStep = 1;

    const hasPackage = Boolean(this.selectedPackageId);
    const hasActivities = this.itinerary.length > 0 && this.itinerary.some(d => d.items && d.items.length > 0);

    if (hasPackage && hasActivities) {
      currentStep = 3;
    } else if (hasPackage) {
      currentStep = 2;
    } else {
      currentStep = 1;
    }

    // Step 1 Node (Pilih Paket)
    const $node1 = $('#step-node-1');
    const $label1 = $('#step-label-1');
    if (currentStep > 1) {
      // Completed
      $node1.attr('class', 'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-heading font-bold text-xs sm:text-sm transition-all duration-300 bg-neutral-900 text-white shadow-xs');
      $label1.attr('class', 'text-[11px] sm:text-xs font-semibold mt-2.5 text-neutral-900 tracking-tight transition-colors whitespace-nowrap');
    } else {
      // Active
      $node1.attr('class', 'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-heading font-bold text-xs sm:text-sm transition-all duration-300 bg-neutral-900 text-white shadow-xs');
      $label1.attr('class', 'text-[11px] sm:text-xs font-semibold mt-2.5 text-neutral-900 tracking-tight transition-colors whitespace-nowrap');
    }

    // Step 2 Node (Rancang Jadwal)
    const $node2 = $('#step-node-2');
    const $label2 = $('#step-label-2');
    if (currentStep > 2) {
      // Completed
      $node2.attr('class', 'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-heading font-bold text-xs sm:text-sm transition-all duration-300 bg-neutral-900 text-white shadow-xs');
      $label2.attr('class', 'text-[11px] sm:text-xs font-semibold mt-2.5 text-neutral-900 tracking-tight transition-colors whitespace-nowrap');
    } else if (currentStep === 2) {
      // Active
      $node2.attr('class', 'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-heading font-bold text-xs sm:text-sm transition-all duration-300 bg-white border-2 border-neutral-900 text-neutral-900 shadow-xs');
      $label2.attr('class', 'text-[11px] sm:text-xs font-semibold mt-2.5 text-neutral-900 tracking-tight transition-colors whitespace-nowrap');
    } else {
      // Pending
      $node2.attr('class', 'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-heading font-bold text-xs sm:text-sm transition-all duration-300 bg-white border-2 border-neutral-300 text-neutral-400');
      $label2.attr('class', 'text-[11px] sm:text-xs font-medium mt-2.5 text-neutral-400 tracking-tight transition-colors whitespace-nowrap');
    }

    // Step 3 Node (Konfirmasi)
    const $node3 = $('#step-node-3');
    const $label3 = $('#step-label-3');
    if (currentStep === 3) {
      // Active / Ready
      $node3.attr('class', 'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-heading font-bold text-xs sm:text-sm transition-all duration-300 bg-white border-2 border-neutral-900 text-neutral-900 shadow-xs');
      $label3.attr('class', 'text-[11px] sm:text-xs font-semibold mt-2.5 text-neutral-900 tracking-tight transition-colors whitespace-nowrap');
    } else {
      // Pending
      $node3.attr('class', 'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-heading font-bold text-xs sm:text-sm transition-all duration-300 bg-white border-2 border-neutral-300 text-neutral-400');
      $label3.attr('class', 'text-[11px] sm:text-xs font-medium mt-2.5 text-neutral-400 tracking-tight transition-colors whitespace-nowrap');
    }

    // Connecting line progress fill
    let fillPercent = '0%';
    if (currentStep === 2) fillPercent = '50%';
    if (currentStep === 3) fillPercent = '100%';
    $('#stepper-progress-fill').css('width', fillPercent);
  }

  // 7. Ringkasan & Konfirmasi
  openConfirmationModal() {
    const pkg = this.getSelectedPackage();
    if (!pkg) {
      this.showSaveNotification('Silakan pilih salah satu paket perjalanan di Langkah 1');
      return;
    }

    const guests = this.guestsCount;
    const dateFormatted = this.departureDate ? this.formatDateIndo(this.departureDate) : 'Belum ditentukan';

    // Generate random alphanumeric booking ID: TRV-2026-XXXX
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingCode = `TRV-2026-${randomCode}`;

    // Get current grand total
    const grandTotal = $('.budget-grand-total-display').first().text();

    $('#conf-booking-code').text(bookingCode);
    $('#conf-package-name').text(pkg.title);
    $('#conf-destination').text(pkg.destination);
    $('#conf-date').text(dateFormatted);
    $('#conf-guests').text(`${guests} Orang`);
    $('#conf-total-price').text(grandTotal);

    // Fill summary details
    const totalActivities = this.itinerary.reduce((sum, d) => sum + (d.items ? d.items.length : 0), 0);
    $('#conf-itinerary-stats').text(`${this.itinerary.length} Hari (${totalActivities} Aktivitas)`);
    
    const checklistChecked = this.checklist.filter(c => c.checked).length;
    $('#conf-checklist-stats').text(`${checklistChecked} dari ${this.checklist.length} siap`);

    $('#booking-confirmation-modal').removeClass('hidden');
  }

  exportPlanAsText() {
    const pkg = this.getSelectedPackage();
    const guests = this.guestsCount;
    const totalCost = $('.budget-grand-total-display').first().text();

    let text = `======================================\n`;
    text += `  TRAVECT TRAVEL PLAN & ITINERARY     \n`;
    text += `======================================\n\n`;
    text += `Paket: ${pkg ? pkg.title : 'Kustom / Belum Dipilih'}\n`;
    text += `Destinasi: ${pkg ? pkg.destination : '-'}\n`;
    text += `Tanggal Berangkat: ${this.departureDate ? this.formatDateIndo(this.departureDate) : 'Belum ditentukan'}\n`;
    text += `Jumlah Peserta: ${guests} Orang\n`;
    text += `Total Estimasi Anggaran: ${totalCost}\n\n`;
    text += `--- RENCANA PERJALANAN (ITINERARY) ---\n`;

    this.itinerary.forEach(d => {
      text += `\n[${d.title || 'Hari ' + d.day}]\n`;
      if (d.notes) text += `Catatan: ${d.notes}\n`;
      if (d.items && d.items.length) {
        d.items.forEach(i => {
          text += `  • ${i.time} - ${i.activity}${i.notes ? ` (${i.notes})` : ''}\n`;
        });
      } else {
        text += `  • Belum ada aktivitas terdaftar.\n`;
      }
    });

    text += `\n--- TRIP CHECKLIST PERLENGKAPAN ---\n`;
    this.checklist.forEach(c => {
      text += `  [${c.checked ? 'X' : ' '}] ${c.text} (${c.category})\n`;
    });

    text += `\nLayanan Bantuan Travect: example@travect.com\n`;

    return text;
  }

  copyPlanToClipboard() {
    const summaryText = this.exportPlanAsText();
    navigator.clipboard.writeText(summaryText).then(() => {
      this.showSaveNotification('Ringkasan rencana perjalanan disalin ke clipboard!');
    }).catch(() => {
      this.showSaveNotification('Gagal menyalin. Silakan coba lagi.');
    });
  }

  showSaveNotification(msg) {
    const $toast = $('#booking-save-toast');
    if (!$toast.length) return;

    $toast.find('#booking-toast-message').text(msg);
    $toast.removeClass('opacity-0 translate-y-4 pointer-events-none').addClass('opacity-100 translate-y-0');

    setTimeout(() => {
      $toast.removeClass('opacity-100 translate-y-0').addClass('opacity-0 translate-y-4 pointer-events-none');
    }, 2800);
  }

  // Bind UI Events
  bindEvents() {
    const self = this;

    // Package card selection
    $(document).on('click', '.package-card', function () {
      const packageId = $(this).data('package-id');
      self.selectPackage(packageId);
    });

    // Date change
    $(document).on('change', '#booking-departure-date', function () {
      self.departureDate = $(this).val();
      self.updateEstimatedDates();
      self.startCountdown();
      self.updateProgressIndicator();
    });

    // Guests +/-
    $(document).on('click', '#btn-guests-minus', function () {
      if (self.guestsCount > 1) {
        self.guestsCount--;
        self.updateGuestsDisplay();
        self.renderBudgetCalculator();
      }
    });

    $(document).on('click', '#btn-guests-plus', function () {
      if (self.guestsCount < 20) {
        self.guestsCount++;
        self.updateGuestsDisplay();
        self.renderBudgetCalculator();
      }
    });

    // Itinerary Day Tab Click
    $(document).on('click', '.itinerary-tab-btn', function () {
      const dayIdx = parseInt($(this).data('day-index'), 10);
      self.currentDayIndex = dayIdx;
      self.renderItineraryTabs();
      self.renderItineraryTimeline();
      self.renderRecommendations();
    });

    // Add Day Button
    $(document).on('click', '#btn-add-itinerary-day', function () {
      self.addNewDay();
    });

    // Delete Current Day Button
    $(document).on('click', '#btn-delete-current-day', function (e) {
      e.preventDefault();
      self.deleteCurrentDay();
    });

    // Save Day Notes
    $(document).on('click', '#btn-save-day-notes', function () {
      const notes = $('#active-day-notes-input').val();
      self.saveActiveDayNotes(notes);
    });

    // Add Activity Form Submit
    $(document).on('submit', '#form-add-activity', function (e) {
      e.preventDefault();
      const time = $('#input-act-time').val();
      const name = $('#input-act-name').val();
      const notes = $('#input-act-notes').val();

      if (!name) return;

      self.addActivityItem(time, name, notes);
      $('#input-act-name').val('');
      $('#input-act-notes').val('');
    });

    // Edit Activity Button Click
    $(document).on('click', '[data-action="edit-activity"]', function () {
      const itemId = $(this).data('item-id');
      self.openEditActivityModal(itemId);
    });

    // Submit Edit Activity
    $(document).on('submit', '#form-edit-activity', function (e) {
      e.preventDefault();
      const time = $('#edit-act-time').val();
      const name = $('#edit-act-name').val();
      const notes = $('#edit-act-notes').val();

      self.saveEditedActivity(time, name, notes);
    });

    // Close Edit Activity Modal
    $(document).on('click', '#btn-close-edit-act, #btn-cancel-edit-act', function () {
      $('#edit-activity-modal').addClass('hidden');
      self.editingActivityId = null;
    });

    // Delete Activity Button Click
    $(document).on('click', '[data-action="delete-activity"]', function () {
      const itemId = $(this).data('item-id');
      self.deleteActivityItem(itemId);
    });

    // Add Recommendation to Active Day Click
    $(document).on('click', '[data-action="add-recommendation"]', function () {
      const recId = $(this).data('rec-id');
      self.addRecommendationToActiveDay(recId);
    });

    // Custom Expense Form Submit
    $(document).on('submit', '#form-add-custom-expense', function (e) {
      e.preventDefault();
      const name = $('#input-exp-name').val();
      const amount = parseInt($('#input-exp-amount').val(), 10);

      self.addCustomExpense(name, amount);
      $('#input-exp-name').val('');
      $('#input-exp-amount').val('');
    });

    // Delete Custom Expense Click
    $(document).on('click', '[data-action="delete-custom-expense"]', function () {
      const expId = $(this).data('exp-id');
      self.deleteCustomExpense(expId);
    });

    // Checklist Checkbox Change
    $(document).on('change', '.checklist-checkbox', function () {
      const itemId = $(this).data('checklist-id');
      self.toggleChecklistItem(itemId);
    });

    // Add Checklist Item Form Submit
    $(document).on('submit', '#form-add-checklist-item', function (e) {
      e.preventDefault();
      const text = $('#input-chk-text').val();
      const cat = $('#input-chk-category').val();

      self.addChecklistItem(text, cat);
      $('#input-chk-text').val('');
    });

    // Delete Checklist Item Click
    $(document).on('click', '[data-action="delete-checklist-item"]', function () {
      const itemId = $(this).data('item-id');
      self.deleteChecklistItem(itemId);
    });

    // Stepper Node Click Navigation
    $(document).on('click', '[data-step-target]', function () {
      const target = $(this).data('step-target');
      const $el = $(target);
      if ($el.length) {
        $('html, body').animate({
          scrollTop: $el.offset().top - 90
        }, 350);
      }
    });

    // Confirmation Modal Open
    $(document).on('click', '#btn-confirm-booking, #summary-btn-confirm-booking', function () {
      self.openConfirmationModal();
    });

    // Confirmation Modal Close
    $(document).on('click', '#btn-close-confirmation-modal, #btn-dismiss-conf', function () {
      $('#booking-confirmation-modal').addClass('hidden');
    });

    // Print / Export View
    $(document).on('click', '#btn-print-plan, #conf-btn-print', function () {
      window.print();
    });

    // Copy to Clipboard
    $(document).on('click', '#btn-copy-plan-text, #conf-btn-copy', function () {
      self.copyPlanToClipboard();
    });
  }
}

export const bookingManager = new BookingManager();
if (typeof window !== 'undefined') {
  window.bookingManager = bookingManager;
}
