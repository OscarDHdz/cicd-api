
exports.up = function(knex, Promise) {

  return Promise.all([
    knex.schema.createTable('todos', function (table) {
      table.increments('id');
      table.text('title');
      table.text('body');
      table.boolean('completed');
    }),
  ])

};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.raw(`DROP TABLE IF EXISTS todos;`),
  ])
};
