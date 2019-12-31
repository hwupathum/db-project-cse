exports.check_authenticated = function (req, res, next) {
  if (!req.session.user) {
    next()
  } else {
    res.redirect('/');
  }
};

exports.show_login = function (req, res, next) {
  //  response is a HTTP web page
  res.render('user/login', {formData: {}, errors: {}});
}

exports.show_signup = function (req, res, next) {
  //  response is a HTTP web page
  res.render('user/signup', {formData: {}, errors: {}});
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const pass = req.body.password;
  const confirmPass = req.body.confirmPassword;
  if (pass !== confirmPass) {
    res.render('user/signup', {formData: req.body, errors: {message: 'Password and confirm password mismatch'}});
  }
  const queryString = 'SELECT user_register(?, ?) AS user_register';
  req.getConnection((error, conn) => {
    conn.query(queryString, [email, pass], (err, rows, fields) => {
      let message;
      if (err) {
        res.json(err)
      } else {
        if (rows[0].admin_register === 0) {
          message = 'Email already registered';
          res.render('user/signup', {formData: {}, errors: {message}, admin: req.session.admin});
        } else if (rows[0].admin_register === 1) {
          message = 'Access denied';
          res.render('user/signup', {formData: {}, errors: {message}, admin: req.session.admin});
        } else {
          res.redirect('/login');
        }
      }
    });
  });
}

exports.login = function(req, res, next) {
  var email= req.body.email;
  var pass = req.body.password;
  var queryString = 'SELECT email, employee_id FROM user NATURAL JOIN employee WHERE email = ? AND password = md5(?)';
  req.getConnection((error, conn) => {
    conn.query(queryString, [email, pass], (err, rows, fields) => {
      if (err) {
        res.json(err)
      } else {
        if(rows.length){
          req.session.userId = rows[0].employee_id;
          req.session.user = rows[0];
          // console.log(rows[0].id);
          res.redirect('/');
        } else{
          message = 'Your username or password is incorrect';
          res.render('user/login', { formData: req.body, errors:{message} });
        }
      }
    });
  });                       
}

exports.logout = function(req, res, next) {
  // req.logout();
  req.session.destroy();
    res.redirect('/');
}