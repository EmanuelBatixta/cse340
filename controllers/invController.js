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
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildDetailsById = async function (req, res, next) {
    console.log(res)
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

module.exports = invCont
