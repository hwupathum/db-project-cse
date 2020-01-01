var express = require('express');
var router = express.Router();

let user = require('../controllers/user');
let user_landing = require('../controllers/user_landing');

router.get('/login', user.check_authenticated, user.show_login);
router.get('/signup', user.check_authenticated, user.show_signup);
router.post('/login', user.check_authenticated, user.login);
router.post('/signup', user.check_authenticated, user.signup);
router.get('/logout', user.logout);

//  USER
router.get('/', user_landing.check_authenticated, user_landing.show_home);
router.get('/work-history', user_landing.check_authenticated, user_landing.show_work_history);
router.get('/dependents', user_landing.check_authenticated, user_landing.show_dependents);
router.get('/contacts', user_landing.check_authenticated, user_landing.show_contacts);
router.get('/leaves', user_landing.check_authenticated, user_landing.show_leaves);

router.get('/employee', user_landing.check_authenticated, user_landing.show_employees);
router.get('/employee/:employee_id/add_supervisor', user_landing.check_authenticated, user_landing.show_add_supervisor);

module.exports = router;
