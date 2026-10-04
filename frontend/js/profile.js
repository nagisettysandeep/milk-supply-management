const user =
JSON.parse(
localStorage.getItem("loggedUser")
);

if(!user){

    window.location.href =
    "login.html";
}

document.getElementById("name")
.innerText = user.name;

document.getElementById("username")
.innerText = user.username;

document.getElementById("phone")
.innerText = user.phone;

document.getElementById("address")
.innerText = user.address;

document.getElementById("milk")
.innerText = user.milkQuantity;