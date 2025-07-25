const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    const data = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    )
    return data.rows
}

async function getClassificationById(classification_id) {
    const data = await pool.query(
      "SELECT * FROM public.classification WHERE classification_id = $1 ORDER BY classification_name",
       [classification_id]
    )
    return data.rows[0]
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    console.log(data.rows)

    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
    }
}

async function getDetailsById(inv_id) {
  try {
    console.log(inv_id)
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [inv_id]
    )
    console.log(data.rows)

    return data.rows
  } catch (error) {
    console.error("getDetailsById error " + error)
    }
}

module.exports = { getClassifications, getInventoryByClassificationId, getDetailsById }
