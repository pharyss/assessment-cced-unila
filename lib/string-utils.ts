/**
 * Converts a string to title case where the first letter of each word is uppercase
 * and the rest are lowercase. Also replaces underscores with spaces.
 *
 * @param str - The string to format
 * @returns The formatted string with title case and spaces instead of underscores
 *
 * @example
 * ```
 * formatStringToTitleCase("hello_world") // "Hello World"
 * formatStringToTitleCase("HELLO_WORLD") // "Hello World"
 * formatStringToTitleCase("hello_world_example") // "Hello World Example"
 * formatStringToTitleCase("already_Title_Case") // "Already Title Case"
 * ```
 */
export function formatStringToTitleCase(str: string): string {
  if (!str) return str;

  // Replace underscores with spaces
  const withSpaces = str.replace(/_/g, ' ');

  // Convert to title case: first letter uppercase, rest lowercase for each word
  return withSpaces
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Alternative name for the same function for better discoverability
 */
export const formatUnderscoreToTitleCase = formatStringToTitleCase;
