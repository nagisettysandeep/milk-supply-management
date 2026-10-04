const customerForm = document.getElementById("customerForm");
const customerTable = document.getElementById("customerTable");
const searchBox = document.getElementById("searchBox");

const API_URL = "http://localhost:5000/customers";

let customers = [];

// =====================================
// LOAD CUSTOMERS FROM DATABASE
// =====================================

async function loadCustomers() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch customers");
        }

        customers = await response.json();

        localStorage.setItem(
            "customers",
            JSON.stringify(customers)
        );

        renderCustomers();

    }
    catch (error) {

        console.error("Load Error:", error);

        alert("Failed To Load Customers");

    }

}

// =====================================
// SAVE CUSTOMER
// =====================================

customerForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const customer = {

        name: document.getElementById("name").value.trim(),

        mobile: document.getElementById("mobile").value.trim(),

        address: document.getElementById("address").value.trim(),

        milkType: document.getElementById("milkType").value,

        morningQty: document.getElementById("morningQty").value || 0,

        eveningQty: document.getElementById("eveningQty").value || 0,

        rate: document.getElementById("rate").value || 0

    };

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(customer)

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message || "Failed To Save Customer"
            );

        }

        alert(
            data.message ||
            "Customer Saved Successfully"
        );

        customerForm.reset();

        loadCustomers();

    }
    catch (error) {

        console.error("Save Error:", error);

        alert(error.message);

    }

});

// =====================================
// DISPLAY CUSTOMERS
// =====================================

function renderCustomers() {

    customerTable.innerHTML = "";

    if (customers.length === 0) {

        customerTable.innerHTML = `
        <tr>
            <td colspan="5" class="empty-row">
                No Customers Available
            </td>
        </tr>
        `;

        return;

    }

    customers.forEach((customer) => {

        customerTable.innerHTML += `

        <tr>

            <td>${customer.name}</td>

            <td>${customer.mobile}</td>

            <td>${customer.milk_type || "-"}</td>

            <td>₹${customer.rate}</td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteCustomer(${customer.id})">
                    Delete
                </button>

            </td>

        </tr>

        `;

    });

}

// =====================================
// DELETE CUSTOMER
// =====================================

async function deleteCustomer(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this customer?"
        );

    if (!confirmDelete) return;

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed To Delete Customer"
            );

        }

        alert(
            data.message ||
            "Customer Deleted Successfully"
        );

        loadCustomers();

    }
    catch (error) {

        console.error(
            "Delete Error:",
            error
        );

        alert(error.message);

    }

}

// =====================================
// SEARCH CUSTOMER
// =====================================

searchBox.addEventListener(
    "keyup",
    function () {

        const value =
            this.value.toLowerCase();

        const rows =
            customerTable.querySelectorAll("tr");

        rows.forEach(row => {

            const text =
                row.textContent.toLowerCase();

            row.style.display =
                text.includes(value)
                    ? ""
                    : "none";

        });

    }
);

// =====================================
// INITIAL LOAD
// =====================================

loadCustomers();