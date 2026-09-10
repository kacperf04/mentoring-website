/* =====================================================
   Mentoring Studencki — interakcje
===================================================== */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Obługa formularza newslettera */
  async function handleNewsletterFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const emailInput = form.email.value;
    const honeyPot = form.website.value;
    const submitButton = form.querySelector('button[type="submit"]');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      showToast("Podaj poprawny adres e-mail.", "error");
      return;
    }

    if (honeyPot) {
      form.reset();
      showToast("Dziękujemy za zapisanie się do newslettera!", "success");
      const popup = document.getElementById("popupNews");
      if (popup) popup.dispatchEvent(new Event("newsletter:success"));
      return;
    }

    if (localStorage.getItem("newsletter_subscribed")) {
      form.reset();
      showToast("Już jesteś zapisany!", "success");
      const popup = document.getElementById("popupNews");
      if (popup) popup.dispatchEvent(new Event("newsletter:success"));
      return;
    }

    submitButton.textContent = "Zapisuję...";
    submitButton.classList.toggle("btn-orange-disabled");
    submitButton.disabled = true;

    const scriptURL = "https://script.google.com/macros/s/AKfycby6srDlpLF2tasRy7gmBka1ilSaHTspa8vKfxJhNf7YxgD-_fjPcWdRmpI5Dea54LL8/exec"; // i tak będzie widoczne w network tabie więc no worries, że jest odkryte

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({ email: emailInput })
      });

      const result = await response.json();

      if (result.status == "success" || result.message == "Już jesteś na liście!") {
        showToast("Dziękujemy za zapisanie się do newslettera!", "success");
        localStorage.setItem("newsletter_subscribed", "true");
        form.reset();
        const popup = document.getElementById("popupNews");
        if (popup) {
          popup.dispatchEvent(new Event("newsletter:success"));
        }
      } else {
        showToast(result.message || "Coś poszło nie tak :( Spróbuj ponownie", "error");
      }
    } catch (error) {
      showToast("Błąd połączenia :( Spróbuj ponownie", "error");
    } finally {
      submitButton.textContent = "Powiadom mnie";
      submitButton.classList.toggle("btn-orange-disabled");
      submitButton.disabled = false;
    }
  }

  const newsForms = document.querySelectorAll(".news-form");
  newsForms.forEach(form => {
    form.addEventListener("submit", handleNewsletterFormSubmit);
  });

  function showToast(message, type="success") {
    const container = document.getElementById("toast-container");

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3500);
  }

  /* ---------- popup newsletter ---------- */
const popup = document.getElementById("popupNews");
  const popupClose = document.getElementById("popupClose");
 
  const isPopupDismissed = localStorage.getItem("popup_dismissed");
  const isSubscribed = localStorage.getItem("newsletter_subscribed");
 
  if (popup && !isPopupDismissed && !isSubscribed) {
    setTimeout(() => {
      popup.hidden = false;
      requestAnimationFrame(() => {
        popup.classList.add("show");
        popup.setAttribute("aria-hidden", "false");
      });
    }, 1000);
 
    const hidePopup = () => {
      popup.classList.remove("show");
      popup.setAttribute("aria-hidden", "true");
      localStorage.setItem("popup_dismissed", "true");
      
      setTimeout(() => {
        popup.hidden = true;
      }, 500); 
    };
 
    popupClose.addEventListener("click", hidePopup);
 
    popup.addEventListener("newsletter:success", () => {
      setTimeout(hidePopup, 500);
    });
  }



  /* ---------- mobile menu ---------- */
  var nav = document.querySelector(".nav");
  var burger = document.getElementById("burger");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".mobile-menu a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = Math.min(i * 60, 240) + "ms";
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- marker underline ---------- */
  var marks = document.querySelectorAll(".mark");
  if ("IntersectionObserver" in window && !reduced) {
    var mio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-drawn"); mio.unobserve(e.target); }
      });
    }, { threshold: 0.7 });
    marks.forEach(function (m) { mio.observe(m); });
  } else {
    marks.forEach(function (m) { m.classList.add("is-drawn"); });
  }

  /* ---------- animated counters ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduced) { el.textContent = target + suffix; return; }
    var dur = 1400, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- ścieżki: przełącznik roli (opis + rekrutacja) ---------- */
  var tabSpec = document.getElementById("tabSpec");
  var tabLider = document.getElementById("tabLider");
  var slider = document.querySelector(".pt-slider");
  var liderStep = document.querySelector(".tl-lider");
  var roleSpec = document.getElementById("roleSpec");
  var roleLider = document.getElementById("roleLider");

  function positionSlider(btn) {
    if (!slider || !btn) return;
    slider.style.width = btn.offsetWidth + "px";
    slider.style.transform = "translateX(" + (btn.offsetLeft - 6) + "px)";
  }
  function setPath(path) {
    var isLider = path === "lider";
    tabSpec.classList.toggle("active", !isLider);
    tabLider.classList.toggle("active", isLider);
    tabSpec.setAttribute("aria-selected", String(!isLider));
    tabLider.setAttribute("aria-selected", String(isLider));
    positionSlider(isLider ? tabLider : tabSpec);
    if (liderStep) liderStep.hidden = !isLider;
    if (roleSpec) roleSpec.classList.toggle("active", !isLider);
    if (roleLider) roleLider.classList.toggle("active", isLider);
  }
  if (tabSpec && tabLider) {
    tabSpec.addEventListener("click", function () { setPath("spec"); });
    tabLider.addEventListener("click", function () { setPath("lider"); });
    window.addEventListener("resize", function () {
      positionSlider(tabLider.classList.contains("active") ? tabLider : tabSpec);
    });
    requestAnimationFrame(function () { setPath("spec"); });
  }

  /* ---------- wieloetapowy formularz Mentee ---------- */
  var menteeForm = document.getElementById("menteeApplicationForm");
  if (menteeForm) {
    var formSteps = Array.from(menteeForm.querySelectorAll(".form-step"));
    var formProgressBar = document.getElementById("menteeProgressBar");
    var formProgressCount = document.getElementById("menteeProgressCount");
    var formProgressSteps = Array.from(document.querySelectorAll(".progress-steps span"));
    var formPrev = document.getElementById("menteePrev");
    var formNext = document.getElementById("menteeNext");
    var formSubmit = document.getElementById("menteeSubmit");
    var formStatus = document.getElementById("menteeFormStatus");
    var formSuccess = document.getElementById("menteeApplicationSuccess");
    var currentFormStep = 0;

    function setFormStatus(message, type) {
      if (!formStatus) return;
      formStatus.textContent = message || "";
      formStatus.classList.toggle("success", type === "success");
    }

    function showFormStep(index, shouldScroll) {
      currentFormStep = Math.max(0, Math.min(index, formSteps.length - 1));
      formSteps.forEach(function (step, stepIndex) {
        var active = stepIndex === currentFormStep;
        step.hidden = !active;
        step.classList.toggle("active", active);
      });

      var stepNumber = currentFormStep + 1;
      if (formProgressBar) formProgressBar.style.width = ((stepNumber / formSteps.length) * 100) + "%";
      if (formProgressCount) formProgressCount.textContent = "Krok " + stepNumber + " z " + formSteps.length;
      formProgressSteps.forEach(function (step, stepIndex) {
        step.classList.toggle("active", stepIndex === currentFormStep);
      });
      if (formPrev) formPrev.hidden = currentFormStep === 0;
      if (formNext) formNext.hidden = currentFormStep === formSteps.length - 1;
      if (formSubmit) formSubmit.hidden = currentFormStep !== formSteps.length - 1;
      setFormStatus("");

      if (shouldScroll) {
        var shell = document.querySelector(".application-shell");
        if (shell) shell.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      }
    }

    function validateCurrentStep() {
      var fields = Array.from(formSteps[currentFormStep].querySelectorAll("input, textarea, select"));
      var invalid = fields.find(function (field) { return !field.checkValidity(); });
      if (invalid) {
        invalid.reportValidity();
        return false;
      }
      return true;
    }

    function focusFirstInvalid() {
      var invalid = menteeForm.querySelector(":invalid");
      if (!invalid) return false;
      var step = invalid.closest(".form-step");
      var stepIndex = formSteps.indexOf(step);
      if (stepIndex >= 0 && stepIndex !== currentFormStep) showFormStep(stepIndex, false);
      invalid.focus();
      invalid.reportValidity();
      return true;
    }

    if (formNext) {
      formNext.addEventListener("click", function () {
        if (validateCurrentStep()) showFormStep(currentFormStep + 1, true);
      });
    }
    if (formPrev) {
      formPrev.addEventListener("click", function () { showFormStep(currentFormStep - 1, true); });
    }

    menteeForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (focusFirstInvalid()) return;

      var endpoint = menteeForm.dataset.endpoint.trim();
      if (!endpoint) {
        setFormStatus("Formularz jest gotowy. Dodaj link do Google Apps Script w atrybucie data-endpoint formularza.");
        return;
      }

      var payload = Object.fromEntries(new FormData(menteeForm).entries());
      payload.application_type = "Mentee";

      formSubmit.disabled = true;
      formSubmit.classList.add("btn-orange-disabled");
      formSubmit.innerHTML = "Wysyłam...";
      setFormStatus("");

      try {
        var response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        });
        var raw = await response.text();
        var result = {};
        try { result = raw ? JSON.parse(raw) : {}; } catch (parseError) { result = { message: raw }; }

        if (!response.ok || (result.status && result.status !== "success" && result.result !== "success")) {
          throw new Error(result.message || "Nie udało się wysłać zgłoszenia.");
        }

        menteeForm.hidden = true;
        if (formSuccess) formSuccess.hidden = false;
        setFormStatus("", "success");
      } catch (error) {
        setFormStatus(error.message || "Błąd połączenia. Spróbuj ponownie.");
      } finally {
        formSubmit.disabled = false;
        formSubmit.classList.remove("btn-orange-disabled");
        formSubmit.innerHTML = 'Wyślij zgłoszenie <span aria-hidden="true">↗</span>';
      }
    });

    showFormStep(0, false);
  }

  /* ---------- mentorzy: modal bio ---------- */
  var modal = document.getElementById("mentorModal");
  if (modal) {
    var mAvatar = document.getElementById("modalAvatar");
    var mName = document.getElementById("modalName");
    var mRole = document.getElementById("modalRole");
    var mBio = document.getElementById("modalBio");
    var lastFocus = null;

    function openModal(card) {
      lastFocus = card;
      var av = card.querySelector(".m-avatar");
      mAvatar.textContent = av.textContent;
      mAvatar.className = av.className;
      mName.textContent = card.querySelector("b").textContent;
      mRole.textContent = card.querySelector("small").textContent;
      mBio.textContent = card.getAttribute("data-bio") || "";
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      document.getElementById("modalClose").focus();
    }
    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }
    document.querySelectorAll(".mentor-card").forEach(function (card) {
      card.addEventListener("click", function () { openModal(card); });
    });
    document.getElementById("modalClose").addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
  }

  /* ---------- galeria społeczności: parallax na scroll ---------- */
  var rows = document.querySelectorAll(".sg-row");
  if (rows.length && !reduced) {
    var ticking = false;
    function updateRows() {
      if (window.innerWidth <= 768) {
        rows.forEach(function (row) {
           row.style.transform = "none"; 
        });
        ticking = false;
        return;
      }
      var vh = window.innerHeight;
      rows.forEach(function (row) {
        var rect = row.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          var progress = (vh - rect.top) / (vh + rect.height); // 0..1
          var speed = parseFloat(row.getAttribute("data-speed") || "1");
          var shift = (progress - 0.5) * 220 * speed;
          row.style.transform = "translateX(" + shift + "px)";
        }
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(updateRows); ticking = true; }
    }, { passive: true });
    updateRows();
  }

/* ---------- FAQ: jedno otwarte + smooth ---------- */
const faqs = document.querySelectorAll(".faq details");

faqs.forEach(details => {
  const content = details.querySelector(".fq-a");

  // ustaw stan początkowy
  if (details.open) {
    content.style.height = content.scrollHeight + "px";
  }

  details.addEventListener("toggle", () => {

    if (details.open) {

      // zamknij pozostałe
      faqs.forEach(other => {
        if (other !== details && other.open) {
          other.querySelector(".fq-a").style.height =
            other.querySelector(".fq-a").scrollHeight + "px";

          requestAnimationFrame(() => {
            other.querySelector(".fq-a").style.height = "0px";
          });

          setTimeout(() => {
            other.open = false;
          }, 350);
        }
      });

      // otwieranie
      content.style.height = "0px";

      requestAnimationFrame(() => {
        content.style.height = content.scrollHeight + "px";
      });

    } else {

      // zamykanie
      content.style.height = content.scrollHeight + "px";

      requestAnimationFrame(() => {
        content.style.height = "0px";
      });

    }

  });

});
  /* ---------- role bottom sheet (ścieżki) ---------- */
  var roleSheet = document.getElementById("roleSheet");
  var roleSheetTitle = document.getElementById("roleSheetTitle");
  var roleSheetDesc = document.getElementById("roleSheetDesc");
  var roleSheetIcon = document.getElementById("roleSheetIcon");
  var roleSheetClose = document.getElementById("roleSheetClose");
  var lastActiveChip = null;

  // Opisy dla każdej roli (możesz swobodnie edytować)
  var roleData = {
    "Marketing": {
      icon: "img/Marketing.png",
      desc: "Specjalista ds. marketingu odpowiada za promocję wydarzeń, tworzenie strategii komunikacji, zarządzanie kampaniami i budowanie rozpoznawalności marki Kanału Studenckiego. Nauczysz się tworzyć angażujące treści, analizować wyniki kampanii i współpracować z mediami."
    },
    "Analityka danych": {
      icon: "img/Analityka_danych.png",
      desc: "Analityk danych zbiera, przetwarza i wizualizuje dane dotyczące działalności fundacji. Będziesz pracować z arkuszami kalkulacyjnymi, tworzyć dashboardy i raporty wspierające decyzje zarządu. Idealna ścieżka dla osób lubiących liczby i wyciąganie wniosków."
    },
    "Project & Event Management": {
      icon: "img/Project_Event_Development.png",
      desc: "Zarządzanie projektami i eventami to serce działalności fundacji. Będziesz koordynować organizację wydarzeń studenckich, warsztatów i konferencji – od planowania budżetu, przez logistykę, po zarządzanie zespołem w dynamicznym środowisku."
    },
    "Software Development": {
      icon: "img/Software_Development.png",
      desc: "Ścieżka dla przyszłych programistów! Współtworzysz realne narzędzia i strony internetowe fundacji, ucząc się praktycznego kodowania. Poznasz pracę w zespole developerskim, code review, nowoczesne technologie webowe i dobre praktyki."
    },
    "Grafika / UX": {
      icon: "img/Grafika.png",
      desc: "Grafik / UX designer odpowiada za wizualną stronę projektów – od postów w social mediach, przez plakaty, po interfejsy aplikacji. Nauczysz się tworzyć estetyczne, spójne i funkcjonalne projekty, które przyciągają uwagę."
    },
    "Social media": {
      icon: "img/Social_Media.png",
      desc: "Specjalista social media zarządza profilami fundacji na Instagramie, Facebooku, TikToku i LinkedIn. Będziesz tworzyć angażujące treści, planować kalendarz publikacji, analizować statystyki i budować aktywną społeczność wokół Kanału Studenckiego."
    },
    "HR & Employer Branding": {
      icon: "img/HR.png",
      desc: "HR i Employer Branding to ścieżka dla osób, które chcą dbać o atmosferę w zespole i wizerunek fundacji. Zajmiesz się rekrutacją, onboardigiem nowych członków, budowaniem kultury organizacyjnej oraz integracjami zespołowymi."
    }
  };

  function openRoleSheet(chip) {
    var roleName = chip.textContent.trim();
    var data = roleData[roleName];
    if (!data) return;

    lastActiveChip = chip;
    roleSheetIcon.innerHTML = '<img src="' + data.icon + '" alt="Ikona ' + roleName + '" class="custom-role-icon">';
    roleSheetTitle.textContent = roleName;
    roleSheetDesc.textContent = data.desc;
    roleSheet.hidden = false;
    document.body.style.overflow = "hidden";
    roleSheetClose.focus();
  }

  function closeRoleSheet() {
    roleSheet.hidden = true;
    document.body.style.overflow = "";
    if (lastActiveChip) {
      lastActiveChip.focus();
      lastActiveChip = null;
    }
  }

  // Podepnij zdarzenia do wszystkich chipów
  var chips = document.querySelectorAll(".paths-chips span");
  chips.forEach(function (chip) {
    chip.setAttribute("role", "button");
    chip.setAttribute("tabindex", "0");

    chip.addEventListener("click", function () {
      openRoleSheet(chip);
    });

    chip.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openRoleSheet(chip);
      }
    });
  });

  // Zamknij: przycisk X
  if (roleSheetClose) {
    roleSheetClose.addEventListener("click", closeRoleSheet);
  }

  // Zamknij: kliknięcie w overlay (tło)
  if (roleSheet) {
    roleSheet.addEventListener("click", function (e) {
      if (e.target === roleSheet) closeRoleSheet();
    });
  }

  // Zamknij: klawisz Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && roleSheet && !roleSheet.hidden) {
      closeRoleSheet();
    }
  });})();
