const Joi = require('joi');

exports.check_validation = function (req, res, next) {
    const schema = Joi.object().keys({
        email: Joi.string().email({minDomainAtoms: 2}).min(5).max(50).required(),
        password: Joi.string().min(5).max(50).required(),
        confirmPassword: Joi.string().min(5).max(50).required()
    }).with('username', 'password');
    Joi.validate(req.body, schema, (err, result) => {
        if (err) {
            res.render('admin/register', {formData: req.body, errors: err.details[0]});
        } else {
            next()
        }
    })
};

exports.add_employee_validation = function (req, res, next) {
    const schema = Joi.object().keys({
        NIC: Joi.string().alphanum().min(10).max(12).required(),
        f_name: Joi.string().alpha().required(),
        email: Joi.string().email({minDomainAtoms: 2}).min(5).max(50).required(),
    })
    Joi.validate(req.body, schema, (err, result) => {
        if (err) {
            res.render('admin/add_employee', {formData: req.body, errors: err.details[0]});
        } else {
            next()
        }
    })
};

