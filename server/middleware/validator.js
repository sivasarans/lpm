const { body } = require("express-validator");

exports.validate = (method) => {
  switch (method) {
    case "register": {
      return [
        body("name", "Name is required!").notEmpty().isLength({ max: 100 }),
        body("organization", "Organization is required!").notEmpty(),
        body("mobile", "Mobile is required!").notEmpty(),
        body("email", "Email is required!").notEmpty().isEmail().withMessage('Invalid email format'),
        body("password", "Password is required!").notEmpty()
      ];
    }
    case "create-subadmin": {
      return [
        body("name", "Name is required!").notEmpty().isLength({ max: 100 }),
        body("email_id", "Email is required!").notEmpty().isEmail().withMessage('Invalid email format'),
        body("mobile", "Mobile Number is required!").notEmpty().isNumeric().isLength({ max: 10 }),
        body("password", "Password is required!").notEmpty(),
        body("role_id", "Role ID is required!").notEmpty(),
        body("validityyn", "validityyn is required!").notEmpty().custom((value, { req }) => {
          // Check if 'recurring' is 'yes'
          if (value == 'Y') {
            // If not, 'frequency' is required
            if (!req.body.validtill) {
              throw new Error('Validity Date is required');
            }


          }

          return true; // Validation passes
        }),
      ];
    }
    case "create-campaign": {
      return [
        body("title", "Title is required!").notEmpty(),
        body("type", "Type is required!").notEmpty(),
        body("message", "Message is required!").notEmpty(),
        body("start_date", "Start Date is required!").notEmpty(),
        body("time", "Time is required!").notEmpty().isTime(),

        body("recurring", "Recurring is required!").notEmpty().custom((value, { req }) => {
          // Check if 'recurring' is 'yes'
          if (value == 'Y') {
            // If not, 'frequency' is required
            if (!req.body.frequency) {
              throw new Error('Frequency is required');
            }
            if (req.body.frequency == 'yearly') {
              if (!req.body.year_num) {
                throw new Error('Year is required');
              }
              if (!req.body.month_num) {
                throw new Error('Month is required');
              }
              if (!req.body.week_num) {
                throw new Error('Week is required');
              }
              if (!req.body.day_name && !req.body.day_num) {
                throw new Error('Day name or Day num is required');
              }

            }
            if (req.body.frequency == 'monthly') {

              if (!req.body.month_num) {
                throw new Error('Month is required');
              }
              if (!req.body.week_num) {
                throw new Error('Week is required');
              }
              if (!req.body.day_name && !req.body.day_num) {
                throw new Error('Day name or Day num is required');
              }

            }
            if (req.body.frequency == 'weekly') {
              if (!req.body.week_num) {
                throw new Error('Week is required');
              }
              if (!req.body.day_name && !req.body.day_num) {
                throw new Error('Day name or Day num is required');
              }

            }
          }

          return true; // Validation passes
        }),
      ];
    }

    case "login": {
      return [
        body("email", "Email is required!").notEmpty().isEmail().withMessage('Invalid email format'),
        body("password", "Password is required!").notEmpty()
      ];
    }
    case "change-password": {
      return [
      body("password", "Password is required!").notEmpty(),
        body("confirmPassword", "Confirm password is required!").notEmpty(),
        body("confirmPassword", "Passwords do not match!").custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Passwords do not match!');
          }
          return true;
        })];
    }
    case "create-contact": {
      return [
        body("name", "Name is required!").notEmpty().isLength({ max: 100 }),
        body("email1", "Email is required!").notEmpty().isEmail().withMessage('Invalid email format'),
        body("mobile1", "Mobile Number is required!").notEmpty().isNumeric().isLength({ max: 10 }),
        body("type", "Type is required!").notEmpty(),
        body("job_title", "Job Title is required!").notEmpty(),
        body("salutation", "Salutation is required!").notEmpty(),
        body("organization", "Organization is required!").notEmpty(),
      ];
    }
    case "user-salutation": {
      return [
        body("salutation", "Salutation is required!").notEmpty(),
        body("contact_id", "Contact is required!").notEmpty(),
      ];
    }
    case "mail-service": {
      return [
        body("username", "Username is required!").notEmpty(),
        body("password", "Password is required!").notEmpty(),
        body("service", "Service is required!").notEmpty(),
        body("host", "Host is required!").notEmpty(),
        body("port", "Port is required!").notEmpty(),
      ];
    }
  }
};
