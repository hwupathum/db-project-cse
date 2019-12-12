exports.check_authenticated = function(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/login');
  }
};

exports.get_landing = function(req, res, next) {
  //  response is a HTTP web page
  res.render('landing', { title: 'Express', user: req.session.user });
};

exports.submit_lead = function(req, res, next) {
    const email = req.body.lead_email;
    const queryString = 'INSERT INTO email (email) VALUES (?)';
    req.getConnection((error, conn) => {
      conn.query(queryString, [email], (err, rows, fields) => {
        if (err) {
          res.json(err);
        } else {
          res.redirect('/leads');
        }
      });
    });
};

exports.show_leads = function(req, res, next) {
    const queryString = 'SELECT * FROM email';
    req.getConnection((error, conn) => {
      conn.query(queryString, [], (err, rows, fields) => {
        if (err) {
          res.json(err);
        } else {
          res.render('landing', {
            title: 'Express',
            leads: rows,
            user: req.session.user
          });
        }
      });
    });
};

exports.show_lead = function(req, res, next) {
    const queryString = 'SELECT * FROM email WHERE id = ?';
    const id = req.params.lead_id;
    req.getConnection((error, conn) => {
      conn.query(queryString, [id], (err, rows, fields) => {
        if (err) {
          res.json(err);
        } else {
          res.render('lead/lead', {
            title: 'Express',
            lead: rows[0],
            user: req.session.user
          });
        }
      });
    });
};

exports.show_edit_lead = function(req, res, next) {
    const queryString = 'SELECT * FROM email WHERE id = ?';
    const id = req.params.lead_id;
    req.getConnection((error, conn) => {
      conn.query(queryString, [id], (err, rows, fields) => {
        if (err) {
          res.json(err);
        } else {
          res.render('lead/edit_lead', {
            title: 'Express',
            lead: rows[0],
            user: req.session.user
          });
        }
      });
    });
};

exports.edit_lead = function(req, res, next) {
    const queryString = 'UPDATE email SET email = ? WHERE email.id = ?';
    const id = req.params.lead_id;
    const email = req.body.lead_email;
    req.getConnection((error, conn) => {
      conn.query(queryString, [email, id], (err, rows, fields) => {
        if (err) {
          res.json(err);
        } else {
          res.redirect('/leads/' + req.params.lead_id);
        }
      });
    });
};

exports.delete_lead = function(req, res, next) {
    const queryString = 'DELETE FROM email WHERE email.id = ?';
    const id = req.params.lead_id;
    req.getConnection((error, conn) => {
      conn.query(queryString, [id], (err, rows, fields) => {
        if (err) {
          res.json(err);
        } else {
          res.redirect('/leads');
        }
      });
    });
};

exports.delete_lead_json = function(req, res, next) {
    const queryString = 'DELETE FROM email WHERE email.id = ?';
    const id = req.params.lead_id;
    req.getConnection((error, conn) => {
      conn.query(queryString, [id], (err, rows, fields) => {
        if (err) {
          res.json(err);
        } else {
          res.send({ msg: 'Success' });
        }
      });
    });
};
