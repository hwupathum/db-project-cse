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
    const queryString = 'SELECT * FROM employee';
    req.getConnection((error, conn) => {
        conn.query(queryString, [], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                res.render('admin/employee', {employee: rows, user: req.session.admin});
            }
        });
    });
};

exports.show_add_employee = function (req, res, next) {
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
                                                        formData: {},
                                                        errors: {},
                                                        departments,
                                                        jobs,
                                                        emp_status,
                                                        paygrades,
                                                        user: req.session.admin
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
    res.json(req.body)
    // var department = req.body.department;
    // var queryString = 'INSERT INTO department(department_id,department) VALUES (null,?)';
    // req.getConnection((error, conn) => {
    //     conn.query(queryString, [department], (err, rows, fields) => {
    //         let message;
    //         if (err) {
    //             res.json(err)
    //         } else {
    //             res.redirect('/admin/departments')
    //         }
    //     });
    // });
};

// admins .....................................................................
exports.show_admins = function (req, res, next) {
    const queryString = 'SELECT * FROM admin';
    req.getConnection((error, conn) => {
        conn.query(queryString, [], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                res.render('admin/admins', {admins: rows, user: req.session.admin});
            }
        });
    });
};

exports.show_admin_register = function (req, res, next) {
    //  response is a HTTP web page
    console.log(req.session)
    res.render('admin/register', {formData: {}, errors: {}, user: req.session.admin});
};

exports.admin_register = function (req, res, next) {
    var email = req.body.email;
    var pass = req.body.password;
    var confirmPass = req.body.confirmPassword;
    if (pass !== confirmPass) {
        res.render('admin/login', {formData: req.body, errors: {message: 'Password and confirm password mismatch'}});
    }
    var queryString = 'SELECT admin_register(?, ?) AS admin_register';
    req.getConnection((error, conn) => {
        conn.query(queryString, [email, pass], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                if (rows[0].admin_register === 0) {
                    message = 'Email already exists';
                    res.render('admin/register', {formData: {}, errors: {message}, user: req.session.admin});
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
                res.render('admin/departments', {departments: rows, user: req.session.admin});
            }
        });
    });
};

exports.show_add_departments = function (req, res, next) {
    //  response is a HTTP web page
    res.render('admin/add_department', {formData: {}, errors: {}});
};

exports.add_departments = function (req, res, next) {
    var department = req.body.department;
    var queryString = 'INSERT INTO department(department_id,department) VALUES (null,?)';
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
    var department = req.params.department_id;
    var queryString = 'SELECT * FROM department WHERE department_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [department], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                console.log(rows)
                res.render('admin/edit_department', {formData: rows[0], errors: {}, user: req.session.admin})
            }
        });
    });
};

exports.edit_departments = function (req, res, next) {
    var department_id = req.params.department_id;
    var department = req.body.department;
    var queryString = 'UPDATE department SET department = ? WHERE department_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [department,department_id], (err, rows, fields) => {
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
                res.render('admin/jobs', {jobs: rows, user: req.session.admin});
            }
        });
    });
};

exports.show_add_jobs = function (req, res, next) {
    //  response is a HTTP web page
    res.render('admin/add_job', {formData: {}, errors: {}, user: req.session.admin});
};

exports.add_jobs = function (req, res, next) {
    var title = req.body.title;
    var queryString = 'INSERT INTO job(job_id,title) VALUES (null,?)';
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
    var job = req.params.job_id;
    var queryString = 'SELECT * FROM job WHERE job_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [job], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                console.log(rows)
                res.render('admin/edit_job', {formData: rows[0], errors: {}, user: req.session.admin})
            }
        });
    });
};

exports.edit_jobs = function (req, res, next) {
    var job_id = req.params.job_id;
    var title = req.body.title;
    var queryString = 'UPDATE job SET title = ? WHERE job_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [title,job_id], (err, rows, fields) => {
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
                res.render('admin/paygrades', {paygrades: rows, user: req.session.admin});
            }
        });
    });
};

exports.show_add_paygrades = function (req, res, next) {
    //  response is a HTTP web page
    res.render('admin/add_paygrade', {formData: {}, errors: {}});
};

exports.add_paygrades = function (req, res, next) {
    var grade = req.body.grade;
    var queryString = 'INSERT INTO paygrade(paygrade_id,grade) VALUES (null,?)';
    req.getConnection((error, conn) => {
        conn.query(queryString, [grade], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.redirect('/admin/paygrades')
            }
        });
    });
};

exports.show_edit_paygrades = function (req, res, next) {
    var grade = req.params.paygrade_id;
    var queryString = 'SELECT * FROM paygrade WHERE paygrade_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [grade], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                console.log(rows)
                res.render('admin/edit_paygrade', {formData: rows[0], errors: {}, user: req.session.admin})
            }
        });
    });
};

exports.edit_paygrades = function (req, res, next) {
    var paygrade_id = req.params.paygrade_id;
    var grade = req.body.grade;
    var queryString = 'UPDATE paygrade SET grade = ? WHERE paygrade_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [grade,paygrade_id], (err, rows, fields) => {
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
                res.render('admin/emp_status', {empstatus: rows, user: req.session.admin});
            }
        });
    });
};

exports.show_add_empstatus = function (req, res, next) {
    //  response is a HTTP web page
    res.render('admin/add_empstatus', {formData: {}, errors: {}, user: req.session.admin});
};

exports.add_empstatus = function (req, res, next) {
    var status = req.body.status;
    var queryString = 'INSERT INTO emp_status(emp_stat_id,status) VALUES (null,?)';
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
    var state = req.params.emp_stat_id;
    var queryString = 'SELECT * FROM emp_status WHERE emp_stat_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [state], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                console.log(rows)
                res.render('admin/edit_empstatus', {formData: rows[0], errors: {}, user: req.session.admin})
            }
        });
    });
};

exports.edit_empstatus = function (req, res, next) {
    var emp_stat_id = req.params.emp_stat_id;
    var state = req.body.state;
    var queryString = 'UPDATE emp_status SET status = ? WHERE emp_stat_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [state,emp_stat_id], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.redirect('/admin/emp_status')
            }
        });
    });
};