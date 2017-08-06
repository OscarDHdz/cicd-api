module.exports = ( extraMethods, extraHeaders ) => {

  var allowedMethods = [];
  var allowedHeaders = ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'];

  // Append Extra Methods to Allowed Methods
  if ( Array.isArray(extraMethods) ) allowedMethods = allowedMethods.concat(extraMethods);
  else allowedMethods.push(extraMethods);
  // Append Extra Headers to Allowed Headers
  if ( Array.isArray(extraHeaders) ) allowedHeaders = allowedHeaders.concat(extraMethods);
  else allowedHeaders.push(extraHeaders);

  var EnableCors = ( req, res, next ) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', allowedHeaders.toString());
    res.header('Access-Control-Allow-Methods', allowedMethods.toString());


    if ( req.method === 'OPTIONS' ) res.status(200).send();
    else next();

  }


  return EnableCors;

}
