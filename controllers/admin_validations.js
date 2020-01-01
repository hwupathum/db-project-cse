const Joi = require('joi');
const moment = require('moment');

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
        f_name: Joi.string().required(),
        l_name: Joi.string().allow("", null),
        email: Joi.string().email({minDomainAtoms: 2}).min(5).max(50).required(),
        tel_no_mobile: Joi.string().regex(/^\d{9}$/).required(),
        tel_no_home: Joi.string().regex(/^\d{9}$/).allow("", null),
        birth_date: Joi.string().required(),
        marital_stat: Joi.string().required(),
        gender: Joi.string().required(),
        street: Joi.string().allow("", null),
        city: Joi.string().allow("", null),
        state: Joi.string().allow("", null)
    })
    Joi.validate(req.body, schema, (err, result) => {
        console.log(req.body);
        if (err) {
            res.render('admin/add_employee', {
                formData: {starting_date: moment().format("YYYY-MM-DD")},
                errors: err.details[0],
                departments,
                jobs,
                emp_status,
                paygrades,
                admin: req.session.admin
            });
        } else {
            next()
        }
    })
};

exports.edit_employee_validation = function (req, res, next) {
    const schema = Joi.object().keys({
        NIC: Joi.string().alphanum().min(10).max(12).required(),
        f_name: Joi.string().required(),
        l_name: Joi.string().allow("", null),
        email: Joi.string().email({minDomainAtoms: 2}).min(5).max(50).required(),
        tel_no_mobile: Joi.string().regex(/^\d{9}$/).required(),
        tel_no_home: Joi.string().regex(/^\d{9}$/).allow("", null),
        birth_date: Joi.string().required(),
        marital_stat: Joi.string().required(),
        gender: Joi.string().required(),
        street: Joi.string().allow("", null),
        city: Joi.string().allow("", null),
        state: Joi.string().allow("", null)
    })
    Joi.validate(req.body, schema, (err, result) => {
        console.log(req.body);
        if (err) {
            res.render('admin/edit_employee', {
                formData: {...req.body, birth_date: moment(req.body.birth_date).format("YYYY-MM-DD")}, 
                errors: err.details[0], 
                admin: req.session.admin
            });
        } else {
            next()
        }
    })
};

exports.add_emergency_validation = function (req, res, next) {
    const employee_id = req.params.employee_id;
    const schema = Joi.object().keys({
        f_name: Joi.string().alphanum().required(),
        l_name: Joi.string().allow("", null),
        relation: Joi.string().required(),
        tel_no: Joi.string().regex(/^\d{9}$/).required(),
        gender: Joi.string().required(),
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required()
    })
    Joi.validate(req.body, schema, (err, result) => {
        console.log(req.body);
        if (err) {
            res.render('admin/add_emergency_contacts', {
                formData: req.body,
                employer: {employee_id}, 
                errors: err.details[0], 
                admin: req.session.admin
            });
        } else {
            next()
        }
    })
};

exports.edit_emergency_validation = function (req, res, next) {
    const employee_id = req.params.employee_id;
    const schema = Joi.object().keys({
        f_name: Joi.string().alphanum().required(),
        l_name: Joi.string().allow("", null),
        relation: Joi.string().required(),
        tel_no: Joi.string().regex(/^\d{9}$/).required(),
        gender: Joi.string().required(),
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required()
    })
    Joi.validate(req.body, schema, (err, result) => {
        console.log(req.params);
        if (err) {
            res.render('admin/edit_emergency_contacts', {
                formData: req.body,
                employer: {employee_id},
                id: req.params.id, 
                errors: err.details[0], 
                admin: req.session.admin
            });
        } else {
            next()
        }
    })
};

exports.add_departments_validation = function (req, res, next) {
    const employee_id = req.params.employee_id;
    const schema = Joi.object().keys({
        f_name: Joi.string().alphanum().required(),
        l_name: Joi.string().allow("", null),
        relation: Joi.string().required(),
        tel_no: Joi.string().regex(/^\d{9}$/).required(),
        birth_date: Joi.string().required(),
        gender: Joi.string().required()
    })
    Joi.validate(req.body, schema, (err, result) => {
        console.log(req.params);
        if (err) {
            res.render('admin/add_dependants', {
                formData: {...req.body, birth_date: moment(req.body.birth_date).format("YYYY-MM-DD")},
                employer: {employee_id}, 
                errors: err.details[0], 
                admin: req.session.admin
            });
        } else {
            next()
        }
    })
};

exports.edit_departments_validation = function (req, res, next) {
    const employee_id = req.params.employee_id;
    const schema = Joi.object().keys({
        f_name: Joi.string().alphanum().required(),
        l_name: Joi.string().allow("", null),
        relation: Joi.string().required(),
        tel_no: Joi.string().regex(/^\d{9}$/).required(),
        birth_date: Joi.string().required(),
        gender: Joi.string().required()
    })
    Joi.validate(req.body, schema, (err, result) => {
        console.log(req.params);
        if (err) {
            res.render('admin/edit_dependants', {
                formData: {...req.body, birth_date: moment(req.body.birth_date).format("YYYY-MM-DD")},
                employer: {employee_id}, 
                errors: err.details[0], 
                admin: req.session.admin
            });
        } else {
            next()
        }
    })
};