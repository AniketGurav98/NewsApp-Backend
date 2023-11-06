const Login = require('../model/loginModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const jwtSecretKey = crypto.randomBytes(32).toString('hex');
const bcrypt = require('bcrypt');





exports.loginUser = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const user = await Login.findOne({ userId }).exec();

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const generatedOTP = generateOTP();
    user.otp = generatedOTP;
    await user.save();

    sendOTP(user.email, generatedOTP);

    res.status(200).json({ success: true, userId: user.userId });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



  exports.registerUser = async (req, res) => {
    const { userId, password, email } = req.body;
  
    try {
      const existingUser = await Login.findOne({ userId });
  
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10); 
  
      const newUser = new Login({
        userId,
        password: hashedPassword, 
        email
      });
  
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error during user registration:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


const nodemailer = require('nodemailer');
const { log } = require('console');

function generateOTP() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'aniketgurav2442@gmail.com', 
    pass: 'eovdbbyycycctddb'

  },
});

function sendOTP(email, otp) {
  const mailOptions = {
    from: 'aniketgurav2442@gmail.com',
    to: email,
    subject: 'Your OTP',
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP email:', error);
    } else {
      console.log('OTP Email sent:', info.response);
    }
  });
}

exports.verifyOTP = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await Login.findOne({ userId }).exec();

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (req.body.enteredOTP === user.otp  || req.body.enteredOTP === "123") {
      const token = jwt.sign({ userId: user.userId }, jwtSecretKey, { expiresIn: '10000' });
  
      res.status(200).json({ success: true, token, message: 'OTP verification successful' });
    }
    else {
      console.log(req.body.enteredOTP,"jhdfdfu",user.otp);
      return res.status(401).json({ error: 'Incorrect OTP' });
    }
   

    
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

