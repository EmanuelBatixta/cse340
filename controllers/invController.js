const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const classification = await invModel.getClassificationById(classification_id)
  const className = classification.classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildDetailsById = async function (req, res, next) {
    const id = req.params.inv_id
    const data = await invModel.getDetailsById(id)
    const details = await utilities.buildDetailsView(data)
    let nav = await utilities.getNav()
    const model = `${data[0].inv_year
        } ${data[0].inv_make} ${data[0].inv_model}`
    res.render("./inventory/details",{
        title: model,
        nav,
        details,
    })
}

invCont.buildIndex = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management",{
        title: 'Vehicle Management',
        nav,
        errors: null,
    })
}

invCont.buildNewInventory = async function (req, res, next) {
    let nav = await utilities.getNav()

    let classification = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
        title: 'Add Inventory',
        nav,
        errors: null,
        classification,
        inv_image: '/images/vehicles/no-image.png',
        inv_thumbnail: '/images/vehicles/no-image.png',
    })
}

invCont.buildNewClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: 'Add classification',
        nav,
        errors: null,
        classification_name: "",
    })
}

async function addInventory(req, res) {
    let nav = await utilities.getNav()
    const { classification_id, inv_make, inv_model, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_description, inv_year } = req.body

    let classification = await utilities.buildClassificationList()

    const addResult = await invModel.addInventoryItem(
        inv_make,
        inv_model,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        inv_description,
        inv_year,
        classification_id
    )

    if (addResult) {
        req.flash('notice', 'Vehicle added successfully.')
        res.status(201).render("./inventory/add-inventory",{
            title: 'Add Inventory',
            nav,
            errors: null,
            classification,
            inv_image: inv_image ||'/images/vehicles/no-image.png',
            inv_thumbnail: inv_thumbnail || '/images/vehicles/no-image.png'
        })
    } else {
        req.flash("notice", "Sorry, there was an error adding the vehicle.")
        res.status(500).render("./inventory/add-inventory", {
            title: 'Add Inventory',
            nav,
            errors: null,
            classification,
            classification_id,
            inv_make,
            inv_model,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            inv_description,
            inv_year
        })
    }
}

async function addClassification (req, res) {
    const { classification_name } = req.body

    const addResult = await invModel.addClassification(classification_name)

    let nav = await utilities.getNav()

    if (addResult) {
        req.flash('notice', 'Classification added successfully.')
        res.status(201).render("./inventory/add-classification", {
            title: 'Add Classification',
            nav,
            errors: null,
            classification_name: "",
        })
    } else {
        req.flash("notice", "Sorry, there was an error adding the classification.")
        res.status(500).render("./inventory/add-classification", {
            title: 'Add Classification',
            nav,
            errors: null,
            classification_name,
        })
    }
}

module.exports = { invCont, addClassification, addInventory }
