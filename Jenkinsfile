pipeline {
  agent any

  stages {
    stage('Validate Clean Workspace') {
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
        /*sh 'docker build -t oscardhdz/$DOCKER_IMAGE_NAME .'*/
        sh 'docker pull oscardhdz/$DOCKER_IMAGE_NAME'
      }
    }
    stage('Test') {
      steps {
        parallel(
          "SQLte": {
            sh 'docker run --name $DOCKER_SL_TEST --net=webapp -e DB_CLIENT=sqlite3 -e DB_FILE=sqlite  oscardhdz/$DOCKER_IMAGE_NAME npm test'
          },
          "PostgreSQL": {
            sh 'docker run --name $DOCKER_PG_TEST --net=webapp -e DB_CLIENT=pg -e DB_HOST=$DATABASE_CONTAINER_NAME -e DB_NAME=$DB_NAME -e DB_PASS=$DB_PASS -e DB_USER=$DB_USER oscardhdz/$DOCKER_IMAGE_NAME npm test'
          }
        )
      }
    }
    stage('Clean') {
      steps {
        sh 'echo Removing Contatainers:'
        sh 'docker rm -f $DOCKER_PG_TEST'
        sh 'docker rm -f $DOCKER_SL_TEST'
        sh 'docker rm -f $DATABASE_CONTAINER_NAME'
        sh 'docker network rm $DOCKER_NETWORK'

      }
    }
    stage('Artifact') {
      steps {
        script {
            withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'docker-hub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                sh 'echo uname=$USERNAME pwd=$PASSWORD'
                sh 'docker login -u $USERNAME -p $PASSWORD'
                sh 'docker logout'
            }
        }
      }
    }

    stage('Deploy') {
        steps {
            script {
                try {
                    sh 'ssh -i ~/.ssh/id_rsa ubuntu@18.221.9.232 "docker rm -f rest"'
                }
                catch (err) {
                    sh 'Docker: Unexisting container rest'
                }
            }
            sh 'ssh -i ~/.ssh/id_rsa ubuntu@18.221.9.232 "docker pull oscardhdz/$DOCKER_IMAGE_NAME && docker run -d --network=nginx-proxy -p 3000:3000 --name=rest  -e VIRTUAL_HOST=manxdev.com -e VIRTUAL_NETWORK=nginx-proxy -e VIRTUAL_PORT=3000  -e LETSENCRYPT_HOST=manxdev.com -e LETSENCRYPT_EMAIL=oscardavid.hernandez.mx@gmail.com  oscardhdz/rest-app"'
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
