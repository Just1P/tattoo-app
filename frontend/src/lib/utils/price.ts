/**
 * Formate un prix en nombre avec 2 décimales
 * @param price - Le prix à formater (peut être un nombre ou une chaîne)
 * @returns Le prix formaté avec 2 décimales ou null si invalide
 */
export function formatPrice(
  price: number | string | null | undefined
): string | null {
  if (!price) return null;

  const numPrice = Number(price);
  if (isNaN(numPrice)) return null;

  return numPrice.toFixed(2);
}

/**
 * Formate un prix avec le symbole euro
 * @param price - Le prix à formater
 * @returns Le prix formaté avec le symbole € ou null si invalide
 */
export function formatPriceWithCurrency(
  price: number | string | null | undefined
): string | null {
  const formatted = formatPrice(price);
  return formatted ? `${formatted} €` : null;
}
