const moment = require('moment');
// check auth ...................................................................
exports.check_authenticated = function (req, res, next) {
    if (req.session.user) {
        next()
    } else {
        res.redirect('/login');
    }
};

exports.show_home = function (req, res, next) {
    const userId = req.session.userId;
    const queryString = 'SELECT * FROM (SELECT * FROM employee WHERE employee_id = ?) AS t1 ' +
        'NATURAL JOIN (SELECT id, department_id, job_id, employee_id FROM works WHERE employee_id = ? AND end_date IS NULL) AS t2 ' +
        'NATURAL JOIN department NATURAL JOIN job NATURAL JOIN emp_status NATURAL JOIN paygrade';
    req.getConnection((error, conn) => {
        conn.query(queryString, [userId, userId], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                //res.json(rows);
                res.render('user/user_data', {
                    employee: {userId},
                    rows,           
                    user: req.session.user});
            }
        });
    });
    //res.render('user/home', {title: 'Home', user: req.session.user})
};

exports.show_work_history = function (req, res, next) {
    const userId = req.session.userId;
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM works NATURAL JOIN job NATURAL JOIN department NATURAL JOIN paygrade NATURAL JOIN emp_status WHERE employee_id = ?', [userId], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                console.log(rows)
                res.render('user/work_history', {
                    employer: {userId}, 
                    rows,
                    user: req.session.user
                });
            }
        });
    });
};

exports.show_dependents = function(req, res, next) {
    const userId = req.session.userId;
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM dependants WHERE employee_id = ?', [userId], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                console.log(rows)
                res.render('user/dependents', {
                    employer: {userId},
                    rows,
                    user: req.session.user
                });
            }
        });
    });
};

exports.show_contacts = function(req, res, next) {
    const userId = req.session.userId;
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM emergency_contacts WHERE employee_id = ?', [userId], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                console.log(rows)
                res.render('user/emergency_concacts', {
                    employer: {userId},
                    rows,
                    user: req.session.user
                });
            }
        });
    });
};

exports.show_leaves = function(req, res, next) {
    const userId = req.session.userId;
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM leaves LEFT OUTER JOIN leave_type USING(leave_type_id) WHERE employee_id = ? AND is_approved=1', [userId], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                console.log(rows)
                res.render('user/leaves', {
                    employer: {userId},
                    rows,
                    user: req.session.user
                });
            }
        });
    });
};

exports.show_employees = function(req, res, next) {    
    const userId = req.session.userId;
    const queryString = 'SELECT * FROM (SELECT employee_id, f_name, l_name, email FROM employee) AS t1 ' +
        'NATURAL JOIN (SELECT id, department_id, job_id, employee_id FROM works WHERE end_date IS NULL) AS t2 NATURAL JOIN department NATURAL JOIN job';
    req.getConnection((error, conn) => {
        conn.query(queryString, [], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                console.log(rows)
                res.render('user/employee', {
                    employee: {userId},
                    rows, 
                    user: req.session.user
                });
            }
        });
    });
};

exports.show_add_supervisor = function(req, res, next) {
    const employeeId = req.params.employee_id;
    const queryString = 'SELECT * FROM (SELECT employee_id, f_name, l_name, email FROM employee) AS t1 ' +
        'NATURAL JOIN (SELECT id, department_id, job_id, employee_id FROM works WHERE end_date IS NULL) AS t2 NATURAL JOIN department NATURAL JOIN job';
    req.getConnection((error, conn) => {
        conn.query(queryString, [], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                console.log(rows)
                res.render('user/add_supervisor', {
                    employer: {employeeId},
                    rows,
                    user: req.session.user
                });
            }
        });
    });
};

// user details.............

exports.show_edit_details = function (req, res, next) {
    const employee_id = req.params.employee_id;
    // const message = req.query.error ? "Email already exists" : null;
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM employee WHERE employee_id = ?', [employee_id], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                // res.json(moment(rows[0].birth_date).format("YYYY-MM-DD"))
                res.render('user/edit_employee', {
                    formData: {...rows[0], birth_date: moment(rows[0].birth_date).format("YYYY-MM-DD")},
                    errors: {},
                    user: req.session.user
                });
            }
        });
    });
};

exports.edit_details = function (req, res, next) {
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
                res.redirect('/')
            }
        });
    });
};

// work history ...............

exports.show_user_work_history = function (req, res, next) {
    const employee_id = req.params.employee_id;
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM works NATURAL JOIN job NATURAL JOIN department NATURAL JOIN paygrade NATURAL JOIN emp_status WHERE employee_id = ?', [employee_id], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                console.log(rows)
                res.render('user/employee_work_history', {
                    employer: {employee_id},
                    rows,
                    user: req.session.user
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
                                                                res.render('user/edit_employee_work_history', {
                                                                    formData: {
                                                                        ...rows[0],
                                                                        birth_date: moment().format("YYYY-MM-DD")
                                                                    },
                                                                    errors: {},
                                                                    departments,
                                                                    jobs,
                                                                    emp_status,
                                                                    paygrades,
                                                                    user: req.session.user
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
                res.redirect('/employees')
            }
        });
    });
};