// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sudhanshu',
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Express middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Set EJS as the view engine

// Routes
// Render the login page
app.get('/login', (req, res) => {
  res.render('login'); // Assuming 'login.ejs' is in the 'views' directory
});

// Render the signup page
app.get('/signup', (req, res) => {
  res.render('signup'); // Assuming 'signup.ejs' is in the 'views' directory
});

// Serve the home page
app.get('/home.html', (req, res) => {
  res.sendFile(__dirname + '/home.html');
});
app.get('/home.html', (req, res) => {
  res.sendFile(__dirname + '/login.ejs');
});

app.get('/login.html', (req, res) => {
  res.sendFile(__dirname + '/loginpage.html');
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM Details WHERE email = ?';
  connection.query(sql, [email], (err, results) => {
    if (err) {
      console.error('MySQL query error: ' + err.stack);
      res.send('Error during login. Please try again.');
    } else {
      if (results.length > 0) {
        const hashedPassword = results[0].password;

        // Compare hashed password with user input using bcrypt
        bcrypt.compare(password, hashedPassword, (bcryptErr, bcryptResult) => {
          if (bcryptErr) {
            console.error('Bcrypt error: ' + bcryptErr);
            res.send('Error during login. Please try again.');
          } else {
            if (bcryptResult) {
              // Redirect to home.html after successful login
              res.redirect('/home.html');
            } else {
              res.send('Incorrect password. Please try again.');
            }
          }
        });
      } else {
        res.send('User not found. Please check your email.');
      }
    }
  });
});

// Handle signup form submission
app.post('/signup', (req, res) => {
  const { name, age, email, mobile, password } = req.body;

  // Hash the password using bcrypt
  bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
    if (hashErr) {
      console.error('Bcrypt hashing error: ' + hashErr);
      res.send('Error during signup. Please try again.');
    } else {
      const sql = 'INSERT INTO Details (Name, Age, Email, Mobile_no, Password) VALUES (?, ?, ?, ?, ?)';
      connection.query(sql, [name, age, email, mobile, hashedPassword], (err, result) => {
        if (err) {
          console.error('MySQL query error: ' + err.stack);
          res.send('Error during signup. Please try again.');
        } else {
          // Redirect to login page after successful signup
          res.redirect('/login');
        }
      });
    }
  });
});

app.get('/contactus', (req, res) => {
  res.render('contactus'); // Assuming 'contact.ejs' is in the 'views' directory
});

// Handle contact form submission
app.post('/submit_contact', (req, res) => {
  const { name, email, mobile, message } = req.body;

  // Insert contact form data into the database
  const sql = 'INSERT INTO Contact_us (Name, Email, Mobileno, Message) VALUES (?, ?, ?, ?)';
  connection.query(sql, [name, email, mobile, message], (err, result) => {
    if (err) {
      console.error('MySQL query error: ' + err.stack);
      res.send('Error submitting contact form. Please try again.');
    } else {
      res.send('Contact form submitted successfully.Some Contact you soon!!!');
    }
  });
});

// Default route - Redirect to the login page
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
