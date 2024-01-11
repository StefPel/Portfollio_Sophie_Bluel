document.addEventListener('DOMContentLoaded', () => {
    // Sélectionner l'élément de la galerie où les projets seront affichés par classe
    const gallery = document.querySelector('.gallery');  // Utiliser querySelector pour sélectionner le premier élément avec la classe 'gallery'
    console.log('Élément de galerie sélectionné:', gallery);

    // Effectuer une requête à l'API pour obtenir les projets
    fetch('http://localhost:5678/api/works')
    .then(response => {
        // Vérifier si la réponse de l'API est un succès
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }
        return response.json();
    })
    .then(projects => {
        console.log('Projets récupérés depuis l\'API:', projects);

        // Nettoyer la galerie pour s'assurer qu'elle est vide avant d'ajouter de nouveaux éléments
        gallery.innerHTML = '';
        console.log('La galerie a été nettoyée.');

        // Itérer à travers chaque projet et créer les éléments HTML correspondants
        projects.forEach(project => {
            console.log('Traitement du projet:', project.title);
            // Créer un élément figure pour chaque projet
            const figure = document.createElement('figure');
            // Créer un élément img, définir ses attributs src et alt
            const img = document.createElement('img');
            img.src = project.imageUrl; // S'assurer que cette propriété correspond à vos données
            img.alt = project.title; // Ajouter un texte alternatif pour l'accessibilité
            figure.appendChild(img);

            // Créer un élément figcaption et ajouter le titre du projet
            const figcaption = document.createElement('figcaption');
            figcaption.textContent = project.title;
            figure.appendChild(figcaption);

            // Ajouter le nouvel élément figure à la galerie
            gallery.appendChild(figure);
            console.log('Projet ajouté à la galerie:', project.title);
        });
    })
    .catch(error => {
        // Logger les erreurs s'il y a des problèmes lors de la récupération des projets
        console.error('Erreur lors de la récupération des projets:', error);
    });
});