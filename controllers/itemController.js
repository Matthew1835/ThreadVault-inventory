const itemDb = require("../db/itemDb");
const categoryDb = require("../db/categoryDb");
const { validationResult } = require("express-validator");

const itemController = {
    // GET /items/new
    newForm: async (req, res, next) => {
        try {
            const categories = await categoryDb.getAll();
            
            res.render("items/form", {
                title: "New Item",
                item: { category_id: req.query.category_id || "" },
                categories,
                errors: [],
                action: "/items",
                method: "POST"
            });
        } catch (err) {
            next(err);
        }
    },

    // POST /items
    create: async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const categories = await categoryDb.getAll();

            await res.render("items/form", {
                title: "New Item",
                item: req.body,
                categories,
                errors: errors.array(),
                action: "/items",
                method: "POST",
            });
        }

        try {
            await itemDb.create(req.body);
            res.redirect(`/categories/${req.body.category_id}`);
        } catch (err) {
            next(err);
        }
    },

    // GET /items/:id
    show: async (req, res, next) => {
        try {
            const item = await itemDb.getById(req.params.id);
            
            if (!item) return res.status(404).render("404", { title: "Not Found" });
            
            res.render("items/show", {
                title: item.name,
                item
            });
        } catch (err) {
            next(err);
        }
    },

    // GET /items/:id/edit
    editForm: async (req, res, next) => {
        try {
            const [item, categories] = await Promise.all([
                itemDb.getById(req.params.id),
                categoryDb.getAll(),
            ]);

            if (!item) return res.status(404).render("404", { title: "Not Found" });

            res.render("items/form", {
                title: `Edit - ${item.name}`,
                item,
                categories,
                errors: [],
                action: `/items/${item.id}/update`,
                method: "POST"
            });
        } catch (err) {
            next(err);
        }
    },

    // POST /item/:id/update
    update: async (req, res, next) => { 
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const categories = await categoryDb.getAll();
            return res.render("items/form", {
                title: `Edit - ${item.name}`,
                item: { ...req.body, id: req.params.id },
                categories,
                errors: errors.array(),
                action: `/items/${req.params.id}/update`,
                method: "POST"
            });
        }

        try {
            const item = await itemDb.update(req.params.id, req.body);
            res.redirect(`/items/${item.id}`);
        } catch (err) {
            next(err);
        }
    },

    // POST /items/:id/delete
    delete: async (req, res, next) => {
        const { adminPassword } = req.body;

        if (adminPassword !== process.env.ADMIN_PASSWORD) {
            const item = await itemDb.getById(req.params.id);
            return res.render("items/show", {
                title: item.name,
                item,
                deleteError: "Incorrect admin password.",
            });
        }

        try {
            const item = await itemDb.getById(req.params.id);
            const categoryId = item.category_id;

            await itemDb.delete(req.params.id);

            res.redirect(`/categories/${categoryId}`);
        } catch (err) {
            next(err);
        }
    },
};

module.exports = itemController;