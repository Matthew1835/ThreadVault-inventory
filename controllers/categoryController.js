const categoryDb = require("../db/categoryDb");
const { validationResult } = require("express-validator");
const itemDb = require("../db/itemDb");

const categoryController = {
    // GET /
    index: async (req, res, next) => {
        try {
            const categories = await categoryDb.getAll();
            res.render("categories/index", {
                title: "All Categories",
                categories
            })
        } catch (err) {
            next(err);
        }
    },

    // GET /categories/new
    newForm: (req, res) => {
        res.render("categories/form", {
            title: "New Category",
            category: {},
            errors: [],
            action: "/categories",
            method: "POST"
        });
    },

    // POST /categories
    create: async (req, res, next) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.render("categories/form", {
                title: "New Category",
                category: req.body,
                errors: errors.array(),
                action: "/categories",
                method: "POST",
            });
        }

        try {
            await categoryDb.create(req.body);
            res.redirect("/");
        } catch (err) {
            next(err);
        }
    },

    // GET /categories/:id
    show: async (req, res, next) => {
        try {
            const category = await categoryDb.getById(req.params.id);

            if (!category) return res.status(404).render("404", { title: "Not Found" });

            const items = await itemDb.getByCategory(req.params.id);

            res.render("categories/show", {
                title: category.name,
                category,
                items
            });
        } catch (err) {
            next(err);
        }
    },

    // GET /categories/:id/edit
    editForm: async (req, res, next) => {
        try {
            const category = await categoryDb.getById(req.params.id);

            if (!category) return res.status(404).render("404", { title: "Not Found" });

            res.render("categories/form", {
                title: `Edit - ${category.name}`,
                category,
                errors: [],
                action: `/categories/${category.id}/update`,
                method: "POST"
            });
        } catch (err) {
            next(err);
        }
    },

    // POST /categories/:id/update
    update: async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("categories/form", {
                title: "Edit Category",
                category: { ...req.body, id: req.params.id },
                errors: errors.array(),
                action: `/categories/${req.params.id}/update`,
                method: "POST",
            });
        }

        try {
            await categoryDb.update(req.params.id, req.body);
            res.redirect(`/categories/${req.params.id}`);
        } catch (err) {
            next(err);
        }
    },

    // POST /categories/:id/delete
    delete: async (req, res, next) => {
        const { adminPassword } = req.body;

        if (adminPassword !== process.env.ADMIN_PASSWORD) {
            const category = await categoryDb.getById(req.params.id);
            const items = await itemDb.getByCategory(req.params.id);

            return res.render("categories/show", {
                title: category.name,
                category,
                items,
                deleteError: "Incorrect admin password."
            });
        }

        try {
            const itemCount = await categoryDb.getItemCount(req.params.id);
            
            if (itemCount > 0) {
                const category = await categoryDb.getById(req.params.id);
                const items = await itemDb.getByCategory(req.params.id);

                return res.render("categories/show", {
                    title: category.name,
                    category,
                    items,
                    deleteError: `Cannot delete: this category still has ${itemCount} items. Delete or reassign them first.`,
                });
            }

            await categoryDb.delete(req.params.id);
            res.redirect("/"); 
        } catch (err) {
            next(err);
        }
    },
};

module.exports = categoryController;