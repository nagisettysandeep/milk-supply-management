const API_CUSTOMERS = "https://milk-supply-backend.onrender.com/customers";
const API_MILK_ENTRIES = "https://milk-supply-backend.onrender.com/milk-entries";

let customers = [];
let milkEntries = [];

// =====================================
// PAGE LOAD
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    showDate();

    fetchCustomers();

    fetchMilkEntries();

});

// =====================================
// SHOW DATE
// =====================================

function showDate() {

    const date =
    document.getElementById("currentDate");

    if (date) {

        date.innerText =
        new Date().toLocaleDateString("en-GB");

    }

}

// =====================================
// LOAD CUSTOMERS
// =====================================

async function fetchCustomers() {

    try {

        const response =
        await fetch(API_CUSTOMERS);

        customers =
        await response.json();

        loadCustomers();

        updateDashboardCards();

    }

    catch (error) {

        console.log(error);

        alert("Unable to load customers");

    }

}

// =====================================
// LOAD MILK ENTRIES
// =====================================

async function fetchMilkEntries() {

    try {

        const response =
        await fetch(API_MILK_ENTRIES);

        milkEntries =
        await response.json();

        loadSavedEntries();

        updateDashboardCards();

    }

    catch (error) {

        console.log(error);

    }

}

// =====================================
// DISPLAY CUSTOMERS
// =====================================

function loadCustomers() {

    const table =
    document.getElementById(
        "customerTableBody"
    );

    table.innerHTML = "";

    if (customers.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="7">

                No Customers Available

            </td>

        </tr>

        `;

        return;

    }

    customers.forEach((customer, index) => {

        table.innerHTML += `

        <tr>

            <td>${customer.name}</td>

            <td>${customer.mobile}</td>

            <td>

                <input
                    type="radio"
                    name="attendance-${index}"
                    checked
                    value="Present"
                    onchange="toggleAttendance(${index})">

            </td>

            <td>

                <input
                    type="radio"
                    name="attendance-${index}"
                    value="Absent"
                    onchange="toggleAttendance(${index})">

            </td>

            <td>

                <input
                    type="number"
                    id="qty-${index}"
                    value="0"
                    min="0"
                    class="qty-input"
                    oninput="calculateAmount(${index})">

            </td>

            <td>

                ₹${customer.rate}

            </td>

            <td id="amount-${index}">

                ₹0

            </td>

        </tr>

        `;

    });

}

// =====================================
// ATTENDANCE
// =====================================

function toggleAttendance(index) {

    const status =
    document.querySelector(
        `input[name="attendance-${index}"]:checked`
    ).value;

    const qty =
    document.getElementById(
        `qty-${index}`
    );

    if (status === "Absent") {

        qty.value = 0;

        qty.disabled = true;

        document.getElementById(
            `amount-${index}`
        ).innerText = "₹0";

    }

    else {

        qty.disabled = false;

        calculateAmount(index);

    }

}

// =====================================
// CALCULATE AMOUNT
// =====================================

function calculateAmount(index) {

    let qty =
    Number(
        document.getElementById(
            `qty-${index}`
        ).value
    ) || 0;

    let rate =
    Number(
        customers[index].rate
    ) || 0;

    let amount =
    qty * rate;

    document.getElementById(
        `amount-${index}`
    ).innerText =
    "₹" + amount;

}

// =====================================
// SAVE BUTTON
// =====================================

document
.getElementById("saveEntriesBtn")
.addEventListener(
    "click",
    saveEntries
);

// =====================================
// SAVE MILK ENTRY
// =====================================

async function saveEntries() {

    try {

        let today =
        new Date()
        .toISOString()
        .split("T")[0];

        for (let i = 0; i < customers.length; i++) {

            let status =
            document.querySelector(
                `input[name="attendance-${i}"]:checked`
            ).value;

            let qty = 0;

            if (status === "Present") {

                qty =
                Number(
                    document.getElementById(
                        `qty-${i}`
                    ).value
                ) || 0;

            }

            let rate =
            Number(
                customers[i].rate
            ) || 0;

            let amount =
            qty * rate;

            await fetch(API_MILK_ENTRIES, {

                method: "POST",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({

                    customer_id:
                    customers[i].id,

                    entry_date:
                    today,

                    morning_qty:
                    qty,

                    evening_qty:
                    0,

                    rate:
                    rate,

                    amount:
                    amount,

                    status:
                    status

                })

            });

        }

        alert(
            "Milk Entries Saved Successfully"
        );

        fetchMilkEntries();

    }

    catch (error) {

        console.log(error);

        alert(
            "Error Saving Milk Entry"
        );

    }

}

// =====================================
// SHOW SAVED ENTRIES
// =====================================

function loadSavedEntries() {

    const table =
    document.getElementById(
        "entriesTableBody"
    );

    table.innerHTML = "";

    if (milkEntries.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="5">

                No Entries Available

            </td>

        </tr>

        `;

        return;

    }

    milkEntries.forEach(entry => {

        table.innerHTML += `

        <tr>

            <td>
                ${entry.name}
            </td>

            <td>
                ${entry.mobile}
            </td>

            <td>
                ${entry.status || "Present"}
            </td>

            <td>
                ${Number(entry.morning_qty || 0)}
                L
            </td>

            <td>
                ₹${entry.amount}
            </td>

        </tr>

        `;

    });

}

// =====================================
// DASHBOARD CARDS
// =====================================

function updateDashboardCards() {

    let total =
    document.getElementById(
        "totalCustomers"
    );

    if (total) {

        total.innerText =
        customers.length;

    }

    let milk = 0;

    let present = 0;

    let absent = 0;

    milkEntries.forEach(entry => {

        milk +=
        Number(entry.morning_qty || 0);

        milk +=
        Number(entry.evening_qty || 0);

        if (entry.status === "Absent") {

            absent++;

        }

        else {

            present++;

        }

    });

    let todayMilk =
    document.getElementById(
        "todayMilk"
    );

    if (todayMilk) {

        todayMilk.innerText =
        milk + " L";

    }

    let presentCount =
    document.getElementById(
        "presentCount"
    );

    if (presentCount) {

        presentCount.innerText =
        present;

    }

    let absentCount =
    document.getElementById(
        "absentCount"
    );

    if (absentCount) {

        absentCount.innerText =
        absent;

    }

}

// =====================================
// MONTHLY BILL
// =====================================

document
.getElementById(
    "calculateBillBtn"
)
.addEventListener(
    "click",
    calculateMonthlyBills
);

function calculateMonthlyBills() {

    const body =
    document.getElementById(
        "billSummaryBody"
    );

    body.innerHTML = "";

    customers.forEach(customer => {

        let totalMilk = 0;

        let presentDays = 0;

        let absentDays = 0;

        milkEntries.forEach(entry => {

            if (
                Number(entry.customer_id) ===
                Number(customer.id)
            ) {

                totalMilk +=
                Number(entry.morning_qty || 0);

                totalMilk +=
                Number(entry.evening_qty || 0);

                if (entry.status === "Absent") {

                    absentDays++;

                }

                else {

                    presentDays++;

                }

            }

        });

        let amount =
        totalMilk *
        Number(customer.rate);

        body.innerHTML += `

        <tr>

            <td>
                ${customer.name}
            </td>

            <td>
                ${presentDays}
            </td>

            <td>
                ${absentDays}
            </td>

            <td>
                ${totalMilk}
            </td>

            <td>
                ₹${amount}
            </td>

        </tr>

        `;

    });

}

// =====================================
// LOGOUT
// =====================================

const logout =
document.getElementById(
    "logoutBtn"
);

if (logout) {

    logout.onclick = () => {

        localStorage.clear();

        window.location.href =
        "login.html";

    };

}