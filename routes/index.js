var express = require('express');
var router = express.Router();

let landing = require('../controllers/landing')
let user = require('../controllers/user')

router.get('/login', user.show_login);
router.get('/signup', user.show_signup);
router.post('/login', user.login);
router.post('/signup', user.signup);
router.get('/logout', user.logout);
/* GET home page. */
router.get('/', landing.check_authenticated, landing.get_landing);
router.post('/', landing.check_authenticated, landing.submit_lead);
router.get('/leads', landing.check_authenticated, landing.show_leads);
router.get('/leads/:lead_id', landing.check_authenticated, landing.show_lead);
router.get('/leads/:lead_id/edit', landing.check_authenticated, landing.show_edit_lead);
router.post('/leads/:lead_id/edit', landing.check_authenticated, landing.edit_lead);
router.post('/leads/:lead_id/delete', landing.check_authenticated, landing.delete_lead);
router.post('/leads/:lead_id/delete-json', landing.check_authenticated, landing.delete_lead_json);
module.exports = router;
