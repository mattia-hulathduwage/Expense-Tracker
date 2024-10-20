const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const axios = require('axios');
const session = require('express-session'); 
const bcrypt = require('bcrypt');
const logger = require('./logger');
require('dotenv').config();


const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Set up session management
app.use(session({
  secret: process.env.SESSION_SECRET, // Use a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true,
        sameSite: 'strict',
    }
}));

// Middleware to track session activity and handle session timeout
const sessionTimeout = 1 * 60 * 1000; // 1 minute

app.use((req, res, next) => {
    if (req.session.userId) {
        const now = Date.now();
        // Check if session is inactive for more than 1 minute
        if (now - req.session.lastActive > sessionTimeout) {
            req.session.destroy(err => {
                if (err) {
                    return res.status(500).json({ message: 'Could not log out' });
                }
                return res.status(401).json({ message: 'Session expired. Please log in again.' });
            });
        } else {
            req.session.lastActive = now; // Update last active timestamp
        }
    }
    next();
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
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

// Update existing income
app.put("/api/income/:id", (req, res) => {
  const { id } = req.params;
  const { title, amount, date, category, reference } = req.body;
  const sqlUpdate = "UPDATE income SET title = ?, amount = ?, idate = ?, category = ?, reference = ? WHERE id = ?";
  db.query(sqlUpdate, [title, amount, date, category, reference, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(result);
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

app.put('/api/expense/:id', (req, res) => {
  const { id } = req.params;
  const { title, amount, date, category, reference } = req.body;
  const sqlUpdate = 'UPDATE expense SET etitle = ?, eamount = ?, edate = ?, ecategory = ?, ereference = ? WHERE eid = ?';
  db.query(sqlUpdate, [title, amount, date, category, reference, id], (err, result) => {
    if (err) {
      res.status(500).send({ err: err });
      return;
    }
    res.send(result);
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

app.put('/api/reminder/:id', (req, res) => {
  const { id } = req.params; // Get the reminder ID from the URL
  const { rtype, rpayment, ramount, rdate } = req.body; // Destructure the updated reminder details

  const sqlUpdate = 'UPDATE reminder SET rtype = ?, rpayment = ?, ramount = ?, rdate = ? WHERE id = ?';
  db.query(sqlUpdate, [rtype, rpayment, ramount, rdate, id], (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      res.status(500).send('Server error');
    } else if (result.affectedRows === 0) {
      // No rows were updated, meaning the ID might not exist
      res.status(404).send('Reminder not found');
    } else {
      res.status(200).send('Reminder updated successfully');
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


// Add this new route in server.js
app.post('/api/signup', async (req, res) => {
  logger.info('Request Body: ' + JSON.stringify(req.body)); // Log the request body

  const { fullname, useremail, telephone, password } = req.body;

  const saltRounds = 10;
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    logger.info('Hashed Password: ' + hashedPassword); // Log the hashed password for debugging

    const sqlInsert = 'INSERT INTO user (fullname, password, useremail, telephone) VALUES (?, ?, ?, ?)';
    db.query(sqlInsert, [fullname, hashedPassword, useremail, telephone], (err, result) => {
      if (err) {
        logger.error('Error inserting user: ' + err.message); // Log the error
        return res.status(500).send('Error inserting user into the database');
      }
      logger.info(`User registered successfully: ${fullname} (${useremail})`); // Log successful registration
      res.status(201).send({ message: 'User registered successfully' });
    });
  } catch (err) {
    logger.error('Error hashing password: ' + err.message); // Log error during password hashing
    return res.status(500).send('Error hashing password');
  }
});





// Login Route
// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password, token } = req.body;

  // Verify the reCAPTCHA token with Google
  try {
      const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
          params: {
              secret: '6Lf4QmUqAAAAAOJufRUGSUA9ARm51vk1xXxofuho', // Replace with your actual secret key
              response: token,
          },
      });

      // Check the response from Google
      const { success, score } = response.data;
      if (!success || score < 0.9) {
          return res.status(403).json({ message: 'reCAPTCHA verification failed' });
      }

      // Proceed to check email and password if reCAPTCHA is successful
      const sqlSelect = 'SELECT * FROM user WHERE useremail = ?';
      db.query(sqlSelect, [email], async (err, result) => {
          if (err) {
              console.error('Error fetching user:', err);
              return res.status(500).json({ message: 'Server error' });
          }

          if (result.length > 0) {
              // Compare the hashed password with the provided password
              const match = await bcrypt.compare(password, result[0].password);
              console.log('Password Match:', match);
              if (match) {
                  // Store user ID in session
                  req.session.userId = result[0].id; // Adjust to match your user schema
                  req.session.lastActive = Date.now(); // Set the last active time
                  res.status(200).json({ message: 'Login successful' });
              } else {
                  res.status(401).json({ message: 'Invalid email or password' });
              }
          } else {
              res.status(401).json({ message: 'Invalid email or password' });
          }
      });
  } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ message: 'Server error' });
  }
});

// Logout Route
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.status(500).json({ message: 'Could not log out' });
      }
      res.status(200).json({ message: 'Logout successful' });
  });
});



app.put('/api/update-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!req.session.userId) {
    logger.warn('Unauthorized access attempt to update password.'); // Log warning for unauthorized access
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Fetch the user based on the session userId
  const sqlSelect = 'SELECT * FROM user WHERE id = ?';
  db.query(sqlSelect, [req.session.userId], async (err, result) => {
    if (err) {
      logger.error('Error fetching user for password update:', err); // Log the error
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.length === 0) {
      logger.warn('User not found for update password:', req.session.userId); // Log warning if user not found
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the old password with the hashed password in the database
    const match = await bcrypt.compare(oldPassword, result[0].password);
    if (!match) {
      logger.warn('Incorrect old password provided for user:', req.session.userId); // Log warning for incorrect password
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    // Hash the new password
    const saltRounds = 10;
    try {
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update the password in the database
      const sqlUpdate = 'UPDATE user SET password = ? WHERE id = ?';
      db.query(sqlUpdate, [hashedNewPassword, req.session.userId], (err, result) => {
        if (err) {
          logger.error('Error updating password for user:', req.session.userId, err); // Log the error
          return res.status(500).json({ message: 'Server error' });
        }
        logger.info('Password updated successfully for user:', req.session.userId); // Log successful update
        res.status(200).json({ message: 'Password updated successfully' });
      });
    } catch (error) {
      logger.error('Error hashing new password for user:', req.session.userId, error); // Log error during hashing
      return res.status(500).json({ message: 'Server error' });
    }
  });
});





app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
