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
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
    }
}

async function getDetailsById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [inv_id]
    )

    return data.rows
  } catch (error) {
    console.error("getDetailsById error " + error)
    }
}

async function addInventoryItem(inv_make, inv_model, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_description, inv_year, classification_id) {
    try{
        const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *"
        console.log("Inventory item added successfully")
        return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
    }catch (error) {
        console.error("addInventoryItem error " + error)
    }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(inv_id, inv_make, inv_model, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_description, inv_year, classification_id) {
    try{
        const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
        const data = await pool.query(sql, [ inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id ])
        return data.rows[0]

    }catch (error) {
        console.error("update error: " + error)
    }
}

async function addClassification(classification_name) {
    try{
        const sql = `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *`
        return await pool.query(sql, [classification_name])
    }catch (error){
        console.error("addClassification error " + error)
    }
}

async function deleteInventory(inv_id) {
    try{
        const sql = 'DELETE FROM inventory WHERE inv_id = $1'
        const data = await pool.query(sql, [inv_id])
        return data
    }catch (error) {
        console.error("Delete Inventory error: " + error)
    }
}
 
module.exports = { getClassifications, getInventoryByClassificationId, getDetailsById, addClassification, addInventoryItem, getClassificationById, updateInventory, deleteInventory }
