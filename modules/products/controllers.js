import connection from "../../config/database.js"

const addProduct = (req, res) => {
    const { name, category, unit_price } = req.body;
    const query = `INSERT INTO PRODUCTS (product_name,category,unit_price) VALUES (?,?,?)`
    connection.query(query, [name, category, unit_price], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId });
    });
}

const getRevByCat = (req, res) => {
    const query = `
        SELECT category, SUM(orderItems.quantity * orderItems.unit_price) AS total_revenue
        FROM products
        JOIN orderItems ON products.id = orderItems.product_id
        GROUP BY category`;
    connection.query(query,(err,results)=>{
        if(err){
            return res.status(500).json({error: err.message})
        }
        res.status(200).json({results})
    })
}

const soldFromEach = (req, res) => {
    const query = `
    SELECT products.id, product_name, SUM(orderItems.quantity) AS total_sales
    FROM products
    JOIN orderItems ON products.id = orderItems.product_id
    GROUP BY product_name DESC`;
    connection.query(query,(err,results)=>{
        if(err){
            return res.status(500).json({error: err.message})
        }
        res.status(200).json({results})
    })
}

export { getRevByCat , addProduct, soldFromEach };