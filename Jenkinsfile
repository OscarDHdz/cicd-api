pipeline {
  agent any
  stages {
    stage('Initialize') {
      steps {
        parallel(
          "Node Container": {
            sh 'docker pull node:$NODE_CONTAINER_TAG'
            
          },
          "PostgreSQL Container": {
            sh 'docker run --name webapp_pg_wrapper  -p 5432:5432  -v cicd_pg:/var/lib/postgresql/data  -e POSTGRES_DB=$DB_NAME -e POSTGRES_USER=$DB_USER -e POSTGRES_PASSWORD=$DB_PASS  -d postgres:$PG_CONTAINER_TAG'
            
          }
        )
      }
    }
    stage('Build') {
      steps {
        sh 'docker build -t oscardhdz/webapp .'
      }
    }
    stage('Test') {
      steps {
        parallel(
          "Test SQLite": {
            sh 'docker run -e DB_CLIENT=sqlite3 DB_FILE=sqlite --name webapp oscardhdz/webapp npm test'
            
          },
          "Test PostgreSQL": {
            sh 'docker run -e DB_CLIENT=pg DB_HOST=localhost -e DB_NAME=$DB_NAME -e DB_PASS=$DB_PASS -e DB_USER=$DB_USER --name webapp oscardhdz/webapp npm test'
            
          }
        )
      }
    }
  }
  environment {
    NODE_CONTAINER_TAG = 'alpine'
    PG_CONTAINER_TAG = 'latest'
    DB_NAME = 'testdb'
    DB_FILE = 'testdb'
    DB_USER = 'tester'
    DB_HOST = 'localhost'
    DB_PASS = 'qwerty'
  }
}