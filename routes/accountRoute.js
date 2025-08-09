const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index.js")
const ctrl = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

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
    utilities.handleErrors(ctrl.accountLogin)
)

router.use(utilities.checkLogin)

router.get("/", utilities.handleErrors(ctrl.buildAccountManagement))

router.get("/management/:account_id", utilities.handleErrors(ctrl.buildEdit))

router.post("/edit/account",
    regValidate.editAccountRules(),
    regValidate.checkEditData,
    utilities.handleErrors(ctrl.editAccount)
)

router.post("/edit/password",
    regValidate.editPasswordRules(),
    utilities.handleErrors(ctrl.editPassword)
)

router.get("/loggout",
    utilities.handleErrors(ctrl.loggout)
)

router.get("/delete/",
    utilities.handleErrors(ctrl.buildDeleteAccount)
)

router.post("/delete/",
    regValidate.deleteValidation(),
    utilities.handleErrors(ctrl.deleteAccount)
)

module.exports = router
