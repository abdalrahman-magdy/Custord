import mysql from 'mysql2'


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'custord'
})

connection.connect((err) => {

    if (err) return console.log("database error");
    console.log("connected to database successfully");
})


export default connection  