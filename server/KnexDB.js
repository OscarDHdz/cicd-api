var {env} = require('./configs/initconfig');
var configs = require('./knexfile');
var knex = require('knex')(configs[env]);

// process.env.VALIDATE_DB = 'ON'

knex.Validate = ( ) => {

  return new Promise((resolve, reject) => {
    if ( process.env.VALIDATE_DB === 'ON' ) {
      console.log("[36m%s[0m", `# Validating Database connnection and migrations...`);

      KeepValidatingConnection()
      .then((connection) => {
        console.log(`  OK - Database connection Established`);
        return knex.migrate.latest();
      })
      .then((migration) => {
        if ( migration[1].length > 0 ) {
          console.log(`  OK - Database is now at latest version`);
          console.log(`    -${migration[1].length}- Migration scripts were executed:`);
          for (var i = 0; i < migration[1].length; i++) {
            console.log(`      - ${migration[1][i]}`);
          }
        }
        else console.log(`  OK - Database was already at latest version`);
        console.log("[32m%s[0m", `# Database validation completed`);
        resolve(true);
      })
      .catch((err) => {
        console.log(err);
        console.log("[31m%s[0m", `# This should be reached...`);
        reject(err);
      })

    }
    else resolve(true);
  })


}


var KeepValidatingConnection = ( success ) => {

  return new Promise((resolve, reject) => {

    if ( success ) resolve(true);

    knex.migrate.currentVersion()
    .then((res) => resolve(true))
    .catch((err) => {
      console.log(err);
      console.log("[31m%s[0m", `# There was a problem with database connection. Retrying connection...`);
      return KeepValidatingConnection(false);
    })
    .then((res2) => resolve(true))


  })

}

module.exports = knex;
