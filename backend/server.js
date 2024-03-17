// Load environment variables
require("dotenv").config();
const validateEnv = require('./utils/envValidator'); // Import the environment variable validator
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require('./routes/apiRoutes'); // Added for API routes
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const axios = require('axios'); // Newly added for making HTTP requests
const jwt = require('jsonwebtoken'); // Required for JWT functionality

// Passport config
require('./config/passport')(passport);

// Validate environment variables as early as possible
validateEnv();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database connections
// Mongoose Events for detailed connection handling
mongoose.connection.on('connected', () => {
  console.log('Mongoose connection established.');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error: ' + err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected.');
});

// Attempt to connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .catch((err) => {
    // Catch initial connection errors
    console.error(`Initial mongoose connection error: ${err.message}`);
    process.exit(1);
  });

//mongoose
//  .connect(process.env.DATABASE_URL)
//  .then(() => {
//    console.log("Mongoose database connected successfully.");
//  })
//  .catch((err) => {
//    console.error(`Mongoose database connection error: ${err.message}`);
//    console.error(err.stack);
//    process.exit(1);
//  });

// Session configuration with connect-mongo
const sessionStore = MongoStore.create({
  mongoUrl: process.env.DATABASE_URL,
});
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,
    // Adding the error handler directly here for conciseness
    crypto: {
      secret: 'squirrel'
    }
  }).on('error', error => console.error('Session store error:', error)),
  cookie: {
    httpOnly: true,
    secure: false, // Remember to set this to true if you're using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Configuring CORS to allow credentials
// Parse allowed origins from environment variable
const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [];
// Configuring CORS with dynamic origin support
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || !allowedOrigins.length) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Logging session creation and destruction
app.use((req, res, next) => {
  const sess = req.session;
  // Make session available to all views
  res.locals.session = sess;
  if (!sess.views) {
    sess.views = 1;
    console.log("Session created at: ", new Date().toISOString());
  } else {
    sess.views++;
    console.log(
      `Session accessed again at: ${new Date().toISOString()}, Views: ${sess.views}, User ID: ${sess.userId || '(unauthenticated)'}`,
    );
  }
  next();
});

// Authentication Routes
app.use(authRoutes);

// Serve generated charts statically
app.use('/downloads', express.static('downloads'));

// API Routes - Added for handling API requests
app.use('/api', apiRoutes);

// API Root path response
app.get("/", (req, res) => {
  res.json({ message: "Chat_with_USA_Economy_Data API is operational" });
});

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  console.log('404 Not Found:', req.path);
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});