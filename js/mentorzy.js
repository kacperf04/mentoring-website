(function () {
  "use strict";

  var modal = document.getElementById("mentorPathModal");
  var dialog = modal ? modal.querySelector(".mentor-path-modal-dialog") : null;
  var closeButton = document.getElementById("mentorPathModalClose");
  var title = document.getElementById("mentorPathModalTitle");
  var lead = document.getElementById("mentorPathModalLead");
  var content = document.getElementById("mentorPathModalContent");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".mentor-path-card[data-path]"));
  var lastTrigger = null;

  if (!modal || !dialog || !closeButton || !title || !lead || !content || !cards.length) return;

  var pathData = {
    "marketing": {
      title: "Marketing",
      lead: "Wesprzyj studentów w zrealizowaniu kampanii społecznych",
      overview: "Zespół mentees realizuje kompleksowe działania marketingowe od strategii po wdrożenie:",
      projectItems: [
        "2 autorskie kampanie społeczne: Od pomysłu, przez strategię i kreację, po nagrania, montaż i promocję",
        "Brand Building: Budowanie marki osobistej i komunikacji misji \"Twój rozwój ma znaczenie\"",
        "Social Media & Performance: Prowadzenie kanałów (IG, TikTok, LinkedIn)"
      ],
      areas: [
        "Content Creation, Montaż Video, Copywriting, PR",
        "Canva Pro | CapCut Pro | Meta Business Suite | Google Analytics"
      ],
      audience: "Praktyków z obszaru marketingu, PR, strategii marki, performance marketingu oraz content creatorów.",
      role: "Ukierunkowanie strategiczne, walidacja pomysłów i feedback do kampanii i projektu. Zespół samodzielnie wykonuje montaż, grafiki i publikacje oraz realizuje kampanie."
    },
    "event-management": {
      title: "Event Management",
      lead: "Pomagaj organizować regularne eventy",
      overview: "Zespół realizuje kompleksową organizację wydarzeń od konceptu po ewaluację:",
      projectItems: [
        "Eventy Merytoryczne lub Networkingowe: Organizacja cyklicznych spotkań stacjonarnych oraz online dla studentów (m.in. cykl Kompetentni oraz Impuls)",
        "Planowanie i Logistyka: Tworzenie harmonogramów i agend, pozyskiwanie prelegentów, dobór lokalizacji oraz koordynacja przebiegu wydarzenia",
        "Promocja i Współpraca: Rejestracja uczestników, zbieranie frekwencji oraz zlecanie materiałów promocyjnych dedykowanemu zespołowi marketingu"
      ],
      audience: "Praktyków z obszaru Event Managementu, organizacji konferencji, warsztatów i wydarzeń networkingowych oraz doświadczonych Project Managerów.",
      role: "Wsparcie w planowaniu i organizacji cyklicznych wydarzeń, konsultowanie kluczowych decyzji logistycznych oraz mentoring 1:1 dla Mentee Lidera w zakresie zarządzania ludźmi. Zespół samodzielnie odpowiada za egzekucję, dopinanie miejsc i kontakt z prelegentami."
    },
    "ai-engineering": {
      title: "AI Engineering",
      lead: "Wesprzyj studentów w zbudowaniu asystenta AI",
      overview: "Zespół mentees wzbogaca platformę do nauki matematyki tumatura.pl o nowy moduł oparty na sztucznej inteligencji:",
      projectItems: [
        "Integracja Asystenta AI: Projektowanie i implementacja chatbota opartego na LLM, który kompleksowo wspiera uczniów w przygotowaniach do matury podstawowej z matematyki",
        "Pełny cykl tworzenia funkcji (End-to-End): Projektowanie makiet UI, programowanie frontendu i backendu, integracja API, konteneryzacja oraz wdrożenie"
      ],
      areas: [
        "AI Engineering, Web Development, Architektura LLM, Git Flow, CI/CD, Docker",
        "JavaScript | Python | Git | Docker | Bash | REST API / LLM APIs"
      ],
      audience: "Senior / Mid Developerów, Tech Leadów, AI/ML Engineerów oraz doświadczonych Programistów (Fullstack, Frontend, Backend) chcących dzielić się wiedzą inżynieryjną.",
      role: "Code review, wsparcie w wyborze architektury oprogramowania, dbanie o dobre praktyki (Clean Code, Git) oraz mentoring 1:1 dla Mentee Lidera. Zespół samodzielnie pisze kod, tworzy interfejsy i stawia środowisko produkcyjne."
    }
  };

  function appendSection(heading, paragraph, items, extraClass) {
    var section = document.createElement("section");
    section.className = "mentor-path-modal-section" + (extraClass ? " " + extraClass : "");

    var sectionTitle = document.createElement("h4");
    sectionTitle.textContent = heading;
    section.appendChild(sectionTitle);

    if (paragraph) {
      var sectionParagraph = document.createElement("p");
      sectionParagraph.textContent = paragraph;
      section.appendChild(sectionParagraph);
    }

    if (items && items.length) {
      var list = document.createElement("ul");
      items.forEach(function (item) {
        var listItem = document.createElement("li");
        listItem.textContent = item;
        list.appendChild(listItem);
      });
      section.appendChild(list);
    }

    content.appendChild(section);
  }

  function openModal(card) {
    var data = pathData[card.getAttribute("data-path")];
    if (!data) return;

    lastTrigger = card;
    title.textContent = data.title;
    lead.textContent = data.lead;
    while (content.firstChild) content.removeChild(content.firstChild);

    appendSection("Co realizuje zespół?", data.overview, data.projectItems);
    if (data.areas) appendSection("Obszary i narzędzia mentees", "", data.areas);
    appendSection("Kogo szukamy?", data.audience);
    appendSection("Twoja rola w zespole", data.role, null, "mentor-path-modal-role");

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    card.setAttribute("aria-expanded", "true");
    document.body.classList.add("mentor-path-modal-open");
    dialog.scrollTop = 0;
    closeButton.focus();
  }

  function closeModal() {
    if (modal.hidden) return;

    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("mentor-path-modal-open");

    if (lastTrigger) {
      lastTrigger.setAttribute("aria-expanded", "false");
      lastTrigger.focus();
      lastTrigger = null;
    }
  }

  cards.forEach(function (card) {
    card.setAttribute("aria-controls", "mentorPathModal");
    card.setAttribute("aria-expanded", "false");
    card.addEventListener("click", function () {
      openModal(card);
    });
  });

  closeButton.addEventListener("click", closeModal);

  modal.addEventListener("click", function (event) {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", function (event) {
    if (modal.hidden) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      closeButton.focus();
    }
  });
})();
