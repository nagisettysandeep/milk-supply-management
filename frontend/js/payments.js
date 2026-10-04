console.log("Payments JS Loaded");

const INVOICE_API =
"http://localhost:5000/invoices";

const customerName =
document.getElementById("customerName");

const customerMobile =
document.getElementById("customerMobile");

const invoiceNo =
document.getElementById("invoiceNo");

const billAmount =
document.getElementById("billAmount");

const qrImage =
document.getElementById("upiQr");

const saveBtn =
document.getElementById("savePaymentBtn");

let selectedInvoice = null;

document.addEventListener(
"DOMContentLoaded",
loadPayment
);

async function loadPayment(){

    try{

        const response =
        await fetch(INVOICE_API);

        const invoices =
        await response.json();

        const pendingInvoice =

        invoices.find(
        invoice =>
        invoice.payment_status !==
        "Paid"
        );

        if(!pendingInvoice){

            customerName.textContent =
            "No Pending Payments";

            return;
        }

        selectedInvoice =
        pendingInvoice;

        customerName.textContent =
        pendingInvoice.name;

        customerMobile.textContent =
        pendingInvoice.mobile;

        invoiceNo.textContent =
        pendingInvoice.invoice_no;

        billAmount.textContent =
        "₹" +
        pendingInvoice.amount;

        const qrData =

        `UPI Payment
Invoice:${pendingInvoice.invoice_no}
Amount:${pendingInvoice.amount}
UPI:7569148565@ptyes`;

        qrImage.src =

        `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;

    }

    catch(error){

        console.log(error);

        alert(
        "Unable To Load Payment"
        );

    }

}

saveBtn.addEventListener(
"click",
updatePayment
);

async function updatePayment(){

    if(!selectedInvoice){

        return;

    }

    const status =

    document.querySelector(
    'input[name="paymentStatus"]:checked'
    ).value;

    try{

        const response =

        await fetch(

        `${INVOICE_API}/${selectedInvoice.id}/payment`,

        {

            method:"PUT",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                status

            })

        }

        );

        const result =
        await response.json();

        if(result.success){

            alert(
            "Payment Updated Successfully"
            );

            loadPayment();

        }

    }

    catch(error){

        console.log(error);

        alert(
        "Server Error"
        );

    }

}