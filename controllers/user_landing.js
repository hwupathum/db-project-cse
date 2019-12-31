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