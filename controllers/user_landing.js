const moment = require('moment');
const uuidv1 = require('uuid/v1');
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
                const query = "SELECT * FROM has_attributes LEFT OUTER JOIN custom_attributes USING(attr_id) WHERE employee_id=?";
                req.getConnection((error, conn) => {
                    conn.query(query, [userId], (err, custom_attrs, fields) => {
                        if (err) {
                            res.json(err);
                        } else {
                            res.render('user/user_data', {
                                employee: {userId},
                                rows,
                                custom_attrs,
                                user: req.session.user
                            });
                        }
                    });
                });
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
    const queryString = 'SELECT * FROM leaves NATURAL JOIN leave_type WHERE employee_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [userId], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                req.getConnection((error, conn) => {
                    conn.query('SELECT * FROM leave_count NATURAL JOIN leave_type WHERE employee_id = ?', [userId], (err, countRows, fields) => {
                        if (err) {
                            res.json(err);
                        } else {
                            console.log(countRows)
                            res.render('user/leaves', {
                                employee: {userId},
                                countRows,
                                rows: rows.map(row => ({...row,from_date: moment(row.from_date).format("YYYY-MM-DD"),to_date: moment(row.to_date).format("YYYY-MM-DD")})),
                                user: req.session.user
                            });
                        }
                    });
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
    const queryString = 'SELECT * FROM (SELECT employee_id, f_name, l_name FROM employee WHERE employee_id <> ?) AS t1 ' +
        'NATURAL JOIN (SELECT id, department_id, job_id, employee_id FROM works WHERE end_date IS NULL) AS t2 NATURAL JOIN department NATURAL JOIN job';
    req.getConnection((error, conn) => {
        conn.query(queryString, [employeeId], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                console.log(employeeId)
                const query = 'SELECT superviser_id FROM supervises WHERE employee_id=?';
                req.getConnection((error, conn) => {
                    conn.query(query, [employeeId], (err, id, fields) => {
                        if (err) {
                            res.json(err);
                        } else {
                            console.log(id)
                            res.render('user/add_supervisor', {
                                employer: {employeeId},
                                rows,
                                id : id[0],
                                user: req.session.user
                            })
                        }
                    })
                })
            }
        });
    });
};

exports.add_edit_supervisor = function(req, res, next) {
    const supervisor = req.body.supervisor_id;
    req.getConnection((error, conn) => {
        conn.query('CALL add_supervisor(?,?)', [req.params.employee_id,supervisor], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.redirect('/employee')
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

// dependants ...............................

exports.show_user_dependants = function (req, res, next) {
    const employee_id = req.params.employee_id;
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM dependants WHERE employee_id = ?', [employee_id], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                console.log(rows)
                res.render('user/employee_dependants', {
                    employer: {employee_id},
                    rows: rows.map(row => ({...row,birth_date: moment(row.birth_date).format("YYYY-MM-DD")})),
                    user: req.session.user
                });
            }
        });
    });
};

exports.show_add_dependants = function (req, res, next) {
    //  response is a HTTP web page
    const employee_id = req.params.employee_id;
    res.render('user/add_dependants', {formData: {},employer: {employee_id}, errors: {}, user: req.session.user});
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
                res.redirect("/employee/" + employee_id + "/dependants")
            }
        });
    });
};
exports.show_edit_dependants = function (req, res, next) {
    const employee_id = req.params.employee_id;
    const id = req.params.id;
    const queryString = 'SELECT * FROM dependants WHERE employee_id = ? AND id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [employee_id,id], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                console.log(rows)
                res.render('user/edit_dependants', {formData: rows[0],employer: {employee_id},id : {id}, errors: {}, user: req.session.user})
            }
        });
    });
};

exports.edit_dependants = function (req, res, next) {
    const employee_id = req.params.employee_id;
    const id = req.params.id;
    const f_name = req.body.f_name;
    const l_name = req.body.l_name;
    const relation = req.body.relation;
    const tel_no = req.body.tel_no;
    const birth_date = req.body.birth_date;
    const gender = req.body.gender;
    const queryString = 'UPDATE dependants SET f_name = ?, l_name = ?, relation = ?, tel_no = ?, birth_date = ?, gender = ? WHERE employee_id = ? AND id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [f_name,l_name,relation,tel_no,birth_date,gender,employee_id,id], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.redirect("/employee/" + employee_id + "/dependants")
            }
        });
    });
};

// emergency contacts......................

exports.show_emergency_contacts = function (req, res, next) {
    const employee_id = req.params.employee_id;
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM emergency_contacts WHERE employee_id = ?', [employee_id], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                console.log(rows)
                res.render('user/emergency_contacts', {
                    employer: {employee_id},
                    rows,
                    user: req.session.user
                });
            }
        });
    });
};

exports.show_add_emergency_contacts = function (req, res, next) {
    //  response is a HTTP web page
    const employee_id = req.params.employee_id;
    res.render('user/add_emergency_contacts', {formData: {},employer: {employee_id}, errors: {}, user: req.session.user});
};

exports.add_emergency_contacts = function (req, res, next) {
    const employee_id = req.params.employee_id;
    const {f_name, l_name, relation, tel_no, gender, street, city, state} = req.body;
    const queryString = 'INSERT INTO emergency_contacts (id,employee_id,f_name,l_name,relation,tel_no,street,city,state,gender) VALUES (null,?,?,?,?,?,?,?,?,?)';
    req.getConnection((error, conn) => {
        conn.query(queryString, [employee_id,f_name,l_name,relation,tel_no,street,city,state,gender], (err, rows, fields) => {
            let message;
            if (err) {
                res.json(err)
            } else {
                res.redirect("/employee/" + employee_id + "/emergency_contacts")
            }
        });
    });
};

exports.show_edit_emergency_contacts = function (req, res, next) {
    const employee_id = req.params.employee_id;
    const id = req.params.id;
    const queryString = 'SELECT * FROM emergency_contacts WHERE employee_id = ? AND id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [employee_id,id], (err, rows, fields) => {
            if (err) {
                res.json(err)
            } else {
                console.log(rows)
                res.render('user/edit_emergency_contacts', {formData: rows[0],employer: {employee_id},id: {id}, errors: {}, user: req.session.user})
            }
        });
    });
};

exports.edit_emergency_contacts = function (req, res, next) {
    const employee_id = req.params.employee_id;
    const id = req.params.id;
    const {f_name, l_name, relation, tel_no, gender, street, city, state} = req.body;
    const queryString = 'UPDATE emergency_contacts SET f_name = ?, l_name = ?, relation = ?, tel_no = ?, street = ?, city = ?, state = ?, gender = ? WHERE employee_id = ? AND id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [f_name,l_name,relation,tel_no,street,city,state,gender,employee_id,id], (err, rows, fields) => {
            if (err) {
                res.json(err)
            } else {
                res.redirect("/employee/" + employee_id + "/emergency_contacts")
            }
        });
    });
};

// other details .................

exports.show_edit_has_attr = function (req, res, next) {
    const employee_id = req.params.employee_id;
    const queryString = 'SELECT * FROM has_attributes NATURAL JOIN custom_attributes WHERE employee_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [employee_id], (err, rows, fields) => {
            if (err) {
                res.json(err)
            } else {
                res.render('user/edit_custom_attributes', {
                    rows,
                    employer: {employee_id},
                    errors: {},
                    user: req.session.user
                })
            }
        });
    });
};

exports.edit_has_attr = function (req, res, next) {
    const {employee_id, id} = req.params;
    const value = req.body.value;
    const queryString = 'UPDATE has_attributes SET value = ? WHERE employee_id = ? AND attr_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [value, employee_id, id], (err, rows, fields) => {
            if (err) {
                res.json(err)
            } else {
                res.redirect('/employee/' + employee_id + '/custom-details')
            }
        });
    });
};


// aprove leaves ...............

exports.show_approve_leaves = function(req, res, next) {
    const userId = req.session.userId;
    const queryString = 'SELECT * FROM leaves NATURAL JOIN supervises NATURAL JOIN employee NATURAL JOIN leave_type WHERE superviser_id = ? AND is_approved is null';
    req.getConnection((error, conn) => {
        conn.query(queryString, [userId], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                console.log(rows)
                res.render('user/approve_leaves', {
                    employee: {userId},
                    rows: rows.map(row => ({...row,from_date: moment(row.from_date).format("YYYY-MM-DD"),to_date: moment(row.to_date).format("YYYY-MM-DD")})),
                    user: req.session.user
                });
            }
        });
    });
};

exports.approve_leave = function (req, res, next) {
    const id = req.params.id;
    const queryString = 'UPDATE leaves SET is_approved = 1 WHERE id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [id], (err, rows, fields) => {
            if (err) {
                res.json(err)
            } else {
                res.redirect("/approve_leaves")
            }
        });
    });
};

exports.reject_leave = function (req, res, next) {
    const id = req.params.id;
    const queryString = 'UPDATE leaves SET is_approved = 0 WHERE id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [id], (err, rows, fields) => {
            if (err) {
                res.json(err)
            } else {
                res.redirect("/approve_leaves")
            }
        });
    });
};

// apply leave .......................

exports.show_apply_leaves = function(req, res, next) {
    const userId = req.session.userId;
    const queryString = 'SELECT * FROM leave_type';
    req.getConnection((error, conn) => {
        conn.query(queryString, [userId], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                console.log(rows)
                res.render('user/apply_leave', {
                    formData : {},
                    errors: req.query.error ? 'Leave Limit Exceeded' : null,
                    employee: {userId},
                    rows: rows.map(row => ({...row,from_date: moment(row.from_date).format("YYYY-MM-DD"),to_date: moment(row.to_date).format("YYYY-MM-DD")})),
                    user: req.session.user
                });
            }
        });
    });
};

exports.apply_leave = function (req, res, next) {
    const id = req.params.id;
    const {leave_type_id, reason, from_date, to_date} = req.body;
    const queryString = 'SELECT add_leave(?,?,?,?,?,?,?) AS add_leave';
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM leave_count WHERE employee_id = ? AND leave_type_id = ?', [req.session.userId,leave_type_id], (err, rows, fields) => {
            if (err) {
                res.json(err)
            } else {
                if(rows[0].max > rows[0].count) {
                    const queryString = 'INSERT INTO leaves (`id`, `employee_id`,`leave_type_id`, `from_date`, `to_date`, `reason`, `is_approved`) VALUES (null,?,?,?,?,?,null);';
                    req.getConnection((error, conn) => {
                        conn.query(queryString, [id,leave_type_id,from_date,to_date,reason], (err, result, fields) => {
                            if (err) {
                                res.json(err)
                            } else {
                                res.redirect("/leaves")
                            }
                        });
                    });
                } else {
                    res.redirect("/apply_leave?error=1")
                }
            }
        });
    });
};

// reports ...............

exports.show_report_dept = function (req, res, next) {
    const userId = req.session.userId;
    const {department_id} = req.params;
    const queryString = 'SELECT * FROM employee NATURAL JOIN works NATURAL JOIN job NATURAL JOIN emp_status WHERE department_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [department_id], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                console.log(rows);
                const deptQuery = 'SELECT * FROM department';
                req.getConnection((error, conn) => {
                    conn.query(deptQuery, [], (err, departments, fields) => {
                        if (err) {
                            res.json(err);
                        } else {
                            res.render('user/department_report', {
                                employee: {userId},
                                rows,
                                departments,
                                department_id,
                                user: req.session.user
                            });
                        }
                    });
                });
            }
        });
    });
};

exports.show_report_group = function (req, res, next) {
    const userId = req.session.userId;
    const {job, department, emp_status, paygrade} = req.query;
    const queryString = 'SELECT * FROM employee NATURAL JOIN works NATURAL JOIN job NATURAL JOIN emp_status NATURAL JOIN department WHERE job_id = ? AND department_id = ? AND emp_stat_id = ? AND paygrade_id = ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [job, department, emp_status, paygrade], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
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
                                            conn.query('SELECT * FROM emp_status', [], (err, emp_stats, fields) => {
                                                if (err) {
                                                    res.json(err);
                                                } else {
                                                    req.getConnection((error, conn) => {
                                                        conn.query('SELECT * FROM paygrade', [], (err, paygrades, fields) => {
                                                            if (err) {
                                                                res.json(err);
                                                            } else {
                                                                console.log(departments)
                                                                res.render('user/group_report', {
                                                                    employee: {userId},
                                                                    rows,
                                                                    jobs,
                                                                    departments,
                                                                    paygrades,
                                                                    emp_stats,
                                                                    job_id: job,
                                                                    paygrade_id: paygrade,
                                                                    emp_status: emp_status,
                                                                    department_id: department,
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

exports.show_report_leaves = function (req, res, next) {
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM department', [], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                console.log(rows)
                res.render('user/leave_range', {
                    formData : {},
                    rows,
                    user: req.session.user
                });
            }
        });
    });
};

exports.show_leaves_report = function (req, res, next) {
    const {department_id, from_date, to_date} = req.body;
    const queryString = 'SELECT COUNT(id) as count FROM employee NATURAL JOIN department NATURAL JOIN leaves WHERE department_id = ? AND ? < from_date AND to_date < ?';
    req.getConnection((error, conn) => {
        conn.query(queryString, [department_id,from_date,to_date], (err, rows, fields) => {
            if (err) {
                res.json(err);
            } else {
                console.log(rows)
                res.render('user/leave_report', {
                    formData : {},
                    rows,
                    user: req.session.user
                });
            }
        });
    });
};

// employee .......................
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
                                                    res.render('user/add_employee', {
                                                        formData: {starting_date: moment().format("YYYY-MM-DD")},
                                                        errors: {message},
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
                    res.redirect('/employee/add?error=1')
                } else {
                    // call procedure to add employee
                    const procedure = 'CALL add_employee(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    req.getConnection((error, conn) => {
                        conn.query(procedure, params, (err, rows, fields) => {
                            if (err) {
                                res.json(err);
                            } else {
                                res.redirect('/');
                            }
                        });
                    });
                }
            }
        });
    });
};