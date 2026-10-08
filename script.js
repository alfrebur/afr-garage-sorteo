(function () {
    // Placeholder draw date — edit this to your real sorteo date/time.
    var target = new Date("2026-09-12T21:00:00-03:00").getTime();

    var labelEl = document.getElementById("draw-date-label");
    var fmt = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" });
    if (labelEl) labelEl.textContent = fmt.format(new Date(target)) + " hs";

    var d = document.getElementById("cd-days");
    var h = document.getElementById("cd-hours");
    var m = document.getElementById("cd-mins");
    var s = document.getElementById("cd-secs");

    function pad(n) { return String(n).padStart(2, "0"); }

    function tick() {
      var now = Date.now();
      var diff = Math.max(0, target - now);
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var mins = Math.floor((diff % 3600000) / 60000);
      var secs = Math.floor((diff % 60000) / 1000);
      if (d) d.textContent = pad(days);
      if (h) h.textContent = pad(hours);
      if (m) m.textContent = pad(mins);
      if (s) s.textContent = pad(secs);
    }
    tick();
    setInterval(tick, 1000);
  })();

  // Chance-tier selection
  (function () {
    var radios = Array.prototype.slice.call(document.querySelectorAll(".chance-radio"));
    var ctaText = document.getElementById("main-cta-text");

    function applySelection(radio) {
      radios.forEach(function (r) {
        var row = r.closest(".chance-row");
        if (row) row.classList.toggle("selected", r === radio);
      });
      if (ctaText && radio) {
        ctaText.textContent = "Comprar " + radio.dataset.tier + " — " + radio.dataset.price;
      }
    }

    radios.forEach(function (radio) {
      radio.addEventListener("change", function () {
        applySelection(radio);
      });
    });

    var initial = document.querySelector(".chance-radio:checked") || radios[0];
    applySelection(initial);
  })();

  // Checkout view (design-only — no real payment processing)
  (function () {
    var mainEl = document.getElementById("top");
    var checkoutEl = document.getElementById("checkout-view");
    var buyBtn = document.getElementById("main-cta");
    var backBtn = document.getElementById("checkout-back");
    var form = document.getElementById("checkout-form");
    var note = document.getElementById("checkout-note");
    var orderDetail = document.getElementById("checkout-order-detail");
    var orderPrice = document.getElementById("checkout-order-price");
    var totalPrice = document.getElementById("checkout-total-price");

    function openCheckout() {
      var radio = document.querySelector(".chance-radio:checked");
      if (radio) {
        var tier = radio.dataset.tier;
        var price = radio.dataset.price;
        var fotos = tier.replace(/chance(s)?/i, "foto$1");
        if (orderDetail) orderDetail.textContent = tier + " para el sorteo · " + fotos;
        if (orderPrice) orderPrice.textContent = price;
        if (totalPrice) totalPrice.textContent = price;
      }
      if (note) note.classList.remove("visible");
      if (mainEl) mainEl.hidden = true;
      if (checkoutEl) checkoutEl.hidden = false;
      window.scrollTo(0, 0);
    }

    function closeCheckout() {
      if (checkoutEl) checkoutEl.hidden = true;
      if (mainEl) mainEl.hidden = false;
      window.scrollTo(0, 0);
    }

    if (buyBtn) buyBtn.addEventListener("click", openCheckout);
    if (backBtn) backBtn.addEventListener("click", closeCheckout);
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (note) {
          note.classList.add("visible");
          note.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      });
    }
  })();
