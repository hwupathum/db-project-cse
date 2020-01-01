var express = require('express');
var router = express.Router();

let admin_landing = require('../controllers/admin_landing');
let admin_validations = require('../controllers/admin_validations');
let admin = require('../controllers/admin');

router.get('/login', admin.check_authenticated, admin.show_login);
router.post('/login', admin.check_authenticated, admin.login);
router.get('/logout', admin.logout);

// EMPLOYEES
router.get('/', admin_landing.check_authenticated, admin_landing.show_employee);
router.get('/employee', admin_landing.check_authenticated, admin_landing.show_employee);
router.get('/employee/add', admin_landing.check_authenticated, admin_landing.show_add_employee);
router.post('/employee/add', admin_landing.check_authenticated, admin_landing.add_employee);

// EMPLOYEE DETAILS
router.get('/employee/:employee_id/details', admin_landing.check_authenticated, admin_landing.show_edit_employee);
router.post('/employee/:employee_id/details', admin_landing.check_authenticated, admin_landing.edit_employee);

// EMPLOYEE WORK DETAILS
router.get('/employee/:employee_id/work-details', admin_landing.check_authenticated, admin_landing.show_work_history);
router.get('/employee/:employee_id/work-details/edit', admin_landing.check_authenticated, admin_landing.show_edit_work_history);
router.post('/employee/:employee_id/work-details/edit', admin_landing.check_authenticated, admin_landing.edit_work_history);

// EMPLOYEE DEPENDANTS
router.get('/employee/:employee_id/dependants', admin_landing.check_authenticated, admin_landing.show_dependents);
router.get('/employee/:employee_id/dependants/add', admin_landing.check_authenticated, admin_landing.show_add_dependants);
router.post('/employee/:employee_id/dependants/add', admin_landing.check_authenticated, admin_landing.add_dependants);
router.get('/employee/:employee_id/dependants/edit', admin_landing.check_authenticated, admin_landing.show_edit_dependants);
router.post('/employee/:employee_id/dependants/edit', admin_landing.check_authenticated, admin_landing.edit_dependants);

// EMERGENCY CONTACTS
router.get('/employee/:employee_id/emergency_contacts', admin_landing.check_authenticated, admin_landing.show_emergency_contacts);
router.get('/employee/:employee_id/emergency_contacts/add', admin_landing.check_authenticated, admin_landing.show_add_emergency_contacts);
router.post('/employee/:employee_id/emergency_contacts/add', admin_landing.check_authenticated, admin_landing.add_emergency_contacts);
router.get('/employee/:employee_id/emergency_contacts/edit', admin_landing.check_authenticated, admin_landing.show_edit_emergency_contacts);
router.post('/employee/:employee_id/emergency_contacts/edit', admin_landing.check_authenticated, admin_landing.edit_emergency_contacts);

router.post('/employee/:employee_id/delete-json', admin_landing.check_authenticated, admin_landing.delete_employee_json);

// ADMINS
router.get('/admins', admin_landing.check_authenticated, admin_landing.show_admins);
router.get('/admins/register', admin_landing.check_authenticated, admin_landing.show_admin_register);
router.post('/admins/:admin_id/delete-json', admin_landing.delete_admin_json);
router.post('/admins/register', admin_landing.check_authenticated, admin_validations.check_validation, admin_landing.admin_register);

// DEPARTMENTS
router.get('/departments', admin_landing.check_authenticated, admin_landing.show_departments);
router.get('/departments/add', admin_landing.check_authenticated, admin_landing.show_add_departments);
router.post('/departments/add', admin_landing.check_authenticated, admin_landing.add_departments);
router.get('/departments/edit/:department_id', admin_landing.check_authenticated, admin_landing.show_edit_departments);
router.post('/departments/edit/:department_id',admin_landing.check_authenticated,admin_landing.edit_departments);

// JOBS
router.get('/jobs',admin_landing.check_authenticated,admin_landing.show_jobs);
router.get('/jobs/add',admin_landing.check_authenticated,admin_landing.show_add_jobs);
router.post('/jobs/add',admin_landing.check_authenticated,admin_landing.add_jobs);
router.get('/jobs/edit/:job_id',admin_landing.check_authenticated,admin_landing.show_edit_jobs);
router.post('/jobs/edit/:job_id',admin_landing.check_authenticated,admin_landing.edit_jobs);

// PAYGRADES
router.get('/paygrades',admin_landing.check_authenticated,admin_landing.show_paygrades);
router.get('/paygrades/add',admin_landing.check_authenticated,admin_landing.show_add_paygrades);
router.post('/paygrades/add',admin_landing.check_authenticated,admin_landing.add_paygrades);
router.get('/paygrades/edit/:paygrade_id',admin_landing.check_authenticated,admin_landing.show_edit_paygrades);
router.post('/paygrades/edit/:paygrade_id',admin_landing.check_authenticated,admin_landing.edit_paygrades);

// EMPLOYEE STATUS
router.get('/emp_status',admin_landing.check_authenticated,admin_landing.show_empstatus);
router.get('/emp_status/add',admin_landing.check_authenticated,admin_landing.show_add_empstatus);
router.post('/emp_status/add',admin_landing.check_authenticated,admin_landing.add_empstatus);
router.get('/emp_status/edit/:emp_stat_id',admin_landing.check_authenticated,admin_landing.show_edit_empstatus);
router.post('/emp_status/edit/:emp_stat_id',admin_landing.check_authenticated,admin_landing.edit_empstatus);

// MAXIMUM LEAVES
router.get('/max_leaves', admin_landing.check_authenticated, admin_landing.show_max_leaves);
router.post('/max_leaves/edit/:leave_type_id/:paygrade_id', admin_landing.check_authenticated, admin_landing.edit_max_leaves);

// LEAVE TYPES
router.get('/leave_types', admin_landing.check_authenticated, admin_landing.show_leave_types);
router.get('/leave_types/add', admin_landing.check_authenticated, admin_landing.show_add_leave_types);
router.post('/leave_types/add', admin_landing.check_authenticated, admin_landing.add_leave_types);
router.get('/leave_types/edit/:leave_type_id', admin_landing.check_authenticated, admin_landing.show_edit_leave_types);
router.post('/leave_types/edit/:leave_type_id', admin_landing.check_authenticated, admin_landing.edit_leave_types);

// CUSTOM ATTRIBUTES
router.get('/custom_attr', admin_landing.check_authenticated, admin_landing.show_custom_attr);
router.get('/custom_attr/add', admin_landing.check_authenticated, admin_landing.show_add_custom_attr);
router.post('/custom_attr/add', admin_landing.check_authenticated, admin_landing.add_custom_attr);
router.get('/custom_attr/edit/:attr_id', admin_landing.check_authenticated, admin_landing.show_edit_custom_attr);
router.post('/custom_attr/edit/:attr_id', admin_landing.check_authenticated, admin_landing.edit_custom_attr);
module.exports = router;
