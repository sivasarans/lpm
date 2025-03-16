const db = require("../config/postgresql")
//put proper name
class PGSDB {
  constructor() {
    this.db = db;
  }
  async raw(query,params=null){
    let result = (params)? await this.db.query(query,params):await this.db.query(query);
    return result;
  }
  async insert(tableName, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const columns = keys.join(', ');
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;
    const insert_data = await this.db.query(query, values)
    return insert_data[0];
  }

  async select(tableName, columns, conditions, link = null) {
    let query = `SELECT ${columns} FROM ${tableName}`;
    if (conditions && conditions.length > 0) {
      const whereClauses = conditions.join(` ${link} `);
      query += ` WHERE ${whereClauses}`;
    }
    let result = await this.db.oneOrNone(query);
    return result;
  }
  async selectAll(tableName, columns, conditions, link = null, orderBy = []) {
    let query = `SELECT ${columns} FROM ${tableName}`;
    if (conditions && conditions.length > 0) {
      const whereClauses = conditions.join(` ${link} `);
      query += ` WHERE ${whereClauses}`;
    }
    // Add order by clause if any
    if (orderBy.length > 0) {
      const orderByClauses = orderBy.map(order => {
        // Assuming order is in the form of ["column1 ASC", "column2 DESC"]
        const [column, direction] = order.split(' ');

        // Validate column and direction here
        if (!column || !direction || !['ASC', 'DESC'].includes(direction.toUpperCase())) {
          throw new Error("Invalid order by format");
        }

        return `${column} ${direction.toUpperCase()}`;
      }).join(', ');

      query += ` ORDER BY ${orderByClauses}`;
    }

    let result = await this.db.query(query);
    return result;
  }
  async update(tableName, data, conditions) {
    const setClause = Object.entries(data).map(([key, value]) => {
      if (Array.isArray(value)) {
        // If the value is an array, format it as an array literal
        return `${key} = ARRAY[${value.map(val => `'${val}'`).join(', ')}]`;
      } else if (value === null) {
        // Handle null values
        return `${key} = NULL`;
      }  else {
        // If the value is not an array, treat it as a scalar value
        return `${key} = '${value}'`;
      }
    }).join(', ');

    let query = `UPDATE ${tableName} SET ${setClause}`;
    if (conditions && conditions.length > 0) {
      const whereClauses = conditions.join(' AND ');
      query += ` WHERE ${whereClauses}`;
    }
    query += ` RETURNING *`;

    return await this.db.query(query);
  }


  async delete(tableName, conditions) {
    let query = `DELETE FROM ${tableName}`;
    if (conditions && conditions.length > 0) {
      const whereClauses = conditions.join(' AND ');
      query += ` WHERE ${whereClauses}`;
    }
    return await this.db.query(query)
  }

  async selectCount(tableName, conditions) {
    let query = `SELECT COUNT(*) FROM ${tableName}`;
    if (conditions && conditions.length > 0) {
      const whereClauses = conditions.join(' AND ');
      query += ` WHERE ${whereClauses}`;
    }
    let result = await this.db.oneOrNone(query);
    return result;
  }

  async selectJoin(tableName, columns, joinTables, joinConditions, conditions, orderCondition, limit, page) {
    let query = `SELECT ${columns} FROM ${tableName}`;

    if (joinTables && joinTables.length > 0 && joinConditions && joinConditions.length > 0) {
      for (let i = 0; i < joinTables.length; i++) {
        query += ` LEFT JOIN ${joinTables[i]} ON ${joinConditions[i]}`;
      }
    }

    if (conditions && conditions.length > 0) {
      const whereClauses = conditions.join(' AND ');
      query += ` WHERE ${whereClauses}`;
    }
    if (orderCondition && orderCondition.length > 0) {
      const orderClauses = orderCondition.join(', ');
      query += ` ORDER BY ${orderClauses}`;
    }
    if (limit) {
      query += ` LIMIT ${limit}`;
    }
    if (page) {
      const offset = (page - 1) * limit;
      query += ` OFFSET ${offset}`;
    }
    let result = await this.db.query(query);
    return result;
  }

  async listUserContactPairs(id,role,customerId) {
    const userTable = `public.users u`
    const contactTable = `user_${customerId}.contacts c`;
    const userSalutationTable = `user_${customerId}.user_salutation ucs`;
    let query = `
    SELECT  c.id,u.userid,u.username, c.name, c.email1,c.mobile1, c.organization,c.status, ucs.salutation
    FROM ${userTable}
    CROSS JOIN ${contactTable}
    LEFT JOIN ${userSalutationTable} ON u.userid = ucs.user_id AND c.id = ucs.contact_id where u.userid = ${id} AND u.client_id = '${customerId}'  ORDER BY u.username;
  `;
    try {
      const res = await this.db.query(query);
      return res;
    } catch (err) {
      console.error('Error executing query', err.stack);
      return [];
    }
  }

}
module.exports = PGSDB;

//check exit for update, duplicate