const Joi = require('joi');

const registrationSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().required(),
});

const addTeamSchema = Joi.object({
  city: Joi.string().required(),
  league: Joi.string().required(),
  position: Joi.string().required(),
  description: Joi.string().required(),
  phone: Joi.string().required(),
  teamName: Joi.string().required(),
});

module.exports = {
  registrationSchema,
  loginSchema,
  addTeamSchema,
};
