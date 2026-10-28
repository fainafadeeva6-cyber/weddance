// Переключатели вариантов макета: ?accent=night|terra, ?motif=digits|steps|line, ?hero=clips|photo|type, ?picker=sentence|split|tiles (первый — по умолчанию)
(function () {
  var q = new URLSearchParams(location.search), h = document.documentElement;
  var opts = { accent: ["night", "terra"], motif: ["digits", "steps", "line"], hero: ["clips", "photo", "type"], picker: ["sentence", "split", "tiles"] };
  Object.keys(opts).forEach(function (k) {
    var v = q.get(k); h.dataset[k] = opts[k].indexOf(v) >= 0 ? v : opts[k][0];
  });
  // фото первого экрана грузим только в режимах photo/type
  document.addEventListener("DOMContentLoaded", function () {
    var ph = document.querySelector(".hero__photo[data-src]");
    if (ph && h.dataset.hero !== "clips") ph.src = ph.dataset.src;
  });
  // сохранить параметры при переходах между страницами макета
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || /^(https?:|#|mailto:|tel:)/.test(a.getAttribute("href"))) return;
    var u = new URL(a.href, location.href);
    ["accent", "motif", "hero", "picker"].forEach(function (k) { if (q.get(k) && !u.searchParams.get(k)) u.searchParams.set(k, q.get(k)); });
    a.href = u.toString();
  });
})();
