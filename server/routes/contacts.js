const express = require('express');
const router = express.Router();
const validator = require('../middleware/validator');
const ContactsController = require('../controllers/contacts/ContactsController');
const auth = require('../middleware/auth');
router.route('/type/:type')
    .get(auth.verifyToken,ContactsController.getAll)
    router.route('/').post(auth.verifyToken,validator.validate('create-contact'), ContactsController.create)
    // .put(CampaignController.update)
    // .delete(CampaignController.destroy);
router.route('/delete/:id').delete(auth.verifyToken,ContactsController.deleteContact);
router.route('/salutations/:id').get(auth.verifyToken,ContactsController.getUserSalutation);

router.route('/salutations/').post(auth.verifyToken,validator.validate('user-salutation'),ContactsController.saveUserSalutation);
router.route('/types/')
.post(auth.verifyToken,ContactsController.getAllByType);
router.route('/:id')
    .get(auth.verifyToken,ContactsController.getSingle)
    .put(auth.verifyToken,ContactsController.update);
router.route('/importContacts/').post(auth.verifyToken, ContactsController.importContacts);
router.route('/failedContacts/:id').get(auth.verifyToken, ContactsController.failedContacts);
router.route('/exportFailedContacts/:id').get(auth.verifyToken, ContactsController.exportFailedContacts);
router.route('/clearAll/:id').delete(auth.verifyToken, ContactsController.clearAll);

module.exports = router;