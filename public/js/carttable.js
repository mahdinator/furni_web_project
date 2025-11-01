// carttable.js — Minimal, clean cart logic

document.addEventListener("DOMContentLoaded", () => {
  const rows = document.querySelectorAll(".cart-row");

  function recalcTotals() {
    let subtotal = 0;
    rows.forEach((row) => {
      const price = parseFloat(row.dataset.price) || 0;
      const qtyInput = row.querySelector(".quantity-amount");
      const qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
      const rowTotal = price * qty;
      row.querySelector(".row-total").textContent = rowTotal.toFixed(2);
      subtotal += rowTotal;
    });

    document.getElementById("subtotal-value").textContent =
      "$" + subtotal.toFixed(2);
    document.getElementById("total-value").textContent =
      "$" + subtotal.toFixed(2);
  }

  rows.forEach((row) => {
    const dec = row.querySelector(".decrease");
    const inc = row.querySelector(".increase");

    const qtyInput = row.querySelector(".quantity-amount");
    const removeBtn = row.querySelector(".remove-item");

    dec.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      let val = parseInt(qtyInput.value, 10) || 1;
      recalcTotals();
    });

    inc.addEventListener("click", (e) => {
      console.log("increase");
      e.preventDefault();
      e.stopImmediatePropagation();
      let val = parseInt(qtyInput.value, 10) || 1;
      recalcTotals();
    });

    qtyInput.addEventListener("input", recalcTotals);

    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        const id = removeBtn.dataset.id;
        fetch("/cart/remove/" + id, { method: "POST" })
          .then((res) => res.ok && location.reload())
          .catch(console.error);
      });
    }
  });

  recalcTotals();
});
