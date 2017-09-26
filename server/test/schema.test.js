var knex = require('../KnexDB.js');
const expect = require('expect');
// Todos Schema
var {Todo, TABLE_NAME} = require('../models/Todo');
const TABLE_NAME_TODOS = TABLE_NAME;
// todos Schema
var {User, TABLE_NAME} = require('../models/User');
const TABLE_NAME_USERS = TABLE_NAME;

describe('SCHEMA TEST', function() {


  var todos = [];

  const CLIENT = process.env.DB_CLIENT || 'sqlite3';

  describe('Todos schema', function() {

    // Prepare input data
    before(function (done) {

      todos = [
        new Todo({
          title: 'Todo #1',
          body: 'Body del todo #1'
        }),
        new Todo({
          title: 'Todo #2',
          body: 'Este body deberia estar completado',
          completed: false
        })
      ]
      for (var i = 0; i < todos.length; i++) {
        delete todos[i].id;
      }

      knex(TABLE_NAME_TODOS).delete()
      .then((res) => done())
      .catch((err) => done(err))

    })

    it('Should insert a todo', function (done) {
      knex(TABLE_NAME_TODOS).insert(todos[0])
      .then((res) => {
        if ( CLIENT === 'sqlite3' ) todos[0].id = res[0];
        else todos[0].id = res[0].id;
        done();
      })
      .catch((err) => done(err))
    })

    it('Should insert a second todo', function (done) {
      knex(TABLE_NAME_TODOS).insert(todos[1])
      .then((res) => {
        if ( CLIENT === 'sqlite3' ) todos[1].id = res[0];
        else todos[1].id = res[0].id;
        done()
      })
      .catch((err) => done(err))
    })

    it('Should retrive first inserted todo', function (done) {
      knex(TABLE_NAME_TODOS).select('*').where({id: todos[0].id})
      .then((res) => {
        expect(res[0].id).toBe(todos[0].id);
        done()
      })
      .catch((err) => done(err))
    })

    it('Should set second inserted todo as completed', function (done) {
      knex(TABLE_NAME_TODOS).update({completed: true}).where({id: todos[1].id})
      .then((res) => {
        return knex(TABLE_NAME_TODOS).select('*').where({id: todos[1].id})
        done()
      })
      .then((res) => {
        expect(new Boolean(res[0].completed).valueOf()).toEqual(true);
        todos[1].completed = true;
        done();
      })
      .catch((err) => done(err))
    })

    it('Should delete first inserted todo', function (done) {
      knex(TABLE_NAME_TODOS).del().where({id: todos[0].id})
      .then((res) => {
        return knex(TABLE_NAME_TODOS).select('*').where({id: todos[0].id});
      })
      .then((res) => {
        expect(res).toEqual([]);
        done()
      })
      .catch((err) => done(err))
    })



  });

  describe('Users schema', function() {

    // Prepare input data
    before(function (done) {

      users = [
        new User({
          username: "Oscar"
        }),
        new User({
          username: "Brenda"
        })
      ]
      for (var i = 0; i < users.length; i++) {
        delete users[i].id;
      }

      knex(TABLE_NAME_USERS).delete()
      .then((res) => done())
      .catch((err) => done(err))

    })

    it('Should insert an user', function (done) {
      knex(TABLE_NAME_USERS).insert(users[0])
      .then((res) => {
        if ( CLIENT === 'sqlite3' ) users[0].id = res[0];
        else users[0].id = res[0].id;
        done();
      })
      .catch((err) => done(err))
    })

    it('Should insert a second user', function (done) {
      knex(TABLE_NAME_USERS).insert(users[1])
      .then((res) => {
        if ( CLIENT === 'sqlite3' ) users[1].id = res[0];
        else users[1].id = res[0].id;
        done()
      })
      .catch((err) => done(err))
    })

    it('Should retrive first inserted user', function (done) {
      knex(TABLE_NAME_USERS).select('*').where({id: users[0].id})
      .then((res) => {
        expect(res[0].id).toBe(users[0].id);
        done()
      })
      .catch((err) => done(err))
    })

    it('Should set second inserted user username as "modified"', function (done) {
      knex(TABLE_NAME_USERS).update({username: 'modified'}).where({id: users[1].id})
      .then((res) => {
        return knex(TABLE_NAME_USERS).select('*').where({id: users[1].id})
        done()
      })
      .then((res) => {
        expect(res[0].username).toEqual('modified');
        users[1].username = 'modified';
        done();
      })
      .catch((err) => done(err))
    })

    it('Should delete first inserted user', function (done) {
      knex(TABLE_NAME_USERS).del().where({id: users[0].id})
      .then((res) => {
        return knex(TABLE_NAME_USERS).select('*').where({id: users[0].id});
      })
      .then((res) => {
        expect(res).toEqual([]);
        done()
      })
      .catch((err) => done(err))
    })



  });


})
