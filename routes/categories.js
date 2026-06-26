const { Router } = require("express");
const categoryRouter = Router();
const categoryController = require("../controllers/categoryController");
const { categoryRules } = require("../controllers/validators");

categoryRouter.get("/new", categoryController.newForm);
categoryRouter.post("/", categoryRules, categoryController.create);
categoryRouter.get("/:id", categoryController.show);
categoryRouter.get("/:id/edit", categoryController.editForm);
categoryRouter.post("/:id/update", categoryRules, categoryController.editForm);
categoryRouter.post("/:id/delete", categoryController.delete);

module.exports = categoryRouter;