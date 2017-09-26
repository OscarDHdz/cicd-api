var env = process.env.NODE_ENV || 'development';
const CONFIGS = require('./configs')[env];

for (var variable in CONFIGS) {
  process.env[variable] = CONFIGS[variable];
}

console.log("[36m%s[0m", `# Running API Configuraction...`);

console.log(`  OK - Using environment: [35m${process.env.NODE_ENV}[0m`);
if ( process.env.DB_CLIENT ) {
  console.log(`  OK - Using Client: [35m${process.env.DB_CLIENT}[0m`);
  // SQLite
  if ( process.env.DB_CLIENT === 'sqlite3') {
    if ( process.env.DB_FILE) {
      console.log(`  OK - Using SQLite database file: [35m${process.env.DB_FILE}[0m`);
    }
    else {
      console.log("[31m%s[0m", `  ERROR - No DB_FILE provided`);
      throw `Missing DB_FILE environment variable`
    }
  }
  // PotgreSQL
  else {
    // Database Environment
    if ( process.env.DB_HOST ) {
      console.log(`  OK - Database Host: [35m${process.env.DB_HOST}[0m`);

        console.log(`  OK - Database Client: [35m${process.env.DB_CLIENT}[0m`);
          if ( process.env.DB_NAME ) {
            console.log(`  OK - Using database name: [35m${process.env.DB_NAME}[0m`);
              if ( process.env.DB_USER &&  process.env.DB_PASS ) {
                console.log(`  OK - Using Database credential for user: [35m${process.env.DB_USER}[0m`);
                }
                else {
                  console.log("[31m%s[0m", `  ERROR - No DB User credential provided`);
                  throw `Missing DB_USER/DB_PASS environment variable`
                }
              }
              else {
                console.log("[31m%s[0m", `  ERROR - No DB_NAME provided`);
                throw `Missing DB_NAME environment variable`
              }


            }
            else {
              console.log("[31m%s[0m", `  ERROR - No DB_HOST provided`);
              throw `Missing DB_CLIENT environment variable`
            }

  }

}
// Fail Client
else {
  console.log("[31m%s[0m", `  ERROR - No DB_CLIENT provided`);
  throw `Missing DB_CLIENT environment variable`
}

console.log("[32m%s[0m", `# API Configuration completed`);


module.exports = {env}
