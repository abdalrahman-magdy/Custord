
import connection from "../../config/database.js"

const signUp = (req, res) => {
    const { first_name, last_name, email, phone } = req.body;
    
    const checkQuery = `SELECT * FROM customers WHERE email = ?`
    
    connection.query(checkQuery,[email],(err,results)=>{
        if(err)return res.status(500).json(err);

        if (results.length>0){
            return res.status(400).json({message : 'E-mail already exists'});
        }
    })
    
    
    const query = `INSERT INTO customers (first_name,last_name, email, phone) VALUES (?,?,?,?)`
    connection.query(query, [first_name, last_name, email, phone], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message:'registered',id: results.insertId });
    });
}

const logIn = (req, res) => {
    const { first_name, last_name, email } = req.body;
    const verify = `SELECT * FROM customers WHERE first_name = ''?'' AND last_name = ''?'' AND email =''?'' `
    connection.query(verify,[first_name, last_name, email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
    });
    const query = 'SELECT * FROM products';
    connection.query(query,(err,results)=>{
        if(err){
            return res.status(500).json({error: err.message})
        }
        return res.status(200).json({message:"logged in successfully",results})
    })
}

export {signUp,logIn};