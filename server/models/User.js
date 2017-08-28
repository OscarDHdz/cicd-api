var _ = require('lodash');
const TABLE_NAME = 'users';
const ALLOWED_PARAMS = ['username'];

class User {

  constructor( data ) {
    this.id = 0;
    this.username = '';

    if ( data ) {
      for (var key in data) {
        this[key] = data[key];
      }
    }

  }

  Validate( ) {

    if ( !_.isString(this.username) || this.username.length === 0) return false;

    return true;
  }

}

module.exports = {User, TABLE_NAME, ALLOWED_PARAMS}
