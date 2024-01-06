const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');
const crypto = require('crypto');
const path = require('path');
const uploadRoutes = require('./routes/uploadRoutes');
const router = require('./routes/router');

const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

const corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(cookieParser());

const secretKey = crypto.randomBytes(64).toString('hex');

console.log("secret", secretKey);
app.use(cookieParser());

app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true if using HTTPS
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '/views/uploads')));
app.use('/views/user-images', express.static(path.join(__dirname, '/views/user-images')));

// MongoDB connection
const mongoURI = 'mongodb://127.0.0.1:27017/news-portal';
mongoose.set('strictQuery', false);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});


// Define your routes and other middleware here...
app.use('/api/upload', uploadRoutes);
app.use('/api', router);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
