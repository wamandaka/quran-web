/**
 * Capitalizes the first letter of a string.
 * This is used to ensure consistent formatting across all browsers
 * where CSS 'capitalize' might behave inconsistently.
 */
export const capitalizeFirstLetter = (string: string | undefined | null) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};
