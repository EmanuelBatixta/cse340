const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index.js")
const ctrl = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


//router.get("/account", utilities.handleErrors(ctrl.buildLoginPage))

router.get("/login", utilities.handleErrors(ctrl.buildLogin))

router.get("/registration", utilities.handleErrors(ctrl.buildRegister))

router.post("/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(ctrl.registerAccount)
)



module.exports = router
