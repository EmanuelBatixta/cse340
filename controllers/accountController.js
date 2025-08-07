const utilities = require("../utilities/index.js")
const accountModel = require("../models/account-model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("./account/register", {
        title: "Register",
        nav,
        errors: null,
        })
    }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("./account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function buildAccountManagement(req, res) {
    let nav = await utilities.getNav()

    res.render("./account/management",{
        title: 'Account Management',
        nav,
        errors: null,
    })
}

async function buildEdit(req, res) {
    let nav = await utilities.getNav()

    res.render("./account/edit", {
        title: 'Edit Account',
        nav,
        errors: null,
    })
}

async function editAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    const existEmail = await accountModel.getAccountByEmail(account_email)
    if(account_id === existEmail.account_id){
        req.flash('notice', 'Failed edit account, this email is already in use.')
        res.status(500).render("./account/edit", {
            title: 'Edit account',
            nav,
            errors: null,
        })

    } else {

        const editResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)

        if(editResult){
        req.flash('notice', 'Account edited sucessfully.')
        res.status(201).render("./account/management", {
            title: 'Account Management',
            nav,
            errors: null,
        })
        } else {
            req.flash('notice', 'Failed edit account.')
            res.status(500).render("./account/edit", {
                title: 'Edit account',
                nav,
                errors: null,
            })
        }
    }
}

async function editPassword(req, res) {
    let nav = await utilities.getNav()
    const { account_password, account_id } = req.body

    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Failed edit password.')
        res.status(500).render("./account/register", {
        title: "Register",
        nav,
        errors: null,
        })
    }

    const editResult = await accountModel.updatePasswod(account_id, hashedPassword)
    console.log(editResult)
    if(editResult){
        req.flash('notice', 'Password edit sucessfully.')
        res.status(201).render("./account/management", {
            title: 'Account Management',
            nav,
            errors: null,
        })
    } else {
        req.flash('notice', 'Failed edit password.')
        res.status(500).render("./account/edit", {
            title: 'Edit account',
            nav,
            errors: null,
        })
    }
}

async function loggout(req, res) {
    let nav = await utilities.getNav()

    if(process.env.NODE_ENV === 'development'){
        res.clearCookie('jwt',{
            httpOnly: true,
        })
    } else {
        res.clearCookie('jwt',{
            httpOnly: true,
            secure: true,   // se estiver em produção com HTTPS
        })
    }

    res.locals.loggedin = false
    res.locals.accountData = {}

    req.flash('notice', 'You\'re discconected.')
    res.render("./index", {
        title: 'Welcome to CSE Motors!',
        nav,
        errors: null,
    })
}


module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildEdit, editAccount, editPassword, loggout }
