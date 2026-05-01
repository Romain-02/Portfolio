let repositories = [];
let activeFilter = "";
let selectedProjectIndex = -1;
let activeModalProjectIndex = -1;
let activeLanguage = "fr";
let projectStatusKey = "projects.loading";
let limitedProjects = true;
const PROJECT_PAGE_SIZE = 9;
const MIN_LANGUAGE_PERCENT = 5;
const MAX_DISPLAYED_LANGUAGES = 4;
const fetchedImages = {};

const translations = {
  fr: {
    "nav.home": "Accueil",
    "nav.about": "À propos",
    "nav.skills": "Compétences",
    "nav.experience": "Expérience",
    "nav.projects": "Projets",
    "nav.contact": "Contact",
    "hero.status": "En recherche d'alternance 2026-2028",
    "hero.subtitle":
      "Étudiant en BUT informatique à l'IUT de Lens et développeur web full stack en alternance. Je travaille principalement sur des applications web notamment avec React et Symfony.",
    "hero.projects": "Voir mes projets",
    "common.resume": "Télécharger CV",
    "about.eyebrow": "À propos",
    "about.title": "Un profil orienté application",
    "about.fullstack.title": "Développeur full stack",
    "about.fullstack.text":
      "Dans le cadre de mon BUT, je réalise ma deuxième et troisième année d'alternance chez Primever, une entreprise de logistique et de transport de fruits et légumes. Je participe au développement et à la maintenance de plusieurs applications web, principalement avec React et Symfony.",
    "about.education.title": "Formation",
    "about.education.text":
      "BUT informatique à l'IUT de Lens depuis 2023. Six compétences de première année validées.",
    "about.location": "Lens, France",
    "about.bac.title": "Baccalauréat",
    "about.bac.text":
      "Bac général Maths, Maths expertes et NSI obtenu en 2023 au lycée Blaise Pascal avec mention très bien.",
    "about.hobbies.title": "Loisirs",
    "about.hobbies.text":
      "Sport, jeux vidéo compétitifs et échecs. Ces passions m'ont aussi donné envie de programmer.",
    "skills.eyebrow": "Stack",
    "skills.title": "Compétences techniques",
    "skills.languages": "Langages",
    "skills.backend": "Backend & bases de données",
    "skills.tools": "Outils",
    "skills.inProgressC": "C/C++",
    "skills.reactMain": "React",
    "skills.nextProgress": "NextJS - En cours",
    "skills.symfonyMain": "Symfony",
    "skills.gitMain": "Git",
    "skills.gitlabMain": "GitLab",
    "skills.dotnet": ".Net - En cours",
    "experience.eyebrow": "Expérience",
    "experience.title": "Parcours professionnel",
    "experience.primever.title": "Développeur web full stack",
    "experience.primever.company": "Primever - Alternance",
    "experience.primever.text":
      "Développement et maintenance d'applications web avec React et Symfony. Travail sur GLPI pour la mise en place d'une solution d'assistance, gestion et remontée des tickets.",
    "experience.since2023": "Depuis 2023",
    "experience.iut.title": "BUT informatique",
    "experience.iut.text":
      "Formation en développement informatique, conception d'applications, bases de données et méthodes de projet.",
    "projects.title": "Projets",
    "projects.intro": "Ces projets sont automatiquement reliés à mon GitHub.",
    "projects.all": "Tous",
    "projects.loading": "Chargement des projets...",
    "projects.empty": "Aucun projet portfolio trouve sur GitHub.",
    "projects.error":
      "Impossible de charger les projets GitHub pour le moment.",
    "projects.more": "Afficher plus",
    "projects.less": "Afficher moins",
    "projects.github": "Voir sur GitHub",
    "projects.showMore": "Voir plus de projets",
    "projects.showLess": "Voir moins de projets",
    "projects.moreGithub": "Voir plus sur GitHub",
    "contact.title": "Informations",
    "contact.text":
      "Vous pouvez me contacter par email, téléphone, LinkedIn ou consulter mon GitHub.",
    "footer.copyright": "2024 Hannoir Romain - Portfolio.",
  },
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.skills": "Skills",
    "nav.experience": "Experience",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    "hero.status": "Seeking 2026-2028 work-study opportunity",
    "hero.subtitle":
      "Computer science BUT student at the IUT of Lens and full stack web developer in a work-study program. I mainly work on web applications with React, Symfony and GLPI.",
    "hero.projects": "View my projects",
    "common.resume": "Download resume",
    "about.eyebrow": "About",
    "about.title": "An application-focused profile",
    "about.fullstack.title": "Full stack developer",
    "about.fullstack.text":
      "As part of my BUT program, I am completing my second and third work-study years at Primever, a logistics and fruit and vegetable transport company. I contribute to the development and maintenance of several web applications, mainly with React and Symfony.",
    "about.education.title": "Education",
    "about.education.text":
      "Computer science BUT at the IUT of Lens since 2023. The six first-year competencies have been validated.",
    "about.location": "Lens, France",
    "about.bac.title": "Baccalaureate",
    "about.bac.text":
      "General baccalaureate in Mathematics, Advanced Mathematics and Computer Science, obtained in 2023 at Blaise Pascal high school with highest honors.",
    "about.hobbies.title": "Hobbies",
    "about.hobbies.text":
      "Sports, competitive video games and chess. These interests also motivated me to learn programming.",
    "skills.eyebrow": "Stack",
    "skills.title": "Technical skills",
    "skills.languages": "Languages",
    "skills.backend": "Backend & databases",
    "skills.tools": "Tools",
    "skills.inProgressC": "C/C++",
    "skills.reactMain": "React",
    "skills.nextProgress": "NextJS - In progress",
    "skills.symfonyMain": "Symfony",
    "skills.gitMain": "Git",
    "skills.gitlabMain": "GitLab",
    "skills.dotnet": ".Net - In progress",
    "experience.eyebrow": "Experience",
    "experience.title": "Professional path",
    "experience.primever.title": "Full stack web developer",
    "experience.primever.company": "Primever - Work-study",
    "experience.primever.text":
      "Development and maintenance of web applications with React and Symfony. Work with GLPI to set up a support solution for ticket management and tracking.",
    "experience.since2023": "Since 2023",
    "experience.iut.title": "Computer science BUT",
    "experience.iut.text":
      "Training in software development, application design, databases and project methods.",
    "projects.title": "Projects",
    "projects.intro": "These projects are automatically linked to my GitHub.",
    "projects.all": "All",
    "projects.loading": "Loading projects...",
    "projects.empty": "No portfolio project found on GitHub.",
    "projects.error": "Unable to load GitHub projects right now.",
    "projects.more": "Show more",
    "projects.less": "Show less",
    "projects.github": "View on GitHub",
    "projects.showMore": "Show more projects",
    "projects.moreGithub": "See more on GitHub",
    "contact.title": "Let's work together",
    "contact.text":
      "You can contact me by email, phone, LinkedIn or view my GitHub.",
    "footer.copyright": "2024 Hannoir Romain - Portfolio.",
  },
};

const fallbackImages = {
  Java: "java.png",
  Python: "python.png",
  HTML: "html.png",
  JavaScript: "js.png",
};

const webLanguages = [
  "HTML",
  "CSS",
  "SCSS",
  "Sass",
  "JavaScript",
  "TypeScript",
  "PHP",
  "Vue",
  "Svelte",
];

document.addEventListener("DOMContentLoaded", () => {
  initLanguage();
  initNavigation();
  initProjectModal();
  bindProjectFilters();
  fetchGitHubRepos();
});

function initNavigation() {
  const navbar = document.getElementById("navbar");
  const navLinks = [...document.querySelectorAll('.floating-nav a[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("is-visible", window.scrollY > 100);
    updateActiveNavigation(navLinks, sections);
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  updateActiveNavigation(navLinks, sections);
}

function updateActiveNavigation(navLinks, sections) {
  let currentSection = sections[0]?.id ?? "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= sectionTop - window.innerHeight / 2.8) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      "is-active",
      link.getAttribute("href") === `#${currentSection}`,
    );
  });
}

function initLanguage() {
  const button = document.getElementById("languageToggle");
  button.addEventListener("click", () => {
    activeLanguage = activeLanguage === "fr" ? "en" : "fr";
    applyTranslations();
  });

  applyTranslations();
}

function applyTranslations() {
  document.documentElement.lang = activeLanguage;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent =
      translations[activeLanguage][key] ?? element.textContent;
  });

  const button = document.getElementById("languageToggle");
  const flag =
    activeLanguage === "fr"
      ? { src: "images/france.png", alt: "Français" }
      : { src: "images/angleterre.png", alt: "English" };
  button.innerHTML = `<img src="${flag.src}" alt="${flag.alt}">`;
  button.setAttribute(
    "aria-label",
    activeLanguage === "fr" ? "Switch to English" : "Passer en francais",
  );

  const resume =
    activeLanguage === "fr"
      ? { href: "CV/Hannoir Romain - CV.pdf", download: "Hannoir Romain - CV" }
      : {
          href: "CV/Hannoir Romain - Resume.pdf",
          download: "Hannoir Romain - Resume",
        };

  ["heroResumeLink", "contactResumeLink"].forEach((id) => {
    const link = document.getElementById(id);
    link.href = resume.href;
    link.download = resume.download;
  });

  const status = document.getElementById("project-status");
  status.textContent = repositories.length
    ? ""
    : translations[activeLanguage][projectStatusKey];

  if (repositories.length) {
    printProjects(activeFilter, { resetSelected: false });
    if (selectedProjectIndex !== -1) {
      const selectedIndex = selectedProjectIndex;
      selectedProjectIndex = -1;
      printSelectedProject(selectedIndex, false);
    }
    if (activeModalProjectIndex !== -1) {
      renderProjectModal(activeModalProjectIndex);
    }
  }
}

function initProjectModal() {
  document.querySelectorAll("[data-modal-close]").forEach((element) => {
    element.addEventListener("click", closeProjectModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProjectModal();
    }
  });
}

function bindProjectFilters() {
  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-button")
        .forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      limitedProjects = true;
      printProjects(button.dataset.filter);
    });
  });

  document
    .getElementById("show-more-projects")
    .addEventListener("click", () => {
      limitedProjects = !limitedProjects;
      printProjects(activeFilter, { resetSelected: false });
    });
}

async function fetchGitHubRepos() {
  const status = document.getElementById("project-status");
  const url = "https://api.github.com/users/Romain-02/repos";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("GitHub request failed");
    }

    const repos = await response.json();
    const portfolioRepos = repos.filter((repository) =>
      (repository.topics || []).includes("portfolio"),
    );

    repositories = await Promise.all(
      portfolioRepos.map(async (repository) => {
        const translations = await getTranslations(repository);
        const languages = await getRepositoryLanguages(repository);
        return {
          ...repository,
          languages,
          title: {
            en: translations.title.en,
            fr: translations.title.fr,
          },
          description: {
            en: translations.description.en,
            fr: translations.description.fr,
          },
        };
      }),
    );

    projectStatusKey = repositories.length
      ? "projects.loading"
      : "projects.empty";
    status.textContent = repositories.length
      ? ""
      : translations[activeLanguage][projectStatusKey];
    printProjects(activeFilter);
  } catch (error) {
    projectStatusKey = "projects.error";
    status.textContent = translations[activeLanguage][projectStatusKey];
    console.error(error);
  }
}

async function getTranslations(repository) {
  const translatedDescriptions = `https://raw.githubusercontent.com/Romain-02/${repository.name}/main/portfolio.json`;
  let translations = {
    title: {
      fr: repository.name,
      en: repository.name,
    },
    description: {
      fr: repository.description ?? "",
      en: repository.description ?? "",
    },
  };

  try {
    const response = await fetch(translatedDescriptions);
    if (!response.ok) {
      throw new Error("File not found");
    }
    translations = await response.json();
  } catch {
    console.error(`${repository.name} does not have translations`);
  }

  return translations;
}

async function getRepositoryLanguages(repository) {
  try {
    const response = await fetch(repository.languages_url);
    if (!response.ok) {
      throw new Error("Languages not found");
    }

    const languageBytes = await response.json();
    const totalBytes = Object.values(languageBytes).reduce(
      (total, bytes) => total + bytes,
      0,
    );

    if (!totalBytes) {
      return repository.language ? [repository.language] : [];
    }

    const sortedLanguages = Object.entries(languageBytes)
      .map(([name, bytes]) => ({
        name,
        percent: (bytes / totalBytes) * 100,
      }))
      .sort((a, b) => b.percent - a.percent);

    const significantLanguages = sortedLanguages
      .filter((language) => language.percent >= MIN_LANGUAGE_PERCENT)
      .slice(0, MAX_DISPLAYED_LANGUAGES)
      .map((language) => language.name);

    return significantLanguages.length
      ? significantLanguages
      : sortedLanguages.slice(0, 1).map((language) => language.name);
  } catch {
    return repository.language ? [repository.language] : [];
  }
}

function printProjects(filter, options = {}) {
  const { resetSelected = true } = options;
  activeFilter = filter;

  const selectedProject = document.getElementById("selected-project");
  if (resetSelected) {
    selectedProjectIndex = -1;
    selectedProject.hidden = true;
    selectedProject.innerHTML = "";
  }

  const repoList = document.getElementById("project-list");
  repoList.innerHTML = "";

  const visibleRepos = repositories
    .map((repo, index) => ({ repo, index }))
    .filter(({ repo }) => {
      return (
        filter === "" ||
        repo.languages.includes(filter) ||
        (filter === "Web" &&
          repo.languages.some((language) => webLanguages.includes(language)))
      );
    });

  visibleRepos
    .slice(0, limitedProjects ? PROJECT_PAGE_SIZE : visibleRepos.length)
    .forEach(({ repo, index }) => {
      const card = document.createElement("article");
      card.className = "project-card is-visible";
      card.innerHTML = `
            <div class="project-visual">
                <img class="project-image" alt="Illustration du projet ${repo.title.fr}">
            </div>
            <div class="project-body">
                <h3>${repo.title[activeLanguage]}</h3>
                <p>${repo.description[activeLanguage]}</p>
                <div class="project-meta">
                    <span class="project-language" tabindex="0" data-tooltip="${getProjectLanguageLabel(repo)}" title="${getProjectLanguageLabel(repo)}">${getProjectLanguageLabel(repo)}</span>
                    <button class="project-button" type="button">${translations[activeLanguage]["projects.more"]}</button>
                </div>
            </div>
        `;

    card
      .querySelector(".project-button")
      .addEventListener("click", () => openProjectModal(index));
      repoList.appendChild(card);
      const image = card.querySelector(".project-image");
      image.alt = `${translations[activeLanguage]["projects.title"]} ${repo.title[activeLanguage]}`;
      setImgProject(index, image);
    });

  updateShowMoreButton(visibleRepos.length);
}

function getProjectLanguageLabel(repository) {
  const languages = repository.languages.length ? repository.languages : ["Code"];
  return languages.join(" / ");
}

function openProjectModal(index) {
  activeModalProjectIndex = index;
  renderProjectModal(index);
  document.getElementById("project-modal").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeProjectModal() {
  const modal = document.getElementById("project-modal");
  if (modal.hidden) {
    return;
  }

  activeModalProjectIndex = -1;
  modal.hidden = true;
  document.body.style.overflow = "";
}

function renderProjectModal(index) {
  const repository = repositories[index];
  if (!repository) {
    return;
  }

  const image = document.getElementById("project-modal-image");
  const title = document.getElementById("project-modal-title");
  const description = document.getElementById("project-modal-description");
  const language = document.getElementById("project-modal-language");
  const link = document.getElementById("project-modal-link");

  title.textContent = repository.title[activeLanguage];
  description.textContent = repository.description[activeLanguage];
  language.textContent = getProjectLanguageLabel(repository);
  language.title = getProjectLanguageLabel(repository);
  language.dataset.tooltip = getProjectLanguageLabel(repository);
  link.href = repository.svn_url;
  link.textContent = translations[activeLanguage]["projects.github"];
  image.alt = `${translations[activeLanguage]["projects.title"]} ${repository.title[activeLanguage]}`;
  setImgProject(index, image);
}

function updateShowMoreButton(totalVisibleProjects) {
  const button = document.getElementById("show-more-projects");
  const haslimitedProjects = totalVisibleProjects > PROJECT_PAGE_SIZE;

  button.hidden = !haslimitedProjects && !limitedProjects;
  button.textContent =
    translations[activeLanguage][
      limitedProjects ? "projects.showMore" : "projects.showLess"
    ];
}

async function setImgProject(index, imageElement) {
  if (fetchedImages[index]) {
    imageElement.src = fetchedImages[index];
    return;
  }

  const repository = repositories[index];
  const primaryLanguage = repository.languages[0] ?? repository.language;
  const fallbackImage = `images/${fallbackImages[primaryLanguage] ?? "codeDefault.png"}`;
  const url = `https://raw.githubusercontent.com/Romain-02/${repository.name}/main/illustration.png`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Project image not found");
    }

    const blob = await response.blob();
    fetchedImages[index] = URL.createObjectURL(blob);
  } catch {
    fetchedImages[index] = fallbackImage;
  }

  imageElement.src = fetchedImages[index];
}

function printSelectedProject(index, shouldScroll = true) {
  const selectedProject = document.getElementById("selected-project");

  if (selectedProjectIndex === index) {
    selectedProjectIndex = -1;
    selectedProject.hidden = true;
    selectedProject.innerHTML = "";
    return;
  }

  const repository = repositories[index];
  selectedProjectIndex = index;
  selectedProject.hidden = false;
  selectedProject.innerHTML = `
        <div class="project-visual">
            <img class="project-image" alt="Illustration du projet ${repository.title.fr}">
        </div>
        <div>
            <h3>${repository.title[activeLanguage]}</h3>
            <p>${repository.description[activeLanguage]}</p>
            <div class="selected-actions">
                <button class="project-button" type="button">${translations[activeLanguage]["projects.less"]}</button>
                <a class="button button-primary" target="_blank" rel="noreferrer" href="${repository.svn_url}">${translations[activeLanguage]["projects.github"]}</a>
            </div>
        </div>
    `;

  selectedProject
    .querySelector(".project-button")
    .addEventListener("click", () => printSelectedProject(index));
  setImgProject(index, selectedProject.querySelector(".project-image"));
  if (shouldScroll) {
    selectedProject.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
