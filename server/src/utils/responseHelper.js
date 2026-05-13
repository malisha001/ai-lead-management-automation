const success = (res, statusCode, message, data) =>
  res.status(statusCode).json({ success: true, message, data });

const error = (res, statusCode, message, errors = null) =>
  res.status(statusCode).json({ success: false, message, ...(errors && { errors }) });

module.exports = { success, error };
