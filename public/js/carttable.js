document.addEventListener("DOMContentLoaded", () => {
  // UPDATE QUANTITY IN BACKEND
  async function updateCart(productId, quantity) {
    await fetch(`/cart/update/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
  }

  // CALCULATE ROW TOTAL
  function updateRowTotal(row) {
    const price = Number(row.querySelector(".unit-price").textContent);
    const qty = Number(row.querySelector(".quantity-amount").value);
    row.querySelector(".row-total").textContent = (price * qty).toFixed(2);
    updateTotals();
  }

  // CALCULATE CART TOTALS
  function updateTotals() {
    let subtotal = 0;

    document.querySelectorAll(".cart-row").forEach((row) => {
      const price = Number(row.querySelector(".unit-price").textContent);
      const qty = Number(row.querySelector(".quantity-amount").value);
      subtotal += price * qty;
    });

    document.getElementById("subtotal-value").textContent =
      "$" + subtotal.toFixed(2);
    document.getElementById("total-value").textContent =
      "$" + subtotal.toFixed(2);
  }

  // INCREASE QUANTITY
  document.querySelectorAll(".increase").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const qtyInput = row.querySelector(".quantity-amount");
      qtyInput.value = Number(qtyInput.value) + 1;
      updateRowTotal(row);
      updateCart(row.dataset.id, qtyInput.value);
    });
  });

  // DECREASE QUANTITY
  document.querySelectorAll(".decrease").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const qtyInput = row.querySelector(".quantity-amount");
      if (qtyInput.value > 1) {
        qtyInput.value = Number(qtyInput.value) - 1;
        updateRowTotal(row);
        updateCart(row.dataset.id, qtyInput.value);
      }
    });
  });

  // REMOVE ITEM
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!confirm("Remove this item?")) return;

      const res = await fetch(`/cart/remove/${id}`, { method: "POST" });
      const data = await res.json();

      if (data.success) {
        btn.closest("tr").remove();
        updateTotals();

        if (document.querySelectorAll(".cart-row").length === 0) {
          window.location.reload();
        }
      }
    });
  });
});
