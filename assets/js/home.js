// Первый экран: нарезка 4 фрагментов по кругу. Подборщик: собирает ссылку в каталог.
(function () {
  // телефон: одна лента 1→2→3→4; широкий экран (≥1280): две ленты, 1→3 и 2→4
  function loop(v, list) {
    var k = 0;
    v.addEventListener("ended", function () {
      k = (k + 1) % list.length; v.poster = "assets/media/hero-" + list[k] + "-poster.jpg"; v.src = "assets/media/hero-" + list[k] + ".mp4"; v.play().catch(function () {});
    });
  }
  var v = document.getElementById("heroVideo"), v2 = document.getElementById("heroVideo2");
  var two = v2 && matchMedia("(min-width: 1280px)").matches;
  if (v) loop(v, two ? [1, 3] : [1, 2, 3, 4]);
  if (two) { v2.src = "assets/media/hero-2.mp4"; v2.autoplay = true; v2.play().catch(function () {}); loop(v2, [2, 4]); }
  // подборщик (3 варианта раскладки, ?picker=): кнопка показывает, сколько танцев найдется
  var data = null, pks = [];
  var moodPhoto = { romantic: "assets/media/couple-2.jpg", energetic: "assets/media/cover-miyagi-polovina-moya.jpg", calm: "assets/media/cover-westlife-nothings-gonna-change.jpg" };
  function plural(n) { var m = n % 10, h = n % 100; return m === 1 && h !== 11 ? "танец" : m >= 2 && m <= 4 && (h < 12 || h > 14) ? "танца" : "танцев"; }
  function count(mood, level) { return data.filter(function (d) { return d.mood === mood && String(d.level) === String(level); }).length; }
  document.querySelectorAll(".pk").forEach(function (pk) {
    var st = {}, go = pk.querySelector(".pk-go"), lv = pk.querySelector('[data-pick="level"]');
    function items(g) { return g.tagName === "SELECT" ? [].slice.call(g.options) : [].slice.call(g.querySelectorAll("[data-v]")); }
    function val(o) { return o.dataset.v || o.value; }
    function set(g, o) { if (g.tagName === "SELECT") g.value = o.value; else items(g).forEach(function (c) { c.setAttribute("aria-pressed", c === o ? "true" : "false"); }); st[g.dataset.pick] = val(o); }
    function upd() {
      if (!data) return;
      // настроение выбирается всегда; уровни без танцев при этом настроении выключаются
      items(lv).forEach(function (o) { o.disabled = count(st.mood, val(o)) === 0; });
      if (!count(st.mood, st.level)) set(lv, items(lv).filter(function (o) { return !o.disabled; })[0]);
      var n = count(st.mood, st.level);
      go.href = "catalog.html?mood=" + st.mood + "&level=" + st.level;
      go.textContent = "Показать " + n + " " + plural(n);
    }
    pk.querySelectorAll("[data-pick]").forEach(function (g) {
      var k = g.dataset.pick;
      if (g.tagName === "SELECT") { st[k] = g.value; g.addEventListener("change", function () { st[k] = g.value; upd(); }); return; }
      st[k] = g.querySelector('[aria-pressed="true"]').dataset.v;
      g.addEventListener("click", function (e) {
        var b = e.target.closest("[data-v]"); if (!b || b.disabled) return; set(g, b); upd();
        // в варианте split фото слева меняется вместе с настроением
        var img = pk.querySelector(".pk__media"); if (img && k === "mood") img.src = moodPhoto[b.dataset.v];
      });
    });
    pks.push(upd);
  });
  if (window.WD) WD.load().then(function (d) { data = d; pks.forEach(function (f) { f(); }); });
})();
// Хиты из data/dances.json (разметка в HTML — запасной вариант без JS)
(function () {
  var box = document.getElementById("hits"); if (!box || !window.WD) return;
  WD.load().then(function (d) { box.innerHTML = d.filter(function (x) { return x.badges.indexOf("хит") >= 0; }).slice(0, 4).map(WD.card).join(""); });
})();
