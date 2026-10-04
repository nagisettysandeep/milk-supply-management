console.log("Bills JS Loaded");

// ===============================
// API
// ===============================

const CUSTOMER_API =
"http://localhost:5000/customers";

const MILK_API =
"http://localhost:5000/milk-entries";

const INVOICE_API =
"http://localhost:5000/invoices";

// ===============================
// STORE DATA
// ===============================

let customers = [];

let milkEntries = [];

let invoices = [];

// ===============================
// PAGE LOAD
// ===============================

document.addEventListener(
"DOMContentLoaded",
async ()=>{

    await loadBills();

}
);

// ===============================
// LOAD DATA
// ===============================

async function loadBills(){

    try{

        const customerResponse =
        await fetch(CUSTOMER_API);

        customers =
        await customerResponse.json();

        const milkResponse =
        await fetch(MILK_API);

        milkEntries =
        await milkResponse.json();

        const invoiceResponse =
        await fetch(INVOICE_API);

        invoices =
        await invoiceResponse.json();

        displayBills();

    }

    catch(error){

        console.log(error);

        alert(
        "Unable To Load Billing Data"
        );

    }

}

// ===============================
// DISPLAY BILLS
// ===============================

function displayBills(){

    const table =
    document.getElementById(
    "billTableBody"
    );

    table.innerHTML = "";

    if(customers.length === 0){

        table.innerHTML =

        `
        <tr>
            <td colspan="7">
                No Customers Available
            </td>
        </tr>
        `;

        return;
    }

    customers.forEach(customer=>{

        let totalMilk = 0;

        milkEntries.forEach(entry=>{

            if(
                Number(entry.customer_id) ===
                Number(customer.id)
            ){

                totalMilk +=
                Number(entry.morning_qty || 0);

                totalMilk +=
                Number(entry.evening_qty || 0);

            }

        });

        const rate =
        Number(customer.rate);

        const amount =
        totalMilk * rate;

        const existingInvoice =
        invoices.find(invoice =>

            Number(invoice.customer_id) ===
            Number(customer.id)

        );

        table.innerHTML +=

        `
        <tr>

            <td>${customer.name}</td>

            <td>${customer.mobile}</td>

            <td>${totalMilk}</td>

            <td>₹${rate}</td>

            <td>₹${amount}</td>

            <td>

                <button
                class="generate-btn"
                onclick="generateInvoice(
                ${customer.id},
                '${customer.name}',
                ${totalMilk},
                ${rate},
                ${amount}
                )">

                Generate Bill

                </button>

            </td>

            <td>

                ${
                    existingInvoice
                    ?

                    `<button
                    class="print-btn"
                    onclick="openInvoice(${existingInvoice.id})">

                    Print

                    </button>`

                    :

                    "-"
                }

            </td>

        </tr>
        `;

    });

}

// ===============================
// GENERATE INVOICE
// ===============================

async function generateInvoice(
customerId,
name,
totalMilk,
rate,
amount
){

    try{

        const duplicateInvoice =
        invoices.find(invoice =>

            Number(invoice.customer_id) ===
            Number(customerId)

        );

        if(duplicateInvoice){

            alert(
            "Invoice Already Exists For This Customer"
            );

            return;
        }

        const invoiceNumber =
        "INV-" + Date.now();

        const today =
        new Date()
        .toISOString()
        .split("T")[0];

        const invoiceData = {

            invoice_no:
            invoiceNumber,

            customer_id:
            customerId,

            bill_date:
            today,

            total_milk:
            totalMilk,

            rate:
            rate,

            amount:
            amount

        };

        const response =
        await fetch(
        INVOICE_API,
        {

            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:
            JSON.stringify(
            invoiceData
            )

        });

        const result =
        await response.json();

        if(result.success){

            alert(
            "Invoice Generated Successfully\n\nInvoice No : "
            +
            invoiceNumber
            );

            loadBills();

        }
        else{

            alert(
            "Invoice Generation Failed"
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

// ===============================
// OPEN INVOICE
// ===============================

function openInvoice(id){

    window.location.href =
    `invoice.html?id=${id}`;

}