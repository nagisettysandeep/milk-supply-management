// =====================================
// GET LOGGED USER
// =====================================

const loggedUser =
JSON.parse(
localStorage.getItem("loggedUser")
);

if (!loggedUser) {

    window.location.href =
    "login.html";

}

// =====================================
// CUSTOMER DATA
// =====================================

const user = loggedUser;

// =====================================
// CUSTOMER VALUES
// =====================================

const milkQty =
Number(user.morning_qty || 0) +
Number(user.evening_qty || 0);

const milkRate =
Number(user.rate || 0);

const todayAmount =
milkQty * milkRate;

// =====================================
// DISPLAY CUSTOMER DETAILS
// =====================================

document.getElementById(
"customerName"
).textContent =
"Welcome, " + (user.name || "Customer");

document.getElementById(
"customerFullName"
).textContent =
user.name || "-";

document.getElementById(
"phone"
).textContent =
user.mobile || "-";

document.getElementById(
"address"
).textContent =
user.address || "-";

document.getElementById(
"milkQty"
).textContent =
milkQty + " Liters";

document.getElementById(
"todayAmount"
).textContent =
"₹" + todayAmount;

// =====================================
// RATE CARD
// =====================================

const rateCard =
document.querySelector(".card2 h2");

if (rateCard) {

    rateCard.textContent =
    "₹" + milkRate + "/Liter";

}

// =====================================
// DATE
// =====================================

document.getElementById(
"todayDate"
).textContent =
new Date().toDateString();

// =====================================
// ATTENDANCE HISTORY
// =====================================

const attendanceHistory =
document.getElementById(
"attendanceHistory"
);

const attendanceTable =
document.getElementById(
"attendanceTable"
);

const viewAttendanceBtn =
document.getElementById(
"viewAttendanceBtn"
);

attendanceHistory.style.display =
"none";

viewAttendanceBtn.addEventListener(
"click",
loadAttendanceHistory
);

async function loadAttendanceHistory() {

    if (
        attendanceHistory.style.display
        === "block"
    ) {

        attendanceHistory.style.display =
        "none";

        viewAttendanceBtn.innerText =
        "View History";

        return;

    }

    attendanceHistory.style.display =
    "block";

    viewAttendanceBtn.innerText =
    "Hide History";

    try {

        const response =
        await fetch(
        `https://milk-supply-backend.onrender.com/customer-attendance/${user.id}`
        );

        const data =
        await response.json();

        attendanceTable.innerHTML = "";

        if (!data || data.length === 0) {

            attendanceTable.innerHTML = `
            <tr>
                <td colspan="3">
                    No Attendance Found
                </td>
            </tr>
            `;

            return;

        }

        data.forEach(entry => {

            const date =
            new Date(entry.entry_date)
            .toLocaleDateString("en-GB");

            const status =
            entry.status || "Present";

            const qty =
            Number(entry.morning_qty || 0) +
            Number(entry.evening_qty || 0);

            attendanceTable.innerHTML += `

            <tr>

                <td>${date}</td>

                <td>${status}</td>

                <td>${qty} L</td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.log(error);

        attendanceTable.innerHTML = `
        <tr>
            <td colspan="3">
                Failed To Load Attendance
            </td>
        </tr>
        `;

    }

}

// =====================================
// MONTHLY BILLS
// =====================================

const billHistory =
document.getElementById(
"billHistory"
);

const billTable =
document.getElementById(
"billTable"
);

const viewBillsBtn =
document.getElementById(
"viewBillsBtn"
);

if (billHistory) {

    billHistory.style.display =
    "none";

}

if (viewBillsBtn) {

    viewBillsBtn.addEventListener(
        "click",
        loadCustomerBills
    );

}

async function loadCustomerBills() {

    if (
        billHistory.style.display ===
        "block"
    ) {

        billHistory.style.display =
        "none";

        viewBillsBtn.innerText =
        "View Bills";

        return;

    }

    billHistory.style.display =
    "block";

    viewBillsBtn.innerText =
    "Hide Bills";

    try {

        const response =
        await fetch(
        `https://milk-supply-backend.onrender.com/customer-bills/${user.id}`
        );

        const bills =
        await response.json();

        billTable.innerHTML = "";

        if (
            !bills ||
            bills.length === 0
        ) {

            billTable.innerHTML = `
            <tr>
                <td colspan="5">
                    No Bills Found
                </td>
            </tr>
            `;

            document.getElementById(
            "pendingPayment"
            ).textContent =
            "₹0";

            return;

        }

        let pendingAmount = 0;

        bills.forEach(bill => {

            if (
                bill.payment_status !==
                "Paid"
            ) {

                pendingAmount +=
                Number(
                bill.amount || 0
                );

            }

            billTable.innerHTML += `

            <tr>

                <td>
                    ${bill.invoice_no}
                </td>

                <td>
                    ${new Date(
                    bill.bill_date
                    ).toLocaleDateString("en-GB")}
                </td>

                <td>
                    ₹${bill.amount}
                </td>

                <td>
                    ${bill.payment_status}
                </td>

                <td>
                    ${
                        bill.payment_date
                        ?
                        new Date(
                        bill.payment_date
                        ).toLocaleDateString("en-GB")
                        :
                        "-"
                    }
                </td>

            </tr>

            `;

        });

        document.getElementById(
        "pendingPayment"
        ).textContent =
        "₹" + pendingAmount;

    }

    catch (error) {

        console.log(error);

        billTable.innerHTML = `
        <tr>
            <td colspan="5">
                Failed To Load Bills
            </td>
        </tr>
        `;

    }

}

// =====================================
// LOAD PENDING PAYMENT
// =====================================

window.addEventListener(
"load",
async () => {

    try {

        const response =
        await fetch(
        `https://milk-supply-backend.onrender.com/customer-bills/${user.id}`
        );

        const bills =
        await response.json();

        let pendingAmount = 0;

        bills.forEach(bill => {

            if (
                bill.payment_status !==
                "Paid"
            ) {

                pendingAmount +=
                Number(
                bill.amount || 0
                );

            }

        });

        document.getElementById(
        "pendingPayment"
        ).textContent =
        "₹" + pendingAmount;

    }

    catch(error){

        console.log(error);

    }

});

// =====================================
// LOGOUT
// =====================================

document.getElementById(
"logoutBtn"
).addEventListener(
"click",
() => {

    localStorage.removeItem(
    "loggedUser"
    );

    window.location.href =
    "login.html";

}
);

// =====================================
// DEBUG
// =====================================

console.log(
"Customer Dashboard User:",
user
);