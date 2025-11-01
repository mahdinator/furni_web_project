document.addEventListener("DOMContentLoaded", () => {
  // Select all plus icons
  document.querySelectorAll(".icon-cross").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation(); // prevent the product link from opening

      const id = btn.dataset.id;
      if (!id) return;

      try {
        const res = await fetch(`/shop/add-to-cart/${id}`, { method: "POST" });
        const data = await res.json();

        if (data.success) {
          console.log(`Product ${id} added to cart!`);
          // Optional: visually confirm
          btn.classList.add("added");
          setTimeout(() => btn.classList.remove("added"), 600);

          // Optional: update navbar count
          const cartBadge = document.querySelector("#cart-count");
          if (cartBadge) cartBadge.textContent = data.count;
        }
      } catch (err) {
        console.error("Add to cart failed:", err);
      }
    });
  });

  //search bar
  // Live slider value display
  const minSlider = document.getElementById("price-min");
  const maxSlider = document.getElementById("price-max");
  const minInput = document.getElementById("price-min-value");
  const maxInput = document.getElementById("price-max-value");

  // Sync slider → input
  minSlider.addEventListener("input", () => (minInput.value = minSlider.value));
  maxSlider.addEventListener("input", () => (maxInput.value = maxSlider.value));

  // Sync input → slider (with validation)
  minInput.addEventListener("input", () => {
    const val = Math.min(Math.max(parseInt(minInput.value) || 1, 1), 5000);
    minInput.value = val;
    minSlider.value = val;
  });

  maxInput.addEventListener("input", () => {
    const val = Math.min(Math.max(parseInt(maxInput.value) || 5000, 1), 5000);
    maxInput.value = val;
    maxSlider.value = val;
  });

  //search button
  // --- Search button ---
  const searchBtn = document.getElementById("search-btn");

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const query = document.getElementById("search")?.value.trim() || "";
      const category = document.getElementById("category")?.value || "";
      const min = document.getElementById("price-min")?.value || 1;
      const max = document.getElementById("price-max")?.value || 5000;

      // Build query string
      const params = new URLSearchParams({
        query,
        category,
        min,
        max,
      });

      // Redirect to /shop with parameters
      window.location.href = `/shop?${params.toString()}`;
    });
  }
});

btn.classList.add("added");
setTimeout(() => btn.classList.remove("added"), 400);
