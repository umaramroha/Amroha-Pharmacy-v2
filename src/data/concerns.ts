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
    hindiName: "पुरुषों की ताकत और वेलनेस",
    icon: "🦁",
    description:
      "Traditional Ayurvedic and Unani formulations for men's strength, energy and overall wellness, made with ingredients such as Ashwagandha, Shilajit and Safed Musli.",
    relatedCategories: ["male-problems"],
  },
  {
    slug: "sexual-health",
    name: "Sexual Health & Stamina",
    hindiName: "यौन स्वास्थ्य और ताकत",
    icon: "🛡️",
    description:
      "Traditional Ayurvedic and Unani remedies that support stamina, vigor and sexual wellness.",
    relatedCategories: ["male-problems"],
  },
  {
    slug: "male-fertility",
    name: "Male Fertility",
    hindiName: "स्पर्म काउंट और प्रजनन क्षमता",
    icon: "👶",
    description:
      "Ayurvedic and Unani formulations to support sperm count, motility and male fertility, with ingredients such as Salab Misri, Gokhru and Akarkara.",
    relatedCategories: ["male-problems"],
  },
  {
    slug: "womens-health",
    name: "Women's Health",
    hindiName: "महिलाओं का स्वास्थ्य",
    icon: "💗",
    description:
      "Traditional remedies for women's wellness, hormonal balance and reproductive health, made with ingredients such as Ashok, Lodhra and Shatavari.",
    relatedCategories: ["female-problems"],
  },
  {
    slug: "white-discharge",
    name: "White Discharge (Likoria)",
    hindiName: "सफेद पानी / ल्यूकोरिया",
    icon: "🩺",
    description:
      "Herbal support for problems related to white discharge (likoria). Regular check-ups and proper medical treatment are important.",
    relatedCategories: ["female-problems"],
  },
  {
    slug: "gastric-digestion",
    name: "Gastric, Digestion & Acidity",
    hindiName: "पेट और पाचन की समस्या",
    icon: "🫀",
    description:
      "Traditional remedies for gas, acidity, constipation and digestion problems, made with ingredients such as Triphala, Hingwashtak and Saunf.",
    relatedCategories: ["general-problems"],
  },
  {
    slug: "weight-loss",
    name: "Weight Loss & Obesity",
    hindiName: "वजन घटाना / मोटापा",
    icon: "📏",
    description:
      "Herbal support for healthy weight management, without crash diets. Best used along with regular exercise and a balanced diet.",
    relatedCategories: ["general-problems"],
  },
  {
    slug: "weight-gain",
    name: "Weight Gain & Weakness",
    hindiName: "वजन बढ़ाना / कमजोरी",
    icon: "💪",
    description:
      "Traditional tonics and supplements to support healthy weight gain, muscle building and general strength, with ingredients such as Ashwagandha and Musli.",
    relatedCategories: ["general-problems"],
  },
  {
    slug: "joints-pain",
    name: "Joints, Back & Arthritis Pain",
    hindiName: "जोड़ों और कमर का दर्द",
    icon: "🦵",
    description:
      "Ayurvedic and Unani oils and capsules for joint pain, back pain and arthritis, including Mahanarayan Oil, Shallaki and Majoon Suranjan.",
    relatedCategories: ["general-problems"],
  },
  {
    slug: "diabetes",
    name: "Diabetes & Blood Sugar",
    hindiName: "शुगर (मधुमेह)",
    icon: "🩸",
    description:
      "Traditional Ayurvedic and Unani ingredients such as Karela, Jamun and Gurmar, used to support healthy blood sugar levels. Use alongside, never instead of, the treatment prescribed by your doctor.",
    relatedCategories: ["general-problems"],
  },
];

export function getConcernBySlug(slug: string): Concern | undefined {
  return concerns.find((c) => c.slug === slug);
}
