document.addEventListener('DOMContentLoaded', () => {
    console.log('Initialisation de la modal...');
    
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modalContainer = document.querySelector('.modal-container');
    const closeModalElements = document.querySelectorAll('.close-modal');
    const galleryContainer = document.querySelector('.gallery_modal');
    const addGalleryButton = document.querySelector('.button_add_gallery');
    const modalAdd = document.querySelector('.modal_add');
    const form = document.querySelector('.modal_add form');
    const selectCategories = document.getElementById("categories");
    const addPhotoButton = document.querySelector('.button_add_picture');
    const inputTitle = document.getElementById("title_picture");
    const labelFile = document.querySelector('.form_add_photo');
    const validateButton = document.querySelector('.button_validate');
    const fileInput = createFileInput();
    const img_element = createImgElement();
    const errorMessage = document.querySelector('.error-message');

    console.log('Éléments DOM sélectionnés.');

    modalTriggers.forEach(trigger => trigger.addEventListener('click', toggleModal));
    closeModalElements.forEach(element => element.addEventListener('click', toggleModal));
    addGalleryButton.addEventListener('click', showAddModal);
    document.querySelector('.modal_add .close-modal').addEventListener('click', hideAddModal);
    form.addEventListener('submit', submitForm);
    addPhotoButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener("change", handleFileChange);
    inputTitle.addEventListener("input", updateSubmitButton);
    selectCategories.addEventListener("change", updateSubmitButton);

    console.log('Écouteurs d\'événements ajoutés.');

    fetchCategories();
    updateSubmitButton();

    console.log('Initialisation terminée.');

    function toggleModal() {
        console.log('Toggle de la modal...');
        modalContainer.classList.toggle('active');
        modalContainer.classList.contains('active') && loadGalleryFromAPI();
    }

    function showAddModal() {
        console.log('Affichage de la modal d\'ajout...');
        modalAdd.style.display = 'block';
    }

    function hideAddModal() {
        console.log('Fermeture de la modal d\'ajout...');
        modalAdd.style.display = 'none';
    }

    function submitForm(event) {
        console.log('Soumission du formulaire...');
        event.preventDefault();
        if (!isFormValid()) {
            console.error("Le formulaire n'est pas valide.");
            return alert("Veuillez remplir tous les champs du formulaire.");
        }
        const formData = new FormData();
        formData.append('title', inputTitle.value);
        formData.append('category', selectCategories.value);
        fileInput.files[0] && formData.append('image', fileInput.files[0]);

        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData,
            headers: {'Authorization': `Bearer ${localStorage.getItem('userToken')}`}
        })
        .then(response => response.ok ? response.json() : Promise.reject(`Erreur HTTP ! Statut : ${response.status}`))
        .then(data => {
            console.log('Projet ajouté avec succès', data);
            toggleModal(); // Fermer la modal après la suppression réussie
            loadGalleryFromAPI();
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout du projet :', error);
            alert('Erreur lors de l\'ajout du projet : ' + error.message);
        });
    }

    function createFileInput() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        fileInput.accept = 'image/png, image/jpeg';
        document.body.appendChild(fileInput);
        return fileInput;
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        file && displayImg(URL.createObjectURL(file));
    }

    function displayImg(url) {
        labelFile.style.padding = "0px";
        img_element.src = url;
        img_element.style.maxWidth = "100%";
        img_element.style.height = "auto";
        labelFile.innerHTML = "";
        labelFile.appendChild(img_element);
        updateSubmitButton();
    }

    function createImgElement() {
        const img_element = document.createElement("img");
        img_element.style.objectFit = 'cover';
        img_element.style.width = '129px';
        img_element.style.height = '169px';
        return img_element;
    }

    function fetchCategories() {
        console.log('Récupération des catégories...');
        fetch('http://localhost:5678/api/categories')
            .then(response => response.ok ? response.json() : Promise.reject(`Erreur HTTP ! Statut : ${response.status}`))
            .then(fillCategories)
            .catch(handleError);
    }

    function fillCategories(categories) {
        categories.forEach(category => {
            const option = new Option(category.name, category.id);
            selectCategories.appendChild(option);
        });
    }

    function loadGalleryFromAPI() {
        console.log('Chargement de la galerie depuis l\'API...');
        fetchGalleryData('http://localhost:5678/api/works')
            .then(data => {
                galleryContainer.innerHTML = '';
                data.forEach(item => addImageToGallery(item.imageUrl, item.id));
            })
            .catch(handleError);
    }

    function fetchGalleryData(url) {
        return fetch(url)
            .then(response => response.ok ? response.json() : Promise.reject(`Erreur HTTP ! Statut : ${response.status}`));
    }

    function addImageToGallery(src, projectId) {
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('img_modal');
        const image = new Image();
        image.src = src;
        const deleteButton = createDeleteButton(projectId);
        imageContainer.appendChild(image);
        imageContainer.appendChild(deleteButton);
        galleryContainer.appendChild(imageContainer);
    }

    function createDeleteButton(projectId) {
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('icon1_modal');
        deleteButton.setAttribute('data-id', projectId);
        deleteButton.addEventListener('click', () => deleteProject(projectId));
        const iconImage = new Image();
        iconImage.src = 'assets/icons/Group 9.svg';
        iconImage.alt = 'Supprimer';
        deleteButton.appendChild(iconImage);
        return deleteButton;
    }

    function deleteProject(projectId) {
        fetch(`http://localhost:5678/api/works/${projectId}`, {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${localStorage.getItem('userToken')}`}
        })
        .then(response => {
            const targetButton = document.querySelector(`button[data-id="${projectId}"]`);
            targetButton && targetButton.parentNode.remove();
            toggleModal(); // Fermer la modal après la suppression réussie
        })
        .catch(handleError);
    }

    function updateSubmitButton() {
        validateButton.disabled = !isFormValid();
        validateButton.classList.toggle('button', isFormValid());
    }

    function isFormValid() {
        const title = inputTitle.value.trim();
        const selectedCategories = selectCategories.querySelectorAll('option:checked');
        return title !== '' && selectedCategories.length > 0;
    }

    function handleError(error) {
        console.error('Erreur lors de l\'opération :', error);
        alert('Une erreur s\'est produite. Veuillez réessayer.');
    }
});
