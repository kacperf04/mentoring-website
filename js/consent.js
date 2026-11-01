(function () {
  "use strict";

  var STORAGE_KEY = "ks_cookie_consent_v1";
  var CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  var META_PIXEL_ID = "1693340262211938";
  var currentChoice = readChoice();
  var lastFocusedElement = null;

  function readChoice() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || typeof saved.marketing !== "boolean" || !saved.savedAt) return null;
      if (Date.now() - saved.savedAt > CONSENT_MAX_AGE) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return saved;
    } catch (error) {
      return null;
    }
  }

  function saveChoice(marketing) {
    currentChoice = {
      marketing: marketing,
      savedAt: Date.now()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentChoice));
    } catch (error) {
      // If storage is unavailable, the visitor will be asked again next time.
    }

    if (marketing) {
      loadMetaPixel();
    } else {
      if (typeof window.fbq === "function") window.fbq("consent", "revoke");
      clearMetaCookies();
    }

    closeBanner();
  }

  function clearMetaCookies() {
    ["_fbp", "_fbc"].forEach(function (name) {
      document.cookie = name + "=; Max-Age=0; path=/; SameSite=Lax";
      document.cookie = name + "=; Max-Age=0; path=/; domain=." + window.location.hostname + "; SameSite=Lax";
    });
  }

  function loadMetaPixel() {
    if (window.fbq && window.fbq.loaded) return;

    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js"));

    window.fbq("init", META_PIXEL_ID);
    window.fbq("track", "PageView");
  }

  function createBanner() {
    var banner = document.createElement("section");
    banner.id = "cookieConsent";
    banner.className = "cookie-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-labelledby", "cookieConsentTitle");
    banner.setAttribute("aria-describedby", "cookieConsentDescription");
    banner.setAttribute("aria-modal", "false");
    banner.hidden = true;
    banner.innerHTML =
      '<div class="cookie-consent__inner">' +
        '<div class="cookie-consent__copy">' +
          '<div>' +
            '<h2 id="cookieConsentTitle">Twoja prywatność, Twój wybór.</h2>' +
            '<p id="cookieConsentDescription">Korzystamy z niezbędnych plików cookie, aby strona działała prawidłowo. Za Twoją zgodą użyjemy również opcjonalnych technologii do pomiaru odwiedzin i działań promocyjnych. Szczegóły znajdziesz w <a href="https://kanalstudencki.pl/polityka-prywatnosci/" target="_blank" rel="noopener">polityce prywatności</a>.</p>' +
          '</div>' +
        '</div>' +
        '<div class="cookie-consent__actions">' +
          '<button class="cookie-consent__button cookie-consent__button--reject" type="button" data-consent-reject>Tylko niezbędne</button>' +
          '<button class="cookie-consent__button cookie-consent__button--accept" type="button" data-consent-accept>Akceptuję wszystkie</button>' +
        '</div>' +
      '</div>';

    banner.querySelector("[data-consent-reject]").addEventListener("click", function () {
      saveChoice(false);
    });
    banner.querySelector("[data-consent-accept]").addEventListener("click", function () {
      saveChoice(true);
    });

    document.body.appendChild(banner);
  }

  function createSettingsButton() {
    var footerBottom = document.querySelector("footer .foot-bottom");
    if (!footerBottom) return;
    var footerLegalLinks = footerBottom.querySelector(".footer-legal-links");

    var button = document.createElement("button");
    button.type = "button";
    button.className = "cookie-settings-button";
    button.textContent = "Ustawienia cookies";
    button.addEventListener("click", openBanner);
    (footerLegalLinks || footerBottom).appendChild(button);
  }

  function openBanner() {
    var banner = document.getElementById("cookieConsent");
    if (!banner) return;
    lastFocusedElement = document.activeElement;
    banner.hidden = false;
    document.body.classList.add("cookie-consent-open");
    banner.querySelector("[data-consent-reject]").focus();
  }

  function closeBanner() {
    var banner = document.getElementById("cookieConsent");
    if (!banner) return;
    banner.hidden = true;
    document.body.classList.remove("cookie-consent-open");
    if (lastFocusedElement && lastFocusedElement !== document.body) lastFocusedElement.focus();
    lastFocusedElement = null;
  }

  function init() {
    createBanner();
    createSettingsButton();

    if (currentChoice && currentChoice.marketing) loadMetaPixel();
    if (!currentChoice) openBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}());
