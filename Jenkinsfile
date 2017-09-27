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
            sh 'docker run --name webapp_pg_wrapper  -p 5432:5432  -v cicd_pg:/var/lib/postgresql/data  -e POSTGRES_DB=db_api  -e POSTGRES_USER=developer  -e POSTGRES_PASSWORD=qwerty  -d postgres:$PG_CONTAINER_TAG'
            
          }
        )
      }
    }
    stage('Build') {
      steps {
        sh 'docker run --name webapp_node_wrapper  -v $WORKSPACE:/home/workspace  node:latest  npm install'
      }
    }
    stage('Test') {
      steps {
        sh 'docker run --name webapp_node_test  -v $WORKSPACE:/home/workspace  node:latest  npm test'
      }
    }
  }
  environment {
    NODE_CONTAINER_TAG = 'alpine'
    PG_CONTAINER_TAG = 'latest'
  }
}