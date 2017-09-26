var express = require('express');
var knex = require('../KnexDB.js');
var _ = require('lodash');
var router = express.Router();

var {User, TABLE_NAME, ALLOWED_PARAMS} = require('../models/User');

router.get('/users', (req, res) => {
  knex(TABLE_NAME).select('*')
  .then((users) => {
    res.status(200).send({ users})
  })
  .catch((err) => {
    res.status(400).send(err);
  })
})

router.get('/users/:id', (req, res) => {
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

router.delete('/users/:id', (req, res) => {
  var id = req.params.id;
  if ( +id ) {
    knex(TABLE_NAME).where({id}).del()
    .then((todo) => {
      res.sendStatus(201)
    })
    .catch((err) => {
      res.status(500).send(err);
    })
  }
  else {
    res.status(400).send({message: 'Invalid Id'})
  }
})

router.post('/users', (req, res) => {

  var data = _.pick(req.body, ALLOWED_PARAMS);
  var user = new User(data);

  if ( user.Validate() ) {

    delete user.id;

    knex(TABLE_NAME).insert(user).returning('*')
    .then((insertedUser) => {
      if ( process.env.DB_CLIENT === 'sqlite3' ) return res.status(200).send({id: insertedUser[0]})
      res.status(200).send(insertedUser[0])
    })
    .catch((err) => res.status(500).status({error: err}))
  }
  else res.status(400).send({message: 'Bad Input Data'})



})

router.patch('/users/:id', (req, res) => {
  var id = req.params.id;
  var data = _.pick(req.body, ALLOWED_PARAMS);


  if ( +id ) {
    knex(TABLE_NAME).update(data).where({id}).returning('*')
    .then((user) => {
      if ( process.env.DB_CLIENT === 'sqlite3' ) return  res.sendStatus(200);
      if ( user[0] ) res.status(200).send(user[0])
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
