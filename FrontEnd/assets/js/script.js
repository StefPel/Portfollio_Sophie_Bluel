// Attente que le document HTML soit complètement chargé avant d'exécuter le code
document.addEventListener('DOMContentLoaded', () => {

    // Sélection de l'élément HTML avec la classe 'gallery'
    const gallery = document.querySelector('.gallery');
    console.log('Élément de galerie sélectionné :', gallery);

    // Sélection de l'élément HTML avec la classe 'filters'
    const filtersContainer = document.querySelector('.filters');
    console.log('Conteneur des filtres sélectionné :', filtersContainer);

    // Création d'un tableau vide pour stocker les données des projets
    let allProjects = [];

    // Définition d'une fonction pour afficher les projets dans la galerie
    function displayProjects(projects) {
        // Efface tout contenu existant dans la galerie
        gallery.innerHTML = '';

        // Parcours de chaque projet dans le tableau 'projects'
        projects.forEach(project => {
            // Création d'un élément 'figure' pour chaque projet
            const figure = document.createElement('figure');

            // Création d'un élément 'img' pour l'image du projet
            const img = document.createElement('img');
            img.src = project.imageUrl; // Définition de l'URL de l'image
            img.alt = project.title; // Définition du texte alternatif pour l'image
            figure.appendChild(img); // Ajout de l'image à l'élément 'figure'

            // Création d'un élément 'figcaption' pour le titre du projet
            const figcaption = document.createElement('figcaption');
            figcaption.textContent = project.title; // Ajout du titre du projet
            figure.appendChild(figcaption); // Ajout du titre à l'élément 'figure'

            // Ajout de l'élément 'figure' à la galerie
            gallery.appendChild(figure);
        });
    }

    // Définition d'une fonction pour filtrer les projets par catégorie
    function filterProjects(category) {
        // Déclaration d'une variable pour les projets filtrés
        let filteredProjects;

        // Si la catégorie sélectionnée est 'Tous'
        if (category === 'Tous') {
            filteredProjects = allProjects; // Utiliser tous les projets
        } else {
            // Sinon, filtrer les projets par la catégorie spécifiée
            filteredProjects = allProjects.filter(project => project.category.name === category);
        }

        // Afficher les projets filtrés
        displayProjects(filteredProjects);
    }

    // Récupération des projets depuis une API
    fetch('http://localhost:5678/api/works')
        .then(response => {
            // Vérification si la réponse de l'API est valide
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
            }
            return response.json(); // Transformation de la réponse en JSON
        })
        .then(projects => {
            allProjects = projects; // Stockage des projets dans 'allProjects'
            console.log('Projets récupérés depuis l\'API :', allProjects);

            displayProjects(allProjects); // Affichage initial de tous les projets

            // Création des boutons de filtre pour chaque catégorie unique
            const categories = [...new Set(projects.map(project => project.category.name))];
            categories.unshift('Tous'); // Ajout d'une option pour afficher tous les projets

            categories.forEach(category => {
                // Création d'un bouton pour chaque catégorie
                const button = document.createElement('button');
                button.textContent = category; // Définition du texte du bouton
                button.classList.add('button'); // Ajout d'une classe CSS au bouton

                // Ajout d'un gestionnaire d'événements pour filtrer par catégorie
                button.addEventListener('click', () => {
                    console.log(`Filtrage par catégorie : ${category}`);
                    filterProjects(category);
                });

                // Ajout du bouton au conteneur de filtres
                filtersContainer.appendChild(button);
            });
        })
        .catch(error => {
            // Affichage d'une erreur en cas d'échec de la récupération des projets
            console.error('Erreur lors de la récupération des projets :', error);
        });
});
