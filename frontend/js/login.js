// =====================================
// CLEAR LOGIN FORM ON PAGE LOAD
// =====================================

window.addEventListener("load", () => {

    localStorage.removeItem("loggedUser");

    document.getElementById("name").value = "";

    document.getElementById("pass").value = "";

});

// =====================================
// DEFAULT ROLE
// =====================================

let selectedRole = "buyer";

const buyerBtn =
document.getElementById("buyerBtn");

const sellerBtn =
document.getElementById("sellerBtn");

// =====================================
// ROLE SWITCH
// =====================================

buyerBtn.addEventListener("click", () => {

    selectedRole = "buyer";

    buyerBtn.classList.add("active");

    sellerBtn.classList.remove("active");

});

sellerBtn.addEventListener("click", () => {

    selectedRole = "seller";

    sellerBtn.classList.add("active");

    buyerBtn.classList.remove("active");

});

// =====================================
// DEFAULT ADMIN USERS
// =====================================

const defaultUsers = [

{
    role: "seller",

    username: "7569148565",

    password: "sandeep",

    name: "Administrator",

    page: "dashboard.html"
},

{
    role: "seller",

    username: "sandeep",

    password: "123",

    name: "Sandeep",

    page: "dashboard.html"
}

];

// =====================================
// LOGIN
// =====================================

document.getElementById("loginbtn")
.addEventListener("click", loginUser);

async function loginUser(){

    const username =
    document.getElementById("name")
    .value
    .trim();

    const password =
    document.getElementById("pass")
    .value
    .trim();

    if(
        username === "" ||
        password === ""
    ){

        alert(
        "Please Enter Username and Password"
        );

        return;

    }

    // =====================================
    // ADMIN LOGIN
    // =====================================

    if(selectedRole === "seller"){

        const user =
        defaultUsers.find(
        u =>

        u.role === "seller" &&

        u.username === username &&

        u.password === password

        );

        if(user){

            localStorage.setItem(
            "loggedUser",
            JSON.stringify(user)
            );

            alert(
            "Admin Login Successful"
            );

            window.location.href =
            "dashboard.html";

        }
        else{

            alert(
            "Invalid Admin Credentials"
            );

        }

        return;

    }

    // =====================================
    // CUSTOMER LOGIN
    // =====================================

    try{

        const response =
        await fetch(
        "https://milk-supply-backend.onrender.com/login",
        {

            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                username:username,
                phone:password

            })

        });

        const result =
        await response.json();

        if(result.success){

            localStorage.setItem(
            "loggedUser",
            JSON.stringify(result.user)
            );

            alert(
            "Customer Login Successful"
            );

            window.location.href =
            "customer-dash.html";

        }
        else{

            alert(
            "Invalid Username Or Mobile Number"
            );

        }

    }

    catch(error){

        console.log(error);

        alert(
        "Unable To Connect Server"
        );

    }

}