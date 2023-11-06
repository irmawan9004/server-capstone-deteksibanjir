const response = (res, statusCode, data, message) => {
  res.status(statusCode).json({
    payload: {
      status: statusCode,
      datas: data,
      message: message,
    },
    pagination: {
      prev: "",
      next: "",
      max: "",
    },
  });
};

module.exports = response;
