// IMG_OPT_V1
// Serves Cloudinary photos in the size the screen needs (smaller, modern format).
// Anything that is not a plain Cloudinary upload URL is returned unchanged.
const CLOUDINARY = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

export function optimizeImage(url: string | null | undefined, width: number): string {
  if (!url) return "";
  const m = CLOUDINARY.exec(url);
  if (!m) return url;
  const first = m[2].split("/")[0];
  // Already has transformations (for example w_500 or f_auto,q_auto): leave it alone.
  if (first.includes(",") || /^[a-z]{1,3}_/.test(first)) return url;
  return m[1] + "f_auto,q_auto,c_limit,w_" + Math.round(width) + "/" + m[2];
}
