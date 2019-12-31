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
                res.json(rows)
                // res.render('admin/employee', {employee: rows, admin: req.session.admin});
            }
        });
    });
    // res.render('user/home', {title: 'Home', user: req.session.user})
};