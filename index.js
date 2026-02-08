import { data } from './data.js';
import { translations } from './translations.js';

let currentLang = 'fr';

const printHero = () => {
    const heroTitle = document.querySelector('.header h1');
    const heroSubtitle = document.querySelector('.header h4');
    if (heroTitle) heroTitle.innerText = data.name;
    if (heroSubtitle) heroSubtitle.innerText = data.title[currentLang];
};

const printExperience = () => {
    const container = document.getElementById('experience-list');
    if (!container) return;
    container.innerHTML = data.experience.map(exp => `
        <div class="exp-item mb-4 p-4 bg-dark rounded border-left border-warning shadow">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h4 class="text-warning mb-0">${exp.company}</h4>
                <span class="text-muted small">${exp.period}</span>
            </div>
            <h5 class="text-light">${exp.role[currentLang]}</h5>
            <p class="text-muted">${exp.description[currentLang]}</p>
            <div class="mt-3">
                ${exp.stack.map(s => `<span class="badge badge-outline-warning mr-2 p-2">${s}</span>`).join('')}
            </div>
        </div>
    `).join('');
};

const printEducation = () => {
    const container = document.getElementById('education-list');
    if (!container) return;
    container.innerHTML = data.education.map(edu => `
        <div class="edu-item mb-4 p-3">
            <div class="d-flex justify-content-between align-items-center">
                <h4 class="text-warning h5 mb-1">${edu.degree[currentLang]}</h4>
                <span class="text-muted small">${edu.year}</span>
            </div>
            <div class="text-light font-weight-bold">${edu.school}</div>
            <p class="text-muted mt-2">${edu.description[currentLang]}</p>
        </div>
    `).join('');
};

const printSkills = () => {
    const container = document.getElementById('skills-list');
    if (!container) return;
    container.innerHTML = Object.entries(data.skills).map(([category, skills]) => `
        <div class="skill-category mb-5">
            <h5 class="text-warning text-uppercase mb-4" style="letter-spacing: 2px;">${category}</h5>
            <div class="d-flex flex-wrap">
                ${skills.map(skill => `
                    <div class="skill-item m-2 px-3 py-2 bg-dark rounded border border-secondary d-flex align-items-center">
                        <span class="text-light">${skill.name}</span>
                        ${skill.learning ? `<span class="badge badge-info ml-2" style="font-size: 0.65em; text-transform: uppercase;">${currentLang === 'fr' ? 'en apprentissage' : 'learning'}</span>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
};

const printHobbies = () => {
    const container = document.getElementById('hobbies-list');
    if (!container) return;
    container.innerHTML = data.hobbies.map(hobby => `
        <div class="hobby-item text-center m-4" style="width: 140px;">
            <div class="hobby-icon mb-3">
                 <img src="${hobby.icon}" class="rounded-circle shadow-lg" width="80" height="80" style="object-fit: cover; border: 3px solid #f59e0b;">
            </div>
            <h6 class="text-light font-weight-bold">${hobby.name[currentLang]}</h6>
        </div>
    `).join('');
};

const fetchRepos = async () => {
    try {
        const response = await fetch('https://api.github.com/users/Romain-02/repos');
        if (!response.ok) throw new Error('Failed to fetch repos');
        return await response.json();
    } catch (error) {
        console.error('GitHub API error:', error);
        return [];
    }
};

const printProjects = async () => {
    const container = document.getElementById('projects-list');
    if (!container) return;
    
    container.innerHTML = '<div class="spinner-border text-warning m-5" role="status"><span class="sr-only">Loading...</span></div>';

    const repos = await fetchRepos();
    // Use optional chaining and array check for topics
    const portfolioRepos = repos.filter(repo => repo.topics?.includes('portfolio'));

    if (portfolioRepos.length === 0) {
        container.innerHTML = '<p class="text-muted">Aucun projet avec le tag "portfolio" trouvé.</p>';
        return;
    }

    container.innerHTML = portfolioRepos.map(repo => {
        const override = data.overrides[repo.name] || {};
        const title = override.title || repo.name;
        const description = override.description ? override.description[currentLang] : repo.description;

        return `
            <div class="project-card m-3 p-4 bg-dark rounded border shadow-lg" style="width: 320px; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-10px)'" onmouseout="this.style.transform='translateY(0)'">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <h4 class="text-warning h5 font-weight-bold mb-0">${title}</h4>
                    <a href="${repo.html_url}" target="_blank" class="text-muted"><i class="fab fa-github fa-lg"></i></a>
                </div>
                <p class="small text-muted mb-4" style="height: 60px; overflow: hidden;">${description || 'Pas de description.'}</p>
                <div class="d-flex justify-content-between align-items-center mt-auto">
                    <span class="badge badge-outline-warning small px-2 py-1">${repo.language || 'Code'}</span>
                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="btn btn-sm btn-outline-light"><i class="fas fa-external-link-alt"></i></a>` : ''}
                </div>
            </div>
        `;
    }).join('');
};

const translatePage = () => {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.innerText = currentLang.toUpperCase();

    // Update static elements with data-t
    document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        if (translations[currentLang][key]) {
            el.innerHTML = el.innerHTML.includes('<i')
                ? el.innerHTML.replace(el.textContent.trim(), translations[currentLang][key])
                : translations[currentLang][key];
        }
    });

    // Re-render dynamic parts
    init();
};

const init = async () => {
    printHero();
    printExperience();
    printEducation();
    printSkills();
    printHobbies();
    await printProjects();
};

window.translatePage = translatePage;
window.addEventListener('DOMContentLoaded', init);
