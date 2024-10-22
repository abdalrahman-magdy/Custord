import { query } from "express";
import connection from "../../config/database.js";
import moment from "moment";

const createOrder = (req, res) => {
    const { customer_id, order_items } = req.body;
    const order_date = moment().format("YYYY-MM-DD");

    const productIds = order_items.map(item => item.product_id);
    const productQuery = `SELECT id, unit_price FROM Products WHERE id IN (?)`;

    connection.query(productQuery, [productIds], (err, products) => {
        if (err) return res.status(500).json({ error: err.message });

        const productPriceMap = new Map();
        products.forEach(product => {
            productPriceMap.set(product.id, product.unit_price);
        });

        let total_amount = 0;
        const orderItems = order_items.map(item => {
            const unit_price = productPriceMap.get(item.product_id);
            if (!unit_price) {
                return res.status(400).json({ error: `Invalid product ID: ${item.product_id}` });
            }
            total_amount += unit_price * item.quantity;
            return [null, item.product_id, item.quantity, unit_price];
        });

        const orderQuery = "INSERT INTO orders (customer_id, order_date, total_amount) VALUES (?, ?, ?)";
        connection.query(orderQuery, [customer_id, order_date, total_amount], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            const order_id = results.insertId;
            orderItems.forEach(item => item[0] = order_id);

            const orderItemsQuery = "INSERT INTO orderItems (order_id, product_id, quantity, unit_price) VALUES ?";
            connection.query(orderItemsQuery, [orderItems], (err, results) => {
                if (err) return res.status(500).json({ error: err.message });

                res.status(201).json({ message: "order completed successfully", id: order_id });
            });
        });
    });
}
const avgOrderValue = (req, res) => {
    const query = `SELECT AVG(total_amount) AS Average_order FROM orders `
    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({ results })
    })
}
const zeroPurchase = (req, res) => {
    const query = `SELECT 
        customers.id, 
        customers.first_name, 
        customers.last_name, 
        customers.email, 
        customers.phone
    FROM 
        customers
    LEFT JOIN 
        orders 
    ON 
        customers.id = orders.customer_id
    WHERE 
        orders.id IS NULL;`

    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({ results })
    })
}

const mostItemsOrder = (req, res) => {
    const query = `SELECT 
        customers.id AS customer_id,
        customers.first_name,
        customers.last_name,
        customers.phone ,
        SUM(orderitems.quantity) AS total_items_purchased
    FROM 
        customers
    JOIN 
        orders ON customers.id = orders.customer_id
    JOIN 
        orderitems ON orders.id = orderitems.order_id
    GROUP BY 
        customers.id, customers.first_name, customers.last_name,customers.phone
    ORDER BY 
        total_items_purchased DESC
    LIMIT 1;`;

    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(200).json({ results })
    })
}

const topTenCustomers = (req, res) => {
    const query = `SELECT 
        customers.id AS customer_id,
        customers.first_name,
        customers.last_name,
        customers.phone ,
        SUM(orders.total_amount) AS money_spent
    FROM
        customers
    JOIN
        orders ON customers.id = orders.customer_id
    GROUP BY 
        customers.id, customers.first_name, customers.last_name,customers.phone
    ORDER BY 
        money_spent DESC
    LIMIT 10;`
    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(200).json({ results })
    })
}

const atLeastFiveOrders = (req, res) => {
    const query = `SELECT 
        customers.id AS customer_id,
        customers.first_name,
        customers.last_name,
        customers.phone,
        COUNT(orders.customer_id) AS number_of_orders
    FROM
        customers
    JOIN
        orders ON customers.id = orders.customer_id
    GROUP BY 
        customers.id, customers.first_name, customers.last_name, customers.phone
    HAVING 
        COUNT(orders.customer_id) > 1
    ORDER BY 
        number_of_orders DESC;`;

    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ err: err.message });
        res.status(200).json({ results })
    })
}

const activeCustomersPercentage = (req, res) => {
    const query = `SELECT 
        (SUM(order_count > 1) / COUNT(*)) * 100 AS Active_customers_percentage
    FROM (
        SELECT 
            customers.id,
            COUNT(orders.id) AS order_count
        FROM 
            customers
        LEFT JOIN 
            orders ON customers.id = orders.customer_id
        GROUP BY 
            customers.id
    ) AS customer_orders;`;

    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ err: err.message });
        res.status(200).json({ results })
    })
}

const earliestOrder = (req, res) => {
    const query = `SELECT 
        customers.id,
        customers.first_name,
        customers.last_name,
        customers.email,
        customers.phone,
        MIN(orders.id) AS order_Number
    FROM 
        customers
    JOIN 
        orders ON customers.id = orders.customer_id
    GROUP BY 
        customers.id, 
        customers.first_name, 
        customers.last_name, 
        customers.email, 
        customers.phone
    ORDER BY 
        order_Number ASC
    LIMIT 1;`

    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ err: err.message });
        res.status(200).json({ results })
    })

}


export {
    createOrder, avgOrderValue, zeroPurchase,
    mostItemsOrder, topTenCustomers, atLeastFiveOrders,
    activeCustomersPercentage, earliestOrder
};
