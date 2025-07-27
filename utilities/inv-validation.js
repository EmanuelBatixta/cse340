const utilities = require("../utilities/index.js")
const invModel = require("../models/inventory-model")

const { body, validationResult } = require("express-validator")

const validate = {}

validate.invRules = () => {
    return [
        body("inv_make")
            .trim()
            .notEmpty()
            .isLength({min: 3})
            .isString()
            .withMessage("A valid make is required."),

        body("inv_model")
            .trim()
            .notEmpty()
            .isLength({min: 3})
            .isString()
            .withMessage("A valid model is required."),

        body("inv_image")
            .trim()
            .notEmpty()
            .isLength({min: 3})
            .isString()
            .withMessage("A valid path for image is required."),

        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .isLength({min: 3})
            .isString()
            .withMessage("A valid path for thumbnail is required."),

        body("inv_price")
            .trim()
            .notEmpty()
            .isNumeric()
            .withMessage("A valid price is required."),

        body("inv_miles")
            .trim()
            .notEmpty()
            .isNumeric()
            .withMessage("A valid miles is required."),

        body("inv_year")
            .trim()
            .notEmpty()
            .isNumeric()
            .isLength({min: 4, max: 4})
            .withMessage("A valid year is required."),

        body("inv_color")
            .trim()
            .notEmpty()
            .isString()
            .isLength({min: 3})
            .withMessage("A valid color is required."),

        body("inv_description")
            .trim()
            .notEmpty()
            .isString()
            .isLength({min: 3})
            .withMessage("A valid description is required."),
    ]
}

validate.checkInvData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_description, inv_year } = req.body
  let errors = []
  let classification = await utilities.buildClassificationList()
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-inventory",{
            title: 'Add Inventory',
            nav,
            errors,
            classification,
            inv_image: inv_image ||'/images/vehicles/no-image.png',
            inv_thumbnail: inv_thumbnail || '/images/vehicles/no-image.png',
            inv_price,
            inv_miles,
            inv_color,
            inv_description,
            inv_year,
            inv_make,
            inv_model,
            classification_id
    })
    return
  }
  next()
}

validate.classRules = () =>{
    return [
        body("classification_name")
            .trim()
            .notEmpty()
            .withMessage("A valid classification name is required."),
    ]
}

validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: 'Add Classification',
        nav,
        errors: null,
        classification_name
    })
    return
  }
  next()
}


module.exports = validate
