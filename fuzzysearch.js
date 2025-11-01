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
    threshold: 0.5, // lower = stricter
    distance: 50, // max edit distance
    includeScore: true, // optional, useful for sorting
  });

  const results = fuse.search(query);
  return results.map((r) => r.item);
}
