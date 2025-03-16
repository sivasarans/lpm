const pgsdb = require("../library/pgsdb");
const db = new pgsdb();

class DatabaseService {

    static async createClientDatabase(clientDetails) {
        // const {
        //   db_name,
        //   db_user,
        //   db_password,
        //   db_host = 'localhost',
        //   db_port = 5432,
        // } = clientDetails;

        // Connect to PostgreSQL as admin
        // const adminClient = new Client({
        //   user: process.env.POSTGRES_ADMIN_USER,
        //   host: process.env.POSTGRES_ADMIN_HOST || 'localhost',
        //   password: process.env.POSTGRES_ADMIN_PASSWORD,
        //   port: process.env.POSTGRES_ADMIN_PORT || 5432,
        // });

        // const newDb = new Client({
        //     user: db_user,
        //     host: db_host,
        //     database: db_name,
        //     password: db_password,
        //     port: db_port,
        //   });
        try {
            const createSchemaQuery = `CREATE SCHEMA IF NOT EXISTS ${clientDetails.schema};`;
            await db.raw(createSchemaQuery);
            //   await adminClient.connect();
            console.log('Connected to PostgreSQL as admin.');

            // Create new user
            //   const createUserQuery = `CREATE USER ${db_user} WITH ENCRYPTED PASSWORD '${db_password}';`;
            //   await adminClient.query(createUserQuery);
            //   console.log(`User "${db_user}" created.`);

            // Create new database owned by the new user
            //   const createDatabaseQuery = `CREATE DATABASE ${db_name};`;
            //   await adminClient.query(createDatabaseQuery);
            //   console.log(`Database "${db_name}" created with owner "${db_user}".`);

            // Grant all privileges on the database to the client user
            //   const grantPrivilegesQuery = `GRANT ALL PRIVILEGES ON DATABASE ${db_name} TO ${db_user};`;
            //   await adminClient.query(grantPrivilegesQuery);
            //   console.log(`Privileges granted on "${db_name}" to "${db_user}".`);

            // Connect to the new database as the new user

            //   await newDb.connect();
            //   console.log(`Connected to database "${db_name}" as user "${db_user}".`);

            // CREATE TABLE IF NOT EXISTS ${clientDetails.schema}.users
        // (
        //     userid serial NOT NULL,
        //     username character varying(255) COLLATE pg_catalog."default",
        //     email character varying(255) COLLATE pg_catalog."default",
        //     mobile character varying(20) COLLATE pg_catalog."default",
        //     role character varying(20) COLLATE pg_catalog."default",
        //     validityyn character(1) COLLATE pg_catalog."default",
        //     validtill date,
        //     password character varying(255) COLLATE pg_catalog."default",
        //     active character(1) COLLATE pg_catalog."default",
        //     datecreated timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
        //     datemodified timestamp with time zone,
        //     datedeleted timestamp with time zone,
        //     createdby integer,
        //     updatedby integer,
        //     deletedby integer,
        //     email_verify_at timestamp without time zone,
        //     CONSTRAINT users_pkey PRIMARY KEY (userid)
        // );

            // Define schema setup queries
            const schemaQueries = `
        -- Create campaigns table
        CREATE TABLE IF NOT EXISTS ${clientDetails.schema}.campaigns (
          id BIGSERIAL PRIMARY KEY,
          title VARCHAR(255),
          type VARCHAR(255),
          remarks TEXT,
          message TEXT,
          start_date DATE,
          end_date DATE DEFAULT NULL,
          last_notify_date DATE,
          next_notify_date DATE,
          status INTEGER,
          frequency VARCHAR(100),
          year_num INTEGER,
          month_num BIGINT[],
          week_num BIGINT[],
          day_name VARCHAR(255)[],
          date_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          date_modified TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          last_trigger timestamp without time zone DEFAULT NULL,
          trigger_count INTEGER DEFAULT 0,
          date_deleted TIMESTAMPTZ,
          created_by BIGINT,
          updated_by BIGINT,
          deleted_by BIGINT,
          recurring VARCHAR(50) NOT NULL,
          time TIME,
          contact_type VARCHAR(100),
          contacts VARCHAR[],
          cc VARCHAR[],
          bcc VARCHAR[],
          subject VARCHAR(100),
          is_group SMALLINT,
          is_resume SMALLINT,
          day_num INTEGER
        );

        -- Create campaigns_import_failures table
        CREATE TABLE IF NOT EXISTS ${clientDetails.schema}.campaigns_import_failures (
          id SERIAL PRIMARY KEY,
          created_by BIGINT NOT NULL,
          title VARCHAR(255),
          type VARCHAR(255),
          remarks TEXT,
          message TEXT,
          start_date DATE,
          status INTEGER,
          frequency VARCHAR(100),
          year_num INTEGER,
          month_num BIGINT[],
          week_num BIGINT[],
          day_num BIGINT[],
          day_name VARCHAR(255)[],
          recurring VARCHAR(50) NOT NULL,
          contact_type VARCHAR(100),
          contacts VARCHAR[],
          cc VARCHAR[],
          bcc VARCHAR[],
          subject VARCHAR(100),
          is_group SMALLINT,
          validation_errors TEXT NOT NULL,
          date_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        -- Create campaignstatuslogs table
        CREATE TABLE IF NOT EXISTS ${clientDetails.schema}.campaignstatuslogs (
          logid SERIAL PRIMARY KEY,
          campaignid INTEGER,
          actiondate TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          actionstatus VARCHAR(20),
          comment TEXT
        );

        -- Create contacts table
        CREATE TABLE IF NOT EXISTS ${clientDetails.schema}.contacts (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255),
          type VARCHAR(50),
          salutation VARCHAR(255),
          organization VARCHAR(255),
          job_title VARCHAR(255),
          mobile1 VARCHAR(20),
          mobile2 VARCHAR(20),
          mobile3 VARCHAR(20),
          sendmessages1 CHAR(1),
          sendmessages2 CHAR(1),
          sendmessages3 CHAR(1),
          email1 VARCHAR(255),
          email2 VARCHAR(255),
          email3 VARCHAR(255),
          status CHAR(1),
          date_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          date_modified TIMESTAMPTZ,
          date_deleted TIMESTAMPTZ,
          created_by INTEGER,
          updated_by INTEGER,
          deleted_by INTEGER
        );

        -- Create contacts_import_failures table
        CREATE TABLE IF NOT EXISTS ${clientDetails.schema}.contacts_import_failures (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255),
          type VARCHAR(50),
          salutation VARCHAR(255),
          organization VARCHAR(255),
          job_title VARCHAR(255),
          mobile1 VARCHAR(20),
          mobile2 VARCHAR(20),
          mobile3 VARCHAR(20),
          sendmessages1 CHAR(1),
          sendmessages2 CHAR(1),
          sendmessages3 CHAR(1),
          email1 VARCHAR(255),
          email2 VARCHAR(255),
          email3 VARCHAR(255),
          status CHAR(1),
          date_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          date_modified TIMESTAMPTZ,
          date_deleted TIMESTAMPTZ,
          created_by INTEGER,
          updated_by INTEGER,
          deleted_by INTEGER,
          validation_errors TEXT
        );

        -- Create fileattachments table
        CREATE TABLE IF NOT EXISTS ${clientDetails.schema}.fileattachments (
          fileid SERIAL PRIMARY KEY,
          campaignid INTEGER,
          filename VARCHAR(255),
          filepath VARCHAR(255),
          datecreated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          datemodified TIMESTAMPTZ,
          datedeleted TIMESTAMPTZ,
          createdby INTEGER,
          modifiedby INTEGER,
          deletedby INTEGER
        );

        -- Create files table
        CREATE TABLE IF NOT EXISTS ${clientDetails.schema}.files (
          id BIGSERIAL PRIMARY KEY,
          filename VARCHAR(255),
          filepath VARCHAR(255),
          filetype VARCHAR(50),
          size BIGINT,
          datecreated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          datemodified TIMESTAMPTZ,
          datedeleted TIMESTAMPTZ,
          createdby INTEGER,
          modifiedby INTEGER,
          deletedby INTEGER
        );
        

        CREATE TABLE IF NOT EXISTS ${clientDetails.schema}.user_salutation
            (
                id serial NOT NULL,
                salutation character varying(100) COLLATE pg_catalog."default",
                contact_id bigint,
                user_id bigint,
                created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT user_salutation_pkey PRIMARY KEY (id),
                CONSTRAINT fk_contact_id FOREIGN KEY (contact_id) REFERENCES ${clientDetails.schema}.contacts(id) ON DELETE CASCADE,
                CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.users(userid) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS ${clientDetails.schema}.mail_services
            (
                id serial NOT NULL,
                user_id bigint,
                service text COLLATE pg_catalog."default",
                host text COLLATE pg_catalog."default",
                username text COLLATE pg_catalog."default",
                password text COLLATE pg_catalog."default",
                port text COLLATE pg_catalog."default",
                created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                email_verified_at timestamp without time zone,
                CONSTRAINT mail_services_pkey PRIMARY KEY (id)
            );
      `;

            // Execute schema setup
            await db.raw(schemaQueries);
            //   console.log(`Schema created successfully in database "${db_name}".`);

            // Close client connections
            //   await newDb.end();
            //   await adminClient.end();
            console.log('All database connections closed successfully.');

            return true;
        } catch (error) {
            console.error('Error creating database and schema:', error);

            // Attempt to drop created database and user in case of failure
            //   try {
            //     if (adminClient._connected) {
            //       await adminClient.query(`DROP DATABASE IF EXISTS ${db_name};`);
            //     //   await adminClient.query(`DROP USER IF EXISTS ${db_user};`);
            //       console.log(`Rolled back created database "${db_name}" and user "${db_user}".`);
            //     }
            //   } catch (rollbackError) {
            //     console.error('Error during rollback:', rollbackError);
            //   } finally {
            //     if (!adminClient._ending) {
            //       await adminClient.end();
            //       console.log('Admin database connection closed after error.');
            //     }
            //   }

            return false;
        }
    }
}

module.exports = DatabaseService;
