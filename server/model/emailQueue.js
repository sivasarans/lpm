const Queue = require('bull');
const REDIS_URL = 'redis://localhost:6379';
const nodemailer = require('nodemailer');
const getTransporter = require('../config/mail');

class EmailQueue {
    constructor() {
        this.queue = new Queue('email', REDIS_URL);

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

    async sendEmail(options, user_id = 0, camp_id = 0 , title = 0, customerId=0) {
        await this.queue.add({ user_id, camp_id, title, customerId, ...options }, this.jobOptions);
    }

    async processEmails() {
        this.queue.process(async (job) => {
            console.log('mail sent');
            try {
                const transporter = await getTransporter(job.data.user_id, job.data.camp_id, job.data.title, job.data.customerId);
                let status = 0;
              
                transporter.sendMail(job.data, async(error, info) => {

                    if (error) {
                        return;
                    }
                let status = 1;


                });

            } catch (error) {
               
                // throw error; // Re-throw the error to trigger the retry mechanism
            }           

        });
    }

   
}

module.exports = new EmailQueue();
