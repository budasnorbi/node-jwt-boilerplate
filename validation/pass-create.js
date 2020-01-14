module.exports = function validatePassCreateInput(data) {
  let { name, count } = data;
  const errors = {};

  name = !is_Empty(name) ? name : "";
  count = !is_Empty(count) ? count : "";

  if (isEmpty(name)) {
    errors.name = "Bérlet neve mező nem lehet üres";
  }

  if (!isNumeric(count)) {
    errors.count = "Alkalmak száma mező csak számot tartalmazhat";
  }

  if (isEmpty(count)) {
    errors.count = "Alkalmak száma mező nem lehet üres";
  }

  return {
    errors,
    isValid: is_Empty(errors)
  };
};
