var express = require('express');
var knex = require('../KnexDB.js');
var _ = require('lodash');
var router = express.Router();

var {User, TABLE_NAME, ALLOWED_PARAMS} = require('../models/User');

router.get('/user', (req, res) => {
  knex(TABLE_NAME).select('*')
  .then((users) => {
    res.status(200).send({ users})
  })
  .catch((err) => {
    res.status(400).send(err);
  })
})

router.get('/user/:id', (req, res) => {
  var id = req.params.id;
  if ( +id ) {
    knex(TABLE_NAME).select('*').where({id})
    .then((todo) => {
      if ( todo[0] ) res.status(200).send(todo[0])
      else res.status(404).send({message: 'User Not Found'});
    })
    .catch((err) => {
      res.status(500).send(err);
    })
  }
  else {
    res.status(400).send({message: 'Invalid Id'})
  }
})

router.post('/user', (req, res) => {

  var data = _.pick(req.body, ALLOWED_PARAMS);
  var todo = new Todo(data);

  if ( todo.Validate() ) {

    delete todo.id;

    knex(TABLE_NAME).insert(todo).returning('*')
    .then((insertedTodo) => {
      res.status(200).send(insertedTodo[0])
    })
    .catch((err) => res.status(500).status({error: err}))
  }
  else res.status(400).send({message: 'Bad Input Data'})



})

router.patch('/user/:id', (req, res) => {
  var id = req.params.id;
  var data = _.pick(req.body, ALLOWED_PARAMS);


  if ( +id ) {
    knex(TABLE_NAME).update(data).where({id}).returning('*')
    .then((todo) => {
      if ( todo[0] ) res.status(200).send(todo[0])
      else res.status(404).send({message: 'Todo Not Found'});
    })
    .catch((err) => {
      res.status(500).send(err);
    })
  }
  else {
    res.status(400).send({message: 'Invalid Id'})
  }
})

module.exports = router;
