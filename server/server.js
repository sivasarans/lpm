require('dotenv').config();
require("./config/postgresql");
const pgsdb = require('./library/pgsdb');
const db = new pgsdb();
const cron = require('node-cron');
const express = require('express');
const app = express();
var multer = require('multer');
var upload = multer();
const path = require('path');
const cors = require('cors');
const moment = require('moment');
const ContactsImportQueue = require('./model/contactsImportQueue');
const PORT = process.env.PORT || 3700;
const fs = require('fs');


// Cross Origin Resource Sharing
app.use(cors());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

// for parsing multipart/form-data

const uploadFolders = ['uploads', 'uploads/users_profile', 'uploads/users_leave_attachments'];
uploadFolders.forEach(folder => {
  fs.mkdirSync(path.join(__dirname, folder), { recursive: true });
});
// routes
app.use('/api/v1/login', require('./routes/login'));
app.use('/api/v1/users', require('./routes/subAdmin'));
// app.use('/api/v1/x', require('./routes/x'));
// app.get("/hi", (req, res) => {
//   res.send("hello");
// });
app.use('/api/v1/contacts', require('./routes/contacts'));
app.use('/leave', require('./routes/leaveData'));

app.use('/login', require('./routes/login'));
app.use('/attandance', require('./routes/attandance'));
// app.use('/add_user', require('./routes/adduser'));
// app.use('/', require('./routes/leave_balance')); // Updated route path

// app.use('/holidays', require('./routes/holidays'));

// app.use('/leave-s', require('./routes/sample_test'));
app.use('/calender', require('./routes/calender'));
app.use('/permission', require('./routes/permission'));

app.use('/download-leave-requests', require('./routes/reports'));






app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('json')) {
    res.json({ "error": "404 Not Found" });
  } else {
    res.type('txt').send("404 Not Found");

  }
});

(async () => {
  const now = new Date();

  // Get hours, minutes, and seconds
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  
  await ContactsImportQueue.processImport();

  app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
  });
})();