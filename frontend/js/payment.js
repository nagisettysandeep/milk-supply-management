console.log("Payment JS Loaded");

// =====================================
// API
// =====================================

const INVOICE_API =
"http://localhost:5000/invoices";

// =====================================
// ELEMENTS
// =====================================

const customerName =
document.getElementById("customerName");

const customerMobile =
document.getElementById("customerMobile");

const billAmount =
document.getElementById("billAmount");

const qrImage =
document.getElementById("upiQr");

const saveBtn =
document.getElementById("savePaymentBtn");

const payNowBtn =
document.getElementById("payNowBtn");

let selectedInvoice = null;

let currentUpiLink = "";

// =====================================
// PAGE LOAD
// =====================================

document.addEventListener(
"DOMContentLoaded",
() => {

    loadLatestInvoice();

}
);

// =====================================
// LOAD LATEST INVOICE
// =====================================

async function loadLatestInvoice() {

    try {

        const response =
        await fetch(INVOICE_API);

        if (!response.ok) {

            throw new Error(
            "Failed To Load Invoices"
            );

        }

        const invoices =
        await response.json();

        if (
            !invoices ||
            invoices.length === 0
        ) {

            customerName.textContent =
            "No Invoice Available";

            customerMobile.textContent =
            "-";

            billAmount.textContent =
            "₹0";

            if (qrImage) {

                qrImage.style.display =
                "none";

            }

            return;

        }

        const pendingInvoice =

        invoices.find(
        invoice =>
        invoice.payment_status !==
        "Paid"
        );

        selectedInvoice =
        pendingInvoice ||
        invoices[0];

        customerName.textContent =
        selectedInvoice.name ||
        "Customer";

        customerMobile.textContent =
        selectedInvoice.mobile ||
        "-";

        billAmount.textContent =
        "₹" +
        selectedInvoice.amount;

        generateQRCode(
        selectedInvoice.amount
        );

        setRadioStatus(
        selectedInvoice.payment_status
        );

    }

    catch (error) {

        console.error(error);

        alert(
        "Unable To Load Payment Details"
        );

    }

}

// =====================================
// SET RADIO STATUS
// =====================================

function setRadioStatus(status) {

    const radio =

    document.querySelector(

    `input[name="paymentStatus"][value="${status}"]`

    );

    if (radio) {

        radio.checked = true;

    }

}

// =====================================
// GENERATE UPI QR
// =====================================

function generateQRCode(amount) {

    if (!qrImage || !selectedInvoice) {

        return;

    }

    const upiId =
    "7569148565@ptyes";

    const payeeName =
    "Milk Supply";

    const invoiceNo =
    selectedInvoice.invoice_no ||
    "Invoice";

    currentUpiLink =

    `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(invoiceNo)}`;

    const qrUrl =

    `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUpiLink)}`;

    qrImage.src =
    qrUrl;

}

// =====================================
// PAY NOW BUTTON
// =====================================

if (payNowBtn) {

    payNowBtn.addEventListener(
    "click",
    openUpiApp
    );

}

function openUpiApp() {

    if (!currentUpiLink) {

        alert(
        "Payment Link Not Ready"
        );

        return;

    }

    window.location.href =
    currentUpiLink;

}

// =====================================
// SAVE PAYMENT STATUS
// =====================================

if (saveBtn) {

    saveBtn.addEventListener(
    "click",
    updatePaymentStatus
    );

}

// =====================================
// UPDATE PAYMENT STATUS
// =====================================

async function updatePaymentStatus() {

    if (!selectedInvoice) {

        alert(
        "No Invoice Selected"
        );

        return;

    }

    const selectedRadio =

    document.querySelector(
    'input[name="paymentStatus"]:checked'
    );

    if (!selectedRadio) {

        alert(
        "Select Payment Status"
        );

        return;

    }

    const status =
    selectedRadio.value;

    try {

        const response =

        await fetch(

        `${INVOICE_API}/${selectedInvoice.id}/payment`,

        {

            method: "PUT",

            headers: {

                "Content-Type":
                "application/json"

            },

            body: JSON.stringify({

                status: status

            })

        }

        );

        const result =
        await response.json();

        if (result.success) {

            alert(
            "Payment Status Updated Successfully"
            );

            loadLatestInvoice();

        }

        else {

            alert(
            "Failed To Update Payment Status"
            );

        }

    }

    catch (error) {

        console.error(error);

        alert(
        "Server Error"
        );

    }

}