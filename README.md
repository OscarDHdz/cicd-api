# Configure your machine for development
1. Install Nodemon CLI to run start API Daemon with:  
``npm install -g nodemon``
2. Install [KnexJS](http://knexjs.org/#Migrations-API) CLI to handle migrations/seeds manually:  
``npm install -g knex``  
3. Install [Docker](https://docs.docker.com/engine/installation/#supported-platforms) for running postgres/api containers

# Getting Started with Example
You have 3 options to run this example.
1. Local API
2. Docker API Image
3. Automated Solution (single solution)

## **Important!**
Before you start runnig the API, you need to have any postgresql empty database with the following parameters:
* Host - IP Address for the database connection
* Database name - Name for the Database that API will use
* Database user - User which must have permission for given database name
* Database user password - Password for previous user

If you dont have any postgresql database up, you can use the provided docker solution by Running a postgresql container with:  

``npm run docker-run-postgres``    

This container has the following configuration:
   * Database name: **db_api**
   * Database user: **developer**
   * Database user password: **qwerty**
   * Database Host (IP Address):
     * If you are using _LINUX_: Use localhost has **DB_HOST**
     * If you are using _MAC_ or _Windows_, your docker daemon might be running on a docker-machine. Type `docker-machine ip` to get It's IP adress and use it as: **DB_HOST**



## Running local API - Development
This options will let you run this API with your Terminal/Console using Postgres Container. Recommended for development as this uses nodemon to watch any change and restart.
1. Install dependencies  
``npm install``
2. Set Database configuration parameters into `server/configs/configs.js` module
3. Run API  
``npm start``

## Running Docker API Image
This option will build and run a docker image out of this API and will connect to any provided postgressql database configuration
1. Build Image with:  
``docker build -t ... .``
2. Run Image by setting Database Env variables (DB_HOST, DB_USER, DB_PASS) with:  
``docker run --name cicd_api -e DB_HOST="" -e DB_USER="" -e DB_PASS="" ...``  


## Running Automated Solution (Docker-Compose)
This options will generate two containers: One for the API and another for the postgressql

....
