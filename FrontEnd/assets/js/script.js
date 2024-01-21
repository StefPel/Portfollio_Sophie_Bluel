//-------------Authentification-------------//

// Fonction pour vérifier si l'utilisateur est connecté
function isLoggedIn() {
    // Vérifie si un jeton d'utilisateur est présent dans le stockage local
    return localStorage.getItem('userToken') !== null;
}


//--------------Mode Connexion pour mode Edition----------------//

  // Ce code attend que le document HTML soit complètement chargé avant d'exécuter le code JavaScript.
  document.addEventListener('DOMContentLoaded', () => {
    
  // Gestion de l'affichage en fonction de l'état de connexion
  if (isLoggedIn()) {
    document.querySelectorAll('.header_edit, .modify_project').forEach(elem => {
        elem.style.cssText = 'background-color: #000; height: 60px; display: flex; align-items: center; justify-content: center; gap: 20px;';
    });
  
    document.querySelectorAll('.header_edit .button').forEach(button => {
        button.style.cssText = 'border: none; background-color: #fff; border-radius: 60px; height: 38px; font-weight: 500; padding: 10px 20px; font-family: "Work Sans";';
    });
  
    document.querySelectorAll('.edition').forEach(edition => {
        edition.style.cssText = 'display: flex; color: #fff; align-items: center; gap: 10px;';
    });
  
    document.querySelectorAll('.edition img').forEach(img => {
        img.style.cssText = 'width: 15px; height: 15px;';
    });
  
    document.querySelectorAll('.edition p').forEach(paragraph => {
        paragraph.style.cssText = 'font-family: "Work Sans"; font-weight: 400; font-size: 16px;';
    });
  
    document.querySelectorAll('.modify_project').forEach(modifyProject => {
        modifyProject.style.cssText = 'display: flex; align-items: center; margin-bottom: 27px; gap: 10px;';
    });
  
    document.querySelectorAll('.modify_project img').forEach(img => {
        img.style.cssText = 'width: 17px; height: 17px;';
    });
  
    document.querySelectorAll('.modify_project p').forEach(paragraph => {
        paragraph.style.cssText = 'margin: 0; text-decoration: none; color: #000; cursor: pointer;';
    });
  } else {
    document.querySelectorAll('.header_edit, .modify_project').forEach(elem => {
        elem.style.display = 'none'; // Continue de cacher les éléments pour les utilisateurs non connectés
    });
  }
 
  //----------------Récupération des travaux depuis le back-end--------------------//

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

//---------------Réalisation du filtre des travaux--------------------//

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
  
            categories.forEach(category => {
                const button = document.createElement('button'); // Crée un bouton.
                button.textContent = category; // Définit le texte du bouton.
                button.classList.add('button'); // Ajoute une classe CSS.
  
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

//-------------Authentification de l’utilisateur------------//

    // Gestion de l'authentification.
    let userData = {}; // Variable pour stocker les données de l'utilisateur.
  
    function redirection() {
        document.location.href = "index.html"; // Redirige vers 'index.html'.
    }
  
    async function login() {
        const emailLogin = document.getElementById("email").value; // Récupère l'email.
        const passwordLogin = document.getElementById("password").value; // Récupère le mot de passe.
  
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
                userData = data.token; // Stocke le token.
                localStorage.setItem('userToken', data.token); // Stocke également le token dans le localStorage
                console.log("Authentification réussie. Token d'utilisateur :", userData);
                redirection(); // Appelle 'redirection'.
            } else {
                afficherErreur(); // Affiche une erreur si l'authentification échoue.
            }
        } catch (error) {
            console.error("Erreur lors de l'authentification : " + error);
        }
    }
  
    function afficherErreur() {
        const error = "Identifiant ou de mot de passe incorrects";
        document.querySelector(".error").innerHTML = error;
        console.error("Échec de l'authentification.");
    }
  
    const btnForm = document.querySelector(".connexion");
  if (btnForm) {
      btnForm.addEventListener("submit", (e) => {
          e.preventDefault();
          login(); // Appelle 'login' lorsque le formulaire est soumis.
      });
  }
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
        // Affichez un message d'erreur à l'utilisateur
        // Par exemple : alert('Une erreur s\'est produite lors de la suppression du projet.');
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

