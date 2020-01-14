const Joi = require("@hapi/joi");
const { password, passwordConfirm } = require("./config");

module.exports = function registerValidator(body) {
  const schema = Joi.object().keys({
    currentPassword: Joi.string()
      .required()
      .min(8)
      .max(30)
      .messages(password),
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
