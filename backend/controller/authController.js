const jwt = require('jsonwebtoken');
const User = require('../models/User');

// helper: generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

// @desc  Register new user
// @route POST /api/auth/register
// @access Public

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if(!name || !email || !password){
            return  res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if(userExists){
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create user
        const user = await User.create({
            name,
            email,
            password
        });
        
        if(user){
            res.status(201).json({
                message: 'User registered successfully',
                token: generateToken(user._id)
            });
        }
        else{
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
// @desc  Login user
// @route POST /api/auth/login
// @access Public

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if(user && (await user.matchPassword(password))){
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                message: 'Login successful',
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc  Get current logged in user
// @route GET /api/auth/profile
// @access Private

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if(user){
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                isPro: user.isPro
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc  Update user profile
// @route PUT /api/auth/profile
// @access Private

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if(user){
            user.name = req.body.name || user.name;
            user.avatar = req.body.avatar || user.avatar;

            await user.save();
            res.json({
                _id: user._id,
                name: user.name,
                avatar: user.avatar
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


