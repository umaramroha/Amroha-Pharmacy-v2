"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import {
  getWhatsAppLink,
  getProductOrderMessage,
} from "@/lib/whatsapp";
import {
  getDeliveryInfo,
  validatePincode,
  getDeliveryDate,
} from "@/data/delivery";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: string;
  mrp: string | null;
  image: string | null;
  category: string | null;
  description: string | null;
  stock: number;
};

type Tab =
  | "description"
  | "benefits"
  | "how-to-use"
  | "precautions";

type DeliveryInfo = {
  city?: string;
  state?: string;
  zone?: string;
  days?: [number, number] | number[];
  fee?: number;
  codAvailable?: boolean;
  discount?: number;
  offerMessage?: string;
};

const tabs: { key: Tab; label: string }[] = [
  { key: "description", label: "Description" },
  { key: "benefits", label: "Benefits" },
  { key: "how-to-use", label: "How to Use" },
  { key: "precautions", label: "Precautions" },
];

const categoryLabels: Record<string, string> = {
  "male-problems": "Men's Wellness",
  "female-problems": "Women's Wellness",
  "general-problems": "General Wellness",
};

/* -------------------------------------------------------------------------- */
/* ICONS                                                                      */
/* -------------------------------------------------------------------------- */

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-4 h-4"
      strokeWidth="2"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-4 h-4"
      strokeWidth="2"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-4 h-4"
      strokeWidth="2"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-4 h-4"
      strokeWidth="2"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function ShoppingBagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className}
      strokeWidth="1.8"
    >
      <path d="M6 8h12l1 13H5L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.198.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-5 h-5"
      strokeWidth="1.8"
    >
      <path d="M3 6h11v11H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-5 h-5"
      strokeWidth="1.8"
    >
      <path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-5 h-5"
      strokeWidth="1.8"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h3" />
    </svg>
  );
}

function PackageIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className}
      strokeWidth="1.4"
    >
      <path d="M20 7 12 3 4 7v10l8 4 8-4V7Z" />
      <path d="m4 7 8 4 8-4M12 11v10" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-3.5 h-3.5"
      strokeWidth="2.5"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-5 h-5"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* LOADING STATE                                                              */
/* -------------------------------------------------------------------------- */

function ProductSkeleton() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 md:py-10">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-56 mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
            <div className="aspect-square bg-gray-200 rounded-2xl" />

            <div className="space-y-5 pt-2">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-10 bg-gray-200 rounded w-4/5" />
              <div className="h-8 bg-gray-200 rounded w-1/3" />
              <div className="h-20 bg-gray-200 rounded" />
              <div className="h-5 bg-gray-200 rounded w-24" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-32 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [activeTab, setActiveTab] =
    useState<Tab>("description");

  const [pincode, setPincode] = useState("");
  const [deliveryCheck, setDeliveryCheck] =
    useState<string | null>(null);

  const [deliveryInfo, setDeliveryInfo] =
    useState<DeliveryInfo | null>(null);

  const [checkingPincode, setCheckingPincode] =
    useState(false);

  const { addToCart } = useCart();

  /* ------------------------------------------------------------------------ */
  /* FETCH PRODUCT                                                            */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const res = await fetch(
          `/api/products/${params.slug}`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          if (!cancelled) {
            setNotFound(true);
          }
          return;
        }

        const data = await res.json();

        if (cancelled) return;

        const fetchedProduct: Product = data.product;

        setProduct(fetchedProduct);

        if (fetchedProduct.category) {
          try {
            const simRes = await fetch(
              `/api/products?category=${encodeURIComponent(
                fetchedProduct.category
              )}`,
              {
                cache: "no-store",
              }
            );

            if (simRes.ok) {
              const simData = await simRes.json();

              if (!cancelled) {
                setSimilar(
                  (simData.products || [])
                    .filter(
                      (p: Product) =>
                        p.id !== fetchedProduct.id
                    )
                    .slice(0, 4)
                );
              }
            }
          } catch (error) {
            console.error(
              "Failed to fetch related products",
              error
            );
          }
        }
      } catch (error) {
        console.error(
          "Failed to fetch product",
          error
        );

        if (!cancelled) {
          setNotFound(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  /* ------------------------------------------------------------------------ */
  /* LOADING                                                                  */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return <ProductSkeleton />;
  }

  /* ------------------------------------------------------------------------ */
  /* NOT FOUND                                                                */
  /* ------------------------------------------------------------------------ */

  if (notFound || !product) {
    return (
      <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-300">
            <PackageIcon className="w-10 h-10" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <p className="text-gray-500 mt-3 mb-7 leading-6">
            The product you are looking for may no longer
            be available.
          </p>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition"
          >
            <ChevronLeftIcon />
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* PRODUCT CALCULATIONS                                                     */
  /* ------------------------------------------------------------------------ */

  const price = parseFloat(product.price) || 0;

  const mrp = product.mrp
    ? parseFloat(product.mrp) || price
    : price;

  const discount =
    mrp > price
      ? Math.round(((mrp - price) / mrp) * 100)
      : 0;

  const isInStock = product.stock > 0;

  const categoryLabel = product.category
    ? categoryLabels[product.category] ||
      product.category
    : null;

  /* ------------------------------------------------------------------------ */
  /* CART                                                                     */
  /* ------------------------------------------------------------------------ */

  const handleAddToCart = () => {
    if (!isInStock) return;

    addToCart({
      id: product.id,
      name: product.name,
      price,
      image: product.image || undefined,
      quantity,
    });

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 2200);
  };

  /* ------------------------------------------------------------------------ */
  /* DELIVERY                                                                 */
  /* ------------------------------------------------------------------------ */

  const handleDeliveryCheck = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const cleanPincode = pincode.trim();

    if (
      cleanPincode.length !== 6 ||
      !/^\d+$/.test(cleanPincode)
    ) {
      setDeliveryCheck(
        "Please enter a valid 6-digit pincode."
      );
      setDeliveryInfo(null);
      return;
    }

    setCheckingPincode(true);
    setDeliveryCheck(null);
    setDeliveryInfo(null);

    try {
      const validation =
        await validatePincode(cleanPincode);

      if (!validation.valid) {
        setDeliveryCheck(
          "Invalid pincode. Please enter a valid 6-digit pincode."
        );
        return;
      }

      const info = getDeliveryInfo(cleanPincode);

      if (!info.available) {
        setDeliveryCheck(
          info.message ||
            "Delivery is not available at this pincode."
        );
        return;
      }

      setDeliveryInfo({
        city: validation.city,
        state: validation.state,
        zone: info.zone,
        days: info.deliveryDays,
        fee: info.deliveryFee,
        codAvailable: info.codAvailable,
        discount: info.discount,
        offerMessage: info.offerMessage,
      });

      setDeliveryCheck(info.message || "");
    } catch (error) {
      console.error(
        "Delivery check failed",
        error
      );

      setDeliveryCheck(
        "Unable to check this pincode right now. Please try again."
      );
    } finally {
      setCheckingPincode(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* WHATSAPP                                                                 */
  /* ------------------------------------------------------------------------ */

  const whatsappLink = getWhatsAppLink(
    getProductOrderMessage({
      name: product.name,
      price,
      slug: product.slug,
      quantity,
    })
  );

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="min-h-screen bg-[#f8fafc] text-gray-900 pb-24 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-8">

        {/* ---------------------------------------------------------------- */}
        {/* BREADCRUMB                                                       */}
        {/* ---------------------------------------------------------------- */}

        <nav
          aria-label="Breadcrumb"
          className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-gray-500 mb-6 md:mb-8"
        >
          <Link
            href="/"
            className="hover:text-primary transition"
          >
            Home
          </Link>

          <ChevronRightIcon />

          <Link
            href="/products"
            className="hover:text-primary transition"
          >
            Products
          </Link>

          {product.category && (
            <>
              <ChevronRightIcon />

              <Link
                href={`/products?category=${encodeURIComponent(
                  product.category
                )}`}
                className="hover:text-primary transition"
              >
                {categoryLabel}
              </Link>
            </>
          )}

          <ChevronRightIcon />

          <span className="text-gray-800 font-medium truncate max-w-[180px] sm:max-w-[280px]">
            {product.name}
          </span>
        </nav>

        {/* ---------------------------------------------------------------- */}
        {/* MAIN PRODUCT                                                     */}
        {/* ---------------------------------------------------------------- */}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-14">

          {/* IMAGE -------------------------------------------------------- */}

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

              {discount > 0 && (
                <div className="absolute left-4 top-4 z-10 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-bold">
                  {discount}% OFF
                </div>
              )}

              <div className="aspect-square flex items-center justify-center bg-white p-6 sm:p-10">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center bg-gray-50 rounded-xl text-gray-300">
                    <PackageIcon className="w-20 h-20" />

                    <p className="mt-3 text-sm text-gray-400">
                      Product image unavailable
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* IMAGE NOTE */}

            <div className="hidden sm:flex items-center justify-center gap-2 text-xs text-gray-400 mt-3">
              <ShieldIcon />
              Product image shown for representation. Refer to packaging for exact details.
            </div>
          </div>

          {/* DETAILS ------------------------------------------------------ */}

          <div className="flex flex-col">

            {/* CATEGORY */}

            {product.category && (
              <Link
                href={`/products?category=${encodeURIComponent(
                  product.category
                )}`}
                className="inline-flex w-fit text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase text-primary mb-3 hover:text-primary-dark transition"
              >
                {categoryLabel}
              </Link>
            )}

            {/* TITLE */}

            <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-bold tracking-tight leading-[1.15] text-gray-950">
              {product.name}
            </h1>

            {/* PRICE */}

            <div className="flex items-end flex-wrap gap-x-3 gap-y-1 mt-5 pb-5 border-b border-gray-200">
              <span className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
                ₹{price.toLocaleString("en-IN")}
              </span>

              {mrp > price && (
                <>
                  <span className="text-base sm:text-lg text-gray-400 line-through mb-1">
                    ₹{mrp.toLocaleString("en-IN")}
                  </span>

                  <span className="mb-1 inline-flex px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* DESCRIPTION */}

            <p className="text-[15px] leading-7 text-gray-600 mt-5">
              {product.description ||
                "Product information is currently unavailable. Please refer to the product packaging for complete details."}
            </p>

            {/* STOCK */}

            <div className="mt-5 flex items-center gap-3">
              {isInStock ? (
                <>
                  <span className="relative flex w-2.5 h-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60 animate-ping" />
                    <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-green-500" />
                  </span>

                  <span className="text-sm font-semibold text-green-700">
                    In Stock
                  </span>

                  {product.stock <= 5 && (
                    <span className="text-xs text-orange-600 font-medium">
                      Limited availability
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-sm font-semibold text-red-600">
                    Currently unavailable
                  </span>
                </>
              )}
            </div>

            {/* QUANTITY */}

            {isInStock && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Quantity
                  </label>

                  <span className="text-xs text-gray-400">
                    Maximum 10 units
                  </span>
                </div>

                <div className="inline-flex items-center h-11 rounded-lg border border-gray-300 bg-white overflow-hidden">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() =>
                      setQuantity(
                        Math.max(1, quantity - 1)
                      )
                    }
                    disabled={quantity <= 1}
                    className="w-11 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <MinusIcon />
                  </button>

                  <span className="w-12 h-full flex items-center justify-center border-x border-gray-200 text-sm font-bold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() =>
                      setQuantity(
                        Math.min(10, quantity + 1)
                      )
                    }
                    disabled={quantity >= 10}
                    className="w-11 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
            )}

            {/* ACTIONS */}

            <div className="mt-6 space-y-3">

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isInStock}
                className={`w-full h-12 sm:h-[52px] rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  !isInStock
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : added
                    ? "bg-green-600 text-white"
                    : "bg-primary hover:bg-primary-dark text-white shadow-sm hover:shadow-md"
                }`}
              >
                {added ? (
                  <>
                    <CheckIcon />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBagIcon className="w-5 h-5" />
                    {isInStock
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </>
                )}
              </button>

              {isInStock && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 sm:h-[52px] rounded-xl border border-green-600 text-green-700 bg-white hover:bg-green-50 flex items-center justify-center gap-2 font-semibold text-sm transition"
                >
                  <WhatsAppIcon />
                  Order on WhatsApp
                </a>
              )}

              <Link
                href="/cart"
                className="w-full flex items-center justify-center gap-1 text-sm font-semibold text-gray-500 hover:text-primary transition py-2"
              >
                View Cart
                <ChevronRightIcon />
              </Link>
            </div>

            {/* DELIVERY */}

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white overflow-hidden">

              <div className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 shrink-0 rounded-lg bg-primary/5 text-primary flex items-center justify-center">
                    <TruckIcon />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Check Delivery
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                      Enter your pincode to see delivery options.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleDeliveryCheck}
                  className="flex flex-col sm:flex-row gap-2"
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) =>
                      setPincode(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    placeholder="Enter 6-digit pincode"
                    className="flex-1 h-11 px-3.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  />

                  <button
                    type="submit"
                    disabled={checkingPincode}
                    className="h-11 px-6 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkingPincode
                      ? "Checking..."
                      : "Check"}
                  </button>
                </form>

                {deliveryCheck &&
                  !deliveryInfo && (
                    <div className="mt-4 flex items-start gap-2 p-3.5 rounded-lg bg-red-50 border border-red-100 text-sm font-medium text-red-700">
                      <InfoIcon />
                      <span>{deliveryCheck}</span>
                    </div>
                  )}

                {deliveryInfo && (
                  <div className="mt-4 rounded-xl border border-green-200 bg-green-50/60 overflow-hidden">

                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                          <CheckIcon />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-green-800">
                            Delivery available
                          </p>

                          {(deliveryInfo.city ||
                            deliveryInfo.state) && (
                            <p className="text-sm text-gray-600 mt-0.5">
                              {deliveryInfo.city}
                              {deliveryInfo.city &&
                                deliveryInfo.state
                                ? ", "
                                : ""}
                              {deliveryInfo.state}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-green-200/70 divide-y divide-green-200/70">

                      {deliveryInfo.days &&
                        deliveryInfo.days.length >=
                          2 && (
                          <div className="p-4 flex items-center justify-between gap-4 text-sm">
                            <span className="text-gray-600">
                              Estimated delivery
                            </span>

                            <strong className="text-gray-900 text-right">
                              {getDeliveryDate(
                                deliveryInfo.days[0]
                              )}{" "}
                              –{" "}
                              {getDeliveryDate(
                                deliveryInfo.days[1]
                              )}
                            </strong>
                          </div>
                        )}

                      {deliveryInfo.fee !==
                        undefined && (
                        <div className="p-4 flex items-center justify-between gap-4 text-sm">
                          <span className="text-gray-600">
                            Delivery fee
                          </span>

                          <strong
                            className={
                              deliveryInfo.fee === 0
                                ? "text-green-700"
                                : "text-gray-900"
                            }
                          >
                            {deliveryInfo.fee === 0
                              ? "FREE"
                              : `₹${deliveryInfo.fee}`}
                          </strong>
                        </div>
                      )}

                      <div className="p-4 flex items-center justify-between gap-4 text-sm">
                        <span className="text-gray-600">
                          Cash on Delivery
                        </span>

                        <strong
                          className={
                            deliveryInfo.codAvailable
                              ? "text-green-700"
                              : "text-gray-500"
                          }
                        >
                          {deliveryInfo.codAvailable
                            ? "Available"
                            : "Not Available"}
                        </strong>
                      </div>
                    </div>

                    {deliveryInfo.offerMessage && (
                      <div className="px-4 py-3 bg-white/70 border-t border-green-200 text-sm font-semibold text-primary">
                        {deliveryInfo.offerMessage}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* TRUST STRIP                                                       */}
        {/* ---------------------------------------------------------------- */}

        <section className="mt-8 lg:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden">

          <div className="bg-white p-5 sm:p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
              <ShieldIcon />
            </div>

            <div>
              <p className="font-semibold text-sm text-gray-900">
                Secure Ordering
              </p>

              <p className="text-xs text-gray-500 mt-0.5">
                Simple & convenient
              </p>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
              <CreditCardIcon />
            </div>

            <div>
              <p className="font-semibold text-sm text-gray-900">
                Flexible Payments
              </p>

              <p className="text-xs text-gray-500 mt-0.5">
                UPI & COD where available
              </p>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
              <TruckIcon />
            </div>

            <div>
              <p className="font-semibold text-sm text-gray-900">
                Reliable Delivery
              </p>

              <p className="text-xs text-gray-500 mt-0.5">
                Across available pincodes
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* PRODUCT INFORMATION                                               */}
        {/* ---------------------------------------------------------------- */}

        <section className="mt-8 lg:mt-12 bg-white border border-gray-200 rounded-2xl overflow-hidden">

          {/* TABS */}

          <div className="border-b border-gray-200 overflow-x-auto scrollbar-hide">
            <div className="flex min-w-max px-1 sm:px-4">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() =>
                    setActiveTab(tab.key)
                  }
                  className={`relative px-4 sm:px-5 py-4 text-sm font-semibold whitespace-nowrap transition ${
                    activeTab === tab.key
                      ? "text-primary"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab.label}

                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* TAB CONTENT */}

          <div className="p-5 sm:p-7 md:p-9">

            {activeTab === "description" && (
              <div className="max-w-4xl">
                <p className="text-[15px] leading-7 text-gray-600">
                  {product.description ||
                    "Product information is currently unavailable."}
                </p>

                <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-gray-500 shrink-0 mt-0.5">
                    <InfoIcon />
                  </div>

                  <p className="text-sm text-gray-600 leading-6">
                    Please refer to the product packaging and
                    label for complete ingredient, usage and
                    product-specific information.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "benefits" && (
              <div className="max-w-4xl">
                <h2 className="text-xl font-bold text-gray-900 mb-5">
                  Product Benefits
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Product-specific formulation and intended use.",
                    "Designed for convenient everyday use as directed.",
                    "Follow the product label for detailed information.",
                    "Individual results may vary depending on the product and user.",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <span className="mt-0.5 w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                        <CheckIcon />
                      </span>

                      <p className="text-sm text-gray-600 leading-6">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "how-to-use" && (
              <div className="max-w-4xl">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  How to Use
                </h2>

                <div className="space-y-6">
                  {[
                    {
                      number: "01",
                      title: "Follow the Product Label",
                      text: "Use the product according to the dosage and directions provided on the packaging.",
                    },
                    {
                      number: "02",
                      title: "Use as Directed",
                      text: "Do not exceed the recommended dosage or frequency.",
                    },
                    {
                      number: "03",
                      title: "Need Individual Advice?",
                      text: "For personal dosage or medical advice, consult a qualified healthcare professional.",
                    },
                  ].map((item) => (
                    <div
                      key={item.number}
                      className="flex gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {item.number}
                      </div>

                      <div className="pt-0.5">
                        <h3 className="font-semibold text-gray-900">
                          {item.title}
                        </h3>

                        <p className="text-sm text-gray-600 leading-6 mt-1">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800 leading-6">
                  <InfoIcon />

                  <p>
                    <strong>Important:</strong> Always follow
                    the product label. If you have a medical
                    condition, take medicines, or require
                    individual dosage advice, consult a
                    qualified healthcare professional.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "precautions" && (
              <div className="max-w-4xl">
                <h2 className="text-xl font-bold text-gray-900 mb-5">
                  Precautions
                </h2>

                <div className="space-y-3">
                  {[
                    "Read the product label carefully before use.",
                    "Follow the recommended dosage and directions.",
                    "Keep the product stored as recommended on the packaging.",
                    "Consult a healthcare professional if you are pregnant, breastfeeding, taking medicines, or have an existing medical condition.",
                    "Stop use and seek appropriate medical advice if an unexpected reaction occurs.",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <span className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold text-xs shrink-0">
                        !
                      </span>

                      <p className="text-sm text-gray-600 leading-6">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-600 leading-6">
                  <strong className="text-gray-800">
                    Important Information:
                  </strong>{" "}
                  Product information is provided for general
                  informational purposes and does not replace
                  professional medical advice, diagnosis or
                  treatment.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* RELATED PRODUCTS                                                 */}
        {/* ---------------------------------------------------------------- */}

        {similar.length > 0 && (
          <section className="mt-10 lg:mt-14">

            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary mb-2">
                  Explore More
                </p>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-950">
                  Related Products
                </h2>
              </div>

              <Link
                href={
                  product.category
                    ? `/products?category=${encodeURIComponent(
                        product.category
                      )}`
                    : "/products"
                }
                className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition"
              >
                View All
                <ChevronRightIcon />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {similar.map((item) => {
                const itemPrice =
                  parseFloat(item.price) || 0;

                const itemMrp = item.mrp
                  ? parseFloat(item.mrp) || itemPrice
                  : itemPrice;

                const itemDiscount =
                  itemMrp > itemPrice
                    ? Math.round(
                        ((itemMrp - itemPrice) /
                          itemMrp) *
                          100
                      )
                    : 0;

                return (
                  <Link
                    key={item.id}
                    href={`/products/${item.slug}`}
                    className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <div className="relative aspect-square bg-gray-50 p-4 flex items-center justify-center overflow-hidden">
                      {itemDiscount > 0 && (
                        <span className="absolute left-2.5 top-2.5 z-10 px-2 py-1 rounded-md bg-primary text-white text-[9px] sm:text-[10px] font-bold">
                          {itemDiscount}% OFF
                        </span>
                      )}

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="w-full h-full object-contain group-hover:scale-[1.04] transition-transform duration-300"
                        />
                      ) : (
                        <PackageIcon className="w-12 h-12 text-gray-300" />
                      )}
                    </div>

                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 min-h-[40px] sm:min-h-[48px] group-hover:text-primary transition">
                        {item.name}
                      </h3>

                      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-3">
                        <span className="font-bold text-primary text-sm sm:text-base">
                          ₹
                          {itemPrice.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        {itemMrp > itemPrice && (
                          <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                            ₹
                            {itemMrp.toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 text-[11px] sm:text-xs font-semibold text-gray-500 group-hover:text-primary transition">
                        View Product →
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <Link
              href={
                product.category
                  ? `/products?category=${encodeURIComponent(
                      product.category
                    )}`
                  : "/products"
              }
              className="sm:hidden mt-5 w-full h-11 rounded-lg border border-gray-200 bg-white flex items-center justify-center gap-1 text-sm font-semibold text-primary"
            >
              View All Products
              <ChevronRightIcon />
            </Link>
          </section>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MOBILE STICKY PURCHASE BAR                                         */}
      {/* ------------------------------------------------------------------ */}

      {isInStock && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-3 shadow-[0_-6px_20px_rgba(0,0,0,0.08)]">
          <div className="max-w-7xl mx-auto flex items-center gap-2.5">

            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                Total
              </p>

              <p className="text-lg font-bold text-primary leading-tight">
                ₹{(price * quantity).toLocaleString("en-IN")}
              </p>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Order on WhatsApp"
              className="w-11 h-11 rounded-lg border border-green-600 text-green-700 flex items-center justify-center shrink-0"
            >
              <WhatsAppIcon />
            </a>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`h-11 px-5 rounded-lg text-sm font-bold text-white transition ${
                added
                  ? "bg-green-600"
                  : "bg-primary"
              }`}
            >
              {added ? "Added" : "Add to Cart"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}