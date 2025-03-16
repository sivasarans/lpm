const pgp = require('pg-promise')();
var data = {
  user: process.env.LOCAL_POSTGRESQL_USER_NAME || 'postgres',
  host: process.env.LOCAL_POSTGRESQL_HOST || 'localhost',
  database: process.env.LOCAL_POSTGRESQL_DATABASE || 'campaign_system',
  password: process.env.LOCAL_POSTGRESQL_PASSWORD || '',
  port: process.env.LOCAL_POSTGRESQL_PORT || 5432

}
const connection = data;
const db = pgp(connection);
async function checkDatabaseConnection() {
  try {
    // Attempt to connect to the database
    await db.connect();
    // Connection successful
    console.log('✅  Database connected.');
  } catch (error) {
    // Connection failed
    console.log(process.env.LOCAL_POSTGRESQL_PASSWORD);
    console.error('Database connection failed:', error);
  }
}
// Check the database connection
checkDatabaseConnection();

module.exports = db;

/*
const pgp = require('pg-promise')();
var data = {
  user: process.env.LOCAL_POSTGRESQL_USER_NAME || 'postgres',
  host: process.env.LOCAL_POSTGRESQL_HOST || 'localhost',
  database: process.env.LOCAL_POSTGRESQL_DATABASE || 'campaign_system',
  password: process.env.LOCAL_POSTGRESQL_PASSWORD || '',
  port: process.env.LOCAL_POSTGRESQL_PORT || 5432
}

const connection = data;
const db = pgp(connection);

async function checkDatabaseConnection() {
  try {
    const conn = await db.connect();
    console.log(`Connected to database: ${conn.client.database}`); // Log connected database
    conn.done(); // Release the connection

    // Fetch and list all tables in the database
    const tables = await db.any(`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
    `);
    // console.log('Tables in the database:', tables.map(t => t.tablename));

    // Fetch and log data from leave_applications_new table
    // const leaveData = await db.any('SELECT * FROM permissions');
    const leaveData = await db.any('SELECT * FROM leave_applications');

    // console.log('Data from leave_applications table:', JSON.stringify(leaveData, null, 2));
  } catch (error) {
    console.log(process.env.LOCAL_POSTGRESQL_PASSWORD);

    console.error('Database connection failed:', error);
  }
}

// Check the database connection
checkDatabaseConnection();

module.exports = db;
*/