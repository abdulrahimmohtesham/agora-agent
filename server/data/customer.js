// Before: Retrieve customer preferences, purchase history, and available offers
const customerProfile = {
  id: "cust_9821",
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  tier: "Platinum VIP",
  memberSince: "2023-04-12",
  cashbackRate: "5%",
  preferences: {
    categories: ["Premium Audio", "Smart Wearables", "Minimalist Desk Tech"],
    favoriteBrands: ["Sony", "Apple", "Bose", "Sennheiser"],
    priceAffinity: "Premium / Flagship",
    preferredColor: "Midnight Black / Matte Silver",
    ecoFriendlyPackaging: true
  },
  purchaseHistory: [
    {
      orderId: "ORD-89421",
      date: "2024-03-15",
      productName: "Sony WH-1000XM4 Noise-Cancelling Headphones",
      sku: "SNY-XM4-BLK",
      category: "Audio",
      price: 349.99,
      status: "Delivered",
      canUpgrade: true,
      upgradeNotes: "Customer has had XM4 for 2+ years; prime candidate for WH-1000XM5 upgrade"
    },
    {
      orderId: "ORD-76192",
      date: "2024-07-22",
      productName: "Minimalist Leather Desk Pad & MagSafe Dock",
      sku: "DSK-PAD-BRN",
      category: "Accessories",
      price: 89.00,
      status: "Delivered",
      canUpgrade: false
    }
  ],
  availableOffers: [
    {
      code: "TECH20",
      description: "20% OFF Flagship Audio Gear & Noise-Cancelling Headphones",
      discountType: "percentage",
      discountValue: 20,
      minSpend: 200,
      badge: "Exclusive Loyalty Reward"
    },
    {
      code: "FALCON15",
      description: "15% OFF Next-Gen Wearables & Smartwatches",
      discountType: "percentage",
      discountValue: 15,
      minSpend: 150,
      badge: "Agora & Murf Special"
    },
    {
      code: "FREESHIP",
      description: "Complimentary Expedited Overnight Priority Delivery",
      discountType: "shipping",
      discountValue: 100,
      minSpend: 50,
      badge: "VIP Benefit"
    }
  ],
  defaultShippingAddress: {
    fullName: "Alex Morgan",
    street: "742 Evergreen Terrace, Suite 400",
    city: "San Francisco",
    state: "CA",
    zipCode: "94107",
    country: "United States"
  },
  savedPaymentMethod: {
    type: "Visa",
    last4: "4242",
    expiry: "09/28",
    billingZip: "94107"
  }
};

module.exports = { customerProfile };
