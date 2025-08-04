import errorResponse from "../utils/errorResponse.js";

const validateRequest = (validateFn) => (req, res, next) => {
  try {
    validateFn(req.body);
    next();
  } catch (err) {
    return errorResponse(res, 400, "BAD_REQUEST", err.message);
  }
};

export default validateRequest;
