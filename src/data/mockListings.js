const now = Date.now();
const hr = 3600000;

export const mockListings = [
  {
    id: '1',
    title: 'Sunset Boat Tour',
    location: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    shortDescription: 'Enjoy a breathtaking sunset while sailing along Bali\'s stunning coastline with local guides.',
    fullDescription: 'Set sail just before the golden hour and experience Bali\'s famous sunsets from the water. Our traditional jukung boat takes you along the coastline, past hidden sea temples and pristine beaches. Complimentary tropical drinks and light snacks are served on board. The tour lasts approximately 2 hours and departs from Sanur Beach.',
    price: 45,
    creatorName: 'Made Sugiarta',
    creatorEmail: 'made@example.com',
    createdAt: now - 2 * hr,
  },
  {
    id: '2',
    title: 'Colosseum Night Walk',
    location: 'Rome, Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    shortDescription: 'Discover ancient Rome under the stars with an expert historian on this exclusive evening tour.',
    fullDescription: 'Step back in time on our intimate small-group evening tour of the Colosseum and Roman Forum. After the day crowds have gone, you\'ll explore these iconic sites bathed in atmospheric lighting. Our expert historian guide brings the stories of gladiators, emperors, and citizens vividly to life. Skip-the-line access included. Groups are capped at 12 people for an immersive experience.',
    price: 89,
    creatorName: 'Sofia Bianchi',
    creatorEmail: 'sofia@example.com',
    createdAt: now - 5 * hr,
  },
  {
    id: '3',
    title: 'Northern Lights Kayaking',
    location: 'Tromsø, Norway',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
    shortDescription: 'Paddle through Arctic fjords under the dancing aurora borealis — an unforgettable adventure.',
    fullDescription: 'Experience the magic of the Northern Lights from a completely unique perspective — on the water. Our guided kayaking tour takes you through the serene Arctic fjords of Tromsø while the aurora borealis dances overhead. All equipment and thermal dry-suits are provided. Hot drinks and traditional Norwegian snacks are served at the midpoint. This tour runs October through March and is suitable for all fitness levels.',
    price: 135,
    creatorName: 'Erik Haugen',
    creatorEmail: 'erik@example.com',
    createdAt: now - 11 * hr,
  },
  {
    id: '4',
    title: 'Medina Food & Spice Walk',
    location: 'Marrakech, Morocco',
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8e78b83?w=800&q=80',
    shortDescription: 'Taste your way through the vibrant souks and hidden street food stalls of the ancient medina.',
    fullDescription: 'Join a local food enthusiast for a 3-hour walking tour through the labyrinthine streets of Marrakech\'s UNESCO-listed medina. You\'ll visit spice merchants, taste traditional snacks like msemen and merguez, sip fresh-squeezed orange juice in Djemaa el-Fna square, and learn the stories behind Moroccan culinary traditions. Small groups only (max 8 people). Vegetarian options available — please mention at booking.',
    price: 38,
    creatorName: 'Fatima Zahra',
    creatorEmail: 'fatima@example.com',
    createdAt: now - 18 * hr,
  },
  {
    id: '5',
    title: 'Kyoto Tea Ceremony & Garden',
    location: 'Kyoto, Japan',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    shortDescription: 'Learn the art of the traditional Japanese tea ceremony in a 300-year-old machiya townhouse.',
    fullDescription: 'Immerse yourself in one of Japan\'s most refined cultural traditions. Hosted in a beautifully preserved machiya townhouse, our certified tea master will guide you through the ritual of chado (the Way of Tea). You\'ll also enjoy a private stroll through the adjacent moss garden. Kimono rental is available at an additional cost. The ceremony is conducted in Japanese with English interpretation. Suitable for all ages.',
    price: 62,
    creatorName: 'Yuki Tanaka',
    creatorEmail: 'yuki@example.com',
    createdAt: now - 26 * hr,
  },
  {
    id: '6',
    title: 'Amazon Canopy Hike',
    location: 'Manaus, Brazil',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    shortDescription: 'Walk high above the Amazon rainforest floor on suspension bridges teeming with wildlife.',
    fullDescription: 'Get above the jungle canopy and see the Amazon from a whole new perspective. Our certified naturalist guides lead you along a network of suspension bridges 30 metres above the forest floor, where you\'ll spot toucans, sloths, monkeys, and countless exotic plants. The experience includes a boat transfer from Manaus, insect repellent, waterproof gear, and a traditional riverside lunch. Duration: full day (8 hours).',
    price: 95,
    creatorName: 'Carlos Mendonça',
    creatorEmail: 'carlos@example.com',
    createdAt: now - 36 * hr,
  },
];

export function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}
