// Карточка танца по ?slug= из data/dances.json. Липкая кнопка, когда основная ушла с экрана.
// Оплаты на сайте пока нет: «Оформить заказ» открывает форму, заказ уходит заявкой в Telegram Насти (в макете — только экран успеха).
(function () {
  var slug = new URLSearchParams(location.search).get("slug") || "lazarev-zagaday-lyubov", $ = function (id) { return document.getElementById(id); };
  var d = null;
  function review() { return document.querySelector('input[name="pkg"]:checked').value === "review"; }
  WD.load().then(function (all) {
    d = all.find(function (x) { return x.slug === slug; }) || all[0];
    document.title = d.artist + " — " + d.song + ": урок свадебного танца — WED DANCE";
    $("title").textContent = d.song; $("artist").textContent = d.artist + " · видеоурок свадебного танца";
    $("badges").innerHTML = d.badges.map(function (b) { return '<span class="badge">' + WD.esc(b[0].toUpperCase() + b.slice(1)) + "</span>"; }).join("");
    $("meta").innerHTML = '<span class="level" data-level="' + d.level + '"><span class="level__marks" aria-hidden="true"><b>1</b><b>2</b><b>3</b></span>' + WD.levelName[d.level] +
      "</span><span>" + WD.esc(d.style) + "</span><span>танец " + WD.esc(d.danceDuration) + "</span><span>урок " + WD.esc(d.lessonDuration) + "</span>";
    $("p1").textContent = WD.money(d.price); $("barSong").textContent = d.song;
    $("about").textContent = d.about;
    // разбор под счет есть не во всех уроках; поддержки — не во всех танцах
    if (d.count) $("countLine").textContent = "Каждую связку под счет, потом под музыку.";
    if (!d.lifts) $("liftsLine").remove();
    $("lessonLen").textContent = "Длина урока — " + d.lessonDuration + ", танца — " + d.danceDuration + ".";
    function pkg() { $("barPrice").textContent = WD.money(d.price) + (review() ? " + разбор" : ""); }
    document.querySelectorAll('input[name="pkg"]').forEach(function (r) { r.addEventListener("change", pkg); });
    pkg();
    $("preview").poster = d.cover;
    if (d.level === 3) $("simple").hidden = false;
  });

  // форма заказа
  var dlg = $("order"), form = $("orderForm"), done = $("orderDone");
  function open() {
    if (!d) return;
    $("oCover").src = d.cover; $("oSong").textContent = d.song;
    $("oPkg").textContent = review() ? "Урок + разбор вашего видео" : "Видеоурок";
    $("oPrice").textContent = WD.money(d.price) + (review() ? " + [цена]" : "");
    form.hidden = false; done.hidden = true;
    dlg.showModal();
  }
  document.querySelectorAll("#buyBtn, [data-order]").forEach(function (b) { b.addEventListener("click", open); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });
  function check(name, ok) { var f = form.elements[name].closest(".fld"); f.classList.toggle("is-bad", !ok); return ok; }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = check("name", form.elements.name.value.trim().length > 1);
    ok = check("phone", form.elements.phone.value.replace(/\D/g, "").length === 11) && ok;
    var agree = form.elements.agree.checked; $("agreeErr").hidden = agree; ok = agree && ok;
    if (!ok) { (form.querySelector(".is-bad input") || form.elements.agree).focus(); return; }
    $("oMsg").textContent = form.elements.msg.value === "whatsapp" ? "WhatsApp" : "Telegram";
    form.hidden = true; done.hidden = false;
  });
  form.addEventListener("input", function (e) { var f = e.target.closest(".is-bad"); if (f) f.classList.remove("is-bad"); if (e.target.name === "agree") $("agreeErr").hidden = true; });

  var btn = $("buyBtn"), bar = $("buybar");
  // панель видна всегда, когда основная кнопка видна не целиком (в Instagram/Safari экран ниже 844)
  if ("IntersectionObserver" in window) new IntersectionObserver(function (es) {
    bar.hidden = es[0].intersectionRatio >= 1;
  }, { threshold: [0, 1] }).observe(btn);
})();
