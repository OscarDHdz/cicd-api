pipeline {
  agent any
  stages {
    stage('Initialize') {
      steps {
        parallel(
          "Node Container": {
            sh 'docker run --name node_wrapper -v $WORKSPACE:/home/workspace  -d node:latest'
            
          },
          "PostgreSQL Container": {
            sh 'docker run --name pg_wrapper  -p 5432:5432  -v cicd_pg:/var/lib/postgresql/data  -e POSTGRES_DB=db_api  -e POSTGRES_USER=developer  -e POSTGRES_PASSWORD=qwerty  -d postgres'
            
          },
          "Test": {
            sh 'echo $WORKSPACE'
            
          }
        )
      }
    }
    stage('Build') {
      steps {
        sh 'echo \'Initialized\''
      }
    }
  }
}