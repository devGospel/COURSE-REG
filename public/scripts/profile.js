let subMenu = document.getElementById("subMenu");

function toggleMenu() {
    subMenu.classList.toggle("open-menu")
}


// Hide and display submit button
const fileInput = document.getElementById("input-file");
const submitButton = document.getElementById("upload-btn");


fileInput.onchange = () => {
    if(fileInput.value) {
        submitButton.style.display = 'block';
    } else {
        submitButton.style.display = 'none';
    }
}

