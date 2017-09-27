pipeline {
  agent {
    docker {
      image 'node:latest'
    }
    
  }
  stages {
    stage('Initialize') {
      steps {
        sh 'node -v'
      }
    }
  }
}