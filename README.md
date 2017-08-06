# Configure your machine
1. Install Nodemon CLI to run start API Daemon with:  
``npm install -g nodemon``
2. Install [KnexJS](http://knexjs.org/#Migrations-API) CLI to handle migrations/seeds manually:  
``npm install -g knex``  
3. Install [Docker](https://docs.docker.com/engine/installation/#supported-platforms) for running postgres/api containers

# Getting Started with Example
1. Install dependencies  
``npm install``
2. Run/Start postgresql container with:  
``npm run docker-run-postgres``    
This container has the following configuration:
   * Database name: **db_api**
   * Database user: **developer**
   * Database user password: **qwerty**
3. ...
