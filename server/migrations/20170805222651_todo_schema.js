
exports.up = function(knex, Promise) {

  return Promise.all([
    knex.schema.createTable('todos', function (table) {
      table.increments('id');
      table.text('title')
      .defaultTo('');
      table.text('body')
      .defaultTo('');
      table.boolean('completed')
      .defaultTo(false);
    }),
  ])

};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.raw(`DROP TABLE IF EXISTS todos;`),
  ])
};
