const pgsdb = require('../../library/pgsdb');
const db = new pgsdb();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailQueue = require('../../model/emailQueue');
const { validationResult } = require("express-validator");
const randomstring = require('randomstring');
const multer = require('multer');
const path = require('path');
const DatabaseService = require('../../services/DatabaseService');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './logos/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Use UUID to generate a unique filename
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|svg/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
        return cb(null, true);
    }
    cb('Error: Images only!');
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // Limit file size to 2MB
});


const userRegister = async (req, res) => {

    // Handle file upload with multer
    // upload.single('logo')(req, res, async (err) => {
    // if (err) {
    //     return res.status(400).json({ 'response': 'Failed1', 'message': err.message });
    // }

    // Perform validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    

    // Auth Check
    if (req.body.adminUsername !== 'vbseenuvas@gmail.com' && req.body.adminUsername !== 'xvamtec@gmail.com') { // bypass

    // if (req.body.adminUsername != 'vbseenuvas@gmail.com') { //bypass
        return res.status(402).json({ 'response': 'Failed', 'message': 'Invalid Credential' });
    }
    const usersTable = `public.users`;
   
    let userData = await db.select(usersTable, '*', [`email ='${req.body.adminUsername}'`]);
    if (userData) {
        bcrypt.compare(req.body.adminPassword, userData.password, function (err, result) {
            if (result) {



            }
            else {
                return res.status(402).json({ 'response': 'Failed', 'message': 'Invalid Credential' });
            }
        });
    } else {
        console.log('User not found');
        return res.status(402).json({ 'response': 'Failed', 'message': 'Invalid Credential' });
    }

    // Hash password
    const saltRounds = 5;
    const hashed_password = await bcrypt.hash(req.body.password, saltRounds);

    // Generate client ID
    const date = new Date();
    const shortDate = date.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD format
    let trimmedStr = req.body.organization.replace(/\s+/g, '');
    const clientId = `${trimmedStr.toLowerCase()}${shortDate}`;

    // Prepare new client object
    const newClient = {
        client_id: clientId,
        name: req.body.name,
        organization: req.body.organization,
        email: req.body.email,
        mobile: req.body.mobile,
        password: hashed_password,
        db_name: `user_${clientId}`,
        schema: `user_${clientId}`,
        db_user: `user_${clientId}`,
        db_password: `user_${clientId}`,
        db_host: 'localhost',
        db_port: 5432,
        status: 1,
        number_of_users: req.body.numberOfUsers,
        logo: req.file ? req.file.filename : null, // Save the filename of the uploaded logo
    };
    try {

        let CheckUserExist = await db.select(usersTable, '*', [`username = '${newClient.username}'`, `email ='${newClient.email}'`, `mobile ='${newClient.mobile}'`], 'OR');
        if (CheckUserExist) {
            return res.status(402).json({ 'response': 'Failed', 'message': 'User Email/Mobile/Username Already Exists' });
        }

        // Check if user already exists
        let CheckClientExist = await db.select('public.clients', '*', [
            `name = '${newClient.name}'`,
            `email = '${newClient.email}'`,
            `mobile = '${newClient.mobile}'`
        ], 'OR');

        if (CheckClientExist) {
            return res.status(402).json({ 'response': 'Failed', 'message': 'Email/Mobile/Name Already Exists' });
        }

        // Insert new client into the database
        const results = await db.insert('clients', newClient);
        let databaseStatus = false;
        if (results) {
            databaseStatus = await DatabaseService.createClientDatabase(newClient);
        }

        if (databaseStatus) {
            const userTable = `public.users`;
            const newUser = {
                username: newClient.name,
                email: newClient.email,
                mobile: newClient.mobile,
                password: hashed_password,
                client_id: clientId,
                role: 'Admin',
                validityyn: 'N',
                validtill: null,
                active: 1,
                datecreated: new Date(),
            }

            await db.insert(userTable, newUser);
        }
        const data = { 'customerId': clientId };
        return res.status(200).json({ 'response': 'Success', 'message': 'Registration Successfully', 'data': data });

    } catch (error) {
        return res.status(500).json({ 'response': 'Failed', 'message': 'Registration Failed', error: error.message });
    }
    // });
}

// Generate OTP
const generateOTP = () => {
    return randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
};
// Send OTP via email
const sendOTP = async (req, res) => {
    const { email } = req.body;
    const usersTable = `public.users`;

    

    try {
        // Fetch user data based on email
        let userData = await db.select(usersTable, '*', [`email ='${email}'`]);
        if (userData.length <= 0) {
            return res.status(401).json({ 'response': 'Failed', 'message': 'User not found' });
        }
        const mailServiceTable = `user_${userData.client_id}.mail_services`;

        // Fetch mail service information
        const service = await db.select(mailServiceTable, '*', [`user_id = ${userData.userid}`]);
        if (!service || !service.email_verified_at) {
            return res.status(402).json({ 'response': 'Failed', 'message': 'Mail configuration failed' });
        }

        // Generate OTP
        const otp = generateOTP();

        // Create email options
        let mailOptions = {
            from: userData.email,
            to: email,
            subject: 'OTP for Login/Change Password',
            html: `Your OTP is ${otp}. It will expire in 15 minutes.`
        };

        // Send email and queue it
        let queue = await emailQueue.sendEmail(mailOptions, userData.userid, 0, 'Login OTP/Change Password', userData.client_id);

        // Create token
        const token = jwt.sign(
            { id: userData.userid, email: userData.email, role: userData.role, customerId: userData.client_id, otp: otp },
            process.env.TOKEN_KEY || 'ghstfdt',
            { expiresIn: '15m' }
        );

        return res.status(200).json({ 'response': 'Success', 'message': 'OTP sent successfully', 'tokenKey': token });

    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).json({ 'response': 'Error', 'message': 'An internal server error occurred' });
    }

};
// Verify OTP via email
const verifyOTP = async (req, res) => {
    const { email, token, otp } = req.body;
    const usersTable = `public.users`;

    let userData = await db.select(usersTable, '*', [`email ='${email}'`],'AND');
    if (!userData) {
        res.status(401).json({ 'response': 'Failed', 'message': 'User not found' });
    }
    jwt.verify(token, process.env.TOKEN_KEY || 'ghstfdt', (err, decoded) => {
        if (err) {
            return res.status(401).json({ 'response': 'Failed', 'message': 'Invalid token' });
        }

        console.log('Decoded:', decoded);
        console.log('Provided OTP:', otp);

        if (decoded.otp == otp) {
            const userRecord = {
                id: userData.userid,
                name: userData.username,
                email: userData.email,
                role: userData.role,
            };
            return res.status(200).json({ 'response': 'Success', 'message': 'Logged In Successfully', 'data': userRecord, 'AccessToken': token });
        } else {
            return res.status(401).json({ 'response': 'Failed', 'message': 'Invalid OTP' });
        }
    });
};

const userLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }

    const newUser = {
        email: req.body.email,
        password: req.body.password
    }
    const usersTable = `public.users`;
    let userData = await db.select(usersTable, '*', [`email ='${newUser.email}'`]);
    if (userData) {
        bcrypt.compare(req.body.password, userData.password, function (err, result) {
            if (result) {
                const userRecord = {
                    id: userData.userid,
                    name: userData.username,
                    email: userData.email,
                    role: userData.role,
                    role_lpm: userData.role_lpm,
                }
                const token = jwt.sign(
                    { id: userData.userid, email: userData.email, role: userData.role, customerId: userData.client_id },
                    process.env.TOKEN_KEY || 'ghstfdt',
                    // {
                    //     expiresIn: "2h",
                    // }
                );
                return res.status(200).json({ 'response': 'Success', 'message': 'Logged In Successfully', 'data': userRecord, 'AccessToken': token });
            }
            else {
                return res.status(402).json({ 'response': 'Failed', 'message': 'Invalid Credential' });
            }
        });
    }
    else {
        return res.status(402).json({ 'response': 'Failed', 'message': 'Invalid Credential' });
    }

}

const getUserProfile = async (req, res) => {
    const id = parseInt(req.params.id);
    if (id) {
        const getUserProfile = await db.select('users', '*', [`id = ${id}`]);
        if (getUserProfile) {
            return res.status(200).json({ 'response': 'Success', 'UserDetails': getUserProfile });
        }
        else {
            return res.status(400).json({ 'response': 'Failed', "message": 'Not found' });
        }
    }
    else {
        return res.status(400).json({ 'response': 'Failed', "message": 'Not found' });
    }
}

const generateLink = async (req, res) => {
    try {
        const email = req.body.email;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({ 'response': 'Error', "message": 'Email is required' });
        }

        // Check if user exists
        const getUserProfile = await db.select('users', '*', [`email ='${email}'`]);
        if (!getUserProfile || getUserProfile.length === 0) {
            return res.status(400).json({ 'response': 'Error', "message": 'User not found' });
        }

        // Check if reset token already exists for the user
        const userTokenDetail = await db.select('reset_tokens', '*', [`user_id ='${getUserProfile.userid}'`]);
        if (userTokenDetail.length > 0) {
            const expirationDate = new Date(userTokenDetail.expiration_date);
            const currentDate = new Date();
            if (expirationDate > currentDate) {
                return res.status(400).json({ 'response': 'Error', "message": 'Reset link already sent' });
            }
        }

        // Generate reset token
        const token = randomstring.generate({ length: 12 });
        const url = 'http://localhost/reset/' + token;

        // Insert or update reset token in the database
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 30);
        await db.insertOrUpdate('reset_tokens', {
            user_id: getUserProfile.userid,
            token: token,
            expiration_date: expirationDate.toISOString()
        });

        // Send email with reset link
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Password Reset Link',
            html: `Password Reset Link is <a href="${url}">${url}</a>. It will expire in 30 minutes.`
        };
        await emailQueue.sendEmail(mailOptions, getUserProfile.userid);

        return res.status(200).json({ 'response': 'Success', "message": 'Reset link sent successfully' });
    } catch (error) {
        console.error('Error in generateLink:', error);
        return res.status(500).json({ 'response': 'Error', "message": 'Something went wrong' });
    }
}


const changePassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        const { email, token, otp, password } = req.body;
        const usersTable = `public.users`;



        // Fetch user data
        let userData = await db.select(usersTable, '*', [`email ='${email}'`]);
        if (!userData) {
            return res.status(401).json({ 'response': 'Failed', 'message': 'User not found' });
        }



        // Verify token
        jwt.verify(token, process.env.TOKEN_KEY || 'ghstfdt', async (err, decoded) => {
            if (err) {
                return res.status(401).json({ 'response': 'Failed', 'message': 'Invalid token' });
            }

            // Check OTP and hash the new password
            if (decoded.otp == otp) {
                const saltRounds = 5;
                const hashed_password = await bcrypt.hash(password, saltRounds);

                // Update the password in the database
                await db.update(usersTable, { "password": `${hashed_password}` }, [`email ='${email}'`]);

                return res.status(200).json({ 'response': 'Success', 'message': 'Password updated successfully' });
            } else {
                return res.status(401).json({ 'response': 'Failed', 'message': 'Invalid OTP' });
            }
        });
    } catch (error) {
        console.error('Error in changePassword:', error);
        return res.status(500).json({ 'response': 'Failed', 'message': 'Internal server error' });
    }
};

const updateProfile = async (req, res) => {
    const id = parseInt(req.params.id);

    const User = await db.select('users', '*', [`id = ${id}`]);
    if (User) {
        if (req.body.name) {
            const updateUser = await db.update('users', {
                "name": req.body.name
            }, [`id = '${id}'`]);
            if (updateUser)
                return res.status(200).json({ 'response': 'Success', 'message': 'Profile Updated Successfully' });
        }

    }
    else {
        return res.status(400).json({ 'response': 'Failed', "message": 'Not found' });
    }
}

module.exports = {
    userLogin,
    getUserProfile,
    changePassword,
    updateProfile,
    sendOTP,
    verifyOTP,
    generateLink,
    userRegister
}