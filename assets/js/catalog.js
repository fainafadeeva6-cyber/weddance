// Каталог: поиск, фильтры (шторка), сортировка. Начальные фильтры из ?mood=&level= (подборщик на главной).
(function () {
  var all = [], q = document.getElementById("q"), sort = document.getElementById("sort"), grid = document.getElementById("grid");
  var dlg = document.getElementById("filters"), sel = { mood: [], level: [], style: [], lang: [], dur: [] };
  var p = new URLSearchParams(location.search), wide = matchMedia("(min-width: 1024px)");
  ["mood", "level"].forEach(function (k) { if (p.get(k)) sel[k] = [p.get(k)]; });
  function secs(t) { var a = t.split(":"); return +a[0] * 60 + +a[1]; }
  function dur(d) { var s = secs(d.danceDuration); return s < 160 ? "short" : s <= 180 ? "mid" : "long"; }
  function match(d) {
    var t = q.value.trim().toLowerCase();
    if (t && (d.song + " " + d.artist).toLowerCase().indexOf(t) < 0) return false;
    var v = { mood: d.mood, level: String(d.level), style: d.style, lang: d.lang === "RU" ? "RU" : "EN", dur: dur(d) };
    return Object.keys(sel).every(function (k) { return !sel[k].length || sel[k].indexOf(v[k]) >= 0; });
  }
  function order(a, b) {
    if (sort.value === "price") return a.price - b.price;
    var k = sort.value === "new" ? "новинка" : "хит";
    return (b.badges.indexOf(k) >= 0) - (a.badges.indexOf(k) >= 0);
  }
  function syncChips() {
    dlg.querySelectorAll("[data-f]").forEach(function (g) {
      g.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", sel[g.dataset.f].indexOf(c.dataset.v) >= 0 ? "true" : "false"); });
    });
    var n = Object.keys(sel).reduce(function (s, k) { return s + sel[k].length; }, 0);
    document.getElementById("fcount").textContent = n ? "· " + n : "";
    document.getElementById("openFilters").setAttribute("aria-pressed", n ? "true" : "false");
  }
  function render() {
    var list = all.filter(match).sort(order);
    grid.innerHTML = list.map(WD.card).join("");
    document.getElementById("empty").hidden = list.length > 0;
    document.getElementById("total").textContent = list.length === all.length ? all.length : list.length + " из " + all.length;
    syncChips();
  }
  function reset() { Object.keys(sel).forEach(function (k) { sel[k] = []; }); q.value = ""; render(); }
  dlg.addEventListener("click", function (e) {
    var c = e.target.closest(".chip"); if (!c) return;
    var arr = sel[c.parentNode.dataset.f], i = arr.indexOf(c.dataset.v);
    if (i >= 0) arr.splice(i, 1); else arr.push(c.dataset.v);
    // на десктопе фильтры — боковая колонка, применяем сразу
    if (wide.matches) render(); else syncChips();
  });
  dlg.addEventListener("close", render);
  document.getElementById("openFilters").addEventListener("click", function () { dlg.showModal(); });
  document.getElementById("reset").addEventListener("click", function () { Object.keys(sel).forEach(function (k) { sel[k] = []; }); if (wide.matches) render(); else syncChips(); });
  document.getElementById("reset2").addEventListener("click", reset);
  q.addEventListener("input", render); sort.addEventListener("change", render);
  WD.load().then(function (d) { all = d; render(); });
  // поиск из шапки: catalog.html#q
  if (location.hash === "#q") q.focus();
})();
