// Init ------------------------------------------------------------------------
var express = require('express');
var knex = require('./KnexDB.js');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
const PORT = process.env.PORT || 3000;

// Middleware ------------------------------------------------------------------
app.use(bodyParser.json());
app.use(require('./middleware/enable-cors')(['GET', 'POST', 'PATCH', 'DELETE'], ['x-auth']));
app.use(require('./middleware/log'));


// Endpoints -------------------------------------------------------------------
var TodoEnpoints = require('./endpoints/Todo');
app.use('/_api/v1', TodoEnpoints);


var UserEndpoints = require('./endpoints/User');
app.use('/_api/v1', UserEndpoints);

// Front-end
app.use('/', express.static(path.join(__dirname, 'public')));

// Validate Dabatabase connection and Start API --------------------------------
knex.Validate()
.then(() => {
  app.listen(PORT, () => {
    console.log(`[36m%s[0m`, `# API Listening at: http://localhost:${PORT}`);
  });
})



module.exports = {app};
