const handleDatabaseError = (err) => {
  if (err.code === '23505') { // Unique constraint violation
    return new AppError('Duplicate field value. Please use another value.', 400);
  }
  // Add more specific database error handlers as needed
  return new AppError('Something went wrong with the database.', 500);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'JsonWebTokenError') error = new AppError('Invalid token. Please log in again.', 401);
    if (error.name === 'TokenExpiredError') error = new AppError('Your token has expired. Please log in again.', 401);
    if (error.code) error = handleDatabaseError(error);

    sendErrorProd(error, res);
  }
};

export default errorHandler;
