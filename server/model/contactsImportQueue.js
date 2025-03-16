const Queue = require('bull');
const REDIS_URL = 'redis://localhost:6379';
const pgsdb = require('../library/pgsdb');

const db = new pgsdb();

class ContactsImportQueue {
    constructor() {
        this.queue = new Queue('contactsImport', REDIS_URL);

        // Set job options including retry strategy
        this.jobOptions = {
            attempts: 5, // Maximum number of attempts
            backoff: {
                type: 'exponential',
                delay: 5000 // Initial delay of 5 seconds
            }
        };

        this.queue.on('failed', (job, error) => {
            // Additional tracking logic (e.g., alerting or storing failure info) can be added here
        });

        this.queue.on('completed', (job, result) => {
        });

        this.queue.on('stalled', (job) => {
        });
    }

    async addImport(options) {
        await this.queue.add({ options }, this.jobOptions);
    }

    async processImport() {

        this.queue.process(async (job) => {

        const customerIdMatch = job.data.options.replace("temp_contacts_", "").split("_");
        const customerId = customerIdMatch ? customerIdMatch[0] : null;
        const schema  = `user_${customerId}`;
        const contactTable = `${schema}.contacts`;
        const contactsImportFailuresTable = `${schema}.contacts_import_failures`;
            try {
                const query = `
                WITH valid_records AS (
                    SELECT DISTINCT ON (email1, COALESCE(mobile1, '')) 
                        CASE
                            WHEN name IS NULL THEN '@' || email1
                            ELSE name
                        END AS name,
                        type, 
                        salutation, 
                        organization, 
                        job_title, 
                        mobile1, 
                        mobile2, 
                        mobile3, 
                        email1, 
                        email2, 
                        email3, 
                        sendmessages1, 
                        sendmessages2, 
                        sendmessages3, 
                        status, 
                        date_created, 
                        created_by
                    FROM 
                        ${job.data.options}
                ),
                inserted_records AS (
                    INSERT INTO ${contactTable} (
                        name, 
                        type, 
                        salutation, 
                        organization, 
                        job_title, 
                        mobile1, 
                        mobile2, 
                        mobile3, 
                        email1, 
                        email2, 
                        email3, 
                        sendmessages1, 
                        sendmessages2, 
                        sendmessages3, 
                        status, 
                        date_created, 
                        created_by
                    )
                    SELECT 
                        name, 
                        type, 
                        salutation, 
                        organization, 
                        job_title, 
                        mobile1, 
                        mobile2, 
                        mobile3, 
                        email1, 
                        email2, 
                        email3, 
                        sendmessages1, 
                        sendmessages2, 
                        sendmessages3, 
                        status, 
                        date_created, 
                        created_by
                    FROM 
                        valid_records
                    WHERE NOT EXISTS (
                        SELECT 1 FROM ${contactTable} 
                        WHERE 
                        (${contactTable}.email1 = valid_records.email1)
                        OR (valid_records.mobile1 IS NOT NULL AND valid_records.mobile1 <> '' AND ${contactTable}.mobile1 = valid_records.mobile1)
                    )
                    RETURNING ctid
                )
                INSERT INTO ${contactsImportFailuresTable} (
                    name, 
                    type, 
                    salutation, 
                    organization, 
                    job_title, 
                    mobile1, 
                    mobile2, 
                    mobile3, 
                    email1, 
                    email2, 
                    email3, 
                    sendmessages1, 
                    sendmessages2, 
                    sendmessages3, 
                    status, 
                    date_created, 
                    created_by,
                    validation_errors
                )
                SELECT 
                    name, 
                    type, 
                    salutation, 
                    organization, 
                    job_title, 
                    mobile1, 
                    mobile2, 
                    mobile3, 
                    email1, 
                    email2, 
                    email3, 
                    sendmessages1, 
                    sendmessages2, 
                    sendmessages3, 
                    status, 
                    date_created, 
                    created_by,
                    'Duplicate email1 or mobile1' AS validation_errors
                FROM 
                    valid_records
                WHERE EXISTS (
                    SELECT 1 FROM ${contactTable} 
                    WHERE 
                        ${contactTable}.email1 = valid_records.email1 
                        OR (valid_records.mobile1 IS NOT NULL AND valid_records.mobile1 <> '' AND ${contactTable}.mobile1 = valid_records.mobile1)
                )
            `;
            
            await db.raw(query);
            }
            catch (error) {
                // Consider re-throwing the error if needed
            }
        });
    }
    
}

module.exports = new ContactsImportQueue();
