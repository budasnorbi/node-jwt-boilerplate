const Joi = require("@hapi/joi");
const { name, email, password, passwordConfirm } = require("./config");

module.exports = function registerValidator(body) {
  const schema = Joi.object().keys({
    name: Joi.string()
      .required()
      .trim()
      .min(3)
      .max(40)
      .messages(name),
    email: Joi.string()
      .required()
      .trim()
      .max(60)
      .email()
      .messages(email),
    password: Joi.string()
      .required()
      .min(8)
      .max(30)
      .messages(password),
    passwordConfirm: Joi.string()
      .required()
      .valid(Joi.ref("password"))
      .messages(passwordConfirm)
  });

  const rules = schema.validate(body, {
    abortEarly: false,
    errors: { escapeHtml: true, label: false }
  });

  if (rules.error) {
    return rules.error.details.reduce(
      (acc, currRule) => {
        acc[currRule.context.key] = currRule.message;
        return acc;
      },
      { status: "error" }
    );
  } else {
    return { status: "success" };
  }
};
