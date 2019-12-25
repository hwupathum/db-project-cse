var express = require('express');
var router = express.Router();

let admin_landing = require('../controllers/admin_landing');
let admin_validations = require('../controllers/admin_validations');
let admin = require('../controllers/admin');

router.get('/login', admin.show_login);
router.post('/login', admin.login);
router.get('/logout', admin.logout);
/* GET home page. */
router.get('/', admin_landing.check_authenticated, admin_landing.get_landing);
// router.post('/', landing.check_authenticated, landing.submit_lead);
router.get('/admins', admin_landing.check_authenticated, admin_landing.show_admins);
router.get('/admins/register', admin_landing.check_authenticated, admin_landing.show_admin_register);
// router.get('/leads/:lead_id', landing.check_authenticated, landing.show_lead);
router.post('/admins/:admin_id/delete-json', admin_landing.delete_admin_json);
router.post('/admins/register', admin_landing.check_authenticated, admin_validations.check_validation, admin_landing.admin_register);

// DEPARTMENTS
router.get('/departments',admin_landing.check_authenticated,admin_landing.show_departments);
router.get('/departments/add',admin_landing.check_authenticated,admin_landing.show_add_departments);
router.post('/departments/add',admin_landing.check_authenticated,admin_landing.add_departments);
router.get('/departments/edit/:department_id',admin_landing.check_authenticated,admin_landing.show_edit_departments);
router.post('/departments/edit/:department_id',admin_landing.check_authenticated,admin_landing.edit_departments);

// JOBS
router.get('/jobs',admin_landing.check_authenticated,admin_landing.show_jobs);
router.get('/jobs/add',admin_landing.check_authenticated,admin_landing.show_add_jobs);
router.post('/jobs/add',admin_landing.check_authenticated,admin_landing.add_jobs);
router.get('/jobs/edit/:job_id',admin_landing.check_authenticated,admin_landing.show_edit_jobs);
router.post('/jobs/edit/:job_id',admin_landing.check_authenticated,admin_landing.edit_jobs);

// PAYGRADE
router.get('/paygrades',admin_landing.check_authenticated,admin_landing.show_paygrades);
router.get('/paygrades/add',admin_landing.check_authenticated,admin_landing.show_add_paygrades);
router.post('/paygrades/add',admin_landing.check_authenticated,admin_landing.add_paygrades);
router.get('/paygrades/edit/:paygrade_id',admin_landing.check_authenticated,admin_landing.show_edit_paygrades);
router.post('/paygrades/edit/:paygrade_id',admin_landing.check_authenticated,admin_landing.edit_paygrades);

// router.get('/leads/:lead_id/edit', landing.check_authenticated, landing.show_edit_lead);
// router.post('/leads/:lead_id/edit', landing.check_authenticated, landing.edit_lead);
// router.post('/leads/:lead_id/delete', landing.check_authenticated, landing.delete_lead);
module.exports = router;
