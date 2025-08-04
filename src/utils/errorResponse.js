const errorResponse = (res, statusCode, errorCode, errorMessage) => {
  return res.status(statusCode).json({
    errorCode,
    errorMessage,
  });
};

export default errorResponse;
