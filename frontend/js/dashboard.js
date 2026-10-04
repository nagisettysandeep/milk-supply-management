console.log("Dashboard JS Loaded");

// =====================================
// API URLS
// =====================================

const CUSTOMER_API =
"http://localhost:5000/customers";

const MILK_API =
"http://localhost:5000/milk-entries";

const INVOICE_API =
"http://localhost:5000/invoices";

// =====================================
// PAGE LOAD
// =====================================

document.addEventListener(
"DOMContentLoaded",
async () => {

    showDate();

    await loadDashboardData();

    sidebarToggle();

    logout();

}
);

// =====================================
// LOAD ALL DASHBOARD DATA
// =====================================

async function loadDashboardData(){

    await Promise.all([
        loadCustomers(),
        loadMilkEntries(),
        loadPayments(),
        loadRevenueChart()
    ]);

}

// =====================================
// SHOW DATE
// =====================================

function showDate(){

    const dateElement =
    document.getElementById(
    "currentDate"
    );

    if(dateElement){

        dateElement.innerText =
        new Date().toLocaleDateString(
        "en-GB"
        );

    }

}

// =====================================
// TOTAL CUSTOMERS
// =====================================

async function loadCustomers(){

    try{

        const response =
        await fetch(CUSTOMER_API);

        const customers =
        await response.json();

        const totalCustomers =
        document.getElementById(
        "totalCustomers"
        );

        if(totalCustomers){

            totalCustomers.innerText =
            customers.length;

        }

    }

    catch(error){

        console.log(
        "Customer Error:",
        error
        );

    }

}

// =====================================
// TODAY MILK TOTAL
// =====================================

async function loadMilkEntries(){

    try{

        const response =
        await fetch(MILK_API);

        const entries =
        await response.json();

        let totalMilk = 0;

        entries.forEach(entry => {

            totalMilk +=
            Number(entry.morning_qty || 0);

            totalMilk +=
            Number(entry.evening_qty || 0);

        });

        const milkCard =
        document.querySelector(
        ".green + div h3"
        );

        if(milkCard){

            milkCard.innerText =
            totalMilk.toFixed(2)
            + " Liters";

        }

    }

    catch(error){

        console.log(
        "Milk Entry Error:",
        error
        );

    }

}

// =====================================
// PAID / PENDING PAYMENTS
// =====================================

async function loadPayments(){

    try{

        const response =
        await fetch(INVOICE_API);

        const invoices =
        await response.json();

        let paid = 0;
        let pending = 0;

        invoices.forEach(invoice => {

            if(
            invoice.payment_status ===
            "Paid"
            ){

                paid++;

            }

            else{

                pending++;

            }

        });

        const pendingElement =
        document.getElementById(
        "pendingCustomers"
        );

        if(pendingElement){

            pendingElement.innerText =
            pending + " Customers";

        }

        const paidElement =
        document.getElementById(
        "paidCustomers"
        );

        if(paidElement){

            paidElement.innerText =
            paid + " Customers";

        }

    }

    catch(error){

        console.log(
        "Payment Error:",
        error
        );

    }

}

// =====================================
// MONTHLY REVENUE CHART
// =====================================

async function loadRevenueChart(){

    try{

        const response =
        await fetch(INVOICE_API);

        const invoices =
        await response.json();

        let totalRevenue = 0;

        invoices.forEach(invoice => {

            if(
            invoice.payment_status ===
            "Paid"
            ){

                totalRevenue +=
                Number(invoice.amount || 0);

            }

        });

        const ctx =
        document.getElementById(
        "revenueChart"
        );

        if(!ctx) return;

        new Chart(ctx, {

            type: "bar",

            data: {

                labels: [
                    "Revenue"
                ],

                datasets: [

                    {

                        label:
                        "Paid Revenue",

                        data: [
                            totalRevenue
                        ],

                        backgroundColor:
                        "#16a34a"

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false

            }

        });

    }

    catch(error){

        console.log(
        "Chart Error:",
        error
        );

    }

}

// =====================================
// SIDEBAR TOGGLE
// =====================================

function sidebarToggle(){

    const menuBtn =
    document.getElementById(
    "menu-Btn"
    );

    const sidebar =
    document.getElementById(
    "sidebar"
    );

    const mainContent =
    document.getElementById(
    "mainContent"
    );

    if(menuBtn){

        menuBtn.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
            "hide"
            );

            mainContent.classList.toggle(
            "expand"
            );

        });

    }

}

// =====================================
// LOGOUT
// =====================================

function logout(){

    const logoutBtn =
    document.getElementById(
    "logoutBtn"
    );

    if(logoutBtn){

        logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.clear();

            window.location.href =
            "login.html";

        });

    }

}