const PGSDB = require('../library/pgsdb'); 
const db = new PGSDB(); 

async function getUsers() {
    const query = 'SELECT userid, username, role_lpm FROM users';
    return await db.raw(query);
}

module.exports = { getUsers };
