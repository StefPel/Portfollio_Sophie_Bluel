// Ajoute un écouteur d'événement qui attend que le contenu de la page soit chargé.
document.addEventListener('DOMContentLoaded', () => {

    // Sélectionne tous les éléments qui déclenchent l'ouverture de la modal.
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    // Sélectionne le conteneur de la modal.
    const modalContainer = document.querySelector('.modal-container');
    // Sélectionne la flèche.
    const arrowBackIcon = document.querySelector('.arrow-modal');
    // Sélectionne tous les éléments qui permettent de fermer la modal.
    const closeModalElements = document.querySelectorAll('.close-modal');
    // Sélectionne le conteneur de la galerie dans la modal.
    const galleryContainer = document.querySelector('.gallery_modal');
    // Sélectionne le bouton pour ajouter des images à la galerie.
    const addGalleryButton = document.querySelector('.button_add_gallery');
    // Sélectionne la modal d'ajout.
    const modalAdd = document.querySelector('.modal_add');
    // Sélectionne le formulaire dans la modal d'ajout.
    const form = document.querySelector('.modal_add form');
    // Sélectionne le sélecteur de catégories.
    const selectCategories = document.getElementById("categories");
    // Sélectionne le bouton pour ajouter une photo.
    const addPhotoButton = document.querySelector('.button_add_picture');
    // Sélectionne le champ de saisie pour le titre de l'image.
    const inputTitle = document.getElementById("title_picture");
    // Sélectionne le conteneur pour l'ajout de photo.
    const labelFile = document.querySelector('.form_add_photo');
    // Sélectionne le bouton de validation du formulaire.
    const validateButton = document.querySelector('.button_validate');
    // Crée dynamiquement un input de type fichier.
    const fileInput = createFileInput();
    // Crée dynamiquement un élément img pour afficher l'image sélectionnée.
    const img_element = createImgElement();
    // Sélectionne l'élément pour afficher les messages d'erreur.
    const errorMessage = document.querySelector('.error-message');

    // Sélectionne l'icône flèche par son id et ajoute un écouteur d'événement pour le clic
document.getElementById('backArrow').addEventListener('click', () => {
    // Cache la modal d'ajout
    modalAdd.style.display = 'none';
    // Affiche la première modal
    modalContainer.classList.add('active');
});

    // Ajoute des écouteurs d'événements sur les éléments qui déclenchent l'ouverture/fermeture de la modal.
    modalTriggers.forEach(trigger => trigger.addEventListener('click', toggleModal));
    closeModalElements.forEach(element => element.addEventListener('click', toggleModal));
    // Ajoute un écouteur d'événement sur le bouton pour afficher la modal d'ajout.
    addGalleryButton.addEventListener('click', showAddModal);
    // Ajoute un écouteur d'événement sur le bouton pour cacher la modal d'ajout.
    document.querySelector('.modal_add .close-modal').addEventListener('click', hideAddModal);
    // Ajoute un écouteur d'événement sur le formulaire pour gérer la soumission.
    form.addEventListener('submit', submitForm);
    // Ajoute un écouteur d'événement sur le bouton pour déclencher le clic sur l'input de type fichier.
    addPhotoButton.addEventListener('click', () => fileInput.click());
    // Ajoute un écouteur d'événement sur l'input de type fichier pour gérer le changement de fichier.
    fileInput.addEventListener("change", handleFileChange);
    // Ajoute des écouteurs d'événement sur les éléments pour activer/désactiver le bouton de soumission.
    inputTitle.addEventListener("input", updateSubmitButton);
    selectCategories.addEventListener("change", updateSubmitButton);

    // Appelle la fonction pour récupérer les catégories depuis l'API.
    fetchCategories();
    // Met à jour l'état du bouton de soumission.
    updateSubmitButton();

// Définition des fonctions utilisées dans le script...

// Fonction pour basculer la visibilité de la modal (la montrer ou la cacher)
function toggleModal() {
    modalContainer.classList.toggle('active'); // Bascule la classe 'active' pour montrer ou cacher la modal
    modalContainer.classList.contains('active') && loadGalleryFromAPI(); // Si la modal est active, charge la galerie depuis l'API
}

// Fonction pour montrer la modal d'ajout
function showAddModal() {
    modalAdd.style.display = 'block'; // Modifie le style pour afficher la modal
}

// Fonction pour cacher la modal d'ajout
function hideAddModal() {
    modalAdd.style.display = 'none'; // Modifie le style pour cacher la modal
}

// Fonction pour créer un champ d'entrée de fichier
function createFileInput() {
    const fileInput = document.createElement('input'); // Crée un élément input
    fileInput.type = 'file'; // Définit le type comme fichier
    fileInput.style.display = 'none'; // Cache l'input
    fileInput.accept = 'image/png, image/jpeg'; // Accepte seulement les images PNG et JPEG
    document.body.appendChild(fileInput); // Ajoute l'input au corps du document
    return fileInput; // Retourne l'input créé
}

// Fonction pour gérer le changement de fichier
function handleFileChange(e) {
    const file = e.target.files[0]; // Récupère le fichier sélectionné
    file && displayImg(URL.createObjectURL(file)); // Affiche l'image si un fichier est sélectionné
}

// Fonction pour afficher l'image
function displayImg(url) {
    labelFile.style.padding = "0px"; // Réinitialise le padding
    img_element.src = url; // Définit l'URL de l'image
    img_element.style.maxWidth = "100%"; // Ajuste la largeur maximale
    img_element.style.height = "auto"; // Ajuste la hauteur automatiquement
    labelFile.innerHTML = ""; // Efface le contenu actuel
    labelFile.appendChild(img_element); // Ajoute l'élément image
    updateSubmitButton(); // Met à jour le bouton de soumission
}

// Fonction pour créer un élément image
function createImgElement() {
    const img_element = document.createElement("img"); // Crée un élément image
    img_element.style.objectFit = 'cover'; // Ajuste le remplissage de l'image
    img_element.style.width = '129px'; // Définit la largeur
    img_element.style.height = '169px'; // Définit la hauteur
    return img_element; // Retourne l'élément image créé
}

// Fonction pour récupérer les catégories depuis l'API
function fetchCategories() {
    fetch('http://localhost:5678/api/categories') // Envoie une requête à l'API
        .then(response => response.ok ? response.json() : Promise.reject(`Erreur HTTP ! Statut : ${response.status}`)) // Gère la réponse
        .then(fillCategories) // Remplit les catégories
        .catch(handleError); // Gère les erreurs
}

// Fonction pour remplir les catégories dans le formulaire
function fillCategories(categories) {
    categories.forEach(category => {
        const option = new Option(category.name, category.id); // Crée une nouvelle option
        selectCategories.appendChild(option); // Ajoute l'option au select
    });
}

// Fonction pour charger la galerie depuis l'API
function loadGalleryFromAPI() {
    fetchGalleryData('http://localhost:5678/api/works') // Envoie une requête à l'API
        .then(data => {
            galleryContainer.innerHTML = ''; // Vide le conteneur de la galerie
            data.forEach(item => addImageToGallery(item.imageUrl, item.id)); // Ajoute chaque image à la galerie
        })
        .catch(handleError); // Gère les erreurs
}

// Fonction pour récupérer les données de la galerie
function fetchGalleryData(url) {
    return fetch(url) // Envoie une requête à l'URL spécifiée
        .then(response => response.ok ? response.json() : Promise.reject(`Erreur HTTP ! Statut : ${response.status}`)); // Gère la réponse
}

// Fonction pour ajouter une image à la galerie
function addImageToGallery(src, projectId) {
    const imageContainer = document.createElement('div'); // Crée un conteneur pour l'image
    imageContainer.classList.add('img_modal'); // Ajoute une classe au conteneur
    const image = new Image(); // Crée une nouvelle image
    image.src = src; // Définit l'URL de l'image
    const deleteButton = createDeleteButton(projectId); // Crée un bouton de suppression
    imageContainer.appendChild(image); // Ajoute l'image au conteneur
    imageContainer.appendChild(deleteButton); // Ajoute le bouton de suppression
    galleryContainer.appendChild(imageContainer); // Ajoute le conteneur à la galerie
}

// Fonction pour créer un bouton de suppression
function createDeleteButton(projectId) {
    const deleteButton = document.createElement('button'); // Crée un bouton
    deleteButton.classList.add('icon1_modal'); // Ajoute une classe au bouton
    deleteButton.setAttribute('data-id', projectId); // Ajoute l'identifiant du projet
    deleteButton.addEventListener('click', () => deleteProject(projectId)); // Ajoute un gestionnaire d'événements
    const iconImage = new Image(); // Crée une nouvelle image pour l'icône
    iconImage.src = 'assets/icons/Group 9.svg'; // Définit l'URL de l'icône
    iconImage.alt = 'Supprimer'; // Définit le texte alternatif
    deleteButton.appendChild(iconImage); // Ajoute l'icône au bouton
    return deleteButton; // Retourne le bouton créé
}

// Fonction pour supprimer un projet
function deleteProject(projectId) {
    fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: 'DELETE', // Méthode de suppression
        headers: {'Authorization': `Bearer ${localStorage.getItem('userToken')}`} // Ajoute le token d'authentification
    })
    .then(response => {
        const targetButton = document.querySelector(`button[data-id="${projectId}"]`); // Trouve le bouton ciblé
        targetButton && targetButton.parentNode.remove(); // Supprime le conteneur du bouton
        //toggleModal(); // Ferme la modal après la suppression réussie
    })
    .catch(handleError); // Gère les erreurs
}

function submitForm(event) {
    event.preventDefault(); // Empêche l'envoi classique du formulaire
    if (!isFormValid()) {
        alert('Veuillez remplir correctement le formulaire.');
        return;
    }
    const formData = new FormData();
    formData.append('title', inputTitle.value);
    formData.append('category', selectCategories.value);
    if (fileInput.files[0]) formData.append('image', fileInput.files[0]);

    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        body: formData,
        headers: {'Authorization': `Bearer ${localStorage.getItem('userToken')}`}
    })
    .then(response => response.ok ? response.json() : Promise.reject(`Erreur HTTP ! Statut : ${response.status}`))
    .then(data => {
       
        modalAdd.style.display = 'none';
        form.reset();
        modalContainer.classList.add('active');
        loadGalleryFromAPI();
    })
    .catch(error => {
        console.error('Erreur lors de l\'ajout du projet :', error);
        // Vérifier si le message d'erreur existe déjà
        let errorMessageId = "error-message";
        let existingErrorMessage = document.getElementById(errorMessageId);
        if (!existingErrorMessage) {
            // Créer et ajouter le message d'erreur s'il n'existe pas déjà
            let p = document.createElement("p");
            p.id = errorMessageId; // Attribuer un identifiant unique
            p.textContent = "Veuillez remplir le formulaire correctement";
            let div = document.getElementById("maDiv");
            div.style.display = "block"; // S'assure que la div est visible
            div.appendChild(p);
        }
    });
}

// Fonction pour mettre à jour le bouton de soumission
function updateSubmitButton() {
    const isValid = isFormValid();
    // Désactivation du bouton de validation si le formulaire n'est pas valide
    validateButton.disabled = !isValid;

    // Ajout ou suppression de la classe 'button' pour le style du bouton en fonction de la validité
     // Ajout ou suppression de la classe 'button' pour le style du bouton en fonction de la validité
     if (isValid) {
        validateButton.classList.add('button');
    } else {
        validateButton.classList.remove('button');
    }
}

// Fonction pour vérifier si le formulaire est valide
function isFormValid() {
    // Récupération de la valeur du champ 'Titre'
    const title = inputTitle.value;
    // Récupération des catégories sélectionnées
    const selectedCategories = selectCategories.querySelectorAll('option:checked');
    // Vérification si le titre n'est pas vide et au moins une catégorie est sélectionnée
    const isValid = title.trim() !== '' && selectedCategories.length > 0;

    // Affichage d'une erreur si le champ 'Titre' est vide
    if (title.trim() === '') {
        console.error("Le champ 'Titre' est vide.");
    }

    // Affichage d'une erreur si aucune catégorie n'est sélectionnée
    if (selectedCategories.length === 0) {
        console.error("Aucune catégorie n'est sélectionnée.");
    }

    return isValid;
}

// Fonction pour gérer les erreurs
function handleError(error) {
    console.error('Erreur lors de l\'opération :', error); // Affiche un message d'erreur
    alert('Une erreur s\'est produite. Veuillez réessayer.'); // Affiche une alerte à l'utilisateur
}
});