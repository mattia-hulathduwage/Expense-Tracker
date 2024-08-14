// server.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // default username for XAMPP
  password: '', // default password for XAMPP
  database: 'ifinance',
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Income Routes
app.post('/api/income', (req, res) => {
  const { title, amount, date, category, reference } = req.body;
  const sqlInsert = 'INSERT INTO income (title, amount, idate, category, reference) VALUES (?, ?, ?, ?, ?)';
  db.query(sqlInsert, [title, amount, date, category, reference], (err, result) => {
    if (err) {
      res.status(500).send({ err: err });
      return;
    }
    res.send(result);
  });
});

app.get('/api/income/latest', (req, res) => {
  const query = 'SELECT id, title, amount, idate AS date FROM income ORDER BY idate DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching latest income:', err);
      res.status(500).send({ err: err });
      return;
    }
    res.json(results);
  });
});

app.delete('/api/income/:id', (req, res) => {
  const { id } = req.params;
  const sqlDelete = 'DELETE FROM income WHERE id = ?';
  db.query(sqlDelete, [id], (err, result) => {
    if (err) {
      res.status(500).send({ err: err });
      return;
    }
    res.send(result);
  });
});

// Server-side code (server.js)

app.get('/api/income/overtime', (req, res) => {
  const query = 'SELECT idate AS date, SUM(amount) AS total FROM income GROUP BY idate ORDER BY idate';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching income over time:', err);
      res.status(500).send({ err: err });
      return;
    }
    res.json(results);
  });
});

app.get('/api/expense/overtime', (req, res) => {
  const query = 'SELECT edate AS date, SUM(eamount) AS total FROM expense GROUP BY edate ORDER BY edate';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching expense over time:', err);
      res.status(500).send({ err: err });
      return;
    }
    res.json(results);
  });
});


// Expense Routes
app.post('/api/expense', (req, res) => {
  const { title, amount, date, category, reference } = req.body;
  const sqlInsert = 'INSERT INTO expense (etitle, eamount, edate, ecategory, ereference) VALUES (?, ?, ?, ?, ?)';
  db.query(sqlInsert, [title, amount, date, category, reference], (err, result) => {
    if (err) {
      res.status(500).send({ err: err });
      return;
    }
    res.send(result);
  });
});

app.get('/api/expense/latest', (req, res) => {
  const query = 'SELECT eid, etitle, eamount, edate AS date FROM expense ORDER BY edate DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching latest expenses:', err);
      res.status(500).send({ err: err });
      return;
    }
    res.json(results);
  });
});

app.delete('/api/expense/:id', (req, res) => {
  const { id } = req.params;
  const sqlDelete = 'DELETE FROM expense WHERE eid = ?';
  db.query(sqlDelete, [id], (err, result) => {
    if (err) {
      res.status(500).send({ err: err });
      return;
    }
    res.send(result);
  });
});

app.get('/api/income/categories', (req, res) => {
  const query = 'SELECT category, SUM(amount) as total FROM income GROUP BY category';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching income by category:', err);
      res.status(500).send({ err: err });
      return;
    }
    res.json(results);
  });
});

app.get('/api/expense/categories', (req, res) => {
  const query = 'SELECT ecategory as category, SUM(eamount) as total FROM expense GROUP BY ecategory';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching expense by category:', err);
      res.status(500).send({ err: err });
      return;
    }
    res.json(results);
  });
});


// Fetch monthly income data
app.get('/api/income/monthly', (req, res) => {
  const query = `
    SELECT DATE_FORMAT(idate, '%Y-%m') AS month, SUM(amount) AS total
    FROM income
    GROUP BY month
    ORDER BY month
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching monthly income:', err);
      res.status(500).send({ err: err });
      return;
    }
    res.json(results);
  });
});

// Fetch monthly expense data
app.get('/api/expense/monthly', (req, res) => {
  const query = `
    SELECT DATE_FORMAT(edate, '%Y-%m') AS month, SUM(eamount) AS total
    FROM expense
    GROUP BY month
    ORDER BY month
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching monthly expense:', err);
      res.status(500).send({ err: err });
      return;
    }
    res.json(results);
  });
});



// Transactions Route
app.get('/api/transactions', (req, res) => {
  const query = `
    SELECT id AS transaction_id, idate AS date, 'income' AS type, amount, category AS category, reference 
    FROM income 
    UNION ALL 
    SELECT eid AS transaction_id, edate AS date, 'expense' AS type, eamount AS amount, ecategory AS category, ereference AS reference 
    FROM expense 
    ORDER BY date 
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching transactions:', err);
      res.status(500).send({ err: err });
      return;
    }
    res.json(results);
  });
});

// Recent Transactions Route (ordered by date descending)
app.get('/api/transactions/recent', (req, res) => {
  const query = `
    SELECT id AS transaction_id, idate AS date, 'income' AS type, amount, category AS category, reference 
    FROM income 
    UNION ALL 
    SELECT eid AS transaction_id, edate AS date, 'expense' AS type, eamount AS amount, ecategory AS category, ereference AS reference 
    FROM expense 
    ORDER BY date DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching recent transactions:', err);
      res.status(500).send({ err: err });
      return;
    }
    res.json(results);
  });
});


// Reminder Routes
app.post('/api/reminder', (req, res) => {
  const { rtype, rpayment, ramount, rdate } = req.body; // Add rtype to destructuring
  const sqlInsert = 'INSERT INTO reminder (rtype, rpayment, ramount, rdate) VALUES (?, ?, ?, ?)';
  db.query(sqlInsert, [rtype, rpayment, ramount, rdate], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Server error');
    } else {
      res.status(200).send('Reminder added successfully');
    }
  });
});

app.get('/api/reminders', (req, res) => {
  const sqlSelect = 'SELECT rtype, rpayment, ramount, rdate FROM reminder';
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Server error');
    } else {
      res.status(200).json(result);
    }
  });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
