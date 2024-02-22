const express = require('express');
const Joi = require('joi');

const validationSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(6)
        .max(30)
        .required(),
    
    email: Joi.string().email().required(),

    repeat_email: Joi.ref('email'),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
        .required(),

    repeat_password: Joi.ref('password'),
    
    terms: Joi.bool().required()

})

module.exports = { validationSchema };