const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

const dbConfig = {
    host: process.env.MYSQL_HOST || 'mysql',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DATABASE || 'test'
  };
  
let connection;

function handleDisconnect() {
  connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      setTimeout(handleDisconnect, 5000);
    } else {
      initializeDatabase();
    }
  });

  connection.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS people (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `;
  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Table is ready.');
    }
  });
}

handleDisconnect();

app.get('/', (req, res) => {
  const name = `User-FullCycle${Math.floor(Math.random() * 100)}`;
  connection.query(`INSERT INTO people(name) VALUES ('${name}')`, (err) => {
    if (err) {
      res.status(500).send('Error inserting data');
      return;
    }

    connection.query('SELECT name FROM people', (err, results) => {
      if (err) {
        res.status(500).send('Error fetching data');
        return;
      }

      let response = '<h1>Full Cycle Rocks!</h1><ul>';
      results.forEach((row) => {
        response += `<li>${row.name}</li>`;
      });
      response += '</ul>';
      res.send(response);
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
