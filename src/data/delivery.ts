// ==============================
// DELIVERY ZONES
// ==============================

export type DeliveryZone = {
  name: string;
  prefixes: string[];
  pincodes: string[];
  deliveryDays: [number, number];
  deliveryFee: number;
  freeAbove: number;
  discount: number;
  offerMessage?: string;
};

export const deliveryZones: DeliveryZone[] = [
  // ZONE 1: Amroha Local
  {
    name: "Amroha Local",
    prefixes: ["2442"],
    pincodes: ["244221", "244222", "244223", "244231", "244235", "244241"],
    deliveryDays: [1, 2],
    deliveryFee: 0,
    freeAbove: 0,
    discount: 5,
    offerMessage: "🎉 Amroha me FREE Delivery + 5% OFF!",
  },
  // ZONE 2: Nearby — Delhi NCR, West UP, Delhi-Lucknow Highway Belt
  {
    name: "Nearby / Priority Zone",
    prefixes: [
      "110", // Delhi
      "201", // Noida, Greater Noida, Ghaziabad
      "203", // Bulandshahr
      "202", // Aligarh
      "204", // Hathras
      "205", // Firozabad
      "207", // Etah
      "244", // Moradabad, Rampur, Sambhal, Bijnor, Chandausi (Amroha already in Zone 1)
      "243", // Bareilly, Pilibhit
      "242", // Shahjahanpur
      "245", // Hapur, Garhmukteshwar
      "250", // Meerut, Baghpat, Muzaffarnagar, Saharanpur
      "251", // Muzaffarnagar
      "247", // Saharanpur
      "226", // Lucknow
      "121", // Faridabad (Haryana)
      "122", // Gurgaon (Haryana)
      "123", // Rewari (Haryana)
    ],
    pincodes: [],
    deliveryDays: [2, 4],
    deliveryFee: 50,
    freeAbove: 500,
    discount: 0,
    offerMessage: "",
  },
  // ZONE 3: Rest of India
  {
    name: "Standard Delivery",
    prefixes: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    pincodes: [],
    deliveryDays: [4, 7],
    deliveryFee: 80,
    freeAbove: 800,
    discount: 0,
    offerMessage: "",
  },
];

// ==============================
// COD BLACKLIST
// ==============================

export const codBlacklistPincodes: string[] = [
  // Haryana, Rajasthan, UP Border - High Fraud
  "122107", "122108", "122104", "122105", "321204", "281403",
  // Remote Islands
  "744101", "744202", "744301", "744304", "682551", "682553", "682554", "682555",
  // Extreme High-Altitude (Ladakh & J&K)
  "194101", "194102", "194301", "194302", "193222", "192230",
  // Remote Mountain (Arunachal, Manipur, Nagaland)
  "791102", "791111", "792110", "795142", "797112",
  // High RTO (Bihar, Jharkhand, Chhattisgarh)
  "855107", "855113", "854311", "829204", "822114", "494001", "494444",
];

// ==============================
// HELPER FUNCTIONS
// ==============================

export function isCodAvailable(pincode: string): boolean {
  return !codBlacklistPincodes.includes(pincode);
}

export function getDeliveryZone(pincode: string): DeliveryZone | null {
  // Exact pincode match first
  for (const zone of deliveryZones) {
    if (zone.pincodes.includes(pincode)) return zone;
  }
  // Then prefix match (order matters — Zone 1 first, then Zone 2, then Zone 3)
  for (const zone of deliveryZones) {
    for (const prefix of zone.prefixes) {
      if (pincode.startsWith(prefix)) return zone;
    }
  }
  return null;
}

export function getDeliveryInfo(pincode: string) {
  const zone = getDeliveryZone(pincode);
  if (!zone) {
    return {
      available: false,
      message: "❌ Is pincode pe delivery available nahi hai",
    };
  }

  const codAvailable = isCodAvailable(pincode);

  return {
    available: true,
    zone: zone.name,
    deliveryDays: zone.deliveryDays,
    deliveryFee: zone.deliveryFee,
    freeAbove: zone.freeAbove,
    discount: zone.discount,
    offerMessage: zone.offerMessage,
    codAvailable: codAvailable,
    message: codAvailable
      ? `✅ Delivery available in ${zone.name}`
      : `⚠️ Delivery available, par COD available nahi hai`,
  };
}

// ==============================
// VALIDATE PINCODE (India Post API)
// ==============================

export async function validatePincode(pincode: string): Promise<{
  valid: boolean;
  city?: string;
  district?: string;
  state?: string;
}> {
  try {
    const res = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    const data = await res.json();

    if (
      data &&
      data[0] &&
      data[0].Status === "Success" &&
      data[0].PostOffice &&
      data[0].PostOffice.length > 0
    ) {
      const po = data[0].PostOffice[0];
      return {
        valid: true,
        city: po.Name,
        district: po.District,
        state: po.State,
      };
    }
    return { valid: false };
  } catch (err) {
    console.error("Pincode validation error:", err);
    return { valid: true };
  }
}

// ==============================
// GET DELIVERY DATE
// ==============================

export function getDeliveryDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}
