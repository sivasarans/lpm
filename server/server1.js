require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

const pool = new Pool({
    user: process.env.LOCAL_POSTGRESQL_USER,
    host: process.env.LOCAL_POSTGRESQL_HOST,
    database: process.env.LOCAL_POSTGRESQL_DATABASE,
    password: process.env.LOCAL_POSTGRESQL_PASSWORD,
    port: process.env.LOCAL_POSTGRESQL_PORT
});

app.use(cors());
app.use(express.json());

// Insert Leave Application API
app.post('/apply-leave', async (req, res) => {
    try {
        const { user_id, user_name, leave_type, from_date, to_date, leave_days, reason, status, profile_picture, approved_by, approved_date } = req.body;

        const query = `INSERT INTO leave_applications 
            (user_id, user_name, leave_type, from_date, to_date, leave_days, reason, status, profile_picture, approved_by, approved_date) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`;

        const values = [user_id, user_name, leave_type, from_date, to_date, leave_days, reason, status || 'Pending', profile_picture, approved_by, approved_date];

        const result = await pool.query(query, values);

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
