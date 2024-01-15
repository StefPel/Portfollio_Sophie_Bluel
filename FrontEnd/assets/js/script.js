// Fonction pour vérifier si l'utilisateur est connecté
function isLoggedIn() {
    return localStorage.getItem('userToken') !== null;
  }
  
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
  } else {
      console.error('Element class .connexion introuvable.');
  }
  });
  // Apparition de la modal
  
  // Attendre que le DOM soit entièrement chargé avant d'exécuter le script
  
    // Sélectionner les éléments qui déclenchent l'ouverture/fermeture de la modale
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    // Sélectionner le conteneur de la modale
    const modalContainer = document.querySelector('.modal-container');
    // Sélectionner tous les éléments qui permettent de fermer la modale
    const closeModalElements = document.querySelectorAll('.close-modal');
    // Sélectionner le conteneur où les images de la galerie seront affichées
    const galleryContainer = document.querySelector('.gallery_modal');
  
    // Fonction pour ouvrir/fermer la modale et charger la galerie si nécessaire
    function toggleModal() {
        console.log('Basculer la visibilité de la modale');
        modalContainer.classList.toggle('active');
        // Vérifier si la modale est active pour charger la galerie
        if (modalContainer.classList.contains('active')) {
            console.log('La modale est ouverte, chargement de la galerie');
            loadGalleryFromAPI(); // Appel de la fonction pour charger la galerie
        }
    }
  
    // Attacher l'ouverture/fermeture de la modale à tous les éléments déclencheurs
    modalTriggers.forEach(trigger => trigger.addEventListener('click', toggleModal));
  
    // Attacher la fermeture de la modale aux éléments de fermeture (croix)
    closeModalElements.forEach(element => element.addEventListener('click', toggleModal));
  
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
                data.forEach(item => addImageToGallery(item.imageUrl));
            })
            .catch(error => {
                console.error('Erreur lors du chargement de la galerie :', error);
            });
    }
  
    // Fonction pour ajouter une image individuelle à la galerie
    function addImageToGallery(src) {
        console.log('Ajout de l\'image à la galerie :', src);
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('img_modal');
  
        const image = document.createElement('img');
        image.src = src;
  
        // Créer un bouton pour la suppression avec une icône SVG à la place du texte 'X'
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('icon1_modal');
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