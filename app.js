const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

// Create connection to MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ModuleSelectionSystem'
});

// Connect to MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as ID ' + connection.threadId);
});

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', './views');

// Route for the main page
app.get('/', (req, res) => {
    // Query the database to fetch module data
    const query = 'SELECT * FROM Modules';
    connection.query(query, (error, modules) => {
        if (error) {
            console.error('Error querying database: ' + error.stack);
            res.status(500).send('Error querying database');
            return;
        }
        // Render the view with fetched module data
        res.render('index', { modules });
    });
});

// Route for the login page
app.get('/login', (req, res) => {
    res.render('login');
});

// Route for handling login form submission
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if the provided email and password match any record in the student table
    const sql = 'SELECT * FROM Students WHERE Email = ? AND Password = ?';
    connection.query(sql, [email, password], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
        } else {
            if (results.length > 0) {
                // Login successful, redirect to the main page
                res.redirect('/');
            } else {
                // Invalid email or password, render an error message
                res.send('Invalid email or password'); // Modify this to render appropriate messages
            }
        }
    });
});

// Route for the registration page
app.get('/register', (req, res) => {
    res.render('register');
});

// Route for handling registration form submission
app.post('/register', (req, res) => {
    const { firstName, middleName, lastName, password, email, regNo, classID } = req.body;

    // Construct SQL INSERT statement for student registration
    const sql = `INSERT INTO Students (FirstName, MiddleName, LastName, Password, Email, RegNo) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    
    // Execute the INSERT statement to register the student
    connection.query(sql, [firstName, middleName, lastName, password, email, regNo, classID], (error, result) => {
        if (error) {
            console.error('Error registering student:', error);
            res.status(500).send('Error registering student');
        } else {
            console.log('Student registered successfully');
            res.redirect('/login'); // Redirect to login page after successful registration
        }
    });
});

// Route for the about us page
app.get('/about', (req, res) => {
    res.render('about');
});

// Route for the contacts page
app.get('/contacts', (req, res) => {
    res.render('contacts');
});

// Route to update the selected value in the database
app.post('/updateSelected', (req, res) => {
    const { moduleID, selected } = req.body;

    // Update the selected value in the database
    const query = 'UPDATE Modules SET Selected = ? WHERE ModuleID = ?';
    connection.query(query, [selected, moduleID], (error, result) => {
        if (error) {
            console.error('Error updating selected value:', error);
            res.status(500).send('Error updating selected value');
        } else {
            console.log('Selected value updated successfully');
            res.sendStatus(200);
        }
    });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
