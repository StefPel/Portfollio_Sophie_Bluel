//-------------Authentification et Gestion du Mode Édition-------------//

// Fonction pour vérifier si l'utilisateur est connecté
function isLoggedIn() {
    // Retourne vrai (true) si le jeton utilisateur est trouvé dans le stockage local, sinon faux (false)
    return localStorage.getItem('userToken') !== null;
}

// Fonction pour changer l'affichage des éléments et de leurs enfants
function toggleDisplay(element, displayStyle) {
    if (element) {
        // Modifie le style d'affichage de l'élément
        element.style.display = displayStyle;
        // Parcourt et modifie le style d'affichage de chaque enfant de l'élément
        Array.from(element.children).forEach(child => {
            child.style.display = displayStyle;
        });
    }
}

// Fonction pour activer ou désactiver le mode édition
function toggleEditMode() {
    // Vérifie si le mode édition est activé
    const editMode = localStorage.getItem('editMode') === 'true';
    // Sélectionne les éléments concernés par le mode édition
    const headerEdit = document.querySelector('.header_edit');
    const modifyProject = document.querySelector('.modify_project');

    // Applique le style d'affichage approprié en fonction du mode édition
    if (editMode) {
        console.log("Mode édition activé");
        toggleDisplay(headerEdit, 'flex'); // Affiche .header_edit et ses enfants
        toggleDisplay(modifyProject, 'flex'); // Affiche .modify_project et ses enfants
    } else {
        console.log("Mode édition désactivé");
        toggleDisplay(headerEdit, 'none'); // Masque .header_edit et ses enfants
        toggleDisplay(modifyProject, 'none'); // Masque .modify_project et ses enfants
    }
}

// Écouteur d'événements qui s'exécute après le chargement complet de la page
document.addEventListener('DOMContentLoaded', () => {
    console.log("Chargement de la page terminé");

    // Définit l'état du mode édition en fonction de l'état de connexion
    if (isLoggedIn()) {
        console.log("Utilisateur connecté");
        localStorage.setItem('editMode', 'true');
    } else {
        console.log("Utilisateur non connecté");
        localStorage.setItem('editMode', 'false');
    }

    // Applique le mode édition
    toggleEditMode();

//-------------Authentification de l’utilisateur------------//

    // Gestion de l'authentification
    let userData = {}; // Stocke les données de l'utilisateur

    /**
     * Redirige vers la page d'accueil après une connexion réussie.
     */
    function redirection() {
        document.location.href = "index.html";
    }

    /**
     * Traite le processus de connexion.
     */
    async function login() {
        const emailLogin = document.getElementById("email").value;
        const passwordLogin = document.getElementById("password").value;

        const user = {
            email: emailLogin,
            password: passwordLogin,
        };

        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                const data = await response.json();
                userData = data.token;
                localStorage.setItem('userToken', data.token);
                console.log("Authentification réussie. Token d'utilisateur :", userData);
                redirection();
            } else {
                afficherErreur();
            }
        } catch (error) {
            console.error("Erreur lors de l'authentification : " + error);
        }
    }

    /**
     * Affiche un message d'erreur en cas d'échec de l'authentification.
     */
    function afficherErreur() {
        const error = "Identifiant ou mot de passe incorrects";
        document.querySelector(".error").innerHTML = error;
        console.error("Échec de l'authentification.");
    }

    // Gestionnaire d'événements pour le formulaire de connexion
    const btnForm = document.querySelector(".connexion");
    if (btnForm) {
        btnForm.addEventListener("submit", (e) => {
            e.preventDefault();
            login();
        });
    }
});

//----------------Récupération des travaux depuis le back-end--------------------

// Sélectionne l'élément de la galerie et le conteneur de filtres
const gallery = document.querySelector('.gallery');
console.log('Élément de la galerie sélectionné :', gallery);
const filtersContainer = document.querySelector('.filters');
console.log('Conteneur de filtres sélectionné :', filtersContainer);

// Tableau pour stocker les données des projets
let allProjects = [];

/**
 * Affiche les projets dans la galerie.
 * @param {Array} projects - Tableau des projets à afficher.
 */
function displayProjects(projects) {
    // Efface le contenu actuel de la galerie
    gallery.innerHTML = '';

    // Affiche chaque projet
    projects.forEach(project => {
        // Crée les éléments nécessaires pour chaque projet
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = project.imageUrl;
        img.alt = project.title;
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = project.title;

        // Assemble et ajoute le projet à la galerie
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

/**
 * Filtre et affiche les projets par catégorie.
 * @param {String} category - Catégorie utilisée pour filtrer les projets.
 */
function filterProjects(category) {
    // Détermine les projets à afficher en fonction de la catégorie
    const filteredProjects = category === 'Tous' ? allProjects : allProjects.filter(project => project.category.name === category);

    // Affiche les projets filtrés
    displayProjects(filteredProjects);
    console.log(`Projets filtrés par '${category}' affichés.`);
}

// Récupère les projets depuis l'API
fetch('http://localhost:5678/api/works')
    .then(response => {
        // Vérifie si la réponse est correcte
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }
        return response.json();
    })
    .then(projects => {
        // Stocke et affiche les projets
        allProjects = projects;
        console.log('Projets récupérés depuis l\'API :', allProjects);
        displayProjects(allProjects);

        // Crée et ajoute des boutons de filtre
        const categories = [...new Set(projects.map(project => project.category.name))];
        categories.unshift('Tous');
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category;
            button.classList.add('button');
            button.addEventListener('click', () => filterProjects(category));
            filtersContainer.appendChild(button);
        });
        console.log('Boutons de filtre créés.');
    })
    .catch(error => {
        // Gère les erreurs de la requête
        console.error('Erreur lors de la récupération des projets :', error);
    });

//-----------------Ajout de la fenêtre modale----------------//
  
// Attendre que le DOM soit entièrement chargé avant d'exécuter le script
    document.addEventListener('DOMContentLoaded', function () {
    // Sélectionner les éléments qui déclenchent l'ouverture/fermeture de la modale
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    // Sélectionner le conteneur de la modale
    const modalContainer = document.querySelector('.modal-container');
    // Sélectionner tous les éléments qui permettent de fermer la modale
    const closeModalElements = document.querySelectorAll('.close-modal');
    // Sélectionner le conteneur où les images de la galerie seront affichées
    const galleryContainer = document.querySelector('.gallery_modal');
    // Sélectionner le bouton "Ajouter une photo"
    const addGalleryButton = document.querySelector('.button_add_gallery');
    // Sélectionner la modal "modal_add"
    const modalAdd = document.querySelector('.modal_add');
    // Sélectionner le bouton "Ajouter photo" dans la modal "modal_add"
    const addPhotoButton = document.querySelector('.button_add_picture');

    // Fonction pour ouvrir/fermer la modale et charger la galerie si nécessaire
    function toggleModal() {
        modalContainer.classList.toggle('active');
        // Vérifier si la modale est active pour charger la galerie
        if (modalContainer.classList.contains('active')) {
            loadGalleryFromAPI(); // Appel de la fonction pour charger la galerie
        }
    }

    // Fonction pour afficher la modal "modal_add"
    function showAddModal() {
        modalAdd.style.display = 'block';
    }

    // Attacher l'ouverture/fermeture de la modale à tous les éléments déclencheurs
    modalTriggers.forEach(trigger => trigger.addEventListener('click', toggleModal));

    // Attacher la fermeture de la modale aux éléments de fermeture (croix)
    closeModalElements.forEach(element => element.addEventListener('click', toggleModal));

    // Attacher l'affichage de la modal "modal_add" au bouton "Ajouter une photo"
    addGalleryButton.addEventListener('click', showAddModal);

    // Attacher la fermeture de la modal "modal_add" au bouton "Fermer" dans la modal "modal_add"
    const closeModalAdd = document.querySelector('.modal_add .close-modal');
    closeModalAdd.addEventListener('click', function () {
        modalAdd.style.display = 'none';
    });

//-----------------Suppression de travaux existants--------------//

    // Fonction pour charger la galerie depuis l'API
    function loadGalleryFromAPI() {
        // Remplacer avec l'URL de votre API
        fetch('http://localhost:5678/api/works')
            .then(response => {
                // Vérifier la réponse de la requête
                if (!response.ok) {
                    throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Données récupérées de l\'API', data);
                // Vider le conteneur de la galerie avant de le remplir avec les nouvelles images
                galleryContainer.innerHTML = '';
                // Ajouter chaque image à la galerie
                data.forEach(item => addImageToGallery(item.imageUrl, item.id));
            })
            .catch(error => {
                console.error('Erreur lors du chargement de la galerie :', error);
            });
    }

    // Fonction pour ajouter une image individuelle à la galerie
    function addImageToGallery(src, projectId) {
        console.log('Ajout de l\'image à la galerie :', src);
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('img_modal');

        const image = document.createElement('img');
        image.src = src;

        // Créer un bouton pour la suppression avec une icône SVG à la place du texte 'X'
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('icon1_modal');
        deleteButton.setAttribute('data-id', projectId); // Ajouter l'ID du projet comme attribut data-id
        deleteButton.addEventListener('click', function() {
            deleteProject(projectId);
        });

        // Ajouter l'élément img pour l'icône SVG dans le bouton
        const iconImage = document.createElement('img');
        iconImage.src = 'assets/icons/Group 9.svg'; // Chemin d'accès à l'icône SVG
        iconImage.alt = 'Supprimer'; // Texte alternatif pour l'icône
        deleteButton.appendChild(iconImage); // Ajoutez l'icône SVG au bouton

        // Ajouter l'image et le bouton de suppression au conteneur de l'image
        imageContainer.appendChild(image);
        imageContainer.appendChild(deleteButton);
        // Ajouter le conteneur de l'image à la galerie
        galleryContainer.appendChild(imageContainer);
    }

    // Fonction pour supprimer un projet
function deleteProject(projectId) {
    fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            // Gestion des erreurs HTTP
            if (response.status === 401) {
                // Erreur d'authentification
                console.error('Erreur d\'authentification. Vous n\'êtes pas autorisé à effectuer cette action.');
            } else {
                // Autre erreur HTTP
                throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
            }
        }
        console.log('Projet supprimé avec succès');
        // Mettre à jour le DOM pour retirer l'élément supprimé
        document.querySelector(`button[data-id="${projectId}"]`).parentNode.remove();
    })
    .catch(error => {
        // Gestion des erreurs de réseau ou autres erreurs
        console.error('Erreur lors de la suppression du projet :', error);
    });
}
    // Chargez la galerie depuis l'API au chargement de la page
    loadGalleryFromAPI();
});

//------------------Téléchargement image pour le formulaire de modal_add----------------//

// Création d'un élément input de type 'file' pour sélectionner une image
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.style.display = 'none'; // Masquer l'input (pour qu'il ne soit pas visible à l'écran)
fileInput.accept = 'image/png, image/jpeg'; // Accepter uniquement les images JPEG et PNG
document.body.appendChild(fileInput); // Ajouter l'input au DOM (dans le corps de la page)

// Gestion du clic sur le bouton "+ Ajouter photo" pour ouvrir le dialogue de sélection de fichier
const addPhotoButton = document.querySelector('.button_add_picture');
addPhotoButton.addEventListener('click', () => fileInput.click());

// Récupérer les éléments du formulaire
const inputTitle = document.getElementById("title_picture"); // Champ de saisie du titre de l'image
const selectCategories = document.getElementById("categories"); // Menu déroulant des catégories
const input_file = document.querySelector('input[type="file"]'); // Input de type 'file' pour sélectionner l'image
const labelFile = document.querySelector('.form_add_photo'); // Label pour afficher l'image sélectionnée
const img_element = document.createElement("img"); // Création d'un élément 'img' pour afficher l'image
const validateButton = document.querySelector('.button_validate'); // Bouton de validation
img_element.style.objectFit = 'cover'; // Assure que l'image garde ses proportions
img_element.style.width = '129px'; // Largeur fixe de l'image
img_element.style.height = '169px'; // Hauteur fixe de l'image

// Fonction pour charger les catégories depuis l'API
function loadCategoriesFromAPI() {
    // Remplacer avec l'URL de votre API pour les catégories
    fetch('http://localhost:5678/api/categories')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Ajouter chaque catégorie comme une option au menu déroulant
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id; // Vous pouvez utiliser l'ID ou une autre propriété comme valeur
                option.textContent = category.name; // Utilisez le nom de la catégorie comme texte
                selectCategories.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement des catégories :', error);
        });
}

// Appelez la fonction pour charger les catégories depuis l'API au chargement de la page
document.addEventListener("DOMContentLoaded", function() {
    loadCategoriesFromAPI();
});

// Gérer le changement de l'input de type 'file'
fileInput.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const imageUrl = e.target.result; // Récupérer l'URL de l'image
        displayImg(imageUrl); // Afficher l'image en passant l'URL comme argument
        validateButton.disabled = false; // Activer le bouton "Valider" une fois qu'une image est sélectionnée
      };
      reader.readAsDataURL(file); // Lire le contenu de l'image en tant qu'URL de données
    }
});

// Fonction pour créer l'image, et l'intégrer dans le label
function displayImg(url) {
    labelFile.style.padding = "0px"; // Supprimer la marge autour du label
    img_element.src = url; // Définir la source de l'image avec l'URL
    img_element.style.maxWidth = "100%"; // Limiter la largeur de l'image à 100% de la largeur du conteneur
    img_element.style.height = "auto"; // Ajuster la hauteur pour conserver les proportions
    labelFile.innerHTML = ""; // Supprimer le contenu actuel du label
    labelFile.appendChild(img_element); // Ajouter l'élément 'img' au label
}

// Fonction pour vérifier si le formulaire est valide
function isFormValid() {
    // Récupérer la valeur du champ 'title_picture'
    const title = inputTitle.value;

    // Récupérer la valeur du champ 'categories'
    const selectedCategories = selectCategories.querySelectorAll('option:checked');
    
    // Vérifier si le champ 'title_picture' est rempli et s'il y a au moins une catégorie sélectionnée
    const isValid = title.trim() !== '' && selectedCategories.length > 0;
    
    // Afficher un message d'erreur si le champ 'title_picture' est vide
    if (title.trim() === '') {
        console.error("Le champ 'Titre' est vide.");
    }

    // Afficher un message d'erreur si aucune catégorie n'est sélectionnée
    if (selectedCategories.length === 0) {
        console.error("Aucune catégorie n'est sélectionnée.");
    }

    return isValid;
}
// Écouteurs d'événements pour les éléments pertinents
inputTitle.addEventListener("input", updateSubmitButton);
selectCategories.addEventListener("change", updateSubmitButton);

// Fonction pour activer ou désactiver le bouton de validation en fonction de la validité du formulaire
function updateSubmitButton() {
    const isValid = isFormValid();
    validateButton.disabled = !isValid;

    // Ajouter ou retirer la classe 'button' en fonction de la validité
    if (isValid) {
        validateButton.classList.add('button');
    } else {
        validateButton.classList.remove('button');
    }
}

// Appelez la fonction initiale pour vérifier l'état initial du bouton "Valider"
updateSubmitButton();

