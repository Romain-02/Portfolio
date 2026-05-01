let repositories = [];
let activeFilter = "";
let selectedProjectIndex = -1;
const fetchedImages = {};

const fallbackImages = {
    Java: "java.png",
    Python: "python.png",
    HTML: "html.png",
    JavaScript: "js.png"
};

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initCursorGlow();
    initTiltCards();
    initRevealOnScroll();
    initThreeBackground();
    bindProjectFilters();
    fetchGitHubRepos();
});

function initNavigation() {
    const navbar = document.getElementById("navbar");

    window.addEventListener("scroll", () => {
        navbar.classList.toggle("is-visible", window.scrollY > 100);
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
}

function initCursorGlow() {
    const cursorGlow = document.getElementById("cursorGlow");
    if (!cursorGlow) {
        return;
    }

    document.addEventListener("mousemove", (event) => {
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
    });
}

function initTiltCards() {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const rotateX = (y - rect.height / 2) / 34;
            const rotateY = (rect.width / 2 - x) / 34;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
        });
    });
}

function initRevealOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function initThreeBackground() {
    if (!window.THREE) {
        return;
    }

    const container = document.getElementById("canvas-container");
    if (!container) {
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 90;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < positions.length; i++) {
        positions[i] = (Math.random() - 0.5) * 48;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x00d8e8,
        transparent: true,
        opacity: 0.52,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    camera.position.z = 30;

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener("mousemove", (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.x += 0.0009 + mouseY * 0.00025;
        particlesMesh.rotation.y += 0.001 + mouseX * 0.00025;
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function bindProjectFilters() {
    document.querySelectorAll(".filter-button").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("is-active"));
            button.classList.add("is-active");
            printProjects(button.dataset.filter);
        });
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
        const portfolioRepos = repos.filter((repository) => (repository.topics || []).includes("portfolio"));

        repositories = await Promise.all(portfolioRepos.map(async (repository) => {
            const translations = await getTranslations(repository);
            return {
                ...repository,
                title: {
                    en: translations.title.en,
                    fr: translations.title.fr
                },
                description: {
                    en: translations.description.en,
                    fr: translations.description.fr
                }
            };
        }));

        status.textContent = repositories.length ? "" : "Aucun projet portfolio trouve sur GitHub.";
        printProjects(activeFilter);
    } catch (error) {
        status.textContent = "Impossible de charger les projets GitHub pour le moment.";
        console.error(error);
    }
}

async function getTranslations(repository) {
    const translatedDescriptions = `https://raw.githubusercontent.com/Romain-02/${repository.name}/main/portfolio.json`;
    let translations = {
        title: {
            fr: repository.name,
            en: repository.name
        },
        description: {
            fr: repository.description ?? "",
            en: repository.description ?? ""
        }
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

function printProjects(filter) {
    activeFilter = filter;
    selectedProjectIndex = -1;

    const selectedProject = document.getElementById("selected-project");
    selectedProject.hidden = true;
    selectedProject.innerHTML = "";

    const repoList = document.getElementById("project-list");
    repoList.innerHTML = "";

    const visibleRepos = repositories
        .map((repo, index) => ({ repo, index }))
        .filter(({ repo }) => {
            return filter === ""
                || repo.language === filter
                || (filter === "Web" && ["HTML", "PHP", "JavaScript"].includes(repo.language));
        });

    visibleRepos.forEach(({ repo, index }) => {
        const card = document.createElement("article");
        card.className = "project-card reveal is-visible";
        card.innerHTML = `
            <div class="project-visual">
                <img class="project-image" alt="Illustration du projet ${repo.title.fr}">
            </div>
            <div class="project-body">
                <h3>${repo.title.fr}</h3>
                <p>${repo.description.fr}</p>
                <div class="project-meta">
                    <span class="project-language">${repo.language ?? "Code"}</span>
                    <button class="project-button" type="button">Afficher plus</button>
                </div>
            </div>
        `;

        card.querySelector(".project-button").addEventListener("click", () => printSelectedProject(index));
        repoList.appendChild(card);
        setImgProject(index, card.querySelector(".project-image"));
    });
}

async function setImgProject(index, imageElement) {
    if (fetchedImages[index]) {
        imageElement.src = fetchedImages[index];
        return;
    }

    const repository = repositories[index];
    const fallbackImage = `images/${fallbackImages[repository.language] ?? "codeDefault.png"}`;
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

function printSelectedProject(index) {
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
            <h3>${repository.title.fr}</h3>
            <p>${repository.description.fr}</p>
            <div class="selected-actions">
                <button class="project-button" type="button">Afficher moins</button>
                <a class="button button-primary" target="_blank" rel="noreferrer" href="${repository.svn_url}">Voir sur GitHub</a>
            </div>
        </div>
    `;

    selectedProject.querySelector(".project-button").addEventListener("click", () => printSelectedProject(index));
    setImgProject(index, selectedProject.querySelector(".project-image"));
    selectedProject.scrollIntoView({ behavior: "smooth", block: "center" });
}
