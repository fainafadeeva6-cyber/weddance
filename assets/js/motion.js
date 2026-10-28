// Появление блоков при прокрутке. Без JS и при reduced-motion всё видно сразу.
(function () {
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var els = document.querySelectorAll("main .section > *, .steps li, .card, .review, .plan, .faq details");
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  els.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
  // карточки, добавленные позже (каталог рендерит из JSON)
  var grid = document.getElementById("grid");
  if (grid) new MutationObserver(function () {
    grid.querySelectorAll(".card:not(.reveal)").forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
  }).observe(grid, { childList: true });
})();
