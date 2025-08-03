const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index.js")
const ctrl = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


router.get("/",
    utilities.checkLogin,
    utilities.handleErrors(ctrl.buildAccountManagement)
)


router.get("/login", utilities.handleErrors(ctrl.buildLogin))

router.get("/register", utilities.handleErrors(ctrl.buildRegister))

router.post("/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(ctrl.registerAccount)
)

router.post("/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    ctrl.accountLogin,
    utilities.handleErrors(ctrl.accountLogin)
)

module.exports = router
