// Product Catalog & Real-Time Inventory Store
const catalog = [
  {
    id: "prod_xm5",
    sku: "SNY-XM5-BLK",
    name: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
    brand: "Sony",
    category: "Audio",
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
    id: "prod_garmin_venu3",
    sku: "GRM-VN3-SLT",
    name: "Garmin Venu 3 Advanced Fitness Smartwatch",
    brand: "Garmin",
    category: "Wearables",
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
    id: "prod_apple_ultra2",
    sku: "APL-WUT-TI",
    name: "Apple Watch Ultra 2 (GPS + Cellular)",
    brand: "Apple",
    category: "Wearables",
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
  }
];

module.exports = { catalog };
