var express = require('express');
var knex = require('../KnexDB.js');
var _ = require('lodash');
var router = express.Router();

var {Todo, TABLE_NAME, ALLOWED_PARAMS} = require('../models/Todo');

router.get('/todos', (req, res) => {
  knex(TABLE_NAME).select('*')
  .then((todos) => {
    res.status(200).send({todos})
  })
  .catch((err) => {
    res.status(400).send(err);
  })
})

router.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if ( +id ) {
    knex(TABLE_NAME).select('*').where({id})
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

router.post('/todos', (req, res) => {

  var data = _.pick(req.body, ALLOWED_PARAMS);
  var todo = new Todo(data);

  if ( todo.Validate() ) {

    delete todo.id;

    knex(TABLE_NAME).insert(todo).returning('*')
    .then((insertedTodo) => {
      if ( process.env.DB_CLIENT === 'sqlite3' ) return res.status(200).send({id: insertedTodo[0]})
      res.status(200).send(insertedTodo[0])
    })
    .catch((err) => res.status(500).status({error: err}))
  }
  else res.status(400).send({message: 'Bad Input Data'})



})

router.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var data = _.pick(req.body, ALLOWED_PARAMS);


  if ( +id ) {
    knex(TABLE_NAME).update(data).where({id}).returning('*')
    .then((todo) => {
      if ( process.env.DB_CLIENT === 'sqlite3' ) return  res.sendStatus(200);
      if ( todo[0] ) res.status(200).send(todo[0]);
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
