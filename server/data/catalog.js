// Product Catalog & Real-Time Inventory Store (Expanded 16 Flagship Products)
const catalog = [
  // 1. OVER-EAR AUDIO
  {
    id: "prod_xm5",
    sku: "SNY-XM5-BLK",
    name: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
    brand: "Sony",
    category: "Audio",
    subcategory: "Over-Ear",
    price: 399.99,
    originalPrice: 429.99,
    rating: 4.8,
    reviewCount: 3820,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    description: "Industry-leading noise canceling with two processors and 8 microphones. Up to 30-hour battery life with quick charging.",
    features: [
      "Auto NC Optimizer adjusts noise canceling based on environment",
      "Magnificent Sound engineered with the new Integrated Processor V1",
      "Ultra-comfortable lightweight design in soft fit leather",
      "Multipoint connection: pair with 2 Bluetooth devices seamlessly"
    ],
    specs: {
      batteryLife: "30 Hours (ANC On)",
      charging: "3 min charge = 3 hours playback",
      ancLevel: "10/10 Industry Standard",
      weight: "250g",
      bluetooth: "Bluetooth 5.2 / LDAC",
      driver: "30mm Carbon Fiber Composite"
    },
    inventory: {
      inStock: true,
      stockCount: 14,
      warehouse: "San Francisco Fulfillment Center (West-01)",
      estimatedDeliveryDays: 1
    },
    tags: ["flagship", "headphones", "anc", "audio", "sony", "upgrade-pick"]
  },
  {
    id: "prod_bose_ultra",
    sku: "BSE-QCU-SLV",
    name: "Bose QuietComfort Ultra Wireless Headphones",
    brand: "Bose",
    category: "Audio",
    subcategory: "Over-Ear",
    price: 429.00,
    originalPrice: 449.00,
    rating: 4.7,
    reviewCount: 2190,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    description: "Breakthrough spatial audio for more immersive listening. World-class quiet with CustomTune technology for personalized sound.",
    features: [
      "Bose Immersive Audio pushes boundaries of spatial acoustic sound",
      "World-class active noise cancellation with Quiet and Aware Modes",
      "CustomTune technology personalizes sound performance to your ears",
      "Luxe materials: sleek aluminum arms and plush synthetic protein cushions"
    ],
    specs: {
      batteryLife: "24 Hours (18h Immersive Audio)",
      charging: "15 min charge = 2.5 hours",
      ancLevel: "9.8/10 Ultra Quiet",
      weight: "253g",
      bluetooth: "Bluetooth 5.3 / Snapdragon Sound",
      driver: "35mm Custom Dynamic"
    },
    inventory: {
      inStock: true,
      stockCount: 9,
      warehouse: "Oakland Distribution Hub (West-02)",
      estimatedDeliveryDays: 1
    },
    tags: ["flagship", "headphones", "bose", "spatial-audio", "comfort"]
  },
  {
    id: "prod_airpods_max",
    sku: "APL-APM-SPC",
    name: "Apple AirPods Max (USB-C)",
    brand: "Apple",
    category: "Audio",
    subcategory: "Over-Ear",
    price: 549.00,
    originalPrice: 549.00,
    rating: 4.6,
    reviewCount: 5410,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
    description: "The ultimate personal listening experience with Apple H1 chips, computational audio, custom acoustic design, and USB-C.",
    features: [
      "Apple-designed dynamic driver delivers high-fidelity audio",
      "Pro-level Active Noise Cancellation with Transparency mode",
      "Personalized Spatial Audio with dynamic head tracking",
      "Knit-mesh canopy and memory foam ear cushions for exceptional fit"
    ],
    specs: {
      batteryLife: "20 Hours (ANC On)",
      charging: "5 min charge = 1.5 hours",
      ancLevel: "9.7/10 Pro ANC",
      weight: "385g",
      bluetooth: "Bluetooth 5.0 / Apple H1",
      driver: "40mm Apple Custom Driver"
    },
    inventory: {
      inStock: true,
      stockCount: 6,
      warehouse: "San Jose Express Center",
      estimatedDeliveryDays: 2
    },
    tags: ["apple", "luxury", "airpods", "spatial-audio", "usb-c"]
  },
  {
    id: "prod_sennheiser_m4",
    sku: "SNN-M4-BLK",
    name: "Sennheiser Momentum 4 Wireless",
    brand: "Sennheiser",
    category: "Audio",
    subcategory: "Over-Ear",
    price: 379.95,
    originalPrice: 399.95,
    rating: 4.8,
    reviewCount: 1850,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
    description: "Audiophile-inspired sound quality with exceptional 60-hour marathon battery life and adaptive noise cancellation.",
    features: [
      "Unmatched 60-hour battery life with fast USB-C charging",
      "Audiophile-grade 42mm transducer system for brilliant acoustics",
      "Adaptive Noise Cancellation automatically adapts to your surroundings",
      "Lightweight design with padded headband and deep cushioned earpads"
    ],
    specs: {
      batteryLife: "60 Hours Marathon",
      charging: "10 min charge = 6 hours",
      ancLevel: "9.2/10 Adaptive",
      weight: "293g",
      bluetooth: "Bluetooth 5.2 / aptX Adaptive",
      driver: "42mm Audiophile Transducer"
    },
    inventory: {
      inStock: true,
      stockCount: 12,
      warehouse: "Reno Logistics Hub (Nevada-01)",
      estimatedDeliveryDays: 2
    },
    tags: ["audiophile", "marathon-battery", "sennheiser", "anc"]
  },
  {
    id: "prod_bw_px8",
    sku: "BW-PX8-TAN",
    name: "Bowers & Wilkins Px8 Flagship Wireless",
    brand: "Bowers & Wilkins",
    category: "Audio",
    subcategory: "Over-Ear",
    price: 699.00,
    originalPrice: 699.00,
    rating: 4.9,
    reviewCount: 780,
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&q=80",
    description: "The pinnacle of wireless acoustic luxury with custom Carbon Cone drive units and cast aluminum arms with Nappa leather trim.",
    features: [
      "Ultra-high resolution 24-bit DSP audio engine",
      "Angled Carbon Cone drive units for minimal distortion",
      "Decadent Cast aluminum arms and fine Nappa leather detailing",
      "6 proprietary noise-canceling microphones for pristine calls"
    ],
    specs: {
      batteryLife: "30 Hours",
      charging: "15 min charge = 7 hours",
      ancLevel: "9.6/10 Acoustic Master",
      weight: "320g",
      bluetooth: "Bluetooth 5.2 / aptX Lossless",
      driver: "40mm Carbon Cone"
    },
    inventory: {
      inStock: true,
      stockCount: 5,
      warehouse: "San Francisco Fulfillment Center (West-01)",
      estimatedDeliveryDays: 1
    },
    tags: ["luxury", "audiophile", "bowers-wilkins", "flagship", "leather"]
  },

  // 2. TRUE WIRELESS EARBUDS
  {
    id: "prod_sony_wfxm5",
    sku: "SNY-WFXM5-BLK",
    name: "Sony WF-1000XM5 True Wireless Noise-Cancelling Earbuds",
    brand: "Sony",
    category: "Audio",
    subcategory: "Earbuds",
    price: 299.99,
    originalPrice: 299.99,
    rating: 4.7,
    reviewCount: 2640,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    description: "The best noise canceling true wireless earbuds with Dynamic Driver X, dual processors, and bone conduction sensors.",
    features: [
      "Dynamic Driver X for wide frequency reproduction and deep bass",
      "Multi-noise sensor technology with 3 mics per earbud",
      "AI-based noise reduction algorithm with bone conduction sensors",
      "Glossy luxury texture with miniature ergonomic earbud chassis"
    ],
    specs: {
      batteryLife: "8 Hours (24h with case)",
      charging: "3 min charge = 60 min playtime",
      ancLevel: "9.9/10 In-Ear King",
      weight: "5.9g per bud",
      bluetooth: "Bluetooth 5.3 / LDAC",
      driver: "8.4mm Dynamic Driver X"
    },
    inventory: {
      inStock: true,
      stockCount: 22,
      warehouse: "San Francisco Fulfillment Center (West-01)",
      estimatedDeliveryDays: 1
    },
    tags: ["earbuds", "wireless", "sony", "anc", "compact"]
  },
  {
    id: "prod_airpods_pro2",
    sku: "APL-APP2-WHT",
    name: "Apple AirPods Pro 2 (USB-C & MagSafe)",
    brand: "Apple",
    category: "Audio",
    subcategory: "Earbuds",
    price: 249.00,
    originalPrice: 249.00,
    rating: 4.8,
    reviewCount: 6890,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80",
    description: "Pro-level Active Noise Cancellation, Adaptive Audio, and Hearing Health assistance with Apple H2 chip.",
    features: [
      "Apple H2 headphone chip powers computational audio and 2x more ANC",
      "Adaptive Audio dynamically blends Transparency and Active Noise Cancellation",
      "Conversation Awareness lowers volume when you begin speaking",
      "MagSafe Charging Case with speaker and lanyard loop"
    ],
    specs: {
      batteryLife: "6 Hours (30h with case)",
      charging: "5 min charge = 1 hour",
      ancLevel: "9.8/10",
      weight: "5.3g per bud",
      bluetooth: "Bluetooth 5.3 / Apple H2",
      driver: "Custom Apple Low-Distortion Driver"
    },
    inventory: {
      inStock: true,
      stockCount: 31,
      warehouse: "San Jose Express Center",
      estimatedDeliveryDays: 1
    },
    tags: ["apple", "airpods", "earbuds", "anc", "h2"]
  },
  {
    id: "prod_bose_qc_earbuds",
    sku: "BSE-QCE-BLK",
    name: "Bose QuietComfort Ultra Earbuds",
    brand: "Bose",
    category: "Audio",
    subcategory: "Earbuds",
    price: 299.00,
    originalPrice: 299.00,
    rating: 4.6,
    reviewCount: 1420,
    image: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800&q=80",
    description: "Breakthrough spatial audio and world-class quiet in a comfortable, customizable in-ear design.",
    features: [
      "Bose Immersive Audio places sound right in front of you",
      "CustomTune technology tailors noise cancellation to your ear canals",
      "Nine combinations of ear tips and stability bands for all-day comfort",
      "Touch controls for playback, volume, and listening modes"
    ],
    specs: {
      batteryLife: "6 Hours (24h with case)",
      charging: "20 min charge = 2 hours",
      ancLevel: "9.7/10",
      weight: "6.2g per bud",
      bluetooth: "Bluetooth 5.3 / Snapdragon Sound",
      driver: "9.3mm Bose Dynamic"
    },
    inventory: {
      inStock: true,
      stockCount: 15,
      warehouse: "Oakland Distribution Hub (West-02)",
      estimatedDeliveryDays: 1
    },
    tags: ["bose", "earbuds", "spatial-audio", "comfort"]
  },

  // 3. SMART WEARABLES & WATCHES
  {
    id: "prod_apple_ultra2",
    sku: "APL-WUT-TI",
    name: "Apple Watch Ultra 2 (GPS + Cellular)",
    brand: "Apple",
    category: "Wearables",
    subcategory: "Smartwatch",
    price: 799.00,
    originalPrice: 799.00,
    rating: 4.9,
    reviewCount: 3120,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
    description: "Rugged and capable 49mm aerospace-grade titanium case with precision dual-frequency GPS and up to 36 hours of battery life.",
    features: [
      "49mm aerospace titanium case with flat sapphire crystal display",
      "Brightest Apple display ever up to 3000 nits peak brightness",
      "Precision dual-frequency GPS for route accuracy",
      "Water resistant up to 100 meters, EN13319 dive computer certified"
    ],
    specs: {
      batteryLife: "36 Hours (72 Hours Low Power)",
      display: "3000 nits Retina LTPO OLED",
      waterRating: "100m / Dive Rated",
      weight: "61.4g",
      sensors: "S9 SiP, Dual Speakers, Siren, Depth Gauge, Water Temp"
    },
    inventory: {
      inStock: true,
      stockCount: 4,
      warehouse: "San Jose Express Center",
      estimatedDeliveryDays: 1
    },
    tags: ["apple", "rugged", "titanium", "flagship", "smartwatch"]
  },
  {
    id: "prod_garmin_venu3",
    sku: "GRM-VN3-SLT",
    name: "Garmin Venu 3 Advanced Fitness Smartwatch",
    brand: "Garmin",
    category: "Wearables",
    subcategory: "Smartwatch",
    price: 449.99,
    originalPrice: 449.99,
    rating: 4.8,
    reviewCount: 940,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    description: "Know the real you with the Venu 3 smartwatch. Advanced health monitoring, sleep coaching with HRV, and built-in speaker/mic.",
    features: [
      "Bright 1.4-inch AMOLED touchscreen display with stainless steel bezel",
      "Up to 14 days of battery life in smartwatch mode",
      "Sleep Coach with nap detection and HRV status tracking",
      "Make and take calls directly from your wrist with built-in mic & speaker"
    ],
    specs: {
      batteryLife: "14 Days",
      display: "1.4\" AMOLED Always-On",
      waterRating: "5 ATM (50m Swim-Proof)",
      weight: "46g",
      sensors: "Elevate Gen 5 Heart Rate, Pulse Ox, Compass, Barometer"
    },
    inventory: {
      inStock: true,
      stockCount: 18,
      warehouse: "San Francisco Fulfillment Center (West-01)",
      estimatedDeliveryDays: 1
    },
    tags: ["smartwatch", "fitness", "garmin", "battery-beast", "wearable"]
  },
  {
    id: "prod_oura_ring3",
    sku: "OUR-RNG3-STE",
    name: "Oura Ring Gen 3 Horizon (Stealth Black)",
    brand: "Oura",
    category: "Wearables",
    subcategory: "Smart Ring",
    price: 349.00,
    originalPrice: 349.00,
    rating: 4.7,
    reviewCount: 1890,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    description: "Accurate health tracking discreetly wrapped around your finger. Monitor sleep stages, Readiness Score, and body temperature trends.",
    features: [
      "Lightweight medical-grade titanium with scratch-resistant PVD coating",
      "Measures directly from the finger arteries for 10x higher signal fidelity",
      "Up to 7 days of battery life with ultra-compact puck charger",
      "Water resistant to 100 meters: wear swimming, showering, or saunas"
    ],
    specs: {
      batteryLife: "7 Days",
      material: "Titanium with PVD Coating",
      waterRating: "100m Water Resistant",
      weight: "4 to 6 grams",
      sensors: "Green, Red, & Infrared LEDs, NTC body temperature sensors"
    },
    inventory: {
      inStock: true,
      stockCount: 16,
      warehouse: "San Francisco Fulfillment Center (West-01)",
      estimatedDeliveryDays: 1
    },
    tags: ["smart-ring", "sleep-tracking", "health", "titanium", "oura"]
  },
  {
    id: "prod_galaxy_watch_ultra",
    sku: "SAM-GWU-TIT",
    name: "Samsung Galaxy Watch Ultra (Titanium Gray)",
    brand: "Samsung",
    category: "Wearables",
    subcategory: "Smartwatch",
    price: 649.99,
    originalPrice: 649.99,
    rating: 4.7,
    reviewCount: 1120,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
    description: "Built to push boundaries with a titanium cushion design, dual-frequency GPS, and up to 100-hour battery power saving mode.",
    features: [
      "Grade 4 Titanium cushion frame with 10 ATM and IP68 resistance",
      "3nm processor for blazing fast Wear OS responsiveness",
      "Energy Score with Galaxy AI health insights",
      "Emergency siren with up to 86-decibel audible alert"
    ],
    specs: {
      batteryLife: "60 Hours (100h Power Saving)",
      display: "1.5\" Super AMOLED (3000 nits)",
      waterRating: "10 ATM (100m)",
      weight: "60.5g",
      sensors: "BioActive Sensor (HR + ECG + BIA), Temperature, Barometer"
    },
    inventory: {
      inStock: true,
      stockCount: 8,
      warehouse: "Oakland Distribution Hub (West-02)",
      estimatedDeliveryDays: 1
    },
    tags: ["samsung", "wearable", "galaxy", "titanium", "rugged"]
  },

  // 4. DESK TECH & SPATIAL AUDIO
  {
    id: "prod_sonos_era300",
    sku: "SNS-E300-BLK",
    name: "Sonos Era 300 Spatial Audio Smart Speaker",
    brand: "Sonos",
    category: "Desk & Audio",
    subcategory: "Home Audio",
    price: 449.00,
    originalPrice: 449.00,
    rating: 4.8,
    reviewCount: 890,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
    description: "Featuring six drivers positioned around the sides, top, and front to deliver Dolby Atmos spatial audio from wall to wall.",
    features: [
      "Six optimal class-D amplifiers tuned for Dolby Atmos immersion",
      "Trueplay tuning technology optimizes sound for your room acoustics",
      "Stream from all your favorite services over Wi-Fi 6 or Bluetooth",
      "Touch controls and built-in far-field microphone array"
    ],
    specs: {
      connectivity: "Wi-Fi 6, Bluetooth 5.0, USB-C Line-In",
      audio: "Dolby Atmos Music, Spatial Audio",
      weight: "4.47 kg",
      dimensions: "160 x 260 x 185 mm",
      driver: "4 Tweeters + 2 Woofers"
    },
    inventory: {
      inStock: true,
      stockCount: 7,
      warehouse: "San Francisco Fulfillment Center (West-01)",
      estimatedDeliveryDays: 1
    },
    tags: ["sonos", "spatial-audio", "speaker", "dolby-atmos", "smart-home"]
  },
  {
    id: "prod_marshall_stanmore",
    sku: "MSH-STM3-BRN",
    name: "Marshall Stanmore III Bluetooth Home Speaker",
    brand: "Marshall",
    category: "Desk & Audio",
    subcategory: "Home Audio",
    price: 379.99,
    originalPrice: 379.99,
    rating: 4.9,
    reviewCount: 1670,
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80",
    description: "Legendary rock 'n' roll vintage design with expansive Marshall signature room-filling stereo sound.",
    features: [
      "Re-engineered soundstage with outward-angled tweeters and updated waveguides",
      "Dynamic Loudness adjusts tonal balance to keep music sounding brilliant at any volume",
      "Iconic Marshall vintage brass dials for volume, bass, and treble adjustments",
      "Bluetooth 5.2 and 3.5mm AUX / RCA line-in inputs"
    ],
    specs: {
      power: "80 Watt Class D Amplification",
      frequencyRange: "45–20,000 Hz",
      weight: "4.25 kg",
      connectivity: "Bluetooth 5.2, 3.5mm, RCA",
      controls: "Analog Brass Knobs"
    },
    inventory: {
      inStock: true,
      stockCount: 11,
      warehouse: "Reno Logistics Hub (Nevada-01)",
      estimatedDeliveryDays: 2
    },
    tags: ["marshall", "vintage", "speaker", "rock", "home-audio"]
  },
  {
    id: "prod_keychron_q1",
    sku: "KYC-Q1P-GRY",
    name: "Keychron Q1 Pro Wireless Custom Mechanical Keyboard",
    brand: "Keychron",
    category: "Desk & Audio",
    subcategory: "Desk Accessories",
    price: 199.00,
    originalPrice: 219.00,
    rating: 4.9,
    reviewCount: 2210,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    description: "All-metal CNC aluminum wireless custom mechanical keyboard with double-gasket acoustic design and QMK/VIA key remapping.",
    features: [
      "Precision CNC machined 6063 aluminum body with anodized finish",
      "Double-gasket acoustic dampening for pure, deep tactile typing feedback",
      "Connect up to 3 devices seamlessly via Broadcom Bluetooth 5.1 or Type-C",
      "Hot-swappable sockets compatible with all 3-pin and 5-pin MX switches"
    ],
    specs: {
      layout: "75% ANSI with Programmable Rotary Knob",
      connectivity: "Bluetooth 5.1 / Type-C Wired (1000Hz Polling)",
      batteryLife: "300 Hours (Backlight Off)",
      weight: "1.74 kg",
      switches: "Keychron K Pro Red (Pre-Lubed)"
    },
    inventory: {
      inStock: true,
      stockCount: 24,
      warehouse: "San Francisco Fulfillment Center (West-01)",
      estimatedDeliveryDays: 1
    },
    tags: ["keyboard", "mechanical", "custom", "aluminum", "desk-setup"]
  },
  {
    id: "prod_mx_master3s",
    sku: "LOG-MX3S-GRY",
    name: "Logitech MX Master 3S Wireless Performance Mouse",
    brand: "Logitech",
    category: "Desk & Audio",
    subcategory: "Desk Accessories",
    price: 99.99,
    originalPrice: 99.99,
    rating: 4.8,
    reviewCount: 8420,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
    description: "An icon remastered with 8K DPI any-surface tracking and 90% quieter clicks for seamless productivity.",
    features: [
      "MagSpeed electromagnetic scrolling: scroll 1,000 lines in one second",
      "Quiet Click technology delivers satisfying click feel with 90% less noise",
      "8,000 DPI Darkfield optical sensor tracks even on glass surfaces",
      "Ergonomic silhouette crafted to support your palm and fingers"
    ],
    specs: {
      dpi: "200 to 8,000 DPI",
      batteryLife: "70 Days on full charge (1 min charge = 3 hours)",
      connectivity: "Bluetooth Low Energy + Logi Bolt USB",
      weight: "141g",
      buttons: "7 Customizable Buttons with Thumb Wheel"
    },
    inventory: {
      inStock: true,
      stockCount: 38,
      warehouse: "San Francisco Fulfillment Center (West-01)",
      estimatedDeliveryDays: 1
    },
    tags: ["mouse", "logitech", "productivity", "ergonomic", "desk-setup"]
  }
];

module.exports = { catalog };
