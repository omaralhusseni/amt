export const tours = [
  {
    id: 1,
    name: "Siwa Oasis",
    subtitle: "Desert sanctuary beyond time",
    price: 150,
    interested: 13,
    duration: "7 days",
    gradient: "linear-gradient(135deg, #c8a97e 0%, #8b6914 100%)",
    accent: "#c8a97e",
    images: [
      "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400&q=80",
      "https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=400&q=80",
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=400&q=80",
      "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=400&q=80",
    ],
    availableDates: ["2026-07-10","2026-07-15","2026-07-20","2026-08-05","2026-09-01"],
    description:
      "Lose yourself in the shimmering salt lakes and ancient oracle temples of Egypt's most remote oasis. A journey beyond ordinary tourism into the soul of the Sahara.",
  },
  {
    id: 2,
    name: "Luxor & the Valley of Kings",
    subtitle: "Walk among pharaohs",
    price: 220,
    interested: 31,
    duration: "5 days",
    gradient: "linear-gradient(135deg, #d4a857 0%, #7a4f1d 100%)",
    accent: "#d4a857",
    images: [
      "https://images.unsplash.com/photo-1562979314-bee7453e911c?w=400&q=80",
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&q=80",
      "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400&q=80",
      "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=400&q=80",
    ],
    availableDates: ["2026-07-12","2026-07-18","2026-08-10","2026-09-15"],
    description:
      "Descend into the golden chambers of ancient rulers. Witness the grandeur of Karnak at sunrise, sail the Nile at dusk, and feel millennia collapse into a single breath.",
  },
  {
    id: 3,
    name: "Alexandria Unveiled",
    subtitle: "The Mediterranean queen",
    price: 180,
    interested: 8,
    duration: "4 days",
    gradient: "linear-gradient(135deg, #7ecac8 0%, #1d5c7a 100%)",
    accent: "#7ecac8",
    images: [
      "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=400&q=80",
      "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=400&q=80",
      "https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&q=80",
      "https://images.unsplash.com/photo-1517911041942-77b6e2353c4d?w=400&q=80",
    ],
    availableDates: ["2026-07-05","2026-07-22","2026-08-02","2026-09-10"],
    description:
      "Trace the ghost of the great library, linger in art deco cafés, and let the sea breeze carry whispers of Cleopatra's court through streets that remember everything.",
  },
  {
    id: 4,
    name: "Aswan & Nubia",
    subtitle: "Where Africa breathes",
    price: 195,
    interested: 19,
    duration: "6 days",
    gradient: "linear-gradient(135deg, #e07b5a 0%, #8b2c1a 100%)",
    accent: "#e07b5a",
    images: [
      "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400&q=80",
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=400&q=80",
      "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=400&q=80",
      "https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=400&q=80",
    ],
    availableDates: ["2026-07-08","2026-07-25","2026-08-15","2026-09-05"],
    description:
      "Sail a felucca past granite boulders at sunset. Visit Nubian villages painted in indigo and ochre. Hear music that predates recorded history rising from the riverbanks.",
  },
];

export function getCardStyle(index, currentIndex, total) {
  const pos = (index - currentIndex + total) % total;
  if (pos === 0) {
    return {
      transform: "translateY(0px) scale(1) rotateX(0deg)",
      zIndex: total,
      opacity: 1,
      boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
      pointerEvents: "auto",
    };
  }
  if (pos === 1) {
    return {
      transform: "translateY(14px) scale(0.97) rotateX(1.5deg)",
      zIndex: total - 1,
      opacity: 0.85,
      boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
      pointerEvents: "none",
    };
  }
  if (pos === 2) {
    return {
      transform: "translateY(26px) scale(0.94) rotateX(3deg)",
      zIndex: total - 2,
      opacity: 0.6,
      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      pointerEvents: "none",
    };
  }
  return {
    transform: "translateY(36px) scale(0.91) rotateX(4deg)",
    zIndex: 0,
    opacity: 0,
    pointerEvents: "none",
  };
}
