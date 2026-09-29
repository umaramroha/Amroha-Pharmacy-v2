export type Concern = {
  slug: string;
  name: string;
  hindiName: string;
  icon: string;
  description: string;
  relatedCategories: string[];
};

export const concerns: Concern[] = [
  {
    slug: "mens-vitality",
    name: "Men's Vitality & Wellness",
    hindiName: "Mardana Taqat & Wellness",
    icon: "🦁",
    description:
      "Mardana taqat, energy aur overall wellness ke liye authentic Ayurvedic aur Unani formulations. Ashwagandha, Shilajit aur Safed Musli jaise traditional ingredients se bani medicines.",
    relatedCategories: ["male-problems"],
  },
  {
    slug: "sexual-health",
    name: "Sexual Health & Stamina",
    hindiName: "Sexual Health & Vigor",
    icon: "🛡️",
    description:
      "Stamina, vigor aur sexual health ko naturally improve karne ke liye traditional remedies. Performance aur confidence dono improve karne me madadgar.",
    relatedCategories: ["male-problems"],
  },
  {
    slug: "male-fertility",
    name: "Male Fertility",
    hindiName: "Sperm Count & Fertility",
    icon: "👶",
    description:
      "Sperm count, motility aur male fertility ko support karne ke liye Ayurvedic aur Unani formulations. Salab Misri, Gokhru aur Akarkara jaise ingredients.",
    relatedCategories: ["male-problems"],
  },
  {
    slug: "womens-health",
    name: "Women's Health",
    hindiName: "Khawateen Ki Sehat",
    icon: "💗",
    description:
      "Women's wellness, hormonal balance aur reproductive health ke liye safe aur natural remedies. Ashok, Lodhra aur Shatavari jaise traditional ingredients.",
    relatedCategories: ["female-problems"],
  },
  {
    slug: "white-discharge",
    name: "White Discharge (Likoria)",
    hindiName: "Safed Pani / Likoria",
    icon: "🩺",
    description:
      "Likoria aur white discharge se related problems ke liye safe aur effective herbal solutions. Regular check-up aur proper treatment zaroori hai.",
    relatedCategories: ["female-problems"],
  },
  {
    slug: "gastric-digestion",
    name: "Gastric, Digestion & Acidity",
    hindiName: "Pet Ke Amraz & Hazma",
    icon: "🫀",
    description:
      "Gas, acidity, constipation aur digestion problems ka natural aur permanent samadhan. Triphala, Hingwashtak aur Saunf jaise traditional remedies.",
    relatedCategories: ["general-problems"],
  },
  {
    slug: "weight-loss",
    name: "Weight Loss & Obesity",
    hindiName: "Wazan Ghatana / Motapa",
    icon: "📏",
    description:
      "Healthy weight management ke liye herbal aur natural support — bina crash diet ke. Regular exercise aur balanced diet ke saath.",
    relatedCategories: ["general-problems"],
  },
  {
    slug: "weight-gain",
    name: "Weight Gain & Weakness",
    hindiName: "Wazan Badhana / Weakness",
    icon: "💪",
    description:
      "Weight gain, muscle building aur weakness door karne ke liye traditional tonics aur supplements. Ashwagandha aur Musli jaise ingredients.",
    relatedCategories: ["general-problems"],
  },
  {
    slug: "joints-pain",
    name: "Joints, Back & Arthritis Pain",
    hindiName: "Jodon Aur Kamar Ka Dard",
    icon: "🦵",
    description:
      "Joint pain, back pain aur arthritis ke liye Ayurvedic aur Unani oils aur capsules. Mahanarayan oil, Shallaki aur Majoon Suranjan.",
    relatedCategories: ["general-problems"],
  },
  {
    slug: "diabetes",
    name: "Diabetes & Blood Sugar",
    hindiName: "Sugar Control",
    icon: "🩸",
    description:
      "Blood sugar management ke liye traditional Ayurvedic aur Unani ingredients. Karela, Jamun aur Gurmar jaise natural remedies.",
    relatedCategories: ["general-problems"],
  },
];

export function getConcernBySlug(slug: string): Concern | undefined {
  return concerns.find((c) => c.slug === slug);
}
