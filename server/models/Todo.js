var _ = require('lodash');
const TABLE_NAME = 'todos';
const ALLOWED_PARAMS = ['title', 'body', 'completed'];

class Todo {

  constructor( data ) {
    this.id = 0;
    this.title = '';
    this.body = '';
    this.completed = false;

    if ( data ) {
      for (var key in data) {
        this[key] = data[key];
      }
    }

  }

  Validate( ) {

    if ( !_.isString(this.title) || this.title.length === 0) return false;
    if ( !_.isString(this.body) || this.title.length === 0 ) return false;
    if ( !_.isBoolean(this.completed)) return false;
    if ( !_.isInteger(this.id) || this.id < 0 ) return false;

    return true;
  }

}

module.exports = {Todo, TABLE_NAME, ALLOWED_PARAMS}
