// Curated packages, default checklists, and initial itineraries for Travect Booking Studio

export const PACKAGES = [
  {
    id: 'labuan-bajo',
    title: 'Labuan Bajo Private Pinisi Luxury',
    destination: 'Labuan Bajo, NTT',
    tag: 'Paling Populer',
    pricePerPax: 14500000,
    durationDays: 4,
    durationNights: 3,
    description: 'Pelayaran privat melintasi perairan Labuan Bajo dengan kapal pinisi mahakarya, kabin ber-AC, chef privat, dan pemandu bersertifikat.',
    inclusions: [
      'Kabin Luxury AC & Private Bathroom',
      'Private Chef, All Meals & Sunset Cocktails',
      'Tiket Masuk TN Komodo & Ranger Resmi',
      'Dokumentasi Drone & Underwater Mirrorless',
      'Peralatan Snorkeling Lengkap & Safety Jacket'
    ],
    recommendedActivities: [
      { id: 'rec-1', title: 'Snorkeling di Manta Point', time: '09:30', category: 'Bahari', cost: 0, notes: 'Berenang bersama kawanan pari manta raksasa dengan pemandu' },
      { id: 'rec-2', title: 'Gua Rangko Natural Salt Lake', time: '14:00', category: 'Eksplorasi', cost: 250000, notes: 'Berenang di kolam air asin alami dalam gua stalaktit' },
      { id: 'rec-3', title: 'Sunset Cocktails di Bukit Sylvia', time: '17:15', category: 'Pemandangan', cost: 150000, notes: 'Menikmati panorama matahari terbenam 360 derajat di puncak bukit' },
      { id: 'rec-4', title: 'Seafood Barbecue di Kampung Ujung', time: '19:30', category: 'Kuliner', cost: 200000, notes: 'Cicipi lobster dan ikan segar bakar bumbu khas Bajo' }
    ],
    defaultItinerary: [
      {
        day: 1,
        title: 'Hari 1: Boarding & Pulau Kelor',
        notes: 'Penerbangan tiba pagi. Bawa kacamata hitam & pakaian santai untuk naik ke kapal.',
        items: [
          { id: 'item-1-1', time: '10:00', activity: 'Penjemputan Bandara Komodo & Boarding Pinisi', notes: 'Welcome drink dan pengenalan kru kapal' },
          { id: 'item-1-2', time: '12:30', activity: 'Makan Siang Mewah di Deck Atas Kapal', notes: 'Sajian hidangan laut segar olahan Chef privat' },
          { id: 'item-1-3', time: '15:00', activity: 'Trekking & Foto Estetik di Puncak Pulau Kelor', notes: 'Jalur pendakian pendek dengan panorama laut biru toska' },
          { id: 'item-1-4', time: '17:45', activity: 'Melihat Ribuan Kelelawar di Pulau Kalong', notes: 'Matahari terbenam dramatis dengan siluet kawanan kalong' }
        ]
      },
      {
        day: 2,
        title: 'Hari 2: Ikon Puncak Padar & Pink Beach',
        notes: 'Bangun pagi pukul 04:30 untuk sunrise Padar. Gunakan sepatu trekking.',
        items: [
          { id: 'item-2-1', time: '05:30', activity: 'Sunrise Trekking Puncak Pulau Padar', notes: 'Abadikan panorama 3 lekuk teluk ikonik dengan drone' },
          { id: 'item-2-2', time: '08:30', activity: 'Sarapan Hangat di Atas Kapal', notes: 'Pancake buah tropis & kopi arabika Flores' },
          { id: 'item-2-3', time: '10:30', activity: 'Santai & Snorkeling di Pink Beach', notes: 'Pasir merah muda alami dan terumbu karang warna-warni' },
          { id: 'item-2-4', time: '14:00', activity: 'Bertemu Komodo Dragon di Pulau Rinca', notes: 'Dipandu oleh Ranger Taman Nasional resmi' }
        ]
      },
      {
        day: 3,
        title: 'Hari 3: Manta Point & Pasir Timbul Taka Makassar',
        notes: 'Siapkan action cam atau drone untuk perairan dangkal Taka Makassar.',
        items: [
          { id: 'item-3-1', time: '08:00', activity: 'Snorkeling Eksklusif di Manta Point', notes: 'Mencari dan berenang bersama kawanan manta ray' },
          { id: 'item-3-2', time: '11:00', activity: 'Eksplorasi Pasir Putih Taka Makassar', notes: 'Pulau pasir timbul mungil di tengah samudra' },
          { id: 'item-3-3', time: '14:30', activity: 'Snorkeling di Turtle Point Pulau Siaba', notes: 'Berenang santai bersama penyu hijau liar' },
          { id: 'item-3-4', time: '19:00', activity: 'Gala Dinner & Acoustic Night di Bintang Malam', notes: 'Malam kebersamaan di bawah taburan bintang Flores' }
        ]
      },
      {
        day: 4,
        title: 'Hari 4: Pulau Kanawa & Kepulangan',
        notes: 'Check-out kapal dan transfer ke bandara untuk penerbangan sore.',
        items: [
          { id: 'item-4-1', time: '07:30', activity: 'Morning Swim & Snorkeling di Pulau Kanawa', notes: 'Dermaga kayu dengan air sejernih kristal' },
          { id: 'item-4-2', time: '10:30', activity: 'Kembali ke Pelabuhan Labuan Bajo', notes: 'Proses check-out dan serah terima bagasi' },
          { id: 'item-4-3', time: '12:00', activity: 'Belanja Cenderamata Kain Tenun & Kopi Manggarai', notes: 'Pusat oleh-oleh khas Flores' },
          { id: 'item-4-4', time: '14:30', activity: 'Pengantaran ke Bandara Komodo (LBJ)', notes: 'Penerbangan kembali ke kota asal' }
        ]
      }
    ]
  },
  {
    id: 'raja-ampat',
    title: 'Raja Ampat Coral Sanctuary Expedition',
    destination: 'Raja Ampat, Papua Barat',
    tag: 'Eksklusif',
    pricePerPax: 24800000,
    durationDays: 5,
    durationNights: 4,
    description: 'Eksplorasi segitiga karang dunia di Misool & Wayag dengan eco-resort apung, speedboat pribadi, dan penyelaman tak terlupakan.',
    inclusions: [
      'Eco-Resort Overwater Bungalow',
      'Private High-Speed Boat Selama Ekspedisi',
      'Biaya Konservasi & PIN Tarif Wisata Raja Ampat',
      'Certified Dive Master & Snorkel Guide',
      'Full Board Gourmet Meals (Organik & Segar)'
    ],
    recommendedActivities: [
      { id: 'rec-ra-1', title: 'Puncak Wayag 1 & 2 Panorama', time: '07:00', category: 'Pemandangan', cost: 0, notes: 'Memanjat tebing karst untuk panorama atol terindah di bumi' },
      { id: 'rec-ra-2', title: 'Berenang Bersama Ubur-Ubur Tanpa Sengat', time: '13:00', category: 'Konservasi', cost: 100000, notes: 'Danau air payau tersembunyi dengan ribuan golden jellyfish jinak' },
      { id: 'rec-ra-3', title: 'Bird of Paradise Watching di Sawinggrai', time: '05:30', category: 'Fauna', cost: 200000, notes: 'Menyaksikan tarian burung Cenderawasih merah di kanopi fajar' }
    ],
    defaultItinerary: [
      {
        day: 1,
        title: 'Hari 1: Tiba di Sorong & Transfer Waisai',
        notes: 'Gunakan pakaian ringan untuk transfer feri cepat ke kepulauan.',
        items: [
          { id: 'ra-1-1', time: '09:00', activity: 'Penyambutan di Bandara Domine Eduard Osok Sorong', notes: 'VIP Fast-track handling bagasi' },
          { id: 'ra-1-2', time: '11:00', activity: 'VIP Ferry ke Waisai & Transfer Speedboat', notes: 'Perjalanan laut menuju overwater resort' },
          { id: 'ra-1-3', time: '14:00', activity: 'Check-in Overwater Bungalow & Unpacking', notes: 'Sensasi kamar di atas karang hidup' }
        ]
      },
      {
        day: 2,
        title: 'Hari 2: Keagungan Gugusan Karst Wayag',
        notes: 'Bawa sarung tangan dan sepatu anti selip untuk mendaki tebing karst.',
        items: [
          { id: 'ra-2-1', time: '06:30', activity: 'Ekspedisi Speedboat ke Gugusan Wayag', notes: 'Menembus labirin tebing karst zamrud' },
          { id: 'ra-2-2', time: '09:30', activity: 'Mendaki Puncak Wayag Lookout', notes: 'Pemandangan 360 derajat lanskap terindah dunia' },
          { id: 'ra-2-3', time: '13:00', activity: 'Berenang Bersama Baby Blacktip Reef Sharks', notes: 'Pos penjagaan pantai konservasi Wayag' }
        ]
      },
      {
        day: 3,
        title: 'Hari 3: Piaynemo & Teluk Bintang (Star Lagoon)',
        notes: 'Hari trekking santai lewat anak tangga kayu.',
        items: [
          { id: 'ra-3-1', time: '08:30', activity: 'Trekking Tangga Kayu Piaynemo', notes: 'Versi mini Wayag dengan akses yang sangat nyaman' },
          { id: 'ra-3-2', time: '11:30', activity: 'Eksplorasi Teluk Bintang (Star Lagoon)', notes: 'Laguna berbentuk bintang laut dari ketinggian' },
          { id: 'ra-3-3', time: '14:30', activity: 'Snorkeling di Pasir Timbul Mansuar', notes: 'Melihat terumbu karang ungu dan ikan badut' }
        ]
      },
      {
        day: 4,
        title: 'Hari 4: Menari Bersama Cenderawasih & Yenbuba',
        notes: 'Pagi hari masuk ke hutan desa adat.',
        items: [
          { id: 'ra-4-1', time: '05:30', activity: 'Birding Cenderawasih di Hutan Adat', notes: 'Melihat atraksi Cenderawasih merah' },
          { id: 'ra-4-2', time: '10:00', activity: 'Snorkeling di Jetty Desa Yenbuba', notes: 'Keanekaragaman ikan karang berlimpah' },
          { id: 'ra-4-3', time: '18:30', activity: 'Seafood Papeda Dinner & Kisah Tetua Adat', notes: 'Makan malam kuliner tradisional Papua' }
        ]
      },
      {
        day: 5,
        title: 'Hari 5: Kembali ke Sorong & Kepulangan',
        notes: 'Perjalanan kembali dengan kenangan laut abadi.',
        items: [
          { id: 'ra-5-1', time: '08:00', activity: 'Check-out Resort & Speedboat ke Sorong', notes: 'Pamit dengan tim penginapan' },
          { id: 'ra-5-2', time: '11:30', activity: 'Oleh-oleh Abon Gulung Khas Sorong', notes: 'Kuliner ikonik Papua Barat' },
          { id: 'ra-5-3', time: '13:30', activity: 'Drop-off Bandara Sorong', notes: 'Penerbangan pulang ke kota tujuan' }
        ]
      }
    ]
  },
  {
    id: 'bromo-quest',
    title: 'Bromo Caldera & Secret Waterfall Quest',
    destination: 'Bromo & Malang, Jawa Timur',
    tag: 'Petualangan',
    pricePerPax: 6200000,
    durationDays: 3,
    durationNights: 2,
    description: 'Menyambut fajar di bibir kawah Gunung Bromo dengan Jeep 4x4 privat, dilanjutkan menyusuri air terjun megah Tumpak Sewu.',
    inclusions: [
      'Jeep 4x4 Hardtop Khusus & Driver Berpengalaman',
      'Luxury Glamping/Lodge View Lembah Bromo',
      'Pemandu Gunung & Fotografer Lokal',
      'Tiket Masuk Semua Wisata & Retribusi',
      'Private Sunrise Picnic Breakfast di Lautan Pasir'
    ],
    recommendedActivities: [
      { id: 'rec-br-1', title: 'Kuda Bromo Menuju Kawah', time: '06:30', category: 'Petualangan', cost: 150000, notes: 'Naik kuda tunggang melewati lautan pasir berbisik' },
      { id: 'rec-br-2', title: 'Trekking Dasar Air Terjun Tumpak Sewu', time: '09:30', category: 'Alam', cost: 200000, notes: 'Menuruni lembah tebing tirai air terjun spektakuler' },
      { id: 'rec-br-3', title: 'Menikmati Kopi Hangat di Desa Wisata Ngadas', time: '16:00', category: 'Budaya', cost: 50000, notes: 'Berbincang dengan warga suku Tengger di rumah tradisional' }
    ],
    defaultItinerary: [
      {
        day: 1,
        title: 'Hari 1: Penjemputan Surabaya/Malang & Menuju Bromo',
        notes: 'Suhu di Bromo bisa mencapai 5-10 derajat celcius, kenakan jaket tebal.',
        items: [
          { id: 'br-1-1', time: '10:00', activity: 'Penjemputan Bandara Juanda Surabaya / Stasiun Malang', notes: 'Mobil SUV ber-AC nyaman' },
          { id: 'br-1-2', time: '14:30', activity: 'Check-in Luxury Lodge di Kaki Kaldera Bromo', notes: 'Pemandangan langsung ke bukit Teletubbies' },
          { id: 'br-1-3', time: '18:30', activity: 'Makan Malam Hangat di Depan Perapian', notes: 'Sop iga hangat dan ubi cilembu bakar' }
        ]
      },
      {
        day: 2,
        title: 'Hari 2: Sunrise Pananjakan, Kawah Bromo & Pasir Berbisik',
        notes: 'Berangkat pukul 03:00 dini hari dengan Jeep 4x4. Bawa sarung tangan & kupluk.',
        items: [
          { id: 'br-2-1', time: '03:30', activity: 'Perjalanan Jeep 4x4 ke Puncak Kingkong / Pananjakan', notes: 'Spot terbaik melihat siluet Bromo dan Semeru' },
          { id: 'br-2-2', time: '05:30', activity: 'Menyaksikan Golden Sunrise Bromo', notes: 'Momen fajar magis terbit di atas kabut awan' },
          { id: 'br-2-3', time: '07:30', activity: 'Trekking Tangga ke Bibir Kawah Aktif Bromo', notes: 'Mendengar gemuruh alami perut bumi' },
          { id: 'br-2-4', time: '09:00', activity: 'Picnic Breakfast Eksklusif di Lautan Pasir', notes: 'Meja estetik dengan kopi panas dan pastry' }
        ]
      },
      {
        day: 3,
        title: 'Hari 3: Eksplorasi Tumpak Sewu & Kepulangan',
        notes: 'Gunakan sandal gunung anti licin saat mendekati tirai air terjun.',
        items: [
          { id: 'br-3-1', time: '07:00', activity: 'Menuju Panorama Air Terjun Tumpak Sewu', notes: 'Tirai air terjun setengah lingkaran yang megah' },
          { id: 'br-3-2', time: '11:00', activity: 'Makan Siang Kuliner Khas Lumajang', notes: 'Ikan bakar sambal terasi segar' },
          { id: 'br-3-3', time: '15:00', activity: 'Drop-off Bandara Juanda Surabaya / Stasiun Malang', notes: 'Selesai trip dengan selamat' }
        ]
      }
    ]
  },
  {
    id: 'ubud-wellness',
    title: 'Ubud Royal Heritage & Wellness Sanctuary',
    destination: 'Ubud & Kintamani, Bali',
    tag: 'Wellness & Budaya',
    pricePerPax: 8900000,
    durationDays: 3,
    durationNights: 2,
    description: 'Penyegaran raga dan ketenangan jiwa di villa lembah Sungai Ayung dengan herbal sound healing, yoga privat, dan upacara melukat suci.',
    inclusions: [
      'Private Pool Valley Villa di Ubud',
      'Balinese Melukat Purification Ritual dengan Pemangku Adat',
      '60 Menit Tibetan Singing Bowl Sound Healing',
      'Private Chauffeur & Curated Farm-to-Table Dining',
      'Akses Privat Spa & Hot Spring Kintamani'
    ],
    recommendedActivities: [
      { id: 'rec-ub-1', title: 'Sunset Yoga di Yoga Barn Ubud', time: '17:00', category: 'Wellness', cost: 180000, notes: 'Sesi relaksasi pernapasan di studio terbuka tengah pepohonan hijau' },
      { id: 'rec-ub-2', title: 'Workshop Memasak Organik di Kebun Ubud', time: '10:00', category: 'Kuliner', cost: 350000, notes: 'Memetik rempah lokal dan memasak hidangan tradisional Bali' },
      { id: 'rec-ub-3', title: 'Bersepeda Menembus Terasering Jatiluwih', time: '08:30', category: 'Alam', cost: 250000, notes: 'Gowes elektrik melintasi warisan budaya UNESCO terasering sawah' }
    ],
    defaultItinerary: [
      {
        day: 1,
        title: 'Hari 1: Kedatangan & Check-in Sanctuary Villa',
        notes: 'Kenakan pakaian santai yang nyaman untuk relaksasi pertama di villa.',
        items: [
          { id: 'ub-1-1', time: '11:00', activity: 'Penyambutan Bandara Ngurah Rai (DPS) & Transfer Ubud', notes: 'Chauffeur pribadi dengan air kelapa muda dingin' },
          { id: 'ub-1-2', time: '14:00', activity: 'Check-in Private Pool Valley Villa', notes: 'Suasana sunyi dengan gemericik sungai Ayung' },
          { id: 'ub-1-3', time: '16:30', activity: 'Sesi Sound Healing & Aromaterapi Privat', notes: 'Penyelarasan chakra dengan getaran mangkuk Tibet' }
        ]
      },
      {
        day: 2,
        title: 'Hari 2: Ritual Melukat Tirta Empul & Kintamani',
        notes: 'Pakaian adat kamen bali akan disediakan oleh pemandu.',
        items: [
          { id: 'ub-2-1', time: '07:30', activity: 'Ritual Pembersihan Jiwa (Melukat) di Tirta Empul', notes: 'Dipandu pemangku adat untuk ketenangan batin' },
          { id: 'ub-2-2', time: '12:00', activity: 'Farm-to-Table Lunch dengan View Gunung Batur Kintamani', notes: 'Sajian sehat bahan segar perkebunan lokal' },
          { id: 'ub-2-3', time: '15:30', activity: 'Relaksasi di Natural Hot Spring Toya Devasya', notes: 'Mandi air panas alami tepi Danau Batur' }
        ]
      },
      {
        day: 3,
        title: 'Hari 3: Pasar Seni Ubud & Kepulangan',
        notes: 'Check-out dan eksplorasi galeri seni sebelum kembali.',
        items: [
          { id: 'ub-3-1', time: '08:00', activity: 'Morning Stroll di Campuhan Ridge Walk', notes: 'Jalan santai di atas punggung bukit rumput ilalang' },
          { id: 'ub-3-2', time: '10:30', activity: 'Berbelanja Kerajinan di Pasar Seni Tradisional Ubud', notes: 'Tenun ikat, keranjang rotan, dan lukisan tangan seniman lokal' },
          { id: 'ub-3-3', time: '13:30', activity: 'Transfer Menuju Bandara I Gusti Ngurah Rai', notes: 'Perjalanan kembali dengan energi baru yang segar' }
        ]
      }
    ]
  }
];

export const DEFAULT_CHECKLIST = [];
