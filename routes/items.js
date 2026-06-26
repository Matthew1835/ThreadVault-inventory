const { Router } = require("express");
const itemRouter = Router();
const itemController = require("../controllers/itemController");
const { itemRules } = require("../controllers/validators");

itemRouter.get("/new", itemController.newForm);
itemRouter.post("/", itemRules, itemController.create);
itemRouter.get("/:id", itemController.show);
itemRouter.get("/:id/edit", itemController.editForm);
itemRouter.post("/:id/update", itemRules, itemController.update);
itemRouter.post("/:id/delete", itemController.delete);

module.exports = itemRouter;