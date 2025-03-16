const pgsdb = require('../../library/pgsdb');
const db = new pgsdb();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const contactsImportQueue = require('../../model/contactsImportQueue');
const Utils = require('../../services/Utils');
const json2csv = require('json2csv').parse; // for CSV export
const create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }

    const user = req.user;
    const contactTable = `user_${user.customerId}.contacts`;

    const newData = {
        name: req.body.name,
        type: req.body.type,
        salutation: req.body.salutation,
        organization: req.body.organization,
        job_title: req.body.job_title,
        mobile1: req.body.mobile1,
        mobile2: req.body.mobile2,
        mobile3: req.body.mobile3,
        email1: req.body.email1,
        email2: req.body.email2,
        email3: req.body.email3,
        status: req.body.status,
        date_created: new Date(),
        created_by: 1
    }

    let CheckUserExist = await db.select(contactTable, '*', [`name = '${newData.name}'`, `email1 ='${newData.email1}'`, `mobile1 ='${newData.mobile1}'`], 'OR');
    if (CheckUserExist) {
        return res.status(402).json({ 'response': 'Failed', 'message': 'Email/Mobile/Name Already Exists' });
    }
    else {
        let results = await db.insert(contactTable, newData);
        return res.status(200).json({ 'response': 'Success', 'contacts': results, 'message': 'Contact added successfully' });
    }
}

const getAll = async (req, res) => {
    const user = req.user;
    const contactTable = `user_${user.customerId}.contacts`;
    const type = req.params.type;
    let condition = [];
    if(type !=0 || type !='0') condition = [`type = '${type}'`];
    const contacts = await db.selectAll(contactTable, '*',condition);
    if (contacts) {
        return res.status(200).json({ 'response': 'Success', 'contacts': contacts });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}
const getAllByType = async (req, res) => {
    const type = req.body.type;
    const filter = req.body.filter;
    let condition = [];
    if (type && filter) {
        condition = [`type = '${type}' AND (LOWER(name) LIKE LOWER('%${filter}%') OR LOWER(organization) LIKE LOWER('%${filter}%') OR LOWER(email1) LIKE LOWER('%${filter}%') )`];
    } else if (type) {
        condition = [`type = '${type}'`];
    } else if (filter) {
        condition = [`(LOWER(name) LIKE LOWER('%${filter}%') OR LOWER(organization) LIKE LOWER('%${filter}%') OR LOWER(email1) LIKE LOWER('%${filter}%') )`];
    }
    const user = req.user;
    const contactTable = `user_${user.customerId}.contacts`;
    const contacts = await db.selectAll(contactTable, '*', condition);
    if (contacts) {
        return res.status(200).json({ 'response': 'Success', 'contacts': contacts });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}
const getSingle = async (req, res) => {
    const id = parseInt(req.params.id);
    const user = req.user;
    const contactTable = `user_${user.customerId}.contacts`;
    const getSingleContact = await db.select(contactTable, '*', [`id = ${id}`]);
    if (getSingleContact) {
        return res.status(200).json({ 'response': 'Success', 'contact': getSingleContact });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}

const update = async (req, res) => {
    const id = parseInt(req.params.id);
    const user = req.user;
    const contactTable = `user_${user.customerId}.contacts`;
    const User = await db.select(contactTable, '*', [`id = ${id}`]);

    var UpdateArray = {};
    if (req.body.status)
        UpdateArray.status = req.body.status;
    if (req.body.name)
        UpdateArray.name = req.body.name;
    if (req.body.type)
        UpdateArray.type = req.body.type;
    if (req.body.salutation)
        UpdateArray.salutation = req.body.salutation;
    if (req.body.organization)
        UpdateArray.organization = req.body.organization;
    if (req.body.job_title)
        UpdateArray.job_title = req.body.job_title;
    if (req.body.mobile1)
        UpdateArray.mobile1 = req.body.mobile1;
    if (req.body.mobile2)
        UpdateArray.mobile2 = req.body.mobile2;
    if (req.body.mobile3)
        UpdateArray.mobile3 = req.body.mobile3;
    if (req.body.email1)
        UpdateArray.email1 = req.body.email1;
    if (req.body.email2)
        UpdateArray.email2 = req.body.email2;
    if (req.body.email3)
        UpdateArray.email3 = req.body.email3;

    if (User) {
        const update = await db.update(contactTable, UpdateArray, [`id = '${id}'`]);
        if (update)
            return res.status(200).json({ 'response': 'Success', 'message': 'Contact Updated Successfully' });
    }
    else {
        return res.status(400).json({ 'response': 'Failed', "message": 'Not found' });
    }
}
const deleteContact = async (req, res) => {
    const id = parseInt(req.params.id);
    const user = req.user;
    const contactTable = `user_${user.customerId}.contacts`;
    const getUser = await db.select(contactTable, '*', [`id = ${id}`]);
    if (getUser) {
        try {
            const deleteUser = await db.delete(contactTable, [`id = '${id}'`]);
            if (deleteUser)
                return res.status(200).json({ 'response': 'Success', 'message': 'Record Deleted Successfully' });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ 'response': 'Failed', "message": 'Could Not Delete This Record' });
        }
    }
    else {
        return res.status(400).json({ 'response': 'Failed', "message": 'Not found' });
    }
}

const getUserSalutation = async (req, res) => {
    const user = req.user;
    const user_id =  user.role!='Admin' || parseInt(req.params.id)==0? user.id:parseInt(req.params.id);
    const role = user.role;
    const customerId = user.customerId;
    const salutations =  await db.listUserContactPairs(user_id,role,customerId);
    if (salutations) {
        return res.status(200).json({ 'response': 'Success', 'salutations': salutations });
    } else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}

const saveUserSalutation = async (req, res) => {
    const id = parseInt(req.body.contact_id);
    const user = req.user;
    let user_id = (user.role !='Admin')?user.id:req.body.user_id;

    const userSalutationTable = `user_${user.customerId}.user_salutation`;
    // Fetch salutations from the database
    const salutations = await db.select(userSalutationTable, '*', [`contact_id = ${id} AND user_id = ${user_id}`]);

    // Prepare the update object
    const updateData = {
        salutation: req.body.salutation,
        contact_id: req.body.contact_id,
        user_id: user_id,
        // updated_at: new Date()
    };

    // Add created_at if salutations do not exist
    if (!salutations) {
        // updateData.created_at = new Date();
    }

    // Process the update or insert based on the existence of salutations
    try {
        if (salutations) {
            const updateResult = await db.update(userSalutationTable, updateData, [`contact_id = ${id}`, `user_id = ${user.id}`]);
            if (updateResult) {
                return res.status(200).json({ response: 'Success', message: 'Salutation Updated Successfully' });
            }
        } else {
            const insertResult = await db.insert(userSalutationTable, updateData);
            if (insertResult) {
                return res.status(200).json({ response: 'Success', message: 'Salutation Added Successfully' });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ response: 'Error', message: 'Internal Server Error' });
    }

    // If no update or insert occurred, return a 400 response
    return res.status(400).json({ response: 'Failed', message: 'Not found' });


}

const importContacts = async (req, res) => {
    const user = req.user;
    const user_id = user.id;
    const contactsImportFailures = `user_${user.customerId}.contacts_import_failures`;
    const tempTableName = `temp_contacts_${user.customerId}_${user_id}`;

    const uploadDir = path.join(__dirname, '../../contacts');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
        }
    });
    const upload = multer({ storage: storage }).single('file');

    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ response: 'Failed', message: 'File upload failed' });
        }

        if (!req.file) {
            return res.status(400).json({ response: 'Failed', message: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const contacts = [];
        const failedContacts = [];
        let headerValidation = true;

        const expectedHeaders = ['name', 'type', 'salutation', 'organization', 'job_title', 'mobile1', 'mobile2', 'mobile3', 'email1', 'email2', 'email3', 'sendmessages1', 'sendmessages2', 'sendmessages3', 'status'];
        const columnRules = {
            name: { required: false, type: 'string' },
            type: { required: true, type: 'string' },
            salutation: { required: false, type: 'string' },
            organization: { required: false, type: 'string' },
            job_title: { required: false, type: 'string' },
            mobile1: { required: false, type: 'string', pattern: /^[0-9]{10}$/ },
            mobile2: { required: false, type: 'string', pattern: /^[0-9]{10}$/ },
            mobile3: { required: false, type: 'string', pattern: /^[0-9]{10}$/ },
            email1: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
            email2: { required: false, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
            email3: { required: false, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
            sendmessages1: { required: false, type: 'string' },
            sendmessages2: { required: false, type: 'string' },
            sendmessages3: { required: false, type: 'string' },
            status: { required: true, type: 'string' }
        };

        const validateHeaders = (headers) => {
            headers = headers.filter(header => header.trim() !== '');
            return expectedHeaders.length === headers.length && expectedHeaders.every((header, index) => header === headers[index]);
        };

        const parseCSV = () => {
            return new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('headers', (headers) => {
                        if (!validateHeaders(headers)) {
                            headerValidation = false;
                            failedContacts.push({
                                user_id,
                                validation_errors: 'Invalid headers in CSV file. Expected headers: ' + expectedHeaders.join(', '),
                                date_created: new Date()
                            });
                            resolve();
                        }
                    })
                    .on('data', (row) => {
                        const validationErrors = Utils.validateRow(row, columnRules);
                        if (validationErrors.length > 0) {
                            
                            failedContacts.push({
                                user_id,
                                ...row,
                                validation_errors: validationErrors.join('; '),
                                date_created: new Date()
                            });
                        } else {
                            let parts = row.email1.split('@');
                            row.name = row.name?row.name:parts[0];
                            contacts.push({
                                ...row,
                                date_created: new Date(),
                                created_by: user_id
                            });
                        }
                    })
                    .on('end', resolve)
                    .on('error', reject);
            });
        };

        try {
            await parseCSV();
            
            if(!headerValidation) return res.status(500).json({ response: 'Failed', message: `Invalid headers in CSV file. Expected headers: '` + expectedHeaders.join(', ') });
            if (failedContacts.length > 0) {
                const insertFailuresQuery = `
                    INSERT INTO ${contactsImportFailures} (created_by, name, type, salutation, organization, job_title, mobile1, mobile2, mobile3, email1, email2, email3, sendmessages1, sendmessages2, sendmessages3, status, validation_errors, date_created)
                    VALUES ${failedContacts.map(failedContact => `(
                        ${user_id}, '${failedContact.name}', '${failedContact.type}', '${failedContact.salutation}', '${failedContact.organization}',
                        '${failedContact.job_title}', '${failedContact.mobile1}', '${failedContact.mobile2}', '${failedContact.mobile3}',
                        '${failedContact.email1}', '${failedContact.email2}', '${failedContact.email3}', '${failedContact.sendmessages1}',
                        '${failedContact.sendmessages2}', '${failedContact.sendmessages3}', '${failedContact.status}',
                        '${failedContact.validation_errors}', '${failedContact.date_created.toISOString()}'
                    )`).join(', ')}
                `;
                await   db.raw(insertFailuresQuery);
            }

            if (contacts.length > 0) {
                const createTableQuery = `
                    CREATE TEMP TABLE ${tempTableName} (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(255),
                        type VARCHAR(255),
                        salutation VARCHAR(255),
                        organization VARCHAR(255),
                        job_title VARCHAR(255),
                        mobile1 VARCHAR(255),
                        mobile2 VARCHAR(255),
                        mobile3 VARCHAR(255),
                        email1 VARCHAR(255),
                        email2 VARCHAR(255),
                        email3 VARCHAR(255),
                        sendmessages1 VARCHAR(255),
                        sendmessages2 VARCHAR(255),
                        sendmessages3 VARCHAR(255),
                        status VARCHAR(255),
                        date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        created_by INT
                    )
                `;
                await db.raw(`DROP TABLE IF EXISTS ${tempTableName}`);
                await db.raw(createTableQuery);

                const insertContactsQuery = `
                    INSERT INTO ${tempTableName} (
                        name, type, salutation, organization, job_title, mobile1, mobile2, mobile3,
                        email1, email2, email3, sendmessages1, sendmessages2, sendmessages3, status, date_created, created_by
                    ) VALUES ${contacts.map(contact => `(
                        '${contact.name}', '${contact.type}', '${contact.salutation}', '${contact.organization}',
                        '${contact.job_title}', '${contact.mobile1}', '${contact.mobile2}', '${contact.mobile3}',
                        '${contact.email1}', '${contact.email2}', '${contact.email3}', '${contact.sendmessages1}',
                        '${contact.sendmessages2}', '${contact.sendmessages3}', '${contact.status}',
                        '${contact.date_created.toISOString()}', ${contact.created_by}
                    )`).join(', ')}
                `;
                await db.raw(insertContactsQuery);

                contactsImportQueue.addImport(tempTableName);
            }

            return res.status(200).json({ response: 'Success', message: 'Contacts import process started successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ response: 'Failed', message: 'Error importing contacts' });
        } finally {
            fs.unlink(filePath, (err) => {
                if (err) console.error('Failed to delete file:', err);
            });
        }
    });
};

const failedContacts = async(req, res) => {
    const user = req.user;
    const user_id =  user.role!='Admin' || parseInt(req.params.id)==0? user.id:parseInt(req.params.id);
    const orderBy = ['id DESC'];
    let condition = [`created_by = ${user_id}`];
    const contactsImportFailures = `user_${user.customerId}.contacts_import_failures`;

    const logs = await db.selectAll(contactsImportFailures, '*', condition, '', orderBy);
    if (logs) {
        return res.status(200).json({ 'response': 'Success', 'logs': logs });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}

const exportFailedContacts = async(req, res) => {
    const user = req.user;
    const user_id =  user.role!='Admin' || parseInt(req.params.id)==0? user.id:parseInt(req.params.id);
    const orderBy = ['id DESC'];
    let condition = [`created_by = ${user_id}`];
    const contactsImportFailures = `user_${user.customerId}.contacts_import_failures`;

    const logs = await db.selectAll(contactsImportFailures,`name, type, salutation, organization, job_title, mobile1, mobile2, mobile3, email1, email2, email3, sendmessages1, sendmessages2, sendmessages3, status,validation_errors`, condition, '', orderBy);
    if (logs && logs.length > 0) {
        const csv = json2csv(logs);
        res.header('Content-Type', 'text/csv');
        res.attachment('contactError.csv');
        res.send(csv);
    }
    else {
        return res.status(404).json({ 'response': 'Success', "message": 'Record Not found' });
    }
}

const clearAll = async(req, res) =>{
    const user = req.user;
    const user_id =  user.role!='Admin' || parseInt(req.params.id)==0? user.id:parseInt(req.params.id);
    let condition = [`created_by = ${user_id}`]; 
    const contactsImportFailures = `user_${user.customerId}.contacts_import_failures`;

    try {
        const deleteUser = await db.delete(contactsImportFailures, condition);
        if (deleteUser)
            return res.status(200).json({ 'response': 'Success', 'message': 'Record Deleted Successfully' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ 'response': 'Failed', "message": 'Could Not Delete This Record' });
    }
}

module.exports = {
    create,
    update,
    getAll,
    getAllByType,
    getSingle,
    deleteContact,
    getUserSalutation,
    saveUserSalutation,
    importContacts,
    failedContacts,
    exportFailedContacts,
    clearAll
}