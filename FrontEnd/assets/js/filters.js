// filters.js

// Ce script permet de gérer l'affichage et les filtres des projets

// Sélection des éléments du DOM pour l'affichage de la galerie et les filtres
const gallery = document.querySelector('.gallery');
const filtersContainer = document.querySelector('.filters');

/**
 * Initialise la galerie et les filtres au chargement de la page.
 */
function init() {
    fetchProjects()
        .then(projects => {
            displayProjects(projects);
            createFilterButtons(projects);
        })
        .catch(handleError);
}

/**
 * Récupère les projets depuis l'API de manière asynchrone.
 * @returns {Promise<Array>} Promesse des projets récupérés.
 */
async function fetchProjects() {
    const response = await fetch('http://localhost:5678/api/works');
    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
}

/**
 * Affiche les projets dans la galerie.
 * @param {Array} projects Les projets à afficher.
 */
function displayProjects(projects) {
    gallery.innerHTML = projects.map(projectToHTML).join('');
}

/**
 * Convertit un objet projet en chaîne HTML pour l'affichage.
 * @param {Object} project Le projet à convertir.
 * @returns {string} Chaîne HTML représentant le projet.
 */
function projectToHTML(project) {
    return `
        <figure>
            <img src="${project.imageUrl}" alt="${project.title}" />
            <figcaption>${project.title}</figcaption>
        </figure>
    `;
}

/**
 * Crée les boutons de filtre basés sur les catégories de projets.
 * @param {Array} projects Les projets à partir desquels créer les filtres.
 */
function createFilterButtons(projects) {
    filtersContainer.innerHTML = ''; // Efface les boutons existants
    const categories = ['Tous', ...new Set(projects.map(project => project.category.name))];
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.classList.add('button'); // Applique le style CSS
        button.addEventListener('click', () => filterAndDisplayProjects(projects, category));
        filtersContainer.appendChild(button); // Ajoute le bouton directement au conteneur
    });
}

/**
 * Filtre et affiche les projets en fonction de la catégorie sélectionnée.
 * @param {Array} projects Les projets à filtrer et à afficher.
 * @param {string} category La catégorie sur laquelle filtrer.
 */
function filterAndDisplayProjects(projects, category) {
    const filteredProjects = category === 'Tous' ? projects : projects.filter(project => project.category.name === category);
    displayProjects(filteredProjects);
}

/**
 * Gère les erreurs survenues lors de la récupération des projets.
 * @param {Error} error L'erreur survenue.
 */
function handleError(error) {
    console.error('Erreur lors de la récupération des projets:', error);
    gallery.innerHTML = `<p class="error-message">Erreur lors du chargement des projets: ${error.message}</p>`;
}

/**
 * Applique les styles CSS aux boutons après leur création dynamique.
 * Cela est nécessaire si les boutons sont créés après le chargement du CSS.
 */
function applyButtonStyles() {
    // Code pour appliquer des styles supplémentaires si nécessaire
}

// Écouteur d'événements pour initialiser la galerie et les filtres au chargement du document
document.addEventListener('DOMContentLoaded', init);
