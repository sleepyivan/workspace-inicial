const user = {
    info:{
        name:"Gabriela", name_second:"Fernanda", lastname:"Diaz", lastname_second:"Fagundez",
        email:"ejemplo@mail.com", tel:"090000000", photo:""
    },

    hasPhoto() {
        const checkNotEmptyString = function(string) {
            return string !== ""
        }

        checkAll = [
            checkNotEmptyString(this.info.photo)
        ]
        return checkAll.every(check => check)
    },

    showUserInfo(){
        function showInNode(node_id, value) {
            const node = document.getElementById(node_id);
            node.value = value;
        }

        const node_ids = Object.keys(this.info).filter(id => id !== "photo");
        node_ids.forEach(id => {
            showInNode(id, this.info[id]);
        })

        const node_img = document.getElementById("photoimg");
        if (this.hasPhoto()){
            node_img.src = this.info.photo;
        } else {
            node_img.src = "img/img_perfil.png";
        }
    },

    updateInfo(infokey, newvalue) {
        this.info[infokey] = newvalue;
    },

     updateUserInfo() {
        function findInNode(node_id) {
            const node = document.getElementById(node_id);
            return node.value
        }

        const node_ids = Object.keys(this.info).filter(id => id !== "photo");

        node_ids.forEach(id => {
            this.updateInfo(id, findInNode(id));
        });
        console.log(this.info);
    },

    saveToLocalStorage() {
        localStorage.setItem("userinfo", JSON.stringify(this.info));
    },

    readFromLocalStorage() {
        this.info = JSON.parse(localStorage.getItem("userinfo"));
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // user.saveToLocalStorage();
    user.readFromLocalStorage();
    user.showUserInfo();
})

const node = document.getElementById("perfil");
node.addEventListener("submit", (event) => {
    if (!node.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    } else {
        user.updateUserInfo();
        user.saveToLocalStorage();
        event.preventDefault();
    }
    node.classList.add('was-validated');
})

// Desafiate
function updatePhoto() {
    const node_file = document.getElementById("photofile");
    const node_img = document.getElementById("photoimg");

    const reader = new FileReader();
    reader.onload = function(){
        node_img.src = this.result;
        user.info.photo = this.result;
    }
    reader.readAsDataURL(node_file.files[0]);
}