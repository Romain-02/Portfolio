const images = {
    "Java": "java.png",
    "Python": "python.png",
    "HTML": "html.png",
    "JavaScript": "js.png"
};

let currentLang = 'fr';
let repositories;
let filteredRepositories;
let selectedProjectIndex = -1;
let activeFilter = '';

// Gérer le lien actif lorsque l'on scroll
window.addEventListener('scroll', () => {
    let currentSection = '';
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.sidebar a');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - window.screen.height / 2) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });

    addEffect();
});

function isVisible(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
}

function isHidden(element) {
    const rect = element.getBoundingClientRect();
    const margin = 150;
    return rect.bottom < -margin || rect.top > window.innerHeight + margin;
}

function addEffect() {
    const elements = document.querySelectorAll('.effect');
    elements.forEach(element => {
        if (isVisible(element))
            element.classList.add('visible');
        else if (isHidden(element))
            element.classList.remove('visible');
    });
}

async function fetchGitHubRepos() {
    const url = 'https://api.github.com/users/Romain-02/repos';
    try {
        const response = await fetch(url);
        repositories = await response.json();
        printProjects("");
    } catch (error) {
        console.error("Error fetching repos:", error);
    }
}

async function setImgProject(i, selected = false) {
    const repo = filteredRepositories[i];
    if (!repo) return;
    let url = 'https://raw.githubusercontent.com/Romain-02/' + repo.name + '/main/illustration.png';

    try {
        const response = await fetch(url);
        let imageUrl;
        if (!response.ok) {
            imageUrl = "images/" + (repo.language in images ? images[repo.language] : 'codeDefault.png');
        } else {
            const blob = await response.blob();
            imageUrl = URL.createObjectURL(blob);
        }
        const imgElement = document.querySelector(selected ? '.img-project' : `#project${i} .img-project`);
        if (imgElement) imgElement.src = imageUrl;
    } catch (error) {
        const imageUrl = "images/" + (repo.language in images ? images[repo.language] : 'codeDefault.png');
        const imgElement = document.querySelector(selected ? '.img-project' : `#project${i} .img-project`);
        if (imgElement) imgElement.src = imageUrl;
    }
}

function printProjects(filter) {
    removeSelectedProject();
    activeFilter = filter;
    const repoList = document.getElementById("list-repositories");
    if (!repoList || !repositories) return;
    repoList.innerHTML = ``;

    filteredRepositories = repositories.filter((repository) => repository.topics && repository.topics.includes('portfolio'));

    filteredRepositories.forEach((repo, i) => {
        if (filter === '' || repo.language === filter || (filter === 'Autre' && !(['Python', 'JavaScript', 'Java', 'HTML'].includes(repo.language)))) {
            repoList.innerHTML += `
            <div id="project${i}" class="project effect">
                <img class="img-project">
                <h3><b>${repo.name}</b></h3>
                <p id="description${i}"></p>
                <a href="#selectedProject" class="buttonDesc" id="button${i}" onClick='printSelectedProject(${i})'>${translations[currentLang].show_more}</a>
            </div>
            `;
            setImgProject(i);
        }
    });
    addEffect();
}

function removeSelectedProject() {
    let project = document.getElementById('selectedProject');
    if (!project) return;
    project.innerHTML = ``;
    project.style.marginTop = "0%";
    project.style.border = "0px solid #b4742f";
    project.style.boxShadow = "4px 4px 4px 4px rgba(0, 0, 0, 0)";
    project.classList.remove("visible");

    const elements = document.querySelectorAll('.effect');
    elements.forEach(element => {
        element.classList.add('visible');
    });
}

function printSelectedProject(i) {
    if (selectedProjectIndex != -1 && selectedProjectIndex !== i) {
        printProjects(activeFilter);
    }

    let project = document.getElementById('selectedProject');
    if (!project) return;

    if (selectedProjectIndex == i) {
        selectedProjectIndex = -1;
        removeSelectedProject();
        return;
    } else {
        project.style.marginTop = "2%";
        project.style.border = "5px solid #b4742f";
        project.style.boxShadow = "4px 4px 4px 4px rgba(0, 0, 0, 0.2)";

        project.classList.remove("visible");
        setTimeout(() => {
            project.classList.add("visible");
        }, 100);

        window.scrollTo({ top: project.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth' });
    }

    selectedProjectIndex = i;
    const repo = filteredRepositories[i];
    const projectElement = document.getElementById('project' + i);
    if (projectElement) projectElement.parentElement.removeChild(projectElement);

    project.innerHTML = `
        <div class="img-project-container"><img class="img-project"></div>
        <div class="d-flex">
            <div id="infoProject">
                <h3><b>${repo.name}</b></h3>
                <p id="description${i}">${translations[currentLang][repo.name] || repo.description || ''}</p>
            </div>
            <div class="projectLink">
                <a class="buttonDesc mr-3" id="button${i}" onClick='printSelectedProject(${i})'>${translations[currentLang].show_less}</a>
                <a class="url" target='_blank' href="${repo.svn_url}"><img src="images/iconeGithub.png"></a>
            </div>
        </div>
    `;
    setImgProject(i, true);
}

function translatePage(event) {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';

    // Update title with icon
    const title = document.getElementById('portfolio-title');
    if (title) {
        title.innerHTML = `${translations[currentLang].portfolio_title}<img class="language-icon" src="images/${currentLang === 'fr' ? 'france' : 'angleterre'}.png" onClick="translatePage(event)">`;
    }

    // Update static elements
    document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        if (translations[currentLang][key]) {
            el.innerText = translations[currentLang][key];
        }
    });

    // Update CV links
    const cvLink = document.getElementById('cv-download');
    if (cvLink) {
        cvLink.href = currentLang === 'fr' ? 'CV/Hannoir Romain - CV.pdf' : 'CV/Hannoir Romain - Resume.pdf';
        cvLink.download = currentLang === 'fr' ? 'Hannoir Romain - CV.pdf' : 'Hannoir Romain - Resume.pdf';
    }

    // Refresh dynamic content
    if (repositories) {
        printProjects(activeFilter);
    }
}

window.translatePage = translatePage;
window.printProjects = printProjects;
window.printSelectedProject = printSelectedProject;
window.onload = fetchGitHubRepos;
addEffect();
