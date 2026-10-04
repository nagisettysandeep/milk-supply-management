console.log("Invoice JS Loaded");

// =====================================
// API
// =====================================

const INVOICE_API =
"http://localhost:5000/invoices";

// =====================================
// ELEMENTS
// =====================================

const invoiceNo =
document.getElementById("invoiceNo");

const customerName =
document.getElementById("customerName");

const customerMobile =
document.getElementById("customerMobile");

const billDate =
document.getElementById("billDate");

const paymentStatus =
document.getElementById("paymentStatus");

const totalMilk =
document.getElementById("totalMilk");

const rate =
document.getElementById("rate");

const amount =
document.getElementById("amount");

const grandTotal =
document.getElementById("grandTotal");

const printBtn =
document.getElementById("printBtn");

// =====================================
// PAGE LOAD
// =====================================

document.addEventListener(
"DOMContentLoaded",
() => {

    loadInvoice();

    setupPrint();

}
);

// =====================================
// GET ID FROM URL
// =====================================

function getInvoiceId() {

    const params =
    new URLSearchParams(
        window.location.search
    );

    return params.get("id");

}

// =====================================
// LOAD INVOICE
// =====================================

async function loadInvoice() {

    try {

        const invoiceId =
        getInvoiceId();

        if(!invoiceId){

            alert(
            "Invoice ID Missing"
            );

            window.location.href =
            "bills.html";

            return;

        }

        const response =
        await fetch(
        `${INVOICE_API}/${invoiceId}`
        );

        const invoice =
        await response.json();

        console.log(invoice);

        invoiceNo.textContent =
        invoice.invoice_no;

        customerName.textContent =
        invoice.name;

        customerMobile.textContent =
        invoice.mobile;

        billDate.textContent =
        new Date(
            invoice.bill_date
        ).toLocaleDateString(
            "en-GB"
        );

        totalMilk.textContent =
        invoice.total_milk + " L";

        rate.textContent =
        "₹" + invoice.rate;

        amount.textContent =
        "₹" + invoice.amount;

        grandTotal.textContent =
        "₹" + invoice.amount;

        paymentStatus.textContent =
        invoice.payment_status;

        if(
            invoice.payment_status ===
            "Paid"
        ){

            paymentStatus.style.background =
            "#dcfce7";

            paymentStatus.style.color =
            "#15803d";

        }
        else{

            paymentStatus.style.background =
            "#fee2e2";

            paymentStatus.style.color =
            "#dc2626";

        }

    }

    catch(error){

        console.error(error);

        alert(
        "Failed To Load Invoice"
        );

    }

}

// =====================================
// PRINT
// =====================================

function setupPrint() {

    if(printBtn){

        printBtn.addEventListener(
        "click",
        () => {

            window.print();

        }
        );

    }

}