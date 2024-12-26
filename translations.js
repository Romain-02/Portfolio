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
        "© 2024 Hannoir Romain - PortFolio.": "© 2024 Hannoir Romain - Portfolio."
    };
    
    const eng_to_french = Object.fromEntries(
        Object.entries(french_to_eng).map(([key, value]) => [value, key])
      );

    //language and icon
    let language = event.target.src.includes('/images/france.png') ? "angleterre" : "france"; 
    let translations = language == "france" ? eng_to_french : french_to_eng; 
    event.target.src = '/images/' + language + '.png';

    //CV
    document.getElementById('cv-download').href = language == "france" ? "/CV/Hannoir Romain - CV.pdf" : "/CV/Hannoir Romain - Resume.pdf"
    document.getElementById('cv-download').download = language == "france" ? "Hannoir Romain - CV.pdf" : "/CV/Hannoir Romain - Resume.pdf"

    const elements = document.querySelectorAll("*"); // Sélectionne tous les éléments de la page

    console.log(language, event.target.src)
    
    elements.forEach((element) => {
      // Si l'élément contient du texte
      if (element.childNodes.length === 1) {
        const originalText = element.textContent.trim();
        if (translations[originalText]) {
          element.textContent = translations[originalText]; // Remplace par la traduction
        }
      }
    });

    //translate the problematic text
    let element = document.getElementById("portfolio-title");
    let originalText = element.textContent.trim();
    element.textContent = translations[originalText];
    element = document.getElementById("phone");
    originalText = element.textContent.trim();
    console.log(originalText);
    element.textContent = translations[originalText];
  }
  
// Appliquer la traduction lorsque la page est chargée
document.addEventListener("DOMContentLoaded", translatePage);
