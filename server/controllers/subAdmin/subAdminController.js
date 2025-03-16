const pgsdb = require('../../library/pgsdb');
const db = new pgsdb();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const crypto = require('crypto');
const getTransporter = require('../../config/mail');


function encrypt(text, algorithm, secretKey) {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}
// Decryption function
function decrypt(encryptedText, algorithm, secretKey) {
    const [ivHex, encryptedHex] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedTextBuffer = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedTextBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
  const createSubAdmin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }



    const user = req.user;
    const userTable = `public.users`;
    const saltRounds = 5;
    const hashed_password = await bcrypt.hash(req.body.password, saltRounds);
    // check user limit
    let getLimit = await db.select('public.clients', '*', [`client_id = '${user.customerId}'`]);
    if (!getLimit) {
        return res.status(402).json({ 'response': 'Failed', 'message': 'Somthing went wrong' });
    }
    const limit = getLimit.number_of_users;
    let users = await db.selectCount(userTable,[`client_id = '${user.customerId}'`]);
    if (users.count >= limit) return res.status(402).json({ 'response': 'Failed', 'message': 'User limit reached' });


    const newSubAdmin = {
        username: req.body.name,
        email: req.body.email_id,
        mobile: req.body.mobile,
        password: hashed_password,
        role: req.body.role_id,
        validityyn: req.body.validityyn,
        validtill: req.body.validtill ? req.body.validtill : null,
        active: req.body.status,
        client_id:user.customerId,
        datecreated: new Date(),

    }

    let CheckUserExist = await db.select(userTable, '*', [`username = '${newSubAdmin.username}'`, `email ='${newSubAdmin.email}'`, `mobile ='${newSubAdmin.mobile}'`], 'OR');
    if (CheckUserExist) {
        return res.status(402).json({ 'response': 'Failed', 'message': 'Email/Mobile/Username Already Exists' });
    }
    else {
        let results = await db.insert(userTable, newSubAdmin);
       

        return res.status(200).json({ 'response': 'Success', 'User': results });
    }
}

const getAllSubAdmin = async (req, res) => {
    const user = req.user;
    const userTable = `public.users`;
    const getAllUsers = await db.selectAll(userTable, '*',[`client_id = '${user.customerId}'`],'AND');
    if (getAllUsers) {
        return res.status(200).json({ 'response': 'Success', 'UserDetails': getAllUsers });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}

const getSingleSubAdmin = async (req, res) => {
    const user = req.user;
    const userTable = `public.users`;
    const id = parseInt(req.params.id);
    const getSingleUser = await db.select(userTable, '*', [`userid = ${id}`,`client_id = '${user.customerId}'`],'AND');
    if (getSingleUser) {
        return res.status(200).json({ 'response': 'Success', 'UserDetails': getSingleUser });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}

const deleteSubAdmin = async (req, res) => {
    const id = parseInt(req.params.id);
    const user = req.user;
    const userTable = `public.users`;
    const getUser = await db.select(userTable, '*', [`userid = ${id}`,`client_id = '${user.customerId}'`],'AND');
    if (getUser) {
        try {
            const deleteUser = await db.delete(userTable, [`userid = '${id}'`]);
            if (deleteUser)
                return res.status(200).json({ 'response': 'Success', 'message': 'Record Deleted Successfully' });
        } catch (error) {
            return res.status(400).json({ 'response': 'Failed', "message": 'Could Not Delete This SubAdmin' });
        }
    }
    else {
        return res.status(400).json({ 'response': 'Failed', "message": 'Not found' });
    }
}

const updateSubAdmin = async (req, res) => {
    const id = parseInt(req.params.id);
    const saltRounds = 5;
    const user = req.user;
    const userTable = `public.users`;
    const User = await db.select(userTable, '*', [`userid = ${id}`,`client_id = '${user.customerId}'`],'AND');
    var UpdateArray = {};
    if (req.body.name)
        UpdateArray.username = req.body.name;
    if (req.body.email_id)
        UpdateArray.email = req.body.email_id;
    if (req.body.password) {
        const hashed_password = await bcrypt.hash(req.body.password, saltRounds);
        UpdateArray.password = hashed_password;
    }
    if (req.body.role_id) {
        UpdateArray.role = req.body.role_id;
    }
    if (req.body.mobile) {
        UpdateArray.mobile = req.body.mobile;
    }
    if (req.body.validityyn) {
        UpdateArray.validityyn = req.body.validityyn;
    }
    if (req.body.validtill) {
        UpdateArray.validtill = req.body.validtill;
    }
    UpdateArray.active = req.body.status;

    if (User) {
        const updateSubadmin = await db.update(userTable, UpdateArray, [`userid = '${id}'`]);
        if (updateSubadmin)
            return res.status(200).json({ 'response': 'Success', 'message': 'User Updated Successfully' });

    }
    else {
        return res.status(400).json({ 'response': 'Failed', "message": 'Not found' });
    }
}
const updateMailService = async (req, res) => {
    const user = req.user;
    let user_id = user.id;
    const mailServiceTable = `user_${user.customerId}.mail_services`;

    const algorithm = 'aes-256-cbc';
    const secretKey = '12345678901234567890123456789012';
    // Fetch salutations from the database
    const services = await db.select(mailServiceTable, '*', [`user_id = ${user_id}`]);
    // Prepare the update object
    const service = {
        service: encrypt(req.body.service,algorithm, secretKey),
        host: encrypt(req.body.host,algorithm, secretKey),
        username: encrypt(req.body.username,algorithm, secretKey),
        password: encrypt(req.body.password,algorithm, secretKey),
        port: encrypt(req.body.port,algorithm, secretKey),
        user_id: user_id,
        email_verified_at:null

    };

    // Add created_at if services do not exist
    if (!services) {
        service.created_at = new Date();
    }

    // Process the update or insert based on the existence of salutations
    try {
        if (services) {
            const updateResult = await db.update(mailServiceTable, service, [`user_id = ${user.id}`]);
            if (updateResult) {
                return res.status(200).json({ response: 'Success', message: 'Mail Updated Successfully' });
            }
        } else {
            const insertResult = await db.insert(mailServiceTable, service);
            if (insertResult) {
                return res.status(200).json({ response: 'Success', message: 'Mail Added Successfully' });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ response: 'Error', message: 'Internal Server Error' });
    }

    // If no update or insert occurred, return a 400 response
    return res.status(400).json({ response: 'Failed', message: 'Not found' });

}

const getMailService = async (req, res) => {
    const user = req.user;
    let user_id = user.id;
    const mailServiceTable = `user_${user.customerId}.mail_services`;

    const services = await db.select(mailServiceTable, '*', [`user_id = ${user_id}`]);
    if (services !== null) {
        const algorithm = 'aes-256-cbc';
        const secretKey = '12345678901234567890123456789012';
        // Prepare the update object
        const service = {
            service: decrypt(services.service,algorithm, secretKey),
            host: decrypt(services.host,algorithm, secretKey),
            username: decrypt(services.username,algorithm, secretKey),
            password: decrypt(services.password,algorithm, secretKey),  
            port: decrypt(services.port,algorithm, secretKey),
            user_id: user_id,
            mail_verified_at:services.email_verified_at

        };
       
        return res.status(200).json({ 'response': 'Success', 'service': service });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}
const verifyMailService = async(req, res) => {
    const user = req.user;
    const customerId = user.customerId;
    const mailServiceTable = `user_${user.customerId}.mail_services`;

    try {
        const transporter = await getTransporter(user.id, 0, 'Test Configuration', customerId);
        let mailOptions = {
            from: user.email, // sender address
            to: user.email, // list of receivers
            subject: 'Test Email', // Subject line
            text: 'Hello, this is a test email!' // plain text body
          };
        transporter.sendMail(mailOptions, async(error, info) => {

            if (error) {
                return res.status(400).json({ response: 'Failed', message: error.message });
            }

            if (info.rejected.length > 0) {
                return res.status(400).json({ response: 'Failed', message: 'Email failed to deliver' });
            }


            await db.update(mailServiceTable, {'email_verified_at':'NOW()'}, [`user_id = ${user.id}`]);

            return res.status(200).json({ response: 'Success', message: 'Email verified successfully' });
            
        });

    } catch (error) {
        return res.status(400).json({ response: 'Failed', message: 'Email failed to deliver' });
    }
}


const getAllLeaveApplications = async (req, res) => {
    const leaveApplicationsTable = `public.leave_applications_new`;
    try {
        console.log("Fetching leave applications...  server -> routes ->sample_test.js }");
        
        // Fetch multiple leave applications using selectAll
        const leaveApplications = await db.selectAll(leaveApplicationsTable, '*', []);

        return res.status(200).json({ response: 'Success', LeaveApplications: leaveApplications });
    } catch (err) {
        console.error('Error fetching leave applications:', err);
        return res.status(500).json({ response: 'Error', message: err.message });
    }
};

// router.get("/zzz", async (req, res) => {
//     const leaveApplicationsTable = `public.leave_applications_new`;
//     try {
//         console.log("Fetching leave applications...  server -> routes ->sample_test.js }");
        
//         // Fetch multiple leave applications using selectAll
//         const leaveApplications = await db.selectAll(leaveApplicationsTable, '*', []);

//         return res.status(200).json({ response: 'Success', LeaveApplications: leaveApplications });
//     } catch (err) {
//         console.error('Error fetching leave applications:', err);
//         return res.status(500).json({ response: 'Error', message: err.message });
//     }
// });



module.exports = {
    getAllLeaveApplications,
    createSubAdmin,
    getAllSubAdmin,
    getSingleSubAdmin,
    deleteSubAdmin,
    updateMailService,
    getMailService,
    updateSubAdmin,
    encrypt,
    decrypt,
    verifyMailService
}