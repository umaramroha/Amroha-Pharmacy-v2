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
  {
    name: "Nearby / Priority Zone",
    prefixes: [
      "110", "201", "203", "202", "204", "205", "207", "244", "243", "242", "245", "250", "251", "247", "226", "121", "122", "123",
    ],
    pincodes: [],
    deliveryDays: [2, 4],
    deliveryFee: 50,
    freeAbove: 500,
    discount: 0,
    offerMessage: "",
  },
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

export const codBlacklistPincodes: string[] = [
  "122107", "122108", "122104", "122105", "321204", "281403",
  "744101", "744202", "744301", "744304", "682551", "682553", "682554", "682555",
  "194101", "194102", "194301", "194302", "193222", "192230",
  "791102", "791111", "792110", "795142", "797112",
  "855107", "855113", "854311", "829204", "822114", "494001", "494444",
];

export function isCodAvailable(pincode: string): boolean {
  return !codBlacklistPincodes.includes(pincode);
}

export function getDeliveryZone(pincode: string): DeliveryZone | null {
  for (const zone of deliveryZones) {
    if (zone.pincodes.includes(pincode)) return zone;
  }
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
    return { available: false, message: "Delivery is not available for this PIN code." };
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
      : `⚠️ Delivery is available, but Cash on Delivery is unavailable.`,
  };
}

export async function validatePincode(pincode: string, signal?: AbortSignal): Promise<{
  valid: boolean;
  city?: string;
  district?: string;
  state?: string;
}> {
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, { signal });
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
        city: po.Name,        // Area / Local Post Office name
        district: po.District, // Actual District
        state: po.State,
      };
    }
    return { valid: false };
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
    console.error("Pincode validation error:", err);
    return { valid: false }; // FAIL SAFE
  }
}

export function getDeliveryDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
