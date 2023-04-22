const handleError = (res, message, statusCode = 500) => {
  res.status(statusCode).json({ message });
};

module.exports = { handleError };
