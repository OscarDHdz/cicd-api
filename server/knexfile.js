var ENV = process.env.NODE_ENV || 'development';


var db_client   = process.env.DB_CLIENT || 'pg';
var db_host     = process.env.DB_HOST   || '192.168.99.100';
var db_user     = process.env.DB_USER   || 'developer';
var db_password = process.env.DB_PASS   || 'qwerty2';
var db_dbname   = process.env.DB_NAME   || 'db_api';

module.exports = {
  development: {
    client: db_client,
    connection: {
      host : db_host,
      user : db_user,
      password : db_password,
      database : db_dbname
    },
    migrations: {
      directory: __dirname + '/migrations'
    },
    seeds: {
      directory: __dirname + '/seeds'
    }
  }
}
