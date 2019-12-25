exports.show_login = function(req, res, next) {
  //  response is a HTTP web page
  res.render('user/login', { formData: {}, errors:{} });
}

exports.show_signup = function(req, res, next) {
  //  response is a HTTP web page
  res.render('user/signup', { formData: {}, errors:{} });
}

exports.signup = function(req, res, next) {
  //  response is a HTTP web page
  res.render('landing', { title: 'Express' });
}

exports.login = function(req, res, next) {
  var email= req.body.email;
  var pass = req.body.password;
    var queryString = 'SELECT id, email FROM admin WHERE email = ? AND password = md5(?)';
  req.getConnection((error, conn) => {
    conn.query(queryString, [email, pass], (err, rows, fields) => {
      if (err) {
        res.json(err)
      } else {
        if(rows.length){
          req.session.userId = rows[0].id;
          req.session.user = rows[0];
          console.log(rows[0].id);
          res.redirect('/');
        }
        else{
          message = 'Your username or password is incorrect';
          res.render('user/login', { formData: req.body, errors:{message} });
        }
      }
    });
  });                       
}

exports.logout = function(req, res, next) {
  // req.logout();
  // req.session.destroy();
  res.redirect('/');                     
}