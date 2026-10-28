// Общая карточка танца для главной и каталога. Данные — data/dances.json.
window.WD = {
  levelName: { 1: "Просто", 2: "Средне", 3: "Сложнее" },
  money: function (n) { return n.toLocaleString("ru-RU").replace(/ /g, " ") + " ₽"; },
  esc: function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); },
  card: function (d) {
    var e = WD.esc, badge = d.badges.length ? '<span class="badge">' + e(d.badges[0][0].toUpperCase() + d.badges[0].slice(1)) + "</span>" : "";
    return "<a class=\"card\" href=\"dance.html?slug=" + e(d.slug) + '"><div class="card__media"><img src="' + e(d.cover) + '" alt="" width="600" height="750" loading="lazy">' + badge +
      '<span class="card__cover"><span class="card__eyebrow">Готовый танец</span><span class="card__song">' + e(d.song) + '</span></span>' +
      '</div><span class="card__title">' + e(d.artist) + '<span class="card__artist">' + e(d.style) + " · танец " + e(d.danceDuration) + '</span></span><span class="card__meta"><span class="level" data-level="' + d.level +
      '"><span class="level__marks" aria-hidden="true"><b>1</b><b>2</b><b>3</b></span>' + WD.levelName[d.level] + '</span><span class="card__price">' + WD.money(d.price) + "</span></span></a>";
  },
  load: function () { return fetch("data/dances.json").then(function (r) { return r.json(); }); }
};
