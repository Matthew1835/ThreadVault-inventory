const { body } = require("express-validator");

const categoryRules = [
    body("name").trim()
        .notEmpty().withMessage("Category name is required.")
        .isLength({ max: 100 }).withMessage("Max 100 characters."),

    body("description").trim().optional({ checkFalsy: true }),

    body("image_url").trim()
        .optional({ checkFalsy: true })
        .isURL().withMessage("Must be a valid URL."),
];

const itemRules = [
    body("name").trim()
        .notEmpty().withMessage("Item name is required.")
        .isLength({ max: 150 }).withMessage("Max 150 characters."),

    body("price")
        .isFloat({ min: 0 }).withMessage("Price must be a positive number."),

    body("stock_quantity")
        .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer."),

    body("category_id")
        .notEmpty().withMessage("Category is required."),

    body("description").trim().optional({ checkFalsy: true }),

    body("size").trim().optional({ checkFalsy: true }),

    body("color").trim().optional({ checkFalsy: true }),

    body("image_url").trim()
        .optional({ checkFalsy: true })
        .isURL().withMessage("Must be a valid URL."),
];

module.exports = { categoryRules, itemRules };