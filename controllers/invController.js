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

invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classification = await utilities.buildClassificationList()

    res.render("./inventory/management",{
        title: 'Vehicle Management',
        nav,
        classification,
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

invCont.addInventory = async function (req, res) {
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

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory( inv_id, inv_make, inv_model, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_description, inv_year, classification_id )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classification = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classification,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

invCont.addClassification = async function (req, res) {
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 * Return The Edit View
 * ************************** */
invCont.buildEdit = async (req, res, next) => {
    let nav = await utilities.getNav()
    const inventory_id = parseInt(req.params.inv_id)
    const data = await invModel.getDetailsById(inventory_id)
    const itemName = `${data[0].inv_make} ${data[0].inv_model}`

    let classification = await utilities.buildClassificationList(data[0].classification_id)

    console.log(data[0].inv_description)
    res.render("./inventory/edit-inventory", {
        title: `Edit ${itemName}`,
        nav,
        errors: null,
        classification,
        inv_id: inventory_id,
        inv_make: data[0].inv_make,
        inv_model: data[0].inv_model,
        inv_year: data[0].inv_year,
        inv_description: data[0].inv_description,
        inv_image: data[0].inv_image,
        inv_thumbnail: data[0].inv_thumbnail,
        inv_price: data[0].inv_price,
        inv_miles: data[0].inv_miles,
        inv_color: data[0].inv_color,
        classification_id: data[0].classification_id
    })
}

module.exports = invCont
