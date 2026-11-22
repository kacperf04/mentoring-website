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

(function () {
  "use strict";

  var section = document.getElementById("trenerzy");
  var total = document.getElementById("mentorTrainersTotal");
  var filters = document.getElementById("mentorTrainersFilters");
  var track = document.getElementById("mentorTrainersTrack");
  var previousButton = document.getElementById("mentorTrainersPrev");
  var nextButton = document.getElementById("mentorTrainersNext");
  var status = document.getElementById("mentorTrainersStatus");
  var trainers = [];
  var categories = [];
  var activeCategory = "";

  if (!section || !total || !filters || !track || !previousButton || !nextButton || !status) return;

  function cleanText(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function normalizeTrainer(item, index) {
    if (!item || typeof item !== "object" || !cleanText(item.name)) return null;

    return {
      id: cleanText(item.id) || "trainer-" + index,
      name: cleanText(item.name),
      position: cleanText(item.position),
      company: cleanText(item.company),
      categories: Array.isArray(item.categories) ? item.categories.map(cleanText).filter(Boolean) : [],
      image: cleanText(item.image),
      imageAlt: cleanText(item.imageAlt),
      description: cleanText(item.description),
      featured: item.featured === true
    };
  }

  function initialsFor(name) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(function (part) {
      return part.charAt(0).toUpperCase();
    }).join("");
  }

  function createTrainerCard(trainer) {
    var card = document.createElement("article");
    var media = document.createElement("div");
    var fallback = document.createElement("span");
    var overlay = document.createElement("div");
    var name = document.createElement("h3");
    var nameHighlight = document.createElement("span");
    var role = document.createElement("p");

    card.className = "mentor-trainer-card" + (trainer.featured ? " is-featured" : "");
    card.setAttribute("data-trainer-id", trainer.id);
    media.className = "mentor-trainer-media";
    fallback.className = "mentor-trainer-initials";
    fallback.textContent = initialsFor(trainer.name);
    media.appendChild(fallback);

    if (trainer.image) {
      var image = document.createElement("img");
      image.src = trainer.image;
      image.alt = trainer.imageAlt || "Portret: " + trainer.name;
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("load", function () {
        card.classList.add("has-image");
        fallback.hidden = true;
      });
      image.addEventListener("error", function () {
        image.remove();
      });
      media.appendChild(image);
    }

    overlay.className = "mentor-trainer-overlay";

    if (trainer.description && trainer.featured) {
      var description = document.createElement("p");
      description.className = "mentor-trainer-description";
      description.textContent = trainer.description;
      overlay.appendChild(description);
    }

    nameHighlight.textContent = trainer.name;
    name.appendChild(nameHighlight);
    overlay.appendChild(name);

    role.className = "mentor-trainer-role";
    role.textContent = trainer.position + (trainer.company ? " @" + trainer.company : "");
    if (role.textContent.trim()) overlay.appendChild(role);

    card.appendChild(media);
    card.appendChild(overlay);
    return card;
  }

  function visibleTrainers() {
    if (!activeCategory) return trainers.slice();
    return trainers.filter(function (trainer) {
      return trainer.categories.indexOf(activeCategory) !== -1;
    });
  }

  function renderCards() {
    var visible = visibleTrainers();
    track.innerHTML = "";
    track.scrollLeft = 0;
    track.classList.toggle("is-single", visible.length === 1);

    if (!visible.length) {
      var empty = document.createElement("p");
      empty.className = "mentor-trainers-message";
      empty.textContent = "W tej kategorii nie dodano jeszcze trenerów.";
      track.appendChild(empty);
    } else {
      visible.forEach(function (trainer) {
        track.appendChild(createTrainerCard(trainer));
      });
    }

    previousButton.hidden = visible.length < 2;
    nextButton.hidden = visible.length < 2;
    track.setAttribute("aria-busy", "false");
    status.textContent = visible.length === 1
      ? "Wyświetlono jednego trenera."
      : "Wyświetlono trenerów: " + visible.length + ".";
  }

  function renderFilters() {
    filters.innerHTML = "";
    filters.hidden = categories.length === 0;

    categories.forEach(function (category) {
      var button = document.createElement("button");
      var isActive = category === activeCategory;

      button.type = "button";
      button.className = "mentor-trainers-filter" + (isActive ? " is-active" : "");
      button.textContent = category;
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
      button.addEventListener("click", function () {
        activeCategory = category;
        renderFilters();
        renderCards();
      });
      filters.appendChild(button);
    });
  }

  function showLoadError() {
    track.innerHTML = "";
    track.setAttribute("aria-busy", "false");
    total.textContent = "0";
    filters.hidden = true;
    previousButton.hidden = true;
    nextButton.hidden = true;

    var error = document.createElement("p");
    error.className = "mentor-trainers-message mentor-trainers-message-error";
    error.textContent = "Nie udało się wczytać listy trenerów. Spróbuj ponownie później.";
    track.appendChild(error);
    status.textContent = error.textContent;
  }

  function scrollTrack(direction) {
    var card = track.querySelector(".mentor-trainer-card");
    var distance = card ? card.offsetWidth + 26 : 340;
    var target = track.scrollLeft + direction * distance;

    if (typeof track.scrollTo === "function") {
      track.scrollTo({ left: target, behavior: "smooth" });
    } else {
      track.scrollLeft = target;
    }
  }

  previousButton.addEventListener("click", function () {
    scrollTrack(-1);
  });

  nextButton.addEventListener("click", function () {
    scrollTrack(1);
  });

  fetch("data/trenerzy.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then(function (data) {
      var source = data && Array.isArray(data.trainers) ? data.trainers : [];
      var configuredCategories = data && Array.isArray(data.categories) ? data.categories.map(cleanText).filter(Boolean) : [];

      trainers = source.map(normalizeTrainer).filter(Boolean);
      categories = configuredCategories.length ? configuredCategories : trainers.reduce(function (result, trainer) {
        trainer.categories.forEach(function (category) {
          if (result.indexOf(category) === -1) result.push(category);
        });
        return result;
      }, []);
      activeCategory = categories[0] || "";

      total.textContent = data && typeof data.totalExperts === "number" && isFinite(data.totalExperts)
        ? String(Math.max(0, Math.round(data.totalExperts)))
        : String(trainers.length);

      renderFilters();
      renderCards();
    })
    .catch(showLoadError);
})();

(function () {
  "use strict";

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".mentor-join-tab"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".mentor-join-panel"));

  if (!tabs.length || !panels.length) return;

  function activateTab(nextTab) {
    tabs.forEach(function (tab) {
      var isActive = tab === nextTab;
      var panelId = tab.getAttribute("aria-controls");
      var panel = document.getElementById(panelId);

      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
      if (panel) panel.hidden = !isActive;
    });
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      activateTab(tab);
    });

    tab.addEventListener("keydown", function (event) {
      var nextIndex = index;

      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = tabs.length - 1;
      else return;

      event.preventDefault();
      activateTab(tabs[nextIndex]);
      tabs[nextIndex].focus();
    });
  });
})();
