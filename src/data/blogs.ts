export type Blog = {
  slug: string;
  category: string;
  readTime: number;
  image: string;
  date: string;
  author: string;
  relatedProducts: string[];
  hindi: { title: string; content: string };
  english: { title: string; content: string };
};

export const blogCategories = [
  "All",
  "Men's Health",
  "Women's Health",
  "General Healthcare",
  "Personal Care",
  "Hair & Scalp Care",
  "Chronic Care",
  "Skin & Hair Care",
  "Weight Management",
];

export const blogs: Blog[] = [
  {
    slug: "mardana-kamzori-stamina-reasons",
    category: "Men's Health",
    readTime: 5,
    image: "https://picsum.photos/seed/mardana-kamzori/800/500",
    date: "25 Sep 2026",
    author: "Amroha Pharmacy Health Team",
    relatedProducts: ["prod_3", "prod_7"],
    hindi: {
      title: "Mardana Kamzori aur Stamina Kam Hone ke Common Reasons",
      content: `Thakan, low energy, sexual confidence mein kami ya performance mein problem — ye concerns kaafi common hain. Lekin har baar iska reason sirf "body weakness" nahi hota.

STAMINA KAM HONE KI WAJAH KYA HO SAKTI HAI?

Poor sleep, stress, smoking, alcohol, lack of exercise, unhealthy diet aur kuch medical conditions energy aur sexual health ko affect kar sakti hain.

Agar erection baar-baar maintain nahi ho raha, sexual desire achanak kam ho gayi hai, ya problem long time se chal rahi hai, to doctor se baat karna useful hota hai.

HERBAL INGREDIENTS KA KYA ROLE HAI?

Ashwagandha, Shilajit aur Safed Musli jaise ingredients traditional systems mein use hote aaye hain. Kuch logon ko general energy ya wellbeing mein support mil sakta hai, lekin results person-to-person vary karte hain.

Kisi herbal product ko guaranteed cure ya completely side-effect-free solution nahi samajhna chahiye.

DAILY HABITS JO HELP KAR SAKTI HAIN

7-9 ghante ki sleep, regular exercise, balanced diet, healthy body weight aur stress management stamina aur overall health ke liye important hain.

Amroha Pharmacy Health Tip: Agar problem persistent hai, self-medication ke bajaye qualified healthcare professional se advice lena better hai.`,
    },
    english: {
      title: "Common Reasons for Low Stamina and Male Weakness",
      content: `Fatigue, low energy, reduced sexual confidence, or performance issues — these concerns are quite common. But the reason isn't always just "body weakness."

WHAT CAN CAUSE LOW STAMINA?

Poor sleep, stress, smoking, alcohol, lack of exercise, unhealthy diet, and certain medical conditions can affect energy and sexual health.

If erections are not maintained repeatedly, sexual desire has suddenly decreased, or the problem has been ongoing for a long time, it's useful to talk to a doctor.

WHAT IS THE ROLE OF HERBAL INGREDIENTS?

Ingredients like Ashwagandha, Shilajit, and Safed Musli have been used in traditional systems. Some people may get support in general energy or wellbeing, but results vary from person to person.

No herbal product should be considered a guaranteed cure or a completely side-effect-free solution.

DAILY HABITS THAT CAN HELP

7-9 hours of sleep, regular exercise, a balanced diet, healthy body weight, and stress management are important for stamina and overall health.

Amroha Pharmacy Health Tip: If the problem is persistent, it's better to seek advice from a qualified healthcare professional instead of self-medicating.`,
    },
  },
  {
    slug: "likoria-white-discharge-guide",
    category: "Women's Health",
    readTime: 5,
    image: "https://picsum.photos/seed/likoria/800/500",
    date: "22 Sep 2026",
    author: "Amroha Pharmacy Wellness Team",
    relatedProducts: ["prod_4", "prod_8"],
    hindi: {
      title: "Likoria / White Discharge: Kab Normal Hai, Kab Attention Chahiye?",
      content: `White vaginal discharge har baar disease ka sign nahi hota. Menstrual cycle ke different phases mein normal discharge naturally change ho sakta hai.

KAB CONCERN KARNA CHAHIYE?

Agar discharge ke saath foul smell, itching, burning, pelvic pain ya unusual colour ho, to medical attention ki zarurat ho sakti hai.

Har white discharge ko weakness ya hormonal imbalance ka result samajhna sahi nahi hai.

HYGIENE KA SIMPLE RULE

Clean cotton underwear pehnein, area ko dry rakhein aur strong soaps, perfumes ya unnecessary intimate products se bachhein, kyunki ye irritation badha sakte hain.

Ashok, Lodhra aur Shatavari jaise traditional ingredients kuch herbal preparations mein use hote hain, lekin suspected infection ka proper diagnosis aur treatment healthcare professional se karwana important hai.

Persistent symptoms, severe pain, fever ya pregnancy ke dauran unusual discharge ko ignore na karein.

Amroha Pharmacy Wellness Tip: Apni health se related sensitive problems ko sharm ki wajah se ignore na karein.`,
    },
    english: {
      title: "Leucorrhea / White Discharge: When Is It Normal, When to Pay Attention?",
      content: `White vaginal discharge is not always a sign of disease. Normal discharge can change naturally during different phases of the menstrual cycle.

WHEN SHOULD YOU BE CONCERNED?

If the discharge is accompanied by foul smell, itching, burning, pelvic pain, or unusual color, medical attention may be needed.

It is not correct to assume every white discharge is a result of weakness or hormonal imbalance.

SIMPLE HYGIENE RULES

Wear clean cotton underwear, keep the area dry, and avoid strong soaps, perfumes, or unnecessary intimate products, as these can increase irritation.

Traditional ingredients like Ashok, Lodhra, and Shatavari are used in some herbal preparations, but proper diagnosis and treatment of a suspected infection should be done by a healthcare professional.

Do not ignore persistent symptoms, severe pain, fever, or unusual discharge during pregnancy.

Amroha Pharmacy Wellness Tip: Do not ignore sensitive health problems out of shame.`,
    },
  },
  {
    slug: "gas-acidity-constipation-relief",
    category: "General Healthcare",
    readTime: 4,
    image: "https://picsum.photos/seed/gas-acidity/800/500",
    date: "20 Sep 2026",
    author: "Amroha Pharmacy Health Team",
    relatedProducts: ["prod_2", "prod_5"],
    hindi: {
      title: "Gas, Acidity aur Constipation: Pet Ko Better Feel Karane Ke Simple Ways",
      content: `Gas, bloating, acidity aur constipation bahut common problems hain. Irregular meals, low-fiber diet, dehydration, stress, overeating aur lack of movement in problems ko badha sakte hain.

DIGESTION BETTER KAISE RAKHEIN?

Regular meals lein, food ko properly chew karein aur enough water piyen. Fruits, vegetables, whole grains aur fiber-rich foods digestion ko support karte hain.

Ajwain, saunf aur isabgol jaise traditional options kuch log digestive comfort ke liye use karte hain. Isabgol fiber provide karta hai aur ise sufficient water ke saath lena important hai.

Agar acidity frequently hoti hai, severe pain, vomiting, unexplained weight loss ya black stools ho, to sirf home remedies par depend na karein.

Amroha Pharmacy Health Tip: Healthy digestion ke liye balanced food, enough water, regular movement aur proper sleep ko routine ka part banayein.`,
    },
    english: {
      title: "Gas, Acidity and Constipation: Simple Ways to Make Your Stomach Feel Better",
      content: `Gas, bloating, acidity, and constipation are very common problems. Irregular meals, low-fiber diet, dehydration, stress, overeating, and lack of movement can worsen these issues.

HOW TO KEEP DIGESTION BETTER?

Take regular meals, chew food properly, and drink enough water. Fruits, vegetables, whole grains, and fiber-rich foods support digestion.

Traditional options like Ajwain, Saunf, and Isabgol are used by some people for digestive comfort. Isabgol provides fiber and should be taken with sufficient water.

If acidity occurs frequently, or you experience severe pain, vomiting, unexplained weight loss, or black stools, do not depend only on home remedies.

Amroha Pharmacy Health Tip: For healthy digestion, make balanced food, enough water, regular movement, and proper sleep part of your routine.`,
    },
  },
  {
    slug: "height-after-18-truth",
    category: "Personal Care",
    readTime: 5,
    image: "https://picsum.photos/seed/height-18/800/500",
    date: "18 Sep 2026",
    author: "Amroha Pharmacy Wellness Team",
    relatedProducts: [],
    hindi: {
      title: "Kya 18 Saal Ke Baad Height Badh Sakti Hai?",
      content: `Height ko lekar bahut saare myths hain. Adult height mainly genetics aur growing years ke nutrition aur overall health par depend karti hai.

Jab growth plates close ho jaati hain, naturally bones ki length badhkar height increase karna generally possible nahi hota.

POSTURE IMPROVE HO SAKTA HAI

Stretching, exercise aur better posture se body zyada straight dikh sakti hai. Isse visual height mein difference nazar aa sakta hai, lekin ye actual bone growth nahi hoti.

Calcium, Vitamin D, protein aur balanced diet bone health ke liye important hain.

Ashwagandha, Shatavari ya kisi supplement ko adult height badhane ka guaranteed solution samajhna scientifically correct nahi hai.

Amroha Pharmacy Wellness Tip: Children ya teenagers ki growth expected se slow lag rahi ho to pediatrician ya endocrinologist se assessment karwana useful ho sakta hai.`,
    },
    english: {
      title: "Can Height Increase After 18?",
      content: `There are many myths about height. Adult height mainly depends on genetics and nutrition and overall health during growing years.

Once growth plates close, naturally increasing bone length to increase height is generally not possible.

POSTURE CAN IMPROVE

Stretching, exercise, and better posture can make the body appear straighter. This may show a difference in visual height, but it is not actual bone growth.

Calcium, Vitamin D, protein, and a balanced diet are important for bone health.

Considering Ashwagandha, Shatavari, or any supplement as a guaranteed solution to increase adult height is not scientifically correct.

Amroha Pharmacy Wellness Tip: If a child's or teenager's growth seems slower than expected, getting an assessment by a pediatrician or endocrinologist can be useful.`,
    },
  },
  {
    slug: "hair-fall-scalp-care-tips",
    category: "Hair & Scalp Care",
    readTime: 4,
    image: "https://picsum.photos/seed/hair-fall/800/500",
    date: "15 Sep 2026",
    author: "Amroha Pharmacy Wellness Team",
    relatedProducts: ["prod_6"],
    hindi: {
      title: "Hair Fall aur Scalp Problems: Healthy Hair Ke Practical Tips",
      content: `Hair fall ke peeche ek hi reason nahi hota. Genetics, stress, nutritional deficiencies, dandruff, thyroid problems, hormonal changes, illness aur kuch medicines bhi role play kar sakte hain.

HERBAL INGREDIENTS KA KYA ROLE HAI?

Amla, Bhringraj, Kalonji aur Neem traditional hair-care products mein commonly use hote hain. Ye regular hair-care routine ka part ho sakte hain, lekin severe hair loss ko permanently stop karne ki guarantee nahi di ja sakti.

Scalp ko gently clean rakhein, excessive scratching avoid karein aur harsh products ka unnecessary use na karein.

Agar hair fall suddenly bahut badh gaya hai, bald patches aa rahe hain, ya scalp mein redness aur severe itching hai, to dermatologist se consult karna better hai.

Amroha Pharmacy Wellness Tip: Healthy hair ke liye scalp care ke saath nutrition, sleep aur stress management bhi important hain.`,
    },
    english: {
      title: "Hair Fall and Scalp Problems: Practical Tips for Healthy Hair",
      content: `There isn't just one reason behind hair fall. Genetics, stress, nutritional deficiencies, dandruff, thyroid problems, hormonal changes, illness, and certain medicines can also play a role.

WHAT IS THE ROLE OF HERBAL INGREDIENTS?

Amla, Bhringraj, Kalonji, and Neem are commonly used in traditional hair-care products. They can be part of a regular hair-care routine, but no guarantee can be given to permanently stop severe hair loss.

Keep the scalp gently clean, avoid excessive scratching, and do not unnecessarily use harsh products.

If hair fall has suddenly increased a lot, bald patches are appearing, or there is redness and severe itching on the scalp, it is better to consult a dermatologist.

Amroha Pharmacy Wellness Tip: For healthy hair, along with scalp care, nutrition, sleep, and stress management are also important.`,
    },
  },
  {
    slug: "diabetes-blood-sugar-natural-steps",
    category: "Chronic Care",
    readTime: 6,
    image: "https://picsum.photos/seed/diabetes/800/500",
    date: "12 Sep 2026",
    author: "Amroha Pharmacy Health Team",
    relatedProducts: [],
    hindi: {
      title: "Diabetes / Blood Sugar Ko Manage Karne Ke Safe Natural Steps",
      content: `Diabetes ko lightly nahi lena chahiye. Long-term high blood sugar eyes, kidneys, nerves, heart aur blood vessels ko affect kar sakta hai.

Karela, Jamun seed aur Gurmar jaise traditional ingredients glucose management ke context mein use hote hain. Lekin ye prescribed diabetes medicines ka automatic replacement nahi hain.

DAILY ROUTINE MEIN KYA KAREIN?

Regular walking ya exercise, portion control, balanced meals, adequate sleep aur regular blood sugar monitoring important hain.

Agar aap diabetes ki medicine le rahe hain, to koi herbal supplement start ya stop karne se pehle doctor se discuss karein.

Amroha Pharmacy Health Tip: Natural support useful ho sakta hai, lekin diabetes management ka base proper medical care aur healthy lifestyle hai.`,
    },
    english: {
      title: "Safe Natural Steps to Manage Diabetes / Blood Sugar",
      content: `Diabetes should not be taken lightly. Long-term high blood sugar can affect the eyes, kidneys, nerves, heart, and blood vessels.

Traditional ingredients like Karela, Jamun seed, and Gurmar are used in the context of glucose management. But they are not an automatic replacement for prescribed diabetes medicines.

WHAT TO DO IN DAILY ROUTINE?

Regular walking or exercise, portion control, balanced meals, adequate sleep, and regular blood sugar monitoring are important.

If you are taking diabetes medicine, discuss with your doctor before starting or stopping any herbal supplement.

Amroha Pharmacy Health Tip: Natural support can be useful, but the base of diabetes management is proper medical care and a healthy lifestyle.`,
    },
  },
  {
    slug: "gathiya-joint-pain-guide",
    category: "General Healthcare",
    readTime: 5,
    image: "https://picsum.photos/seed/gathiya/800/500",
    date: "10 Sep 2026",
    author: "Amroha Pharmacy Health Team",
    relatedProducts: ["prod_6"],
    hindi: {
      title: "Gathiya aur Joint Pain: Dard Ko Samajhna Zaroori Hai",
      content: `Knee pain ya joint stiffness ka reason har person mein same nahi hota. Arthritis, old injury, overuse, gout ya doosri conditions iske peeche ho sakti hain.

Gout mein uric acid crystals joint mein inflammation, swelling aur pain create kar sakte hain.

TRADITIONAL REMEDIES KA KYA ROLE HAI?

Guggul aur kuch herbal oils traditional joint-care products mein use hote hain. Lekin cartilage repair ya permanent cure ka claim evidence ke bina nahi karna chahiye.

Suranjan ko casual home remedy ki tarah use nahi karna chahiye; appropriate professional guidance zaroori hai.

Light movement, healthy weight, physiotherapy aur doctor-advised treatment joint health ke liye important ho sakte hain.

Agar joint suddenly red, hot aur extremely painful ho, to medical attention lena zaroori hai.

Amroha Pharmacy Health Tip: Joint pain ka actual cause samajhna sahi treatment choose karne ka pehla step hai.`,
    },
    english: {
      title: "Joint Pain and Stiffness: Understanding the Pain is Important",
      content: `The reason for knee pain or joint stiffness is not the same in every person. Arthritis, old injury, overuse, gout, or other conditions can be behind it.

In gout, uric acid crystals can create inflammation, swelling, and pain in the joint.

WHAT IS THE ROLE OF TRADITIONAL REMEDIES?

Guggul and some herbal oils are used in traditional joint-care products. But claims of cartilage repair or permanent cure should not be made without evidence.

Suranjan should not be used as a casual home remedy; appropriate professional guidance is necessary.

Light movement, healthy weight, physiotherapy, and doctor-advised treatment can be important for joint health.

If a joint suddenly becomes red, hot, and extremely painful, medical attention is necessary.

Amroha Pharmacy Health Tip: Understanding the actual cause of joint pain is the first step in choosing the right treatment.`,
    },
  },
  {
    slug: "sperm-count-male-fertility",
    category: "Men's Health",
    readTime: 6,
    image: "https://picsum.photos/seed/sperm-fertility/800/500",
    date: "8 Sep 2026",
    author: "Amroha Pharmacy Health Team",
    relatedProducts: ["prod_3", "prod_7"],
    hindi: {
      title: "Sperm Count aur Male Fertility: Natural Support Ko Kaise Samjhein?",
      content: `Male fertility sirf sperm count se decide nahi hoti. Sperm count ke saath motility, morphology, hormones, lifestyle aur overall health bhi important hain.

Stress, smoking, obesity, poor sleep, excessive heat exposure aur kuch medical conditions reproductive health ko affect kar sakti hain.

HERBAL INGREDIENTS KA ROLE

Salab Misri, Gokhru aur Akarkara jaise traditional ingredients kuch herbal preparations mein use hote hain. Lekin sperm count ya testosterone ko guaranteed increase karne ka claim nahi karna chahiye.

Healthy weight, regular exercise, good sleep, balanced diet aur smoking avoid karna reproductive health ke liye useful steps hain.

Agar 12 months tak regular unprotected intercourse ke baad pregnancy nahi ho rahi, to couple ko fertility evaluation consider karna chahiye.

Amroha Pharmacy Health Tip: Fertility concern mein correct diagnosis ke bina sirf supplements par depend karna useful nahi ho sakta.`,
    },
    english: {
      title: "Sperm Count and Male Fertility: How to Understand Natural Support?",
      content: `Male fertility is not decided by sperm count alone. Along with sperm count, motility, morphology, hormones, lifestyle, and overall health are also important.

Stress, smoking, obesity, poor sleep, excessive heat exposure, and certain medical conditions can affect reproductive health.

ROLE OF HERBAL INGREDIENTS

Traditional ingredients like Salab Misri, Gokhru, and Akarkara are used in some herbal preparations. But claims of guaranteed increase in sperm count or testosterone should not be made.

Healthy weight, regular exercise, good sleep, balanced diet, and avoiding smoking are useful steps for reproductive health.

If pregnancy does not occur after 12 months of regular unprotected intercourse, the couple should consider a fertility evaluation.

Amroha Pharmacy Health Tip: In fertility concerns, relying only on supplements without correct diagnosis may not be useful.`,
    },
  },
  {
    slug: "pimples-dark-spots-clear-skin",
    category: "Skin & Hair Care",
    readTime: 4,
    image: "https://picsum.photos/seed/pimples/800/500",
    date: "5 Sep 2026",
    author: "Amroha Pharmacy Wellness Team",
    relatedProducts: [],
    hindi: {
      title: "Pimples aur Dark Spots: Clear Skin Ke Liye Smart Approach",
      content: `Pimples aur dark spots common skin problems hain. Acne hormones, excess oil, clogged pores, genetics aur inflammation se connected ho sakta hai.

"Blood impurity" ko acne ka universal root cause maanna medically accurate nahi hai.

SIMPLE SKINCARE ROUTINE

Gentle cleanser use karein, face ko baar-baar touch na karein aur pimples ko squeeze na karein. Daytime mein sunscreen dark spots ko worsening se bachane mein helpful hota hai.

Neem, turmeric, saffron aur herbal products traditional skincare mein popular hain, lekin har natural ingredient har skin type ke liye suitable nahi hota.

Agar acne painful hai, scars ban rahe hain ya problem continuously worsen ho rahi hai, dermatologist se consult karna better hai.

Amroha Pharmacy Wellness Tip: Consistent skincare, good sleep, balanced nutrition aur sun protection healthy skin ke important parts hain.`,
    },
    english: {
      title: "Pimples and Dark Spots: Smart Approach for Clear Skin",
      content: `Pimples and dark spots are common skin problems. Acne can be connected to hormones, excess oil, clogged pores, genetics, and inflammation.

Considering "blood impurity" as the universal root cause of acne is not medically accurate.

SIMPLE SKINCARE ROUTINE

Use a gentle cleanser, don't touch your face repeatedly, and don't squeeze pimples. Sunscreen during the day helps prevent dark spots from worsening.

Neem, turmeric, saffron, and herbal products are popular in traditional skincare, but not every natural ingredient is suitable for every skin type.

If acne is painful, scars are forming, or the problem is continuously worsening, it is better to consult a dermatologist.

Amroha Pharmacy Wellness Tip: Consistent skincare, good sleep, balanced nutrition, and sun protection are important parts of healthy skin.`,
    },
  },
  {
    slug: "belly-fat-weight-loss-sustainable",
    category: "Weight Management",
    readTime: 5,
    image: "https://picsum.photos/seed/belly-fat/800/500",
    date: "2 Sep 2026",
    author: "Amroha Pharmacy Wellness Team",
    relatedProducts: [],
    hindi: {
      title: "Belly Fat aur Weight Loss: Sustainable Formula Kya Hai?",
      content: `Belly fat sirf appearance ka issue nahi hai. Excess abdominal fat metabolic health ko bhi affect kar sakta hai.

Crash diets aur extreme food restriction long-term solution nahi hote.

WEIGHT LOSS KA PRACTICAL APPROACH

Healthy calorie deficit, enough protein, regular walking, strength training aur good sleep weight management ka strong foundation hain.

Green tea ka effect modest ho sakta hai, jabki Garcinia jaise supplements ke benefits limited aur inconsistent evidence ke saath milte hain.

Honey-water ya koi single "detox drink" belly fat ko directly melt nahi karta.

Amroha Pharmacy Wellness Tip: Sustainable weight management ke liye shortcuts ke bajaye consistency, balanced nutrition aur regular physical activity par focus karein.`,
    },
    english: {
      title: "Belly Fat and Weight Loss: What is the Sustainable Formula?",
      content: `Belly fat is not just an appearance issue. Excess abdominal fat can also affect metabolic health.

Crash diets and extreme food restriction are not long-term solutions.

PRACTICAL APPROACH TO WEIGHT LOSS

A healthy calorie deficit, enough protein, regular walking, strength training, and good sleep are a strong foundation for weight management.

Green tea's effect can be modest, while supplements like Garcinia come with limited and inconsistent evidence.

Honey-water or any single "detox drink" does not directly melt belly fat.

Amroha Pharmacy Wellness Tip: For sustainable weight management, focus on consistency, balanced nutrition, and regular physical activity instead of shortcuts.`,
    },
  },
];

export function getBlogBySlug(slug: string): Blog | undefined {
  return blogs.find((b) => b.slug === slug);
}
