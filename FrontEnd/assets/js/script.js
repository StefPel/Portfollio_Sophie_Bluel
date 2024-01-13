// Attend que le document HTML soit complètement chargé avant d'exécuter le code JavaScript.
document.addEventListener('DOMContentLoaded', () => {

    // Sélectionne l'élément HTML avec la classe 'gallery' et l'assigne à la variable 'gallery'.
    const gallery = document.querySelector('.gallery');
    console.log('Élément de galerie sélectionné :', gallery);

    // Sélectionne l'élément HTML avec la classe 'filters' et l'assigne à la variable 'filtersContainer'.
    const filtersContainer = document.querySelector('.filters');
    console.log('Conteneur des filtres sélectionné :', filtersContainer);

    // Crée un tableau vide 'allProjects' pour stocker les données des projets plus tard.
    let allProjects = [];

    // Fonction pour afficher les projets dans la galerie.
    function displayProjects(projects) {
        gallery.innerHTML = ''; // Efface tout contenu existant dans la galerie.

        // Parcourt chaque projet dans le tableau 'projects'.
        projects.forEach(project => {
            const figure = document.createElement('figure'); // Crée un élément 'figure'.

            const img = document.createElement('img'); // Crée un élément 'img' pour l'image.
            img.src = project.imageUrl; // Définit l'URL de l'image.
            img.alt = project.title; // Définit le texte alternatif.
            figure.appendChild(img); // Ajoute l'image à 'figure'.

            const figcaption = document.createElement('figcaption'); // Crée un élément 'figcaption'.
            figcaption.textContent = project.title; // Ajoute le titre du projet.
            figure.appendChild(figcaption); // Ajoute le titre à 'figure'.

            gallery.appendChild(figure); // Ajoute 'figure' à la galerie.
        });
    }

    // Fonction pour filtrer les projets par catégorie.
    function filterProjects(category) {
        let filteredProjects; // Variable pour les projets filtrés.

        if (category === 'Tous') {
            filteredProjects = allProjects; // Si 'Tous', utilise tous les projets.
        } else {
            // Sinon, filtre les projets par catégorie.
            filteredProjects = allProjects.filter(project => project.category.name === category);
        }

        displayProjects(filteredProjects); // Appelle 'displayProjects' avec les projets filtrés.
    }

    // Récupère les projets depuis une API.
    fetch('http://localhost:5678/api/works')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
            }
            return response.json(); // Convertit la réponse en JSON.
        })
        .then(projects => {
            allProjects = projects; // Stocke les projets dans 'allProjects'.
            console.log('Projets récupérés depuis l\'API :', allProjects);

            displayProjects(allProjects); // Affiche tous les projets.

            // Crée des boutons de filtre pour chaque catégorie unique.
            const categories = [...new Set(projects.map(project => project.category.name))];
            categories.unshift('Tous'); // Ajoute 'Tous' aux catégories.

            // Parcourt les catégories pour créer les boutons de filtre.
            categories.forEach(category => {
                const button = document.createElement('button'); // Crée un bouton.
                button.textContent = category; // Définit le texte du bouton.
                button.classList.add('button'); // Ajoute une classe CSS.

                // Ajoute un écouteur d'événements pour gérer le filtrage lors du clic sur le bouton.
                button.addEventListener('click', () => {
                    console.log(`Filtrage par catégorie : ${category}`);
                    filterProjects(category); // Appelle 'filterProjects' quand le bouton est cliqué.
                });

                filtersContainer.appendChild(button); // Ajoute le bouton au conteneur.
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des projets :', error);
        });
});
