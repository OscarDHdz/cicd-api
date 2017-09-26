process.env.NODE_ENV = 'test';
var knex = require('../KnexDB.js');
var {app} = require('../index.js');
var request = require('supertest');
const expect = require('expect');
// Todos Schema
var {Todo, TABLE_NAME} = require('../models/Todo');
const TABLE_NAME_TODOS = TABLE_NAME;
// todos Schema
var {User, TABLE_NAME} = require('../models/User');
const TABLE_NAME_USERS = TABLE_NAME;

describe('REST Suit', function() {

  const CLIENT = process.env.DB_CLIENT || 'sqlite3';
  const BASE = '/_api/v1';

  var todos = [];
  var users = [];

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


    knex.Validate( 'init' )
    .then((res) => knex(TABLE_NAME_TODOS).delete() )
    .then((res) => knex(TABLE_NAME_USERS).delete())
    .then((res) => done())
    .catch((err) => done(err))


  })

  describe('/todos endpoints', function() {

    it('Should POST a todo', function(done) {
      var todo = todos[0];
      request(app)
      .post(BASE + '/todos')
      .send(todo)
      .expect(200)
      .end(function (err, res) {
        expect(res.body).toHaveProperty('id');
        todo.id = res.body.id;
        done();
      })
    });

    it('Should POST a second todo', function(done) {
      var todo = todos[1];
      request(app)
      .post(BASE + '/todos')
      .send(todo)
      .expect(200)
      .end(function (err, res) {
        expect(res.body).toHaveProperty('id');
        todo.id = res.body.id;
        done();
      })
    });

    it('Should GET/:id a todo', function ( done ) {

      var todo = todos[0];
      request(app)
      .get(BASE + '/todos/' + todo.id)
      .expect(200)
      .expect(response => {
        var obj = response.body;
        expect(obj.id).toEqual(todo.id);
      })
      .end(done)

    })

    it('Should GET inserted todos', function ( done ) {

      var todo = todos[0];
      request(app)
      .get(BASE + '/todos')
      .expect(200)
      .expect(response => {
        var objs = response.body.todos;
        expect(objs.length).toEqual(2);
      })
      .end(done)

    })

    it('Should DELETE an inserted todo', function (done) {
      var todo = todos[0];
      request(app)
      .delete(BASE + '/todos/' + todo.id)
      .expect(201)
      .end(function (err, res) {

        request(app)
        .get(BASE + '/todos/' + todo.id)
        .expect(404)
        .end(done);

      })
    })

    it('Should PATCH a todo', function(done) {
      var todo = todos[1];
      request(app)
      .patch(BASE + '/todos/' + todo.id)
      .send({completed: true})
      .expect(200)
      .end(function (err, res) {

        request(app)
        .get(BASE + '/todos/' + todo.id)
        .expect(200)
        .expect((response) => {
          expect(new Boolean(response.body.completed).valueOf()).toEqual(true);
        })
        .end(done);

      })
    });

  });

  describe('/users endpoints', function() {


    it('Shoould POST an user', function(done) {
      var user = users[0];
      request(app)
      .post(BASE + '/users')
      .send(user)
      .expect(200)
      .end(function (err, res) {
        expect(res.body).toHaveProperty('id');
        user.id = res.body.id;
        done();
      })
    });

    it('Shoould POST a second user', function(done) {
      var user = users[1];
      request(app)
      .post(BASE + '/users')
      .send(user)
      .expect(200)
      .end(function (err, res) {
        expect(res.body).toHaveProperty('id');
        user.id = res.body.id;
        done();
      })
    });

    it('Should GET/:id an user', function ( done ) {

      var user = users[0];
      request(app)
      .get(BASE + '/users/' + user.id)
      .expect(200)
      .expect(response => {
        var obj = response.body;
        expect(obj.id).toEqual(user.id);
      })
      .end(done)

    })

    it('Should GET inserted users', function ( done ) {

      var user = users[0];
      request(app)
      .get(BASE + '/users')
      .expect(200)
      .expect(response => {
        var objs = response.body.users;
        expect(objs.length).toEqual(2);
      })
      .end(done)

    })

    it('Should DELETE an inserted user', function (done) {
      var user = users[0];
      request(app)
      .delete(BASE + '/users/' + user.id)
      .expect(201)
      .end(function (err, res) {

        request(app)
        .get(BASE + '/users/' + user.id)
        .expect(404)
        .end(done);

      })
    })

    it('Should PATCH an user', function(done) {
      var user = users[1];
      request(app)
      .patch(BASE + '/users/' + user.id)
      .send({username: 'juan'})
      .expect(200)
      .end(function (err, res) {

        request(app)
        .get(BASE + '/users/' + user.id)
        .expect(200)
        .expect((response) => {
          expect(response.body.username).toEqual('juan');
        })
        .end(done);

      })
    });

  });


})
