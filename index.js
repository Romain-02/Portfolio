const images = {
    "Java": "java.png",
    "Python": "python.png",
    "HTML": "html.png",
    "JavaScript": "js.png"
};

//gérer le lien actif lorsque l'on scroll
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

//Fonction pour éviter que la div redisparaisse trop vite
function isHidden(element) {
    const rect = element.getBoundingClientRect();
    const margin = 150;
    return rect.bottom < -margin || rect.top > window.innerHeight + margin;
}

let repositories;
let selectedProjectIndex = -1
let activeFilter = ''

//remplir les projet avec github
async function fetchGitHubRepos() {
    const url = 'https://api.github.com/users/Romain-02/repos';

    fetch(url)
            .then(response => response.json())
            .then(repos => {
                repositories = repos;
                printProjects("");
            })
}

function addEffect(){
    const elements = document.querySelectorAll('.effect');

    elements.forEach(element => {
        if (isVisible(element))
            element.classList.add('visible');
        else if(isHidden(element))
            element.classList.remove('visible');
    });
}

async function setImgProject(i, selected = false){
    let url = 'https://raw.githubusercontent.com/Romain-02/' + repositories[i]['name'] + '/main/illustration.png';

    fetch(url)
    .then(response => {
        if (!response.ok) {
            return Promise.resolve("images/" + (repositories[i]['language'] in images ? images[repositories[i]['language']] : 'codeDefault.png'));
        }
        return response.blob().then(blob => {
            return URL.createObjectURL(blob);
        });
    })
    .catch(() => {
        return "images/" + (repositories[i]['language'] in images ? images[repositories[i]['language']] : 'codeDefault.png');
    })    
    .then(imageUrl => {
        const imgElement = document.querySelector(selected ? '.img-project' : `#project${i} .img-project`);
        imgElement.src = imageUrl;
    
    });
}

function printProjects(filter){
    removeSelectedProject();
    activeFilter = filter;
    const repoList = document.getElementById("list-repositories");
    repoList.innerHTML = ``;
    const filteredRepositories = repositories.filter((repository) => repository.topics.includes('portfolio'))
    filteredRepositories.forEach((repo, i) => {
        if(filter === '' || filteredRepositories[i]['language'] === filter || (filter === 'Autre' && !(['Python', 'JavaScript', 'Java', 'HTML'].includes(repositories[i]['language'])))){
            repoList.innerHTML += `
            <div id="project`+ i +`" class="project effect">
                <img class="img-project" id="project${i}">
                <h3><b>${repo['name']}</b></h3>
                <p id="description`+ i +`"></p>
                <a href="#selectedProject" class="buttonDesc" id="button`+ i +`" onClick='printSelectedProject(` + i + `)'>Afficher plus</a>
            </div>
            `;  
        }
        setImgProject(i);
        i++;
    });
    addEffect();
}

function removeSelectedProject(){
    let project = document.getElementById('selectedProject');
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

function printSelectedProject(i){
    if(selectedProjectIndex != -1) printProjects(activeFilter);
    let project = document.getElementById('selectedProject')
    if(selectedProjectIndex == i){
        selectedProjectIndex = -1;
        removeSelectedProject();
        return;
    } else{
        project.style.marginTop = "2%";
        project.style.border = "5px solid #b4742f";
        project.style.boxShadow = "4px 4px 4px 4px rgba(0, 0, 0, 0.2)";

        project.classList.remove("visible");
        setTimeout(() => {
            project.classList.add("visible");
        }, 100); // Delay to ensure the animation runs

        event.preventDefault();
        window.scrollTo({top: project.getBoundingClientRect().top + window.pageYOffset - 100,behavior: 'smooth'});
    }

    selectedProjectIndex = i;
    document.getElementById('list-repositories').removeChild(document.getElementById('project' + i));
    document.getElementById('selectedProject').innerHTML = `
                    <div class="img-project-container"><img class="img-project"></div>
                    <div class="d-flex">
                        <div id="infoProject">
                            <h3><b>${repositories[i]['name']}</b></h3>
                            <p id="description`+ i +`">${repositories[i]['description']}</p>
                        </div>
                        <div class="projectLink">
                            <a class="buttonDesc mr-3" id="button`+ i +`" onClick='printSelectedProject(` + i + `)'>Afficher moins</a>
                            <a class="url" target='_blank' href="${repositories[i]['svn_url']}"><img src="images/iconeGithub.png"></img></a>
                        <div>
                    </div>
                `;
                setImgProject(i, true);
}

// Exécute la fonction lors du chargement de la page
window.onload = fetchGitHubRepos;
addEffect();