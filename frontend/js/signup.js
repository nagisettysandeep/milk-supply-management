const API =
"http://localhost:5000/signup";

document
.getElementById("signupBtn")
.addEventListener(
"click",
signupCustomer
);

async function signupCustomer(){

    const username =
    document.getElementById("username").value.trim();

    const password =
    document.getElementById("password").value.trim();

    const phone =
    document.getElementById("phone").value.trim();

    const address =
    document.getElementById("address").value.trim();

    const milk =
    document.getElementById("milk").value.trim();

    const customerType =
    document.getElementById("customerType").value;

    if(
        !username ||
        !password ||
        !phone ||
        !address ||
        !milk
    ){

        alert(
        "Please Fill All Fields"
        );

        return;

    }

    try{

        const response =
        await fetch(
        API,
        {
            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                username,
                phone,
                address,
                milk,
                customerType

            })

        });

        const result =
        await response.json();

        if(result.success){

            alert(
            "Account Created Successfully"
            );

            window.location.href =
            "login.html";

        }
        else{

            alert(
            result.message
            );

        }

    }

    catch(error){

        console.log(error);

        alert(
        "Server Error"
        );

    }

}