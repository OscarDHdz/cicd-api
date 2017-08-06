var apiLog = ( req, res, next ) => {

  var logMessage = `${req.method}: ${req.url}`;
  console.log(logMessage);
  next();

}

module.exports = apiLog;
