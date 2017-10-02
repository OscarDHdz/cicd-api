# Rest-app
This repo has an automated Docker Hub build. You can check It out at:

| Source                                                     |
|------------------------------------------------------------|
| [GitHub](https://github.com/OscarDHdz/rest-app)            |
| [Docker Hub](https://hub.docker.com/r/oscardhdz/rest-app/) |

# Quick Start Guide
You can run this RESTful API with as a **Standalone** web service or as a **Docker container**.
And for either case, you choice what to use, a **SQLite** or **PostgreSQL** database.


## **Docker container**
If you are reading this from Docker Hub, this section Is for you! Following sections are aimed only for dev. deployment.

### Quick Run!
```
docker run --name rest-app -p 3000:3000 oscardhdz/rest-app
```

### Configuration
You have two options, use **SQLite** (Default options), or connect to an existing **PostgreSQL** database.

#### SQLite
By default this option is selected. You need to specify the following Environment variables:
* `DB_CLIENT`=sqlite3
* `DB_FILE`={SQLiteDatabaseFileName}

Database Volume:
* `/home/api/database`

#### PostgreSQL
You must set the following environment variables:
* `DB_CLIENT`=pg
* `DB_HOST`={PostgreSQLHost}
* `DB_NAME`={EmptyDatabaseName}
* `DB_USER`={UserNameWhomeHasAccessToDB_NAME}
* `DB_PASS`={PasswordForDB_USERCredential}

## **Standalone (local deployment)**
### Start
  1. Install dependencies   
  ```  
  npm install
  ```
  2. Start Web service
  ```
  npm start
  ```  
  3. Start making `POST, GET, PATCH & DELETE` requests at `http://localhost:3000/_api/v1/` for:

* `/todos` & `/todos/:id` Model:   

  ```
  {
    id: [int]
    title:  [string],
    body: [string],
    completed: [boolean],
  }
  ```  


* `/users` & `/users/:id` Model:    

    ```
    {
      id: [int]
      username:  [string],
    }
    ```

#### **Important**
  By default **SQLite** is selected for storage, so you can hit start and Web Service will create local database. If you want to select **PostgreSQL** as storage, or specify **SQLite** filename, continue to Configuration section..

### Configuration
  Replace attributes from `development` object at `/server/configs/configs.js` to match your needs.

  ```
  development: {
    NODE_ENV: 'development',
    PORT: 3000,
    VALIDATE_DB: 'ON',
    ...
  }
  ```

If you want to use SQLite (Default), set:
  * DB_CLIENT to **'sqlite3'**
  * DB_FILE to give a name to the SQLite database    

    ```
    development: {
      DB_CLIENT: process.env.DB_CLIENT || 'sqlite3',
      DB_FILE: process.env.DB_FILE || {{YourSQLiteFileName}}
    }
    ```

If you want to use PostgreSQL, set:  
  * DB_CLIENT to **'pg'**
  * DB_HOST to PostgreSQL host
  * DB_NAME to target empty database
  * DB_USER to user with Rights over provided DB_NAME
  * DB_PASS to DB_USER's password  

    ```
    development: {
      DB_CLIENT: process.env.DB_CLIENT || 'pg',
      DB_HOST: process.env.DB_HOST || {{PostgreSQLHost}},
      DB_NAME: process.env.DB_NAME || {{EmptyDatabaseName}},
      DB_USER: process.env.DB_USER || {{DB_NAMEUser}},
      DB_PASS: process.env.DB_PASS || {{DB_USERPassword}},
    }
    ```



# How It Works?
  Having an empty postgressql database, this API will:
  1. Validate connection to Database by calling `knex.migrate.currentVersion()` inside _**KnexDB.js**_
  2. Validate Database version by:
    1. Calling `knex.migrate.latest()` inside _**KnexDB.js**_
    2. Knex will detect that database is empty and will generate its schema by executing migrations sciprts inside `server/migrations` by ASC order. in this cas: First _todo_schema_, then _users_schema_
    3. Knex will set table _**knex_migrations**_ to save a checkpoint for this ran migrtions.
    ![knex_migartions](./knex_migrations.PNG)
  3. Start listening on port 3000  

  If everithing was correct, you should get something like this printed on your terminal:
  ![npm_start](./npm_start.PNG)

# Configure your machine for development
  1. Install Nodemon CLI:  
  ```
  npm install -g nodemon
  ```

  2. Install [KnexJS](http://knexjs.org/#Migrations-API) CLI:  
  ```
  npm install -g knex
  ```  
  3. (OPTIONAL) Install [Docker](https://docs.docker.com/engine/installation/#supported-platforms) for running postgresql container
## PostgreSQL provided container
  If you dont have any postgresql database up, you can use the provided docker docker-solution inside _**package.json**_ by Running a postgresql container with:  

  ```
  npm run docker-run-postgres
  ```

  This container has the following configuration:
     * Database name (**DB_NAME**): **db_api**
     * Database user (**DB_USER**): **developer**
     * Database user password (**DB_PASS**): **qwerty**
     * Database Host (**DB_HOST**):
       * If you are using _LINUX_: Use localhost
       * If you are using _MAC_ or _Windows_, your docker daemon might be running on a docker-machine. Type `docker-machine ip` to get It's IP address and use it



# Why CI/CD?
  The key for these features is [KnexJs](www.knexjs.org) library for handling comunication between API and DB.

  What does KnexJS do??, is you start using it's own migrations API, It creates a couple of tables on the database provided for handling Database versioning. Basically the information stored in this tables is:
  1. A row for each migration script that has been run
  2. For all rows, it adds an integer that stores in which migration was executed that script (**version**).

  Thanks to this, Knex is able to compare which sripts has been executed or not. For Example: If in the migrations folder there are scripts A, B and C; and database has stored only scipts A and B, next time Knex execute its migration API It will execute script C in order to have Database on latest version.


  ![knex_migartions](./knex_migrations.PNG)
  * In this picture, you can see that the firs migration ran todo and users scripts.

# How to Use KnexJS Migrations API
  You can use It either by CLI or It's own module.

  First of all, you need to have configured your _knexfile_ which basically contains the connection object.

  ```
  module.exports = {
    development: {
      client: 'pg',
      connection: {
        host : '127.0.0.1',
        user : 'developer',
        password : 'qwerty',
        database : 'db_api'
      },
      migrations: {
        directory: __dirname + '/migrations'
      },
      seeds: {
        directory: __dirname + '/seeds'
      }
    }
  }
  ```
  Then, you need to have a folder called 'migrations' (provided also at previous connection object). Right there, all your migrations scripts will be stored and Knex will have aknowledge of it.

  Now, for using the migration API, pretty much you can call it either by CLI or Its own module

  Finally you need to be in the same path as your 'knexfile', as CLI command is gonna read it to get the connection ojbect.  
## Creating a Migration Script
  ```
  knex migrate:make "Name_Of_Your_Script"
  ```

  This will create on your migrations folder a file named with a timestap and the given name.
### Migration Script Structure
  Each script consist in an Up and Down function which are required to return the Promise parameter.
  1. Up - Is executed when migration.latests is called
  2. Down - Is executed when migration.rollback is called

  ```
  exports.up = function(knex, Promise) {

  };

  exports.down = function(knex, Promise) {

  };
  ```
## Running a migration
  ```
  knex migrate:latest
  ```
  Knex will execute all scripts that has not been executed scinec last migration

  This is the key for having an API with CI/CD. Basically you can call this by:

  ```
  knex.migrate.latest().then...
  ```
  At the initialization of tour API, at It will enforce the database to be on the latest version before the API start recieveing requests.

  _**You can see this in action on `KnexDB.js` file**_
## Rollback a migration
  ```
  knex migrate:rollback
  ```
  Knex will execute each scripts from latest migration by calling their `down` function
