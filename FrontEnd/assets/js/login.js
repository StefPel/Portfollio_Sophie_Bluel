// login.js

// Fonctions utiles pour l'authentification et la gestion du mode édition

/**
 * Vérifie si l'utilisateur est actuellement connecté.
 * Pour cela, on cherche si un jeton (token) utilisateur est stocké dans le stockage local du navigateur.
 * @returns {boolean} Retourne vrai (true) si un jeton est trouvé, faux (false) sinon.
 */
function isLoggedIn() {
    return localStorage.getItem('userToken') !== null;
}

/**
 * Change le style d'affichage d'un élément HTML et de tous ses éléments enfants.
 * Utile pour montrer ou cacher des parties de la page web.
 * @param {HTMLElement} element - L'élément HTML à modifier.
 * @param {string} displayStyle - Le style d'affichage à appliquer (ex: 'block', 'none', 'flex').
 */
function toggleDisplay(element, displayStyle) {
    if (!element) return; // Si l'élément n'existe pas, on arrête la fonction ici.

    element.style.display = displayStyle; // Applique le style d'affichage à l'élément.
    // Applique le même style d'affichage à chaque enfant de l'élément.
    Array.from(element.children).forEach(child => {
        child.style.display = displayStyle;
    });
}

/**
 * Active ou désactive le mode édition sur la page.
 * Le mode édition est déterminé par l'état de connexion de l'utilisateur et une valeur spécifique dans le stockage local.
 */
function toggleEditMode() {
    const editMode = isLoggedIn() && localStorage.getItem('editMode') === 'true'; // Détermine si le mode édition doit être activé.
    const elementsToToggle = ['.header_edit', '.modify_project']; // Liste des sélecteurs CSS des éléments à modifier.

    // Parcourt chaque sélecteur, trouve l'élément correspondant et modifie son affichage.
    elementsToToggle.forEach(selector => {
        const element = document.querySelector(selector);
        const displayStyle = editMode ? 'flex' : 'none'; // Choix du style d'affichage basé sur le mode édition.
        toggleDisplay(element, displayStyle);
    });

    console.log(`Mode édition ${editMode ? 'activé' : 'désactivé'}.`);
}

/**
 * Gère la connexion de l'utilisateur.
 * Cette fonction est asynchrone car elle doit attendre la réponse d'un serveur distant.
 */
async function login() {
    const email = document.getElementById("email").value; // Récupère l'email saisi par l'utilisateur.
    const password = document.getElementById("password").value; // Récupère le mot de passe saisi.

    try {
        // Effectue une requête POST vers le serveur pour tenter de connecter l'utilisateur.
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }), // Envoie l'email et le mot de passe sous forme de JSON.
        });

        if (!response.ok) throw new Error("Échec de l'authentification"); // Si la réponse n'est pas OK, lance une erreur.

        const { token } = await response.json(); // Extrait le jeton de la réponse du serveur.
        localStorage.setItem('userToken', token); // Stocke le jeton dans le stockage local.
        localStorage.setItem('editMode', 'true'); // Active le mode édition.
        console.log("Authentification réussie. Token d'utilisateur :", token);
        redirection(); // Redirige l'utilisateur après une connexion réussie.
    } catch (error) {
        afficherErreur(error.message); // Affiche un message d'erreur si la connexion échoue.
    }
}

/**
 * Redirige l'utilisateur vers la page d'accueil.
 */
function redirection() {
    window.location.href = "index.html"; // Change l'URL actuelle par celle de la page d'accueil.
}

/**
 * Affiche un message d'erreur.
 * @param {string} message - Le message d'erreur à afficher (par défaut, un message générique).
 */
function afficherErreur(message = "Identifiant ou mot de passe incorrects") {
    document.querySelector(".error").textContent = message; // Affiche le message dans l'élément prévu pour les erreurs.
    console.error(message); // Affiche aussi le message dans la console.
}

// Ajout d'un gestionnaire d'événements qui s'exécute quand le contenu de la page est entièrement chargé.
document.addEventListener('DOMContentLoaded', () => {
    // Initialise le mode édition en fonction de l'état de connexion de l'utilisateur.
    toggleEditMode();

    // Ajoute un gestionnaire d'événements sur le formulaire de connexion pour gérer la soumission du formulaire.
    const btnForm = document.querySelector(".connexion");
    btnForm?.addEventListener("submit", (e) => {
        e.preventDefault(); // Empêche le formulaire d'être envoyé de manière traditionnelle.
        login(); // Appelle la fonction de connexion.
    });
});
