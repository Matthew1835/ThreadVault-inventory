require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('views', path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
const categoryController = require('./controllers/categoryController');
app.get("/", categoryController.index);
app.use("/categories", require("./routes/categories"));
app.use("/items", require("./routes/items"));

// 404
app.use((req, res) => {
    res.status(404).render("404", { title: "Page Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("error", {
        title: "Server Error",
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`🛍️  ThreadVault running on http://localhost:${PORT}`);
});