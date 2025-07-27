// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index.js")
const invValidate = require("../utilities/inv-validation.js")


router.get("/type/:classificationId", utilities.handleErrors(invController.invCont.buildByClassificationId));

router.get("/detail/:inv_id", utilities.handleErrors(invController.invCont.buildDetailsById));

router.get("/", utilities.handleErrors(invController.invCont.buildIndex));

router.get("/new/classification", utilities.handleErrors(invController.invCont.buildNewClassification));

router.get("/new/inventory", utilities.handleErrors(invController.invCont.buildNewInventory));

router.post("/new/inventory",
    invValidate.invRules(),
    invValidate.checkInvData,
    utilities.handleErrors(invController.addInventory)
)

router.post("/new/classification",
    invValidate.classRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addClassification)
)

module.exports = router;
