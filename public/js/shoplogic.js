document.addEventListener("DOMContentLoaded", () => {
  // Select all plus icons
  document.querySelectorAll(".icon-cross").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation(); // prevent the product link from opening

      const id = btn.dataset.id;
      if (!id) return;

      try {
        const res = await fetch("/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: id, quantity: 1 }),
        });

        const data = await res.json();

        if (data.success) {
          console.log(`✅ Product ${id} added to cart`);
          btn.classList.add("added");
          setTimeout(() => btn.classList.remove("added"), 600);

          // Update navbar cart count if available
          const cartBadge = document.querySelector("#cart-count");
          if (cartBadge && data.count) cartBadge.textContent = data.count;

          // Show quick visual toast
          showToast("✅ Item added to cart", "success");
        } else if (data.message === "Login required") {
          showToast("⚠️ Please log in first.", "warning");
          setTimeout(() => (window.location.href = "/api/auth/login"), 1500);
        } else {
          showToast("⚠️ Could not add to cart.", "warning");
        }
      } catch (err) {
        console.error("❌ Add to cart failed:", err);
        showToast("❌ Add to cart failed. Check console.", "error");
      }
    });
  });

  // SEARCH & FILTER
  const minSlider = document.getElementById("price-min");
  const maxSlider = document.getElementById("price-max");
  const minInput = document.getElementById("price-min-value");
  const maxInput = document.getElementById("price-max-value");

  // Sync sliders and inputs
  if (minSlider && maxSlider && minInput && maxInput) {
    minSlider.addEventListener(
      "input",
      () => (minInput.value = minSlider.value)
    );
    maxSlider.addEventListener(
      "input",
      () => (maxInput.value = maxSlider.value)
    );

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
  }

  // Search button click
  const searchBtn = document.getElementById("search-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const query = document.getElementById("search")?.value.trim() || "";
      const category = document.getElementById("category")?.value || "";
      const min = document.getElementById("price-min")?.value || 1;
      const max = document.getElementById("price-max")?.value || 5000;

      const params = new URLSearchParams({ query, category, min, max });
      window.location.href = `/shop?${params.toString()}`;
    });
  }

  // TOAST NOTIFICATION
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.innerText = message;

    Object.assign(toast.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background:
        type === "success"
          ? "#4caf50"
          : type === "error"
          ? "#f44336"
          : "#ff9800",
      color: "white",
      padding: "10px 16px",
      borderRadius: "8px",
      zIndex: "9999",
      opacity: "0",
      transition: "opacity 0.3s ease-in-out",
    });

    document.body.appendChild(toast);
    setTimeout(() => (toast.style.opacity = "1"), 100);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 400);
    }, 2000);
  }
});
