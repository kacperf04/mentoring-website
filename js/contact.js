(function () {
  "use strict";

  var form = document.getElementById("mentorContactForm");
  var status = document.getElementById("mentorContactStatus");

  if (!form || !status) return;

  var submitButton = form.querySelector('button[type="submit"]');
  var requiredFields = Array.prototype.slice.call(form.querySelectorAll("[required]"));

  function setStatus(message, type) {
    status.textContent = message;
    status.className = "mentor-contact-status" + (type ? " is-" + type : "");
  }

  function clearFieldError(event) {
    event.target.removeAttribute("aria-invalid");
    if (status.classList.contains("is-error")) setStatus("", "");
  }

  requiredFields.forEach(function (field) {
    field.addEventListener("input", clearFieldError);
    field.addEventListener("change", clearFieldError);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      var invalidField = form.querySelector(":invalid");
      if (invalidField) {
        invalidField.setAttribute("aria-invalid", "true");
        invalidField.focus();
      }
      setStatus("Uzupełnij wymagane pola i sprawdź adres e-mail.", "error");
      form.reportValidity();
      return;
    }

    var data = new FormData(form);

    if (String(data.get("website") || "").trim()) {
      form.reset();
      setStatus("Dziękujemy. Wiadomość jest gotowa do wysłania.", "success");
      return;
    }

    var name = String(data.get("name") || "").trim();
    var email = String(data.get("email") || "").trim();
    var contactType = String(data.get("contactType") || "").trim();
    var message = String(data.get("message") || "").trim();
    var subject = "Kontakt ze strony Programu Mentoringowego";
    var body = [
      "Dzień dobry,",
      "",
      message,
      "",
      "---",
      "Imię: " + name,
      "Adres e-mail: " + email,
      "Zgłasza się: " + (contactType || "Nie podano")
    ].join("\n");
    var mailto = "mailto:kontakt@kanalstudencki.pl?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

    submitButton.disabled = true;
    submitButton.textContent = "Otwieram…";
    setStatus("Otwieramy program pocztowy z przygotowaną wiadomością.", "success");
    window.location.href = mailto;

    window.setTimeout(function () {
      submitButton.disabled = false;
      submitButton.textContent = "Wyślij";
    }, 1200);
  });
})();
