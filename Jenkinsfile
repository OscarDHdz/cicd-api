pipeline {
  agent any
  stages {
    stage('Initialize') {
      steps {
        parallel(
          "Create Network": {
            sh 'docker network create webapp'
            
          },
          "Pull Docker Images": {
            sh '''docker pull node:$NODE_CONTAINER_TAG
docker pull postgres:$PG_CONTAINER_TAG'''
            
          }
        )
      }
    }
    stage('Preparation') {
      steps {
        sh 'docker run --name $DATABASE_CONTAINER_NAME --net=webapp -p 5432:5432  -e POSTGRES_DB=$DB_NAME -e POSTGRES_USER=$DB_USER -e POSTGRES_PASSWORD=$DB_PASS -d postgres:$PG_CONTAINER_TAG'
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
          "Test": {
            sh 'docker run --name webapp_sqlite --net=webapp -e DB_CLIENT=sqlite3 -e DB_FILE=sqlite  oscardhdz/webapp npm test'
            sh 'docker rm -f webapp_sqlite'
            
          },
          "error": {
            sh 'docker run --name webapp_postgres --net=webapp -e DB_CLIENT=pg -e DB_HOST=$DATABASE_CONTAINER_NAME -e DB_NAME=$DB_NAME -e DB_PASS=$DB_PASS -e DB_USER=$DB_USER oscardhdz/webapp npm test'
            sh 'docker rm -f webapp_postgres'
            
          }
        )
      }
    }
    stage('Clean') {
      steps {
        parallel(
          "Workspace": {
            cleanWs(cleanWhenSuccess: true)
            
          },
          "Docker": {
            sh '''echo 'Removing Postgres container'
docker rm -f webapp_pgdb'''
            sh '''echo 'Removing docker network'
docker network rm network'''
            
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
    DB_USER = 'developer'
    DB_HOST = 'localhost'
    DB_PASS = 'qwerty'
    DATABASE_CONTAINER_NAME = 'webapp_pgdb'
  }
}