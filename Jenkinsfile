pipeline {
  agent any

  stages {

    stage('Clean up') {
        steps {
            script {
                deleteDir()
            }
            script {
                try {
                    sh 'docker rm -f $DOCKER_SL_TEST'
                }
                catch (exc) {
                    sh 'echo Docker: $DOCKER_SL_TEST Container not found.'
                }
            }
            script {
                try {
                    sh 'docker rm -f $DOCKER_PG_TEST'
                }
                catch (exc) {
                    sh 'echo Docker: $DOCKER_PG_TEST Container not found.'
                }
            }
            script {
                try {
                    sh 'docker rm -f $DATABASE_CONTAINER_NAME'
                }
                catch (exc) {
                    sh 'echo Docker: $DATABASE_CONTAINER_NAME Container not found.'
                }
            }
            script {
                try {
                    sh 'docker network rm $DOCKER_NETWORK'
                }
                catch (exc) {
                    sh 'echo Docker: $DOCKER_NETWORK Network not found.'
                }
            }
        }
    }

    stage('Initialize') {
      steps {
        git([url: 'https://github.com/OscarDHdz/rest-app.git', branch: 'master'])
      }
    }
    stage('Preparation') {
      steps {
        parallel(
          "Create Network": {
              sh 'docker network create webapp'
          },
          "Pull Docker Images": {
            sh '''docker pull node:$NODE_CONTAINER_TAG
docker pull postgres:$PG_CONTAINER_TAG'''
            sh 'docker run --name $DATABASE_CONTAINER_NAME --net=webapp -p 5432:5432  -e POSTGRES_DB=$DB_NAME -e POSTGRES_USER=$DB_USER -e POSTGRES_PASSWORD=$DB_PASS -d postgres:$PG_CONTAINER_TAG'
          }
        )
      }
    }
    stage('Build') {
      steps {
        sh 'docker build -t oscardhdz/$DOCKER_IMAGE_NAME .'
      }
    }
    stage('Test') {
      steps {
        parallel(
          "Test": {
            sh 'docker run --name $DOCKER_SL_TEST --net=webapp -e DB_CLIENT=sqlite3 -e DB_FILE=sqlite  oscardhdz/$DOCKER_IMAGE_NAME npm test'
          },
          "error": {
            sh 'docker run --name $DOCKER_PG_TEST --net=webapp -e DB_CLIENT=pg -e DB_HOST=$DATABASE_CONTAINER_NAME -e DB_NAME=$DB_NAME -e DB_PASS=$DB_PASS -e DB_USER=$DB_USER oscardhdz/$DOCKER_IMAGE_NAME npm test'
          }
        )
      }
    }
    stage('Clean') {
      steps {
        sh '''echo 'Removing Postgres container'
docker rm -f webapp_pgdb'''
        sh '''echo 'Removing docker network'
docker network rm webapp'''
      }
    }
    stage('Artifact') {

      steps {


        sh 'echo Hello World'


      }
    }
  }
  environment {
    NODE_CONTAINER_TAG = '6-alpine'
    PG_CONTAINER_TAG = 'latest'
    DB_NAME = 'testdb'
    DB_FILE = 'testdb'
    DB_USER = 'developer'
    DB_HOST = 'localhost'
    DB_PASS = 'qwerty'
    DATABASE_CONTAINER_NAME = 'webapp_pgdb'
    DOCKER_IMAGE_NAME = 'rest-app'
    DOCKER_NETWORK = 'webapp'
    DOCKER_PG_TEST = 'webapp_postgres'
    DOCKER_SL_TEST = 'webapp_sqlite'
  }
}
