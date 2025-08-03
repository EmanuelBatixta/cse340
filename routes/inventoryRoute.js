// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index.js")
const invValidate = require("../utilities/inv-validation.js")


router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:inv_id", utilities.handleErrors(invController.buildDetailsById));

router.get("/", utilities.handleErrors(invController.buildManagement));

router.get("/new/classification", utilities.handleErrors(invController.buildNewClassification));

router.get("/new/inventory", utilities.handleErrors(invController.buildNewInventory));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEdit)) // create a edit view

router.post("/new/inventory",
    invValidate.invRules(),
    invValidate.checkInvData,
    utilities.handleErrors (invController.addInventory)
)

router.post("/new/classification",
    invValidate.classRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addClassification)
)

router.post("/update/",
    invValidate.invRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

//exclusion
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDelete))

router.post("/delete/", utilities.handleErrors(invController.deleteInventory))

module.exports = router;
