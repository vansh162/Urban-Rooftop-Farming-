/**
 * Product Seed Data for Leafinity
 * Run this to populate initial products in the database
 * 
 * Usage: Import Product model and run Product.insertMany(products)
 */

export const products = [
  // CONTAINERS
  {
    name: "UV Grow Bags (5 Gallon)",
    description: "Durable UV-resistant grow bags perfect for rooftop farming. Lightweight and breathable.",
    category: "containers",
    price: 299,
    stock: 150,
    sku: "CNT-UV-5G",
    specifications: {
      weight: "200g",
      dimensions: "12x12x16 inches",
      material: "UV-stabilized polypropylene",
      capacity: "5 gallons"
    },
    tags: ["grow-bags", "containers", "rooftop"],
    featured: true
  },
  {
    name: "Ceramic Pots (Set of 3)",
    description: "Elegant ceramic pots with drainage holes. Perfect for herbs and small vegetables.",
    category: "containers",
    price: 899,
    stock: 80,
    sku: "CNT-CER-SET3",
    specifications: {
      weight: "2.5kg",
      dimensions: "8x8x10 inches each",
      material: "Terracotta ceramic",
      capacity: "3 gallons each"
    },
    tags: ["ceramic", "pots", "herbs"],
    featured: false
  },
  {
    name: "Mud Pots (Traditional)",
    description: "Traditional Indian mud pots for natural growing. Excellent water retention.",
    category: "containers",
    price: 199,
    stock: 200,
    sku: "CNT-MUD-TRAD",
    specifications: {
      weight: "1.2kg",
      dimensions: "10x10x12 inches",
      material: "Terracotta clay",
      capacity: "4 gallons"
    },
    tags: ["mud-pots", "traditional", "organic"],
    featured: true
  },

  // GROWING MEDIA
  {
    name: "Lightweight Potting Mix (20kg)",
    description: "Specially formulated lightweight mix for rooftop gardens. Reduces structural load.",
    category: "growing-media",
    price: 599,
    stock: 100,
    sku: "GM-LWM-20KG",
    specifications: {
      weight: "20kg",
      dimensions: "Bag",
      material: "Cocopeat, perlite, compost blend",
      capacity: "Covers 50 sq ft"
    },
    tags: ["potting-mix", "lightweight", "rooftop"],
    featured: true
  },
  {
    name: "Cocopeat Block (5kg)",
    description: "Compressed cocopeat block. Expands to 70L when hydrated. Excellent water retention.",
    category: "growing-media",
    price: 349,
    stock: 120,
    sku: "GM-COP-5KG",
    specifications: {
      weight: "5kg (compressed)",
      dimensions: "30x30x15 cm",
      material: "100% coconut coir",
      capacity: "Expands to 70L"
    },
    tags: ["cocopeat", "organic", "water-retention"],
    featured: false
  },
  {
    name: "Vermicompost (10kg)",
    description: "Premium organic vermicompost rich in nutrients. Perfect for all vegetables.",
    category: "growing-media",
    price: 449,
    stock: 90,
    sku: "GM-VER-10KG",
    specifications: {
      weight: "10kg",
      dimensions: "Bag",
      material: "Organic compost",
      capacity: "Covers 30 sq ft"
    },
    tags: ["vermicompost", "organic", "fertilizer"],
    featured: true
  },

  // IRRIGATION & TECH
  {
    name: "Drip Irrigation Kit (50 Plants)",
    description: "Complete drip irrigation system for 50 plants. Includes timer and filters.",
    category: "irrigation-tech",
    price: 2499,
    stock: 40,
    sku: "IRR-DRP-50",
    specifications: {
      weight: "3.5kg",
      dimensions: "Kit",
      material: "PVC pipes, emitters, timer",
      capacity: "50 plants"
    },
    tags: ["drip", "irrigation", "automation"],
    featured: true
  },
  {
    name: "Hydroponic NFT System (6 Channels)",
    description: "Nutrient Film Technique system for soilless growing. Includes pump and nutrients.",
    category: "irrigation-tech",
    price: 12999,
    stock: 15,
    sku: "IRR-NFT-6CH",
    specifications: {
      weight: "25kg",
      dimensions: "6x4 feet",
      material: "Food-grade PVC",
      capacity: "72 plants"
    },
    tags: ["hydroponic", "NFT", "soilless"],
    featured: true
  },
  {
    name: "Smart Irrigation Timer",
    description: "WiFi-enabled smart timer with app control. Schedule watering from your phone.",
    category: "irrigation-tech",
    price: 3499,
    stock: 60,
    sku: "IRR-TIM-SMART",
    specifications: {
      weight: "500g",
      dimensions: "15x10x8 cm",
      material: "Weatherproof plastic",
      capacity: "4 zones"
    },
    tags: ["smart", "timer", "automation", "wifi"],
    featured: true
  },

  // VERTICAL GARDENING
  {
    name: "Vertical Gardening Frame (Wall Mount)",
    description: "Space-saving vertical frame for small balconies. Holds 24 pots.",
    category: "vertical-gardening",
    price: 1999,
    stock: 50,
    sku: "VG-FRM-WALL",
    specifications: {
      weight: "8kg",
      dimensions: "120x60x30 cm",
      material: "Powder-coated steel",
      capacity: "24 pots"
    },
    tags: ["vertical", "space-saving", "balcony"],
    featured: true
  },
  {
    name: "Trellis Net (5x10 feet)",
    description: "Heavy-duty trellis net for climbing plants like tomatoes and cucumbers.",
    category: "vertical-gardening",
    price: 399,
    stock: 100,
    sku: "VG-TRL-5X10",
    specifications: {
      weight: "300g",
      dimensions: "5x10 feet",
      material: "UV-resistant polypropylene",
      capacity: "Supports 20+ plants"
    },
    tags: ["trellis", "climbing", "tomatoes"],
    featured: false
  },

  // PEST MANAGEMENT
  {
    name: "Organic Neem Oil Spray (500ml)",
    description: "100% organic neem oil for pest control. Safe for vegetables and herbs.",
    category: "pest-management",
    price: 299,
    stock: 150,
    sku: "PMT-NEM-500ML",
    specifications: {
      weight: "550g",
      dimensions: "Bottle",
      material: "Cold-pressed neem oil",
      capacity: "500ml"
    },
    tags: ["neem", "organic", "pest-control"],
    featured: true
  },
  {
    name: "Yellow Sticky Traps (Pack of 20)",
    description: "Non-toxic sticky traps for flying pests. Effective for aphids and whiteflies.",
    category: "pest-management",
    price: 199,
    stock: 200,
    sku: "PMT-STK-20PK",
    specifications: {
      weight: "200g",
      dimensions: "10x15 cm each",
      material: "Non-toxic adhesive",
      capacity: "20 traps"
    },
    tags: ["sticky-traps", "pest-control", "organic"],
    featured: false
  },

  // MONITORING TOOLS
  {
    name: "PH & Moisture Meter (Digital)",
    description: "Professional-grade digital meter for soil pH and moisture levels.",
    category: "monitoring-tools",
    price: 899,
    stock: 70,
    sku: "MNT-PH-MOIST",
    specifications: {
      weight: "150g",
      dimensions: "25x5x3 cm",
      material: "Plastic + metal probes",
      capacity: "pH 3.5-9.0, Moisture 0-10"
    },
    tags: ["pH-meter", "moisture", "monitoring"],
    featured: true
  },
  {
    name: "Expandable Clay Pebbles (10L)",
    description: "Lightweight drainage layer for pots. Improves aeration and prevents waterlogging.",
    category: "monitoring-tools",
    price: 449,
    stock: 80,
    sku: "MNT-CLP-10L",
    specifications: {
      weight: "3kg",
      dimensions: "Bag",
      material: "Expanded clay",
      capacity: "10L (covers 20 pots)"
    },
    tags: ["clay-pebbles", "drainage", "aeration"],
    featured: false
  }
];
