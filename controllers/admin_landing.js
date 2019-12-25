exports.check_authenticated = function (req, res, next) {
    if (req.session.admin) {
        next()
    } else {
        res.redirect('/admin/login');
    }
};

exports.get_landing = function (req, res, next) {
    //  response is a HTTP web page
    res.render('admin/admins', {title: 'Express', user: req.session.admin});
};

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
    res.render('admin/register', {formData: {}, errors: {}});
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
                    res.render('admin/register', {formData: {}, errors: {message}});
                } else {
                    res.redirect('/admin/admins');
                }
            }
        });
    });
}
//
// exports.show_lead = function(req, res, next) {
//     const queryString = 'SELECT * FROM email WHERE id = ?';
//     const id = req.params.lead_id;
//     req.getConnection((error, conn) => {
//         conn.query(queryString, [id], (err, rows, fields) => {
//             if (err) {
//                 res.json(err);
//             } else {
//                 res.render('lead/lead', {
//                     title: 'Express',
//                     lead: rows[0],
//                     user: req.session.user
//                 });
//             }
//         });
//     });
// };
//
// exports.show_edit_lead = function(req, res, next) {
//     const queryString = 'SELECT * FROM email WHERE id = ?';
//     const id = req.params.lead_id;
//     req.getConnection((error, conn) => {
//         conn.query(queryString, [id], (err, rows, fields) => {
//             if (err) {
//                 res.json(err);
//             } else {
//                 res.render('lead/edit_lead', {
//                     title: 'Express',
//                     lead: rows[0],
//                     user: req.session.user
//                 });
//             }
//         });
//     });
// };
//
// exports.edit_lead = function(req, res, next) {
//     const queryString = 'UPDATE email SET email = ? WHERE email.id = ?';
//     const id = req.params.lead_id;
//     const email = req.body.lead_email;
//     req.getConnection((error, conn) => {
//         conn.query(queryString, [email, id], (err, rows, fields) => {
//             if (err) {
//                 res.json(err);
//             } else {
//                 res.redirect('/leads/' + req.params.lead_id);
//             }
//         });
//     });
// };
//
// exports.delete_lead = function(req, res, next) {
//     const queryString = 'DELETE FROM email WHERE email.id = ?';
//     const id = req.params.lead_id;
//     req.getConnection((error, conn) => {
//         conn.query(queryString, [id], (err, rows, fields) => {
//             if (err) {
//                 res.json(err);
//             } else {
//                 res.redirect('/leads');
//             }
//         });
//     });
// };
//
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
