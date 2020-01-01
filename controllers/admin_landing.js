const uuidv1 = require('uuid/v1');
const moment = require('moment');
// check auth ...................................................................

exports.check_authenticated = function (req, res, next) {
    if (req.session.admin) {
        next()
    } else {
        res.redirect('/admin/login');
    }
};

// employees .....................................................................

exports.show_employee = function (req, res, next) {
    const queryString = 'SELECT * FROM (SELECT employee_id, f_name, l_name, email FROM employee) AS t1 ' +
        'NATURAL JOIN (SELECT id, department_id, job_id, employee_id FROM works WHERE end_date IS NULL) AS t2 NATURAL JOIN department NATURAL JOIN job';
    req.getConnection((error, conn) => {
        conn.query(queryString, [], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                res.render('admin/employee', {employee: rows, admin: req.session.admin});
            }
        });
    });
};

exports.show_add_employee = function (req, res, next) {
    const message = req.query.error ? "Email already exists" : null;
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM department', [], (err, departments, fields) => {
            if (err) {
                res.json(err);
            } else {
                req.getConnection((error, conn) => {
                    conn.query('SELECT * FROM job', [], (err, jobs, fields) => {
                        if (err) {
                            res.json(err);
                        } else {
                            req.getConnection((error, conn) => {
                                conn.query('SELECT * FROM emp_status', [], (err, emp_status, fields) => {
                                    if (err) {
                                        res.json(err);
                                    } else {
                                        req.getConnection((error, conn) => {
                                            conn.query('SELECT * FROM paygrade', [], (err, paygrades, fields) => {
                                                if (err) {
                                                    res.json(err);
                                                } else {
                                                    res.render('admin/add_employee', {
                                                        formData: {starting_date: moment().format("YYYY-MM-DD")},
                                                        errors: {message},
                                                        departments,
                                                        jobs,
                                                        emp_status,
                                                        paygrades,
                                                        admin: req.session.admin
                                                    });
                                                }
                                            });
                                        });
                                    }
                                });
                            });
                        }
                    });
                });
            }
        });
    });
};

exports.add_employee = function (req, res, next) {
    const employee_id = uuidv1();
    const {
        NIC, f_name, l_name, email, birth_date, marital_stat, gender, street, city, state, tel_no_mobile,
        tel_no_home, paygrade_id, emp_stat_id, job_id, department_id, starting_date
    } = req.body;
    const params = [employee_id, NIC, f_name, l_name, email, street, city, state, birth_date, tel_no_mobile,
        tel_no_home, marital_stat, gender, 1, department_id, job_id, paygrade_id, emp_stat_id, starting_date];
    const queryString = 'SELECT email FROM employee WHERE email = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [email], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                if (rows.length) {
                    // Email already exists
                    res.redirect('/admin/employee/add?error=1')
                } else {
                    // call procedure to add employee
                    const procedure = 'CALL add_employee(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    req.getConnection((error, conn) => {
                        conn.query(procedure, params, (err, rows, fields) => {
                            if (err) {
                                res.json(err);
                            } else {
                                res.redirect('/admin');
                            }
                        });
                    });
                }
            }
        });
    });
};

exports.show_edit_employee = function (req, res, next) {
    const employee_id = req.params.employee_id;
    // const message = req.query.error ? "Email already exists" : null;
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM employee WHERE employee_id = ?', [employee_id], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                // res.json(moment(rows[0].birth_date).format("YYYY-MM-DD"))
                res.render('admin/edit_employee', {
                    formData: {...rows[0], birth_date: moment(rows[0].birth_date).format("YYYY-MM-DD")},
                    errors: {},
                    admin: req.session.admin
                });
            }
        });
    });
};

exports.edit_employee = function (req, res, next) {
    const employee_id = req.params.employee_id;
    const {
        NIC, f_name, l_name, email, birth_date, marital_stat, gender, street, city, state, tel_no_mobile, tel_no_home
    } = req.body;
    const params = [NIC, f_name, l_name, email, street, city, state, birth_date, tel_no_mobile, tel_no_home, marital_stat, gender, employee_id];
    const queryString = 'UPDATE employee SET NIC = ?, f_name = ?, l_name = ?, email = ?, street = ?, city = ?, state = ?, birth_date = ? , tel_no_mobile = ?, tel_no_home = ?, marital_stat = ?, gender = ? WHERE employee_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, params, (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.redirect('/admin/')
            }
        });
    });
};

exports.show_work_history = function (req, res, next) {
    const employee_id = req.params.employee_id;
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM works NATURAL JOIN job NATURAL JOIN department NATURAL JOIN paygrade NATURAL JOIN emp_status WHERE employee_id = ?', [employee_id], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                console.log(rows)
                res.render('admin/employee_work_history', {
                    employer: {employee_id},
                    rows,
                    admin: req.session.admin
                });
            }
        });
    });
};

exports.show_edit_work_history = function (req, res, next) {
    const employee_id = req.params.employee_id;
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM department', [], (err, departments, fields) => {
            if (err) {
                res.json(err);
            } else {
                req.getConnection((error, conn) => {
                    conn.query('SELECT * FROM job', [], (err, jobs, fields) => {
                        if (err) {
                            res.json(err);
                        } else {
                            req.getConnection((error, conn) => {
                                conn.query('SELECT * FROM emp_status', [], (err, emp_status, fields) => {
                                    if (err) {
                                        res.json(err);
                                    } else {
                                        req.getConnection((error, conn) => {
                                            conn.query('SELECT * FROM paygrade', [], (err, paygrades, fields) => {
                                                if (err) {
                                                    res.json(err);
                                                } else {
                                                    req.getConnection((error, conn) => {
                                                        conn.query('SELECT * FROM works WHERE employee_id = ? AND end_date IS NULL', [employee_id], (err, rows, fields) => {
                                                            if (err) {
                                                                res.json(err);
                                                            } else {
                                                                // res.json(rows)
                                                                res.render('admin/edit_employee_work_history', {
                                                                    formData: {
                                                                        ...rows[0],
                                                                        birth_date: moment().format("YYYY-MM-DD")
                                                                    },
                                                                    errors: {},
                                                                    departments,
                                                                    jobs,
                                                                    emp_status,
                                                                    paygrades,
                                                                    admin: req.session.admin
                                                                });
                                                            }
                                                        });
                                                    });
                                                }
                                            });
                                        });
                                    }
                                });
                            });
                        }
                    });
                });
            }
        });
    });
};

exports.edit_work_history = function (req, res, next) {
    const employee_id = req.params.employee_id;
    const {
        paygrade_id, emp_stat_id, job_id, department_id, starting_date
    } = req.body;
    const params = [employee_id, department_id, job_id, paygrade_id, emp_stat_id, starting_date];
    const procedure = 'CALL add_work(?, ?, ?, ?, ?, ?)';
    req.getConnection((error, conn) => {
        conn.query(procedure, params, (err, rows, fields) => {
            if (err) {
                res.json(err)
            } else {
                res.redirect('/admin/employee')
            }
        });
    });
};

exports.delete_employee_json = function (req, res, next) {
    const employee_id = req.params.employee_id;
    const queryString = 'UPDATE employee SET is_active = 0 WHERE employee_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [employee_id], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                res.send({msg: 'Success'});
            }
        });
    });
};

// admins .....................................................................
exports.show_admins = function (req, res, next) {
    const queryString = 'SELECT * FROM admin';
    req.getConnection((error, conn) => {
        conn.query(queryString, [], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                res.render('admin/admins', {admins: rows, admin: req.session.admin});
            }
        });
    });
};

exports.show_admin_register = function (req, res, next) {
    //  response is a HTTP web page
    res.render('admin/register', {formData: {}, errors: {}, admin: req.session.admin});
};

exports.admin_register = function (req, res, next) {
    const email = req.body.email;
    const pass = req.body.password;
    const confirmPass = req.body.confirmPassword;
    if (pass !== confirmPass) {
        res.render('admin/login', {formData: req.body, errors: {message: 'Password and confirm password mismatch'}});
    }
    const queryString = 'SELECT admin_register(?, ?) AS admin_register';
    req.getConnection((error, conn) => {
        conn.query(queryString, [email, pass], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                if (rows[0].admin_register === 0) {
                    message = 'Email already exists';
                    res.render('admin/register', {formData: {}, errors: {message}, admin: req.session.admin});
                } else {
                    res.redirect('/admin/admins');
                }
            }
        });
    });
}

exports.delete_admin_json = function (req, res, next) {
    const queryString = 'DELETE FROM admin WHERE admin.id = ?';
    const id = req.params.admin_id;
    req.getConnection((error, conn) => {
        conn.query(queryString, [id], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                res.send({msg: 'Success'});
            }
        });
    });
};

// departments .....................................................................

exports.show_departments = function (req, res, next) {
    const queryString = 'SELECT * FROM department';
    req.getConnection((error, conn) => {
        conn.query(queryString, [], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                res.render('admin/departments', {departments: rows, admin: req.session.admin});
            }
        });
    });
};

exports.show_add_departments = function (req, res, next) {
    //  response is a HTTP web page
    res.render('admin/add_department', {formData: {}, errors: {}});
};

exports.add_departments = function (req, res, next) {
    const department = req.body.department;
    const queryString = 'INSERT INTO department(department_id,department) VALUES (null,?)';
    req.getConnection((error, conn) => {
        conn.query(queryString, [department], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.redirect('/admin/departments')
            }
        });
    });
};

exports.show_edit_departments = function (req, res, next) {
    const department = req.params.department_id;
    const queryString = 'SELECT * FROM department WHERE department_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [department], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.render('admin/edit_department', {formData: rows[0], errors: {}, admin: req.session.admin})
            }
        });
    });
};

exports.edit_departments = function (req, res, next) {
    const department_id = req.params.department_id;
    const department = req.body.department;
    const queryString = 'UPDATE department SET department = ? WHERE department_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [department, department_id], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.redirect('/admin/departments')
            }
        });
    });
};

// jobs .....................................................................
exports.show_jobs = function (req, res, next) {
    const queryString = 'SELECT * FROM job';
    req.getConnection((error, conn) => {
        conn.query(queryString, [], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                res.render('admin/jobs', {jobs: rows, admin: req.session.admin});
            }
        });
    });
};

exports.show_add_jobs = function (req, res, next) {
    //  response is a HTTP web page
    res.render('admin/add_job', {formData: {}, errors: {}, admin: req.session.admin});
};

exports.add_jobs = function (req, res, next) {
    const title = req.body.title;
    const queryString = 'INSERT INTO job(job_id,title) VALUES (null,?)';
    req.getConnection((error, conn) => {
        conn.query(queryString, [title], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.redirect('/admin/jobs')
            }
        });
    });
};

exports.show_edit_jobs = function (req, res, next) {
    const job = req.params.job_id;
    const queryString = 'SELECT * FROM job WHERE job_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [job], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                console.log(rows)
                res.render('admin/edit_job', {formData: rows[0], errors: {}, admin: req.session.admin})
            }
        });
    });
};

exports.edit_jobs = function (req, res, next) {
    const job_id = req.params.job_id;
    const title = req.body.title;
    const queryString = 'UPDATE job SET title = ? WHERE job_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [title, job_id], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.redirect('/admin/jobs')
            }
        });
    });
};

// paygrades .....................................................................
exports.show_paygrades = function (req, res, next) {
    const queryString = 'SELECT * FROM paygrade';
    req.getConnection((error, conn) => {
        conn.query(queryString, [], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                res.render('admin/paygrades', {paygrades: rows, admin: req.session.admin});
            }
        });
    });
};

exports.show_add_paygrades = function (req, res, next) {
    //  response is a HTTP web page
    res.render('admin/add_paygrade', {formData: {}, errors: {}});
};

exports.add_paygrades = function (req, res, next) {
    const grade = req.body.grade;
    const queryString = 'CALL add_paygrade(?)';
    req.getConnection((error, conn) => {
        conn.query(queryString, [grade], (err, result, fields) => {
            if (err) {
                res.json(err)
            } else {
                res.redirect('/admin/paygrades')
            }
        });
    });
};

exports.show_edit_paygrades = function (req, res, next) {
    const grade = req.params.paygrade_id;
    const queryString = 'SELECT * FROM paygrade WHERE paygrade_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [grade], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                console.log(rows)
                res.render('admin/edit_paygrade', {formData: rows[0], errors: {}, admin: req.session.admin})
            }
        });
    });
};

exports.edit_paygrades = function (req, res, next) {
    const paygrade_id = req.params.paygrade_id;
    const grade = req.body.grade;
    const queryString = 'UPDATE paygrade SET grade = ? WHERE paygrade_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [grade, paygrade_id], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.redirect('/admin/paygrades')
            }
        });
    });
};

// emp stat .....................................................................
exports.show_empstatus = function (req, res, next) {
    const queryString = 'SELECT * FROM emp_status';
    req.getConnection((error, conn) => {
        conn.query(queryString, [], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                res.render('admin/emp_status', {empstatus: rows, admin: req.session.admin});
            }
        });
    });
};

exports.show_add_empstatus = function (req, res, next) {
    //  response is a HTTP web page
    res.render('admin/add_empstatus', {formData: {}, errors: {}, admin: req.session.admin});
};

exports.add_empstatus = function (req, res, next) {
    const status = req.body.status;
    const queryString = 'INSERT INTO emp_status(emp_stat_id,status) VALUES (null,?)';
    req.getConnection((error, conn) => {
        conn.query(queryString, [status], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.redirect('/admin/emp_status')
            }
        });
    });
};

exports.show_edit_empstatus = function (req, res, next) {
    const state = req.params.emp_stat_id;
    const queryString = 'SELECT * FROM emp_status WHERE emp_stat_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [state], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                console.log(rows)
                res.render('admin/edit_empstatus', {formData: rows[0], errors: {}, admin: req.session.admin})
            }
        });
    });
};

exports.edit_empstatus = function (req, res, next) {
    const emp_stat_id = req.params.emp_stat_id;
    const state = req.body.state;
    const queryString = 'UPDATE emp_status SET status = ? WHERE emp_stat_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [state, emp_stat_id], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.redirect('/admin/emp_status')
            }
        });
    });
};

// max_leaves ......................................................

exports.show_max_leaves = function (req, res, next) {
    const queryString = 'SELECT * from max_leaves NATURAL JOIN leave_type NATURAL JOIN paygrade';
    req.getConnection((error, conn) => {
        conn.query(queryString, [], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                // console.log(rows);
                res.render('admin/max_leaves', {max_leaves: rows, admin: req.session.admin});
            }
        });
    });
};

exports.show_add_max_leaves = function (req, res, next) {
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM paygrade', [], (err, paygrades, fields) => {
            if (err) {
                res.json(err);
            } else {
                req.getConnection((error, conn) => {
                    conn.query('SELECT * FROM leave_type', [], (err, leavetypes, fields) => {
                        if (err) {
                            res.json(err);
                        } else {
                            res.render('admin/add_max_leaves', {
                                formData: {},
                                errors: {},
                                paygrades,
                                leavetypes,
                                admin: req.session.admin
                            });
                        }
                    });
                });
            }
        });
    });
};

exports.add_max_leaves = function (req, res, next) {
    var paygrade_id = req.body.paygrade_id;
    var leave_type_id = req.body.leave_type_id;
    var count = req.body.count;
    var queryString = 'INSERT INTO max_leaves(count,leave_type_id,paygrade_id) VALUES (?,?,?)';
    req.getConnection((error, conn) => {
        conn.query(queryString, [count,leave_type_id,paygrade_id], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.redirect('/admin/max_leaves')
            }
        });
    });
};

// leave types ...........................................................

exports.show_leave_types = function (req, res, next) {
    const queryString = 'SELECT * FROM leave_type';
    req.getConnection((error, conn) => {
        conn.query(queryString, [], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                res.render('admin/leave_types', {leave_types: rows, admin: req.session.admin});
            }
        });
    });
};

exports.show_add_leave_types = function (req, res, next) {
    //  response is a HTTP web page
    res.render('admin/add_leave_types', {formData: {}, errors: {}, admin: req.session.admin});
};

exports.add_leave_types = function (req, res, next) {
    const type = req.body.type;
    const queryString = 'CALL add_leave_type(?)';
    req.getConnection((error, conn) => {
        conn.query(queryString, [type], (err, result, fields) => {
            if (err) {
                res.json(err)
            } else {
                res.redirect('/admin/leave_types')
            }
        });
    });
};

exports.show_edit_leave_types = function (req, res, next) {
    const type = req.params.leave_type_id;
    const queryString = 'SELECT * FROM leave_type WHERE leave_type_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [type], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                console.log(rows)
                res.render('admin/edit_leave_types', {formData: rows[0], errors: {}, admin: req.session.admin})
            }
        });
    });
};

exports.edit_leave_types = function (req, res, next) {
    const leave_type_id = req.params.leave_type_id;
    const type = req.body.type;
    const queryString = 'UPDATE leave_type SET type = ? WHERE leave_type_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [type, leave_type_id], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.redirect('/admin/leave_types')
            }
        });
    });
};

// custom attr .....................................................................
exports.show_custom_attr = function (req, res, next) {
    const queryString = 'SELECT * FROM custom_attributes';
    req.getConnection((error, conn) => {
        conn.query(queryString, [], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                res.render('admin/custom_attr', {custom_attr: rows, admin: req.session.admin});
            }
        });
    });
};

exports.show_add_custom_attr = function (req, res, next) {
    //  response is a HTTP web page
    res.render('admin/add_custom_attr', {formData: {}, errors: {}, admin: req.session.admin});
};

exports.add_custom_attr = function (req, res, next) {
    const {attribute} = req.body;
    const queryString = 'INSERT INTO custom_attributes(attr_id,attribute) VALUES (null,?)';
    req.getConnection((error, conn) => {
        conn.query(queryString, [attribute], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.redirect('/admin/custom_attr')
            }
        });
    });
};

exports.show_edit_custom_attr = function (req, res, next) {
    const attrId = req.params.attr_id;
    const queryString = 'SELECT * FROM custom_attributes WHERE attr_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [attrId], (err, rows, fields) => {
            if (err) {
                res.json(err)
            } else {
                res.render('admin/edit_custom_attr', {formData: rows[0], errors: {}, admin: req.session.admin})
            }
        });
    });
};

exports.edit_custom_attr = function (req, res, next) {
    const attr_id = req.params.attr_id;
    const attribute = req.body.attribute;
    const queryString = 'UPDATE custom_attributes SET attribute = ? WHERE attr_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [attribute, attr_id], (err, rows, fields) => {
            if (err) {
                res.json(err)
            } else {
                res.redirect('/admin/emp_status')
            }
        });
    });
};

// employee dependents .....................................

exports.show_dependents = function (req, res, next) {
    const employee_id = req.params.employee_id;
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM dependants WHERE employee_id = ?', [employee_id], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                console.log(rows)
                    res.render('admin/employee_dependents', {
                    employer: {employee_id},
                    rows,
                    admin: req.session.admin
                });
            }
        });
    });
};

exports.show_add_dependants = function (req, res, next) {
    //  response is a HTTP web page
    const employee_id = req.params.employee_id;
    res.render('admin/add_dependants', {formData: {},employer: {employee_id}, errors: {}, admin: req.session.admin});
};

exports.add_dependants = function (req, res, next) {
    const employee_id = req.params.employee_id;
    const f_name = req.body.f_name;
    const l_name = req.body.l_name;
    const relation = req.body.relation;
    const tel_no = req.body.tel_no;
    const birth_date = req.body.birth_date;
    const gender = req.body.gender;
    const queryString = 'INSERT INTO dependants (id,employee_id,f_name,l_name,relation,tel_no,birth_date,gender) VALUES (null,?,?,?,?,?,?,?)';
    req.getConnection((error, conn) => {
        conn.query(queryString, [employee_id,f_name,l_name,relation,tel_no,birth_date,gender], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.redirect("/admin/employee/" + employee_id + "/dependants")
            }
        });
    });
};

exports.show_edit_dependants = function (req, res, next) {
    const employee_id = req.params.employee_id;
    const queryString = 'SELECT * FROM dependants WHERE employee_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [employee_id], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                console.log(rows)
                res.render('admin/edit_dependants', {formData: rows[0],employer: {employee_id}, errors: {}, admin: req.session.admin})
            }
        });
    });
};

exports.edit_dependants = function (req, res, next) {
    const employee_id = req.params.employee_id;
    const f_name = req.body.f_name;
    const l_name = req.body.l_name;
    const relation = req.body.relation;
    const tel_no = req.body.tel_no;
    const birth_date = req.body.birth_date;
    const gender = req.body.gender;
    const queryString = 'UPDATE dependants SET f_name = ?, l_name = ?, relation = ?, tel_no = ?, birth_date = ?, gender = ? WHERE employee_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [f_name,l_name,relation,tel_no,birth_date,gender,employee_id], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.redirect("/admin/employee/" + employee_id + "/dependants")
            }
        });
    });
};

// emergency contacts...................................

exports.show_emergency_contacts = function (req, res, next) {
    const employee_id = req.params.employee_id;
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM emergency_contacts WHERE employee_id = ?', [employee_id], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                console.log(rows)
                res.render('admin/emergency_contacts', {
                    employer: {employee_id},
                    rows,
                    admin: req.session.admin
                });
            }
        });
    });
};

exports.show_add_emergency_contacts = function (req, res, next) {
    //  response is a HTTP web page
    const employee_id = req.params.employee_id;
    res.render('admin/add_emergency_contacts', {formData: {},employer: {employee_id}, errors: {}, admin: req.session.admin});
};

exports.add_emergency_contacts = function (req, res, next) {
    const employee_id = req.params.employee_id;
    const f_name = req.body.f_name;
    const l_name = req.body.l_name;
    const relation = req.body.relation;
    const tel_no = req.body.tel_no;
    const gender = req.body.gender;
    const street = req.body.street;
    const city = req.body.city;
    const state = req.body.state;
    const queryString = 'INSERT INTO emergency_contacts (id,employee_id,f_name,l_name,relation,tel_no,street,city,state,gender) VALUES (null,?,?,?,?,?,?,?,?,?)';
    req.getConnection((error, conn) => {
        conn.query(queryString, [employee_id,f_name,l_name,relation,tel_no,street,city,state,gender], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.redirect("/admin/employee/" + employee_id + "/emergency_contacts")
            }
        });
    });
};

exports.show_edit_emergency_contacts = function (req, res, next) {
    const employee_id = req.params.employee_id;
    const queryString = 'SELECT * FROM emergency_contacts WHERE employee_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [employee_id], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                console.log(rows)
                res.render('admin/edit_emergency_contacts', {formData: rows[0],employer: {employee_id}, errors: {}, admin: req.session.admin})
            }
        });
    });
};

exports.edit_emergency_contacts = function (req, res, next) {
    const employee_id = req.params.employee_id;
    const f_name = req.body.f_name;
    const l_name = req.body.l_name;
    const relation = req.body.relation;
    const tel_no = req.body.tel_no;
    const gender = req.body.gender;
    const street = req.body.street;
    const city = req.body.city;
    const state = req.body.state;
    const queryString = 'UPDATE emergency_contacts SET f_name = ?, l_name = ?, relation = ?, tel_no = ?, street = ?, city = ?, state = ?, gender = ? WHERE employee_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [f_name,l_name,relation,tel_no,street,city,state,gender,employee_id], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.redirect("/admin/employee/" + employee_id + "/emergency_contacts")
            }
        });
    });
};