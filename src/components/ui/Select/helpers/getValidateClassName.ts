export const getValidateClassName = (valid?: boolean) => {
  if (valid === undefined) {
    return "";
  } else if (valid) {
    return "form-control is-valid";
  }

  return "form-control is-invalid";
};
