var apiLog = ( req, res, next ) => {

  var logMessage = `${req.method}: ${req.url}`;
  if ( process.env.NODE_ENV !== 'test' )
    console.log(logMessage);
  next();

}

module.exports = apiLog;
