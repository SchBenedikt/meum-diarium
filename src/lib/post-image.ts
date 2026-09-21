const isRemoteImage = (value: string) => /^(?:https?:)?\/\//i.test(value);

export function getPostImageSrc(image: string | null | undefined): string | undefined {
  const value = image?.trim();
  if (!value) return undefined;
  if (isRemoteImage(value) || value.startsWith('/')) return value;
  return `/images/${value.replace(/^\/+/, '')}`;
}

export function getAbsolutePostImageUrl(
  image: string | null | undefined,
  baseUrl: string,
  fallback: string,
): string {
  const src = getPostImageSrc(image);
  if (!src) return fallback;
  try {
    return new URL(src, baseUrl).toString();
  } catch {
    return fallback;
  }
}
