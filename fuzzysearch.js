// utils/fuzzySearch.js
import Fuse from "fuse.js";

/**
 * Perform a fuzzy search on a list of products.
 * @param {Array} products - The array of product objects from the database.
 * @param {string} query - The user's search term.
 * @returns {Array} - The filtered and ranked product list.
 */

export function fuzzyFilter(products, query) {
  if (!query || !products.length) return products;

  const fuse = new Fuse(products, {
    keys: [
      { name: "name", weight: 0.8 },
      { name: "description", weight: 0.2 },
    ],
    threshold: 0.6, // increase tolerance (0.4–0.6 works well)
    distance: 100, // widen acceptable character distance
    minMatchCharLength: 2, // ignore 1-char noise
    ignoreLocation: true, // match anywhere in the string
    includeScore: true,
  });

  const results = fuse.search(query);

  // Keep only reasonably close matches (score ≤ 0.4)
  return results.filter((r) => r.score <= 0.6).map((r) => r.item);
  //return results.map((r) => r.item);
}
