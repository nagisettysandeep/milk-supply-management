console.log("THIS IS MY SERVER FILE");

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());
app.use(express.json());

// =====================================
// TEST ROUTE
// =====================================

app.get("/test", (req, res) => {
    res.send("TEST ROUTE WORKING");
});

// =====================================
// HOME ROUTE
// =====================================

app.get("/", (req, res) => {
    res.send("Milk Management Backend Running");
});

// =====================================
// CUSTOMER SIGNUP
// =====================================

app.post("/signup", (req, res) => {

    const {
        username,
        phone,
        address,
        milk,
        customerType
    } = req.body;

    const rate =
        customerType === "dairy"
            ? 70
            : 85;

    db.query(
        "SELECT * FROM customers WHERE mobile=?",
        [phone],
        (err, existing) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (existing.length > 0) {
                return res.json({
                    success: false,
                    message: "Customer Already Exists"
                });
            }

            const sql = `
                INSERT INTO customers
                (
                    name,
                    mobile,
                    address,
                    milk_type,
                    morning_qty,
                    evening_qty,
                    rate
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(
                sql,
                [
                    username,
                    phone,
                    address,
                    customerType,
                    milk,
                    0,
                    rate
                ],
                (err, result) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    res.json({
                        success: true,
                        message: "Account Created Successfully",
                        id: result.insertId
                    });

                }
            );

        }
    );

});

// =====================================
// GET CUSTOMERS
// =====================================

app.get("/customers", (req, res) => {

    db.query(
        "SELECT * FROM customers ORDER BY id DESC",
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json(results);

        }
    );

});

// =====================================
// ADD CUSTOMER
// =====================================

app.post("/customers", (req, res) => {

    const {
        name,
        mobile,
        address,
        milkType,
        morningQty,
        eveningQty,
        rate
    } = req.body;

    const sql = `
        INSERT INTO customers
        (
            name,
            mobile,
            address,
            milk_type,
            morning_qty,
            evening_qty,
            rate
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            name,
            mobile,
            address,
            milkType,
            morningQty,
            eveningQty,
            rate
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Customer Saved Successfully",
                id: result.insertId
            });

        }
    );

});

// =====================================
// UPDATE CUSTOMER
// =====================================

app.put("/customers/:id", (req, res) => {

    const id = req.params.id;

    const {
        name,
        mobile,
        address,
        milkType,
        morningQty,
        eveningQty,
        rate
    } = req.body;

    const sql = `
        UPDATE customers
        SET
            name=?,
            mobile=?,
            address=?,
            milk_type=?,
            morning_qty=?,
            evening_qty=?,
            rate=?
        WHERE id=?
    `;

    db.query(
        sql,
        [
            name,
            mobile,
            address,
            milkType,
            morningQty,
            eveningQty,
            rate,
            id
        ],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Customer Updated Successfully"
            });

        }
    );

});

// =====================================
// DELETE CUSTOMER
// =====================================

app.delete("/customers/:id", (req, res) => {

    db.query(
        "DELETE FROM customers WHERE id=?",
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Customer Deleted Successfully"
            });

        }
    );

});

// =====================================
// ADD MILK ENTRY
// =====================================

app.post("/milk-entries", (req, res) => {

    const {
        customer_id,
        entry_date,
        morning_qty,
        evening_qty,
        rate,
        amount,
        status
    } = req.body;

    const sql = `
        INSERT INTO milk_entries
        (
            customer_id,
            entry_date,
            morning_qty,
            evening_qty,
            rate,
            amount,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            customer_id,
            entry_date,
            morning_qty,
            evening_qty,
            rate,
            amount,
            status
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Milk Entry Saved Successfully",
                id: result.insertId
            });

        }
    );

});

// =====================================
// GET MILK ENTRIES
// =====================================

app.get("/milk-entries", (req, res) => {

    const sql = `
        SELECT
            m.id,
            m.customer_id,
            c.name,
            c.mobile,
            m.entry_date,
            m.morning_qty,
            m.evening_qty,
            m.rate,
            m.amount,
            m.status
        FROM milk_entries m
        LEFT JOIN customers c
        ON m.customer_id = c.id
        ORDER BY m.entry_date DESC, m.id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json(results);

    });

});

// =====================================
// DELETE MILK ENTRY
// =====================================

app.delete("/milk-entries/:id", (req, res) => {

    db.query(
        "DELETE FROM milk_entries WHERE id=?",
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Milk Entry Deleted Successfully"
            });

        }
    );

});


// =====================================
// CREATE INVOICE
// =====================================

app.post("/invoices", (req, res) => {

    const {
        invoice_no,
        customer_id,
        bill_date,
        total_milk,
        rate,
        amount
    } = req.body;

    const sql = `
        INSERT INTO invoices
        (
            invoice_no,
            customer_id,
            bill_date,
            total_milk,
            rate,
            amount,
            payment_status,
            payment_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            invoice_no,
            customer_id,
            bill_date,
            total_milk,
            rate,
            amount,
            "Pending",
            null
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Invoice Created Successfully",
                id: result.insertId
            });

        }
    );

});

// =====================================
// GET SINGLE INVOICE
// =====================================

app.get("/invoices/:id", (req, res) => {

    const sql = `
        SELECT
            i.*,
            c.name,
            c.mobile
        FROM invoices i
        LEFT JOIN customers c
        ON i.customer_id = c.id
        WHERE i.id = ?
    `;

    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Invoice Not Found"
                });
            }

            res.json(result[0]);

        }
    );

});

// =====================================
// GET ALL INVOICES
// =====================================

app.get("/invoices", (req, res) => {

    const sql = `
        SELECT
            i.id,
            i.invoice_no,
            i.customer_id,
            i.bill_date,
            i.total_milk,
            i.rate,
            i.amount,
            i.payment_status,
            i.payment_date,
            c.name,
            c.mobile
        FROM invoices i
        LEFT JOIN customers c
        ON i.customer_id = c.id
        ORDER BY i.id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json(results);

    });

});

// =====================================
// GET CUSTOMER BILLS
// =====================================

app.get("/customer-bills/:id", (req, res) => {

    const customerId = req.params.id;

    const sql = `
        SELECT
            id,
            invoice_no,
            bill_date,
            total_milk,
            rate,
            amount,
            payment_status,
            payment_date
        FROM invoices
        WHERE customer_id = ?
        ORDER BY bill_date DESC
    `;

    db.query(
        sql,
        [customerId],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json(results);

        }
    );

});

// =====================================
// GET PAYMENTS
// =====================================

app.get("/payments", (req, res) => {

    const sql = `
        SELECT
            i.id,
            i.invoice_no,
            i.amount,
            i.payment_status,
            i.payment_date,
            c.name,
            c.mobile
        FROM invoices i
        LEFT JOIN customers c
        ON i.customer_id = c.id
        ORDER BY i.id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json(results);

    });

});

// =====================================
// UPDATE PAYMENT STATUS
// =====================================

app.put("/invoices/:id/payment", (req, res) => {

    const { status } = req.body;

    const paymentDate =
        status === "Paid"
            ? new Date().toISOString().split("T")[0]
            : null;

    const sql = `
        UPDATE invoices
        SET
            payment_status=?,
            payment_date=?
        WHERE id=?
    `;

    db.query(
        sql,
        [
            status,
            paymentDate,
            req.params.id
        ],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Payment Updated Successfully"
            });

        }
    );

});

// =====================================
// CUSTOMER LOGIN
// =====================================

app.post("/login", (req, res) => {

    const username =
        req.body.username
            ? req.body.username.trim()
            : "";

    const phone =
        req.body.phone
            ? req.body.phone.trim()
            : "";

    const sql = `
        SELECT *
        FROM customers
        WHERE TRIM(name)=?
        AND TRIM(mobile)=?
    `;

    db.query(
        sql,
        [username, phone],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (results.length === 0) {
                return res.json({
                    success: false,
                    message: "Customer Not Found"
                });
            }

            res.json({
                success: true,
                message: "Login Successful",
                user: results[0]
            });

        }
    );

});

// =====================================
// CUSTOMER ATTENDANCE HISTORY
// =====================================

app.get("/customer-attendance/:id", (req, res) => {

    const customerId = req.params.id;

    const sql = `
        SELECT
            entry_date,
            morning_qty,
            evening_qty,
            status,
            amount
        FROM milk_entries
        WHERE customer_id = ?
        ORDER BY entry_date DESC
    `;

    db.query(
        sql,
        [customerId],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json(results);

        }
    );

});

// =====================================
// SERVER START
// =====================================

const PORT = 5000;

app.listen(PORT, () => {

    console.log("================================");
    console.log(`Server Running On Port ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log("================================");

});