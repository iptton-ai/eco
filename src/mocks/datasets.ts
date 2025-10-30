import type {
  Article,
  Category,
  MockCredential,
  Order,
  Product,
  SiteStats,
  User
} from '../types';

export const mockCategories: Category[] = [
  {
    id: 'cat-daoist-philosophy',
    name: 'Daoist Philosophy',
    slug: 'daoist-philosophy',
    description: 'Explorations of the Dao De Jing, Zhuangzi, and the subtle dialectics of Daoist thought.',
    featured: true,
    image: '/images/categories/daoist-philosophy.jpg'
  },
  {
    id: 'cat-internal-alchemy',
    name: 'Internal Alchemy (Neidan)',
    slug: 'internal-alchemy',
    description: 'Classical and contemporary methods for refining jing, qi, and shen in the inner cauldrons.',
    featured: true,
    image: '/images/categories/internal-alchemy.jpg'
  },
  {
    id: 'cat-qigong',
    name: 'Qigong & Breathwork',
    slug: 'qigong-breathwork',
    description: 'Lineage practices for cultivating vitality through movement, breath, and intent.',
    image: '/images/categories/qigong.jpg'
  },
  {
    id: 'cat-herbal',
    name: 'Daoist Herbal Traditions',
    slug: 'daoist-herbalism',
    description: 'Materia medica, tonic formulations, and mountain-harvested herbs revered in Daoist clinics.',
    image: '/images/categories/herbal.jpg'
  },
  {
    id: 'cat-ritual',
    name: 'Ritual & Talismans',
    slug: 'ritual-talismans',
    description: 'Celestial invocations, talismanic arts, and the liturgical cadence of Daoist ceremonies.'
  },
  {
    id: 'cat-mountain-retreats',
    name: 'Sacred Mountains & Retreats',
    slug: 'sacred-mountains',
    description: 'Journeys into the breathing landscapes of Wudang, Qingcheng, Longhu, and Mao Shan.'
  }
];

export const mockArticles: Article[] = [
  {
    id: 'art-celestial-pivots',
    title: 'Tracing the Celestial Pivots: Aligning Breath with the Big Dipper',
    slug: 'celestial-pivots-breath-big-dipper',
    summary: 'A step-by-step night meditation aligning the microcosmic orbit with the handle of the Northern Dipper.',
    content:
      'In the Jade Library scrolls of the Wudang adept Chen Tuan, star-stepping is described as a gateway to harmonising breath with the celestial tides. Begin by facing north, allowing the breath to mirror the slow turn of the heavens. Visualise the Big Dipper arcing over the crown, each star awakening a point along the Du Mai...\n\nBreath Regulation:\n1. Inhale to the Jade Pillow, exhale to the Heavenly Pool.\n2. Synchronise each breath with the pacing mantra of the Seven Stars.\n3. Anchor the awareness in the Lower Dantian as the orbit completes.\n\nWhen practised at the Zi hour, the adept experiences a spacious clarity where thought thins and the Dao silently responds.',
    heroImage: '/images/articles/celestial-pivots.jpg',
    tags: ['star-stepping', 'meditation', 'astral alignment'],
    categoryIds: ['cat-daoist-philosophy', 'cat-qigong'],
    publishedAt: '2024-03-01T08:00:00.000Z',
    updatedAt: '2024-03-12T08:00:00.000Z',
    authorId: 'user-master-li',
    readingTimeMinutes: 12,
    isFeatured: true,
    metrics: {
      reads: 4820,
      bookmarks: 920,
      shares: 312
    }
  },
  {
    id: 'art-golden-elixir-tea',
    title: 'Golden Elixir Tea Ritual for Harmonising the Three Treasures',
    slug: 'golden-elixir-tea-ritual',
    summary: 'An aromatic infusion favoured by Quanzhen adepts to nourish jing, kindle qi, and brighten shen.',
    content:
      'The Golden Elixir tea blends aged white peony leaves with chrysanthemum, goji berry, and a whisper of wild ginseng. Heat spring water to 82°C to honour the delicate aroma. Pour in a slow spiral while intoning the Jade Purity mantra.\n\nSip in three breaths:\n- First to settle Jing in the kidneys\n- Second to open the chest and circulate Qi\n- Third to brighten Shen behind the eyes\n\nAccompany the tea with five minutes of bellows breathing through the nose, concluding with the Immortal Crane mudra.',
    heroImage: '/images/articles/golden-elixir-tea.jpg',
    tags: ['tea', 'ritual', 'neidan'],
    categoryIds: ['cat-internal-alchemy', 'cat-herbal'],
    publishedAt: '2024-02-10T05:30:00.000Z',
    updatedAt: '2024-02-18T10:00:00.000Z',
    authorId: 'user-adept-wei',
    readingTimeMinutes: 8,
    isFeatured: false,
    metrics: {
      reads: 3680,
      bookmarks: 744,
      shares: 210
    }
  },
  {
    id: 'art-dragon-gate-seal',
    title: 'Dragon Gate Seal: Glyphs for Calming Storm Spirits',
    slug: 'dragon-gate-seal-spirit-calm',
    summary: 'A talismanic sequence from the Longmen Canon used to disband turbulent qi within the household.',
    content:
      'Within the Dragon Gate corpus, the Storm-Calming talisman is drawn in a single flowing breath. Begin with the Azure Dragon curve, followed by the Celestial Seal that anchors the glyph to the home altar.\n\nTo activate: burn mugwort, intone the Nine Sovereigns incantation, and press the talisman above the lintel. Practitioners report a palpable hush as the spirit of the wind bows to stillness.',
    heroImage: '/images/articles/dragon-gate-seal.jpg',
    tags: ['talisman', 'ritual', 'longmen'],
    categoryIds: ['cat-ritual'],
    publishedAt: '2024-01-25T09:00:00.000Z',
    updatedAt: '2024-01-26T15:40:00.000Z',
    authorId: 'user-master-li',
    readingTimeMinutes: 6,
    isFeatured: false,
    metrics: {
      reads: 2920,
      bookmarks: 612,
      shares: 184
    }
  },
  {
    id: 'art-immortal-cuisine',
    title: 'Immortal Cuisine: Mineral Broths from Mount Mao',
    slug: 'immortal-cuisine-mineral-broths',
    summary: 'Recipes from the Shangqing retreat kitchens using dew condensate and pine pollen to replenish yin.',
    content:
      'Master Xu Ling records that each dawn the adepts gathered dew from the Jade Bamboo groves. Combined with stone-marrow mushrooms and slow simmered astragalus, the broth restores the delicate balance of yin fluids.\n\nSeason with fermented chrysanthemum leaves and a pinch of sea salt harvested during the Dragon Boat festival.',
    heroImage: '/images/articles/immortal-cuisine.jpg',
    tags: ['cuisine', 'mountain retreat', 'yin tonics'],
    categoryIds: ['cat-herbal', 'cat-mountain-retreats'],
    publishedAt: '2024-04-05T04:00:00.000Z',
    updatedAt: '2024-04-05T04:00:00.000Z',
    authorId: 'user-seeker-mei',
    readingTimeMinutes: 7,
    isFeatured: true,
    metrics: {
      reads: 2150,
      bookmarks: 505,
      shares: 162
    }
  },
  {
    id: 'art-wudang-iron-robes',
    title: 'Wudang Iron Robes: Layering Qi Shields in Spring Thunderstorms',
    slug: 'wudang-iron-robes-qi-shields',
    summary: 'Martial qigong from Purple Cloud Monastery for protecting the protective wei qi during sudden thunder.',
    content:
      'The Iron Robes set weaves together rooted stances with spiralling fascia tension. Practise along the cliff edge to feel the ionic charge in the clouds. The key is to wrap qi along the Ren channel while the outer skin tingles with charged air.',
    heroImage: '/images/articles/wudang-iron-robes.jpg',
    tags: ['martial', 'qigong', 'protective practices'],
    categoryIds: ['cat-qigong'],
    publishedAt: '2024-03-18T11:15:00.000Z',
    updatedAt: '2024-03-22T06:20:00.000Z',
    authorId: 'user-adept-wei',
    readingTimeMinutes: 10,
    isFeatured: false,
    metrics: {
      reads: 3310,
      bookmarks: 588,
      shares: 198
    }
  },
  {
    id: 'art-azure-mists',
    title: 'Azure Mists of Qingcheng: Dawn Walking Meditation Trail',
    slug: 'azure-mists-qingcheng-trail',
    summary: 'A contemplative walking meditation along the moss-lined paths of Qingcheng Shan.',
    content:
      'The trail begins at the Tianshi Cave, winding through bamboo groves humming with cicadas. Each step synchronises with a silent mantra of \u201cQing Jing Jing\u201d. Pause at the dew-collecting basins to refresh the senses and offer gratitude to the mountain guardians.',
    heroImage: '/images/articles/azure-mists.jpg',
    tags: ['walking meditation', 'mountain'],
    categoryIds: ['cat-mountain-retreats', 'cat-daoist-philosophy'],
    publishedAt: '2024-04-12T05:45:00.000Z',
    updatedAt: '2024-04-12T05:45:00.000Z',
    authorId: 'user-seeker-mei',
    readingTimeMinutes: 9,
    isFeatured: true,
    metrics: {
      reads: 2605,
      bookmarks: 490,
      shares: 174
    }
  }
];

export const mockProducts: Product[] = [
  {
    id: 'prod-celestial-incense',
    name: 'Celestial Pivot Incense Cones',
    slug: 'celestial-pivot-incense',
    summary: 'Hand-rolled sandalwood and agarwood cones tuned to the Northern Dipper rites.',
    description:
      'Crafted within the Azure Cloud Monastery, these cones blend 12-year aged sandalwood, agarwood resin, and powdered oyster shell. Burn during star pacing to align breath with celestial rotations.',
    sku: 'DAO-INC-108',
    price: 38,
    currency: 'USD',
    stock: 120,
    categoryIds: ['cat-ritual'],
    images: ['/images/products/celestial-incense.jpg'],
    tags: ['ritual', 'incense', 'star pacing'],
    attributes: [
      { key: 'element', label: 'Element', value: 'Water' },
      { key: 'batch', label: 'Batch', value: 'Spring Thunder 2024' }
    ],
    isFeatured: true,
    createdAt: '2023-11-02T09:00:00.000Z',
    updatedAt: '2024-03-15T02:30:00.000Z',
    metrics: {
      rating: 4.9,
      reviewCount: 128,
      sold: 540,
      restockExpectedAt: null
    }
  },
  {
    id: 'prod-lacquered-luopan',
    name: 'Lacquered Luopan Compass',
    slug: 'lacquered-luopan-compass',
    summary: 'Hand-painted luopan aligned to Longhu Shan magnetic bearings.',
    description:
      'Designed for geomantic surveys and altar placement, each luopan is calibrated against Longhu Shan\'s magnetic field with hand-carved cinnabar markings.',
    sku: 'DAO-LUP-042',
    price: 146,
    currency: 'USD',
    stock: 24,
    categoryIds: ['cat-ritual', 'cat-daoist-philosophy'],
    images: ['/images/products/lacquered-luopan.jpg'],
    tags: ['feng shui', 'ritual'],
    attributes: [
      { key: 'material', label: 'Material', value: 'Rosewood & Brass' },
      { key: 'calibration', label: 'Calibration', value: 'Dragon Tiger Alignment' }
    ],
    isFeatured: true,
    createdAt: '2023-08-18T03:30:00.000Z',
    updatedAt: '2024-02-26T13:50:00.000Z',
    metrics: {
      rating: 4.8,
      reviewCount: 86,
      sold: 210,
      restockExpectedAt: '2024-06-01T00:00:00.000Z'
    }
  },
  {
    id: 'prod-qi-tonic-elixir',
    name: 'Azure Qi Tonic Elixir',
    slug: 'azure-qi-tonic-elixir',
    summary: 'Daily tonic of cordyceps, astragalus, and snow chrysanthemum for nourishing lung qi.',
    description:
      'Brewed in small batches with Tibetan cordyceps, wild astragalus root, and snow chrysanthemum, this elixir gently brightens lung qi while grounding the Earth element.',
    sku: 'DAO-TON-314',
    price: 52,
    currency: 'USD',
    stock: 64,
    categoryIds: ['cat-herbal'],
    images: ['/images/products/azure-qi-elixir.jpg'],
    tags: ['tonic', 'herbal'],
    attributes: [
      { key: 'dosage', label: 'Dosage', value: '10 ml twice daily' },
      { key: 'harvest', label: 'Harvest', value: 'Winter Solstice 2023' }
    ],
    isFeatured: false,
    createdAt: '2024-01-12T07:10:00.000Z',
    updatedAt: '2024-03-28T08:15:00.000Z',
    metrics: {
      rating: 4.7,
      reviewCount: 64,
      sold: 320,
      restockExpectedAt: '2024-05-20T00:00:00.000Z'
    }
  },
  {
    id: 'prod-wudang-robes',
    name: 'Wudang Cloud Silk Robes',
    slug: 'wudang-cloud-silk-robes',
    summary: 'Meditation robes woven with breathable cloud-pattern silk for long sits.',
    description:
      'Tailored in the Purple Cloud workshops, the robes use mulberry silk infused with mugwort smoke to calm the shen. Perfect for dawn practice on the terraces.',
    sku: 'DAO-ROB-512',
    price: 168,
    currency: 'USD',
    stock: 36,
    categoryIds: ['cat-mountain-retreats', 'cat-qigong'],
    images: ['/images/products/wudang-cloud-robe.jpg'],
    tags: ['apparel', 'meditation'],
    attributes: [
      { key: 'fabric', label: 'Fabric', value: 'Mulberry Silk' },
      { key: 'weave', label: 'Weave', value: 'Cloud Whisper Pattern' }
    ],
    isFeatured: false,
    createdAt: '2023-12-01T06:50:00.000Z',
    updatedAt: '2024-02-02T09:20:00.000Z',
    metrics: {
      rating: 4.6,
      reviewCount: 43,
      sold: 138,
      restockExpectedAt: null
    }
  },
  {
    id: 'prod-qi-stone-kit',
    name: 'Breath Stone Grounding Kit',
    slug: 'breath-stone-grounding-kit',
    summary: 'Polished river stones and pine resin oil for Daoist walking meditation.',
    description:
      'Collected from the Nine Bends River, the stones are paired with pine resin oil to anoint the Yongquan point before mindful walking.',
    sku: 'DAO-KIT-207',
    price: 44,
    currency: 'USD',
    stock: 85,
    categoryIds: ['cat-qigong', 'cat-mountain-retreats'],
    images: ['/images/products/breath-stone-kit.jpg'],
    tags: ['meditation', 'grounding'],
    attributes: [
      { key: 'stones', label: 'Stones', value: 'Nine Bends River quartz' },
      { key: 'oil', label: 'Anointing Oil', value: 'Pine Resin & Mugwort' }
    ],
    isFeatured: true,
    createdAt: '2024-02-20T04:00:00.000Z',
    updatedAt: '2024-03-22T12:00:00.000Z',
    metrics: {
      rating: 4.8,
      reviewCount: 51,
      sold: 188,
      restockExpectedAt: null
    }
  }
];

export const mockUsers: User[] = [
  {
    id: 'user-master-li',
    name: 'Master Li Wen',
    email: 'abbot@wudangsanctuary.org',
    role: 'admin',
    avatarUrl: '/images/users/master-li.jpg',
    bio: 'Abbot of the Azure Cloud Monastery and lineage keeper of the Northern Dipper liturgy.',
    location: 'Wudang Mountains, Hubei',
    preferences: {
      locale: 'zh-CN',
      currency: 'CNY',
      marketingOptIn: false,
      interests: ['internal alchemy', 'ritual arts']
    },
    createdAt: '2020-01-18T00:00:00.000Z',
    updatedAt: '2024-03-05T11:00:00.000Z',
    lastLoginAt: '2024-03-20T03:00:00.000Z'
  },
  {
    id: 'user-adept-wei',
    name: 'Wei Ling',
    email: 'wei.ling@example.com',
    role: 'practitioner',
    avatarUrl: '/images/users/wei-ling.jpg',
    bio: 'Daoist herbalist sharing seasonal tonic recipes from Chengdu clinics.',
    location: 'Chengdu, Sichuan',
    preferences: {
      locale: 'zh-CN',
      currency: 'CNY',
      marketingOptIn: true,
      interests: ['herbal alchemy', 'qigong']
    },
    createdAt: '2021-06-10T00:00:00.000Z',
    updatedAt: '2024-03-18T07:45:00.000Z',
    lastLoginAt: '2024-04-01T05:22:00.000Z'
  },
  {
    id: 'user-seeker-mei',
    name: 'Mei Chen',
    email: 'mei.chen@example.com',
    role: 'member',
    avatarUrl: '/images/users/mei-chen.jpg',
    bio: 'Documenting pilgrimages to Daoist mountains and their living rituals.',
    location: 'Hangzhou, Zhejiang',
    preferences: {
      locale: 'en-US',
      currency: 'USD',
      marketingOptIn: true,
      interests: ['mountain retreats', 'tea rituals']
    },
    createdAt: '2022-11-22T00:00:00.000Z',
    updatedAt: '2024-04-08T02:10:00.000Z',
    lastLoginAt: '2024-04-12T05:45:00.000Z'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'order-202403-001',
    userId: 'user-adept-wei',
    items: [
      { productId: 'prod-celestial-incense', quantity: 2, unitPrice: 38, currency: 'USD' },
      { productId: 'prod-lacquered-luopan', quantity: 1, unitPrice: 146, currency: 'USD' }
    ],
    status: 'completed',
    totalAmount: 222,
    currency: 'USD',
    createdAt: '2024-03-02T09:30:00.000Z',
    updatedAt: '2024-03-10T11:00:00.000Z',
    shippingAddress: {
      fullName: 'Wei Ling',
      line1: 'No. 12, Lotus Clinic Lane',
      city: 'Chengdu',
      region: 'Sichuan',
      country: 'China',
      postalCode: '610000'
    },
    notes: 'Leave at meditation hall side door.',
    timeline: [
      { status: 'pending', occurredAt: '2024-03-02T09:30:00.000Z', note: 'Awaiting payment confirmation.' },
      { status: 'processing', occurredAt: '2024-03-03T12:45:00.000Z', note: 'Items anointed and packed.' },
      { status: 'shipped', occurredAt: '2024-03-05T07:10:00.000Z', note: 'Dispatched via crane courier.' },
      { status: 'completed', occurredAt: '2024-03-10T11:00:00.000Z', note: 'Order delivered and blessed.' }
    ]
  },
  {
    id: 'order-202404-002',
    userId: 'user-seeker-mei',
    items: [
      { productId: 'prod-qi-stone-kit', quantity: 1, unitPrice: 44, currency: 'USD' },
      { productId: 'prod-wudang-robes', quantity: 1, unitPrice: 168, currency: 'USD' }
    ],
    status: 'processing',
    totalAmount: 212,
    currency: 'USD',
    createdAt: '2024-04-07T06:05:00.000Z',
    updatedAt: '2024-04-10T04:15:00.000Z',
    shippingAddress: {
      fullName: 'Mei Chen',
      line1: '28 Cloud Terrace Road',
      city: 'Hangzhou',
      region: 'Zhejiang',
      country: 'China',
      postalCode: '310000',
      phone: '+86 571 0000 1234'
    },
    timeline: [
      { status: 'pending', occurredAt: '2024-04-07T06:05:00.000Z' },
      { status: 'processing', occurredAt: '2024-04-08T09:40:00.000Z', note: 'Robes infused with mugwort smoke.' }
    ]
  },
  {
    id: 'order-202403-003',
    userId: 'user-adept-wei',
    items: [
      { productId: 'prod-qi-tonic-elixir', quantity: 3, unitPrice: 52, currency: 'USD' }
    ],
    status: 'completed',
    totalAmount: 156,
    currency: 'USD',
    createdAt: '2024-03-18T05:50:00.000Z',
    updatedAt: '2024-03-22T12:25:00.000Z',
    shippingAddress: {
      fullName: 'Wei Ling',
      line1: 'No. 12, Lotus Clinic Lane',
      city: 'Chengdu',
      region: 'Sichuan',
      country: 'China',
      postalCode: '610000'
    },
    timeline: [
      { status: 'pending', occurredAt: '2024-03-18T05:50:00.000Z' },
      { status: 'processing', occurredAt: '2024-03-19T08:10:00.000Z', note: 'Herbal tonic bottled.' },
      { status: 'shipped', occurredAt: '2024-03-20T14:00:00.000Z', note: 'Sent with cooled ice pack.' },
      { status: 'completed', occurredAt: '2024-03-22T12:25:00.000Z', note: 'Package received by clinic apprentice.' }
    ]
  }
];

export const mockStats: SiteStats = {
  totalRevenue: mockOrders.reduce((sum, order) => sum + order.totalAmount, 0),
  totalOrders: mockOrders.length,
  totalCustomers: new Set(mockOrders.map((order) => order.userId)).size,
  newsletterSubscribers: 1845,
  retreatBookings: 86,
  meditationSessionsTracked: 12840,
  trendingCategories: [
    { categoryId: 'cat-internal-alchemy', growthPercentage: 22 },
    { categoryId: 'cat-mountain-retreats', growthPercentage: 18 },
    { categoryId: 'cat-ritual', growthPercentage: 15 }
  ],
  topProducts: [
    { productId: 'prod-celestial-incense', revenue: 20520 },
    { productId: 'prod-qi-tonic-elixir', revenue: 16640 },
    { productId: 'prod-lacquered-luopan', revenue: 30660 }
  ],
  topArticles: [
    { articleId: 'art-celestial-pivots', reads: 4820 },
    { articleId: 'art-golden-elixir-tea', reads: 3680 },
    { articleId: 'art-wudang-iron-robes', reads: 3310 }
  ]
};

export const mockCredentials: MockCredential[] = [
  {
    email: 'abbot@wudangsanctuary.org',
    password: 'celestialpine',
    userId: 'user-master-li'
  },
  {
    email: 'wei.ling@example.com',
    password: 'lotuscloud',
    userId: 'user-adept-wei'
  },
  {
    email: 'mei.chen@example.com',
    password: 'riverstone',
    userId: 'user-seeker-mei'
  }
];

export const mockData = {
  categories: mockCategories,
  articles: mockArticles,
  products: mockProducts,
  users: mockUsers,
  orders: mockOrders,
  stats: mockStats,
  credentials: mockCredentials
};

export type MockDataset = {
  categories: Category[];
  articles: Article[];
  products: Product[];
  users: User[];
  orders: Order[];
  stats: SiteStats;
};

export const createInitialDataset = (): MockDataset => ({
  categories: mockCategories.map((item) => ({ ...item })),
  articles: mockArticles.map((item) => ({
    ...item,
    tags: [...item.tags],
    categoryIds: [...item.categoryIds],
    metrics: { ...item.metrics }
  })),
  products: mockProducts.map((item) => ({
    ...item,
    categoryIds: [...item.categoryIds],
    images: [...item.images],
    tags: [...item.tags],
    attributes: item.attributes.map((attr) => ({ ...attr })),
    metrics: { ...item.metrics }
  })),
  users: mockUsers.map((item) => ({
    ...item,
    preferences: { ...item.preferences, interests: [...item.preferences.interests] }
  })),
  orders: mockOrders.map((item) => ({
    ...item,
    items: item.items.map((orderItem) => ({ ...orderItem })),
    timeline: item.timeline.map((event) => ({ ...event }))
  })),
  stats: {
    ...mockStats,
    trendingCategories: mockStats.trendingCategories.map((entry) => ({ ...entry })),
    topProducts: mockStats.topProducts.map((entry) => ({ ...entry })),
    topArticles: mockStats.topArticles.map((entry) => ({ ...entry }))
  }
});
