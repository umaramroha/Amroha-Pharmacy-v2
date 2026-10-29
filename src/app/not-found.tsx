import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-primary mb-4">404</div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          This page could not be found. The link may be outdated or incorrect.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/"
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-semibold transition"
          >
            Go Home
          </Link>
          <Link
            href="/products"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-full font-semibold transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
