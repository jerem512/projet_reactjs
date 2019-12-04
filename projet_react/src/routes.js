const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const connection = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'pile_face'
});

const app = express();// Starting the app.
const http = require("http")

app.get('/emotions', function (req, res) {// Creating a GET route that returns data from a table.
    connection.getConnection(function (err, connection) {// Connecting to the database.
    connection.query('SELECT * FROM emotions', function (error, results, fields) {// Executing the MySQL query (select all data from the a table).
      if (error) throw error; // If some error occurs, we throw an error.
      res.send(results)// Getting the 'response' from the database and sending it to our route. This is were the data is.
    });
  });
});

// Starting our server.
app.listen(3000, () => {
 console.log('Go to http://localhost:3000/need so you can see the data.');
});


 // fetch('http://172.29.100.111:3000/need')
 //   .then(response => response.json())
 //   .then(need => console.warn(need))
