let activeLanguage = 'fr'
let repositories;
let selectedProjectIndex = -1
let activeFilter = ''
let fetchedImages = {}

function translatePage(event) {
    const french_to_eng = {
        "Mon Portfolio": "My Portfolio",
        "Accueil": "Home",
        "Formation": "Education",
        "Compétences": "Skills",
        "Projets": "Projects",
        "Loisirs": "Hobbies",
        "Romain Hannoir": "Romain Hannoir",
        "Développeur junior et étudiant en BUT informatique à l'IUT de Lens": "Junior developer and student in a computer science bachelor program at IUT of Lens",
        "Préparation d'un bachelor universitaire de technologie (BUT) informatique.": "Pursuing a Bachelor of Technology in Computer Science.",
        "Depuis 2023, j'étudie à l'IUT de Lens pour obtenir mon BUT informatique. J'ai validé les six compétences de première année, et je suis actuellement en deuxième année.": 
            "Since 2023, I have been studying at the IUT of Lens to earn my Bachelor's degree in Computer Science. I have validated the six core competencies of the first year and am currently in the second year.",
        "Obtention du baccalauréat général Math/NSI.": "Obtained the Baccalaureate specialization in mathematics and digital and computer sciences.",
        "En 2023, j'ai obtenu au lycée Blaise Pascal de Longuenesse mon baccalauréat avec les spécialités Maths, Maths expertes et NSI avec mention très bien.": 
            "In 2023, I graduated from Blaise Pascal High School in Longuenesse with specialization in Mathematics, Advanced Mathematics, and Computer Science with honors.",
        "Compétences": "Skills",
        "Loisir": "Hobbies",
        "Ces projets sont reliés à mon github." : "These projects are linked to my GitHub.",
        "J'aime le sport depuis petit, en particulier le football. Aujourd'hui, je fais surtout de la course, du vélo et de la natation.": 
            "I have loved sports since I was a child, especially football. Today, I mostly run and cycle.",
        "J'ai toujours aimé les jeux vidéo, notamment le côté compétitif. C'est cela qui m'a motivé à apprendre la programmation.": 
            "I have always loved video games, especially the competitive aspect. This motivated me to learn programming.",
        "Après avoir créé un jeu d'échecs, j'ai commencé à y jouer de plus en plus afin de m'améliorer jusqu'à devenir un joueur régulier.": 
            "After creating a chess game, I started playing it more and more to improve and eventually became a regular player.",
        "Mon CV" : "My resume",
        "Vous pouvez télécharger mon CV en cliquant sur le bouton ci-dessous :" : "You can download my resume here !",
        "Télécharger le CV": "Download the resume",
        "CV" : "Resume",
        "Contact": "Contact",
        "Téléphone : +33 7 49 13 30 25": "Phone : +33 7 49 13 30 25",
        "Suivez-moi": "Follow Me",
        "© 2024 Hannoir Romain - PortFolio.": "© 2024 Hannoir Romain - Portfolio.",
        "Expérience": "Experience",
        "expérience": "experience",
        "Dans le cadre de mon BUT, j'ai pu réalisé ma deuxième et troisième année d'alternance chez Primever en tant que développeur web full stack. J’ai participé au développement et à la maintenance de plusieurs applications web, principalement avec React et Symfony, et j’ai également travaillé avec le framework GLPI pour la mise en place d’une solution d’assistance (gestion et remontée des tickets).": "During my second and third year of the BUT program, I completed a work-study placement at Primever as a full stack web developer. I contributed to the development and maintenance of several web applications, mainly using React and Symfony, and also worked with the GLPI framework to implement a support solution, including ticket management and tracking.",
        "Ces projets sont automatiquement reliés à mon github.": "These projects are automatically linked to my github",
        "Tous": "All",
        "Outils": "Tools",
        "Backend & Bases de données": "Backend & Database",
        "En cours": "In progress"
    };
    
    const eng_to_french = Object.fromEntries(
        Object.entries(french_to_eng).map(([key, value]) => [value, key])
      );

    if(!event.target.src) {
      return;
    }

    //language and icon
    let language = event.target.src.includes('images/france.png') ? {country: "angleterre", language: 'en'} : {country: "france", language: 'fr'}; 
    activeLanguage = language.language;
    let translations = language.language == "fr" ? eng_to_french : french_to_eng; 
    event.target.src = 'images/' + language.country + '.png';

    //CV
    document.getElementById('cv-download').href = language.language == "fr" ? "CV/Hannoir Romain - CV.pdf" : "CV/Hannoir Romain - Resume.pdf"
    document.getElementById('cv-download').download = language.language == "fr" ? "Hannoir Romain - CV.pdf" : "Hannoir Romain - Resume.pdf"

    const elements = document.querySelectorAll("*"); // Sélectionne tous les éléments de la page
    
    elements.forEach((element) => {
      // Si l'élément contient du texte
      if (element.childNodes.length === 1) {
        const originalText = element.textContent.trim();
        if (translations[originalText]) {
          element.textContent = translations[originalText]; // Remplace par la traduction
        }
      }
    });

    //translate the problematic elements
    let div = document.getElementById('portfolio-title');
    div.innerHTML = div.innerHTML.replace(div.innerText, translations[div.innerText]);

    printProjects(activeFilter, false);
    if (selectedProjectIndex >= 0) {
        const tempIndex = selectedProjectIndex
        selectedProjectIndex = -1
        printSelectedProject(tempIndex)
    }
  }
  
// Appliquer la traduction lorsque la page est chargée
document.addEventListener("DOMContentLoaded", translatePage);

/* scroll and github projects */
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

//remplir les projet avec github
async function fetchGitHubRepos() {
    const url = 'https://api.github.com/users/Romain-02/repos';

    fetch(url, {
    })
        .then(response => response.json())
        .then(repos => {
            repositories = repos;
            repositories = repositories.filter((repository) => repository.topics.includes('portfolio'))
            // Utilise Promise.all pour attendre toutes les promesses
            Promise.all(repositories.map(async (repository) => {
                const translations = await getTranslations(repository);

                return {
                    ...repository,
                    title: {
                        'en': translations.title.en,
                        'fr': translations.title.fr
                    },
                    description: {
                        'en': translations.description.en,
                        'fr': translations.description.fr
                    }
                };
            }))
            .then(updatedRepos => {
                repositories = updatedRepos;
                printProjects(activeFilter, false);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des traductions :", error);
            });
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
    if(i in fetchedImages){
        const imgElement = document.querySelector(selected ? '.img-project' : `#project${i} .img-project`);
        imgElement.src = fetchedImages[i];
        return;
    }

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
        fetchedImages[i] = imageUrl;
        const imgElement = document.querySelector(selected ? '.img-project' : `#project${i} .img-project`);
        imgElement.src = imageUrl;
    
    });
}

function printProjects(filter, selectedProject = true){
    if(selectedProject){
         removeSelectedProject();
    }
    activeFilter = filter;
    const repoList = document.getElementById("list-repositories");
    repoList.innerHTML = ``;
    repositories.forEach((repo, i) => {
        if(filter === '' || repositories[i]['language'] === filter || (filter === 'Web' && ['HTML/CSS', 'JavaScript'].includes(repositories[i]['language']))){
            repoList.innerHTML += `
            <div id="project`+ i +`" class="project effect">
                <img class="img-project" id="project${i}">
                <h3><b>${repo['title'][activeLanguage]}</b></h3>
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

async function getTranslations(repository){
    const translatedDescriptions = "https://raw.githubusercontent.com/Romain-02/" + repository['name'] + "/main/portfolio.json";
    let translations = {
            title: {
                fr: repository['name'],
                en: repository['name']
            }, 
            description: {
                fr: repository['description'] ?? "", 
                en: repository['description'] ?? ""
            }
        }
    
    await fetch(translatedDescriptions)
        .then(res => {
        if (!res.ok) throw new Error("File not found");
        return res.json();
    })
    .then(data => {
        translations = data
    })
    .catch(() => { 
        console.error(repository['name'] + " does not have translations")
    });

    return translations
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
                            <h3><b>${repositories[i]['title'][activeLanguage]}</b></h3>
                            <p id="description`+ i +`">${repositories[i]['description'][activeLanguage]}</p>
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
