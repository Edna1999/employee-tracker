// Import and require mysql2
const mysql = require('mysql2');


//connecting to  database
const db = mysql.createConnection(
  {

    host: 'localhost',
    database: 'cms_db',
    user: 'root',
    password: ''
   
  },

  console.log(`Connected to the cms_db database.`)
);

 


module.exports = db;