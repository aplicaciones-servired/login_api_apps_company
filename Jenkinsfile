pipeline {
    agent any

    tools { nodejs 'node-v22' }

    environment {
      ENV_API_LOGIN = credentials('ENV_API_LOGIN')
    }

    stages {
      stage('Copy .env files') {
        steps {
          script {
            def envApiContent = readFile(ENV_API_LOGIN)
            writeFile file: './server/.env', text: envApiContent
          }
        }
      }

      stage('Install Dependencies client and server') {
        steps {
          dir('client') {
            sh 'bun install'
            sh 'bun run build'
          }
          dir('server') {
            sh 'bun install'
            sh 'bun run build'
          }
        }
      }


      stage('down docker compose') {
        steps {
          script {
            sh 'sudo docker compose down'
          }
        }
      }

      stage('delete images if exist') {
        steps {
          script {
            def images = 'api-login:v2.2'
            if (sh(script: "docker images -q ${images}", returnStdout: true).trim()) {
              sh "sudo docker rmi ${images}"
                      } else {
              echo "Image ${images} does not exist."
              echo 'continuing...'
            }
          }
        }
      }

      stage('run docker compose') {
        steps {
          script {
            sh 'sudo docker compose up -d'
          }
        }
      }
    }
}
