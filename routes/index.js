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

// PERSONAL DETAILS
router.get('/employee/:employee_id/details', user_landing.check_authenticated, user_landing.show_edit_details);
router.post('/employee/:employee_id/details', user_landing.check_authenticated, user_landing.edit_details);
// router.post('/employee/:employee_id/dependants/add', admin_landing.check_authenticated, admin_landing.add_dependants);
// router.get('/employee/:employee_id/dependants/edit', admin_landing.check_authenticated, admin_landing.show_edit_dependants);
// router.post('/employee/:employee_id/dependants/edit', admin_landing.check_authenticated, admin_landing.edit_dependants);

// EMPLOYEE WORK DETAILS
router.get('/employee/:employee_id/work-details', user_landing.check_authenticated, user_landing.show_user_work_history);
router.get('/employee/:employee_id/work-details/edit', user_landing.check_authenticated, user_landing.show_edit_work_history);
router.post('/employee/:employee_id/work-details/edit', user_landing.check_authenticated, user_landing.edit_work_history);

module.exports = router;
