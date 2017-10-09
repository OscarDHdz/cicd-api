pipeline {
  agent any
  stages {
    stage('Initialize') {
      steps {
        sh 'echo \'Hello World from pipeline branch!\''
        sh 'echo This message comes from a Git Push'
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
    DOCKER_IMAGE_NAME = 'rest-app'
  }
}
