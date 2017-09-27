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
            sh 'docker run --name pg_wrapper  -p 5432:5432  -v cicd_pg:/var/lib/postgresql/data  -e POSTGRES_DB=db_api  -e POSTGRES_USER=developer  -e POSTGRES_PASSWORD=qwerty  -d postgres:$PG_CONTAINER_TAG'
            
          }
        )
      }
    }
    stage('Build') {
      steps {
        sh 'docker run --name node_install  -v $WORKSPACE:/home/workspace  -d node:latest  npm install'
      }
    }
  }
  environment {
    NODE_CONTAINER_TAG = 'alpine'
    PG_CONTAINER_TAG = 'latest'
  }
}