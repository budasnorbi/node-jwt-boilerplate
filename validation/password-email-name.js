const Joi = require("@hapi/joi");
const { email, name } = require("./config");

module.exports = function loginValidator(body) {
  const schema = Joi.object().keys({
    email: Joi.string()
      .required()
      .trim()
      .max(60)
      .email()
      .messages(email),
    name: Joi.string()
      .required()
      .trim()
      .min(3)
      .max(40)
      .messages(name)
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
