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

router.get('/employee', user_landing.check_authenticated, user.allow_hr, user_landing.show_employees);
router.get('/employee/:employee_id/add_supervisor', user_landing.check_authenticated, user.allow_hr, user_landing.show_add_supervisor);
router.post('/employee/:employee_id/add_supervisor', user_landing.check_authenticated, user.allow_hr, user_landing.add_edit_supervisor);

// PERSONAL DETAILS
router.get('/employee/:employee_id/details', user_landing.check_authenticated, user.allow_hr, user_landing.show_edit_details);
router.post('/employee/:employee_id/details', user_landing.check_authenticated, user.allow_hr, user_landing.edit_details);
// router.post('/employee/:employee_id/dependants/add', admin_landing.check_authenticated, admin_landing.add_dependants);
// router.get('/employee/:employee_id/dependants/edit', admin_landing.check_authenticated, admin_landing.show_edit_dependants);
// router.post('/employee/:employee_id/dependants/edit', admin_landing.check_authenticated, admin_landing.edit_dependants);

// EMPLOYEE WORK DETAILS
router.get('/employee/:employee_id/work-details', user_landing.check_authenticated, user.allow_hr, user_landing.show_user_work_history);
router.get('/employee/:employee_id/work-details/edit', user_landing.check_authenticated, user.allow_hr, user_landing.show_edit_work_history);
router.post('/employee/:employee_id/work-details/edit', user_landing.check_authenticated, user.allow_hr, user_landing.edit_work_history);

// EMPLOYEE DEPENDANTS
router.get('/employee/:employee_id/dependants', user_landing.check_authenticated, user.allow_hr, user_landing.show_user_dependants);
router.get('/employee/:employee_id/dependants/add', user_landing.check_authenticated, user.allow_hr, user_landing.show_add_dependants);
router.post('/employee/:employee_id/dependants/add', user_landing.check_authenticated, user.allow_hr, user_landing.add_dependants);
router.get('/employee/:employee_id/dependants/edit/:id', user_landing.check_authenticated, user.allow_hr, user_landing.show_edit_dependants);
router.post('/employee/:employee_id/dependants/edit/:id', user_landing.check_authenticated, user.allow_hr, user_landing.edit_dependants);

// EMERGENCY CONTACTS
router.get('/employee/:employee_id/emergency_contacts', user_landing.check_authenticated, user.allow_hr, user_landing.show_emergency_contacts);
router.get('/employee/:employee_id/emergency_contacts/add', user_landing.check_authenticated, user.allow_hr, user_landing.show_add_emergency_contacts);
router.post('/employee/:employee_id/emergency_contacts/add', user_landing.check_authenticated, user.allow_hr, user_landing.add_emergency_contacts);
router.get('/employee/:employee_id/emergency_contacts/edit/:id', user_landing.check_authenticated, user.allow_hr, user_landing.show_edit_emergency_contacts);
router.post('/employee/:employee_id/emergency_contacts/edit/:id', user_landing.check_authenticated, user.allow_hr, user_landing.edit_emergency_contacts);

// EMPLOYEE CUSTOM DETAILS
router.get('/employee/:employee_id/custom-details', user_landing.check_authenticated, user.allow_hr, user_landing.show_edit_has_attr);
router.post('/employee/:employee_id/custom-details/:id', user_landing.check_authenticated, user.allow_hr, user_landing.edit_has_attr);

// APPROVE LEAVES
router.get('/approve_leaves', user_landing.check_authenticated, user_landing.show_approve_leaves);
router.get('/employee/:id/approve', user_landing.check_authenticated, user_landing.approve_leave);
router.get('/employee/:id/reject', user_landing.check_authenticated, user_landing.reject_leave);

// APPLY LEAVE
router.get('/apply_leave', user_landing.check_authenticated, user_landing.show_apply_leaves);
router.post('/employee/:id/apply', user_landing.check_authenticated, user_landing.apply_leave);

// REPORTS
router.get('/reports/department/:department_id', user_landing.check_authenticated, user_landing.show_report_dept);
router.get('/reports/group', user_landing.check_authenticated, user_landing.show_report_group);
// router.get('/custom_attr/add', admin_landing.check_authenticated, admin_landing.show_add_custom_attr);

module.exports = router;
