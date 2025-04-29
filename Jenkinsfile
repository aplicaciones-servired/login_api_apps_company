pipeline {
    agent any

    tools {
      nodejs 'node-v22'
    }

    environment {
      ENV_API_LOGIN = credentials('ENV_API_LOGIN')
    }

    stages {
      stage('Copy .env files') {
        steps {
          script {
            def envApiContent = readFile(ENV_API_LOGIN)
            writeFile file: './.env', text: envApiContent
          }
        }
      }

      stage('Install Bun') {
        steps {
          script {
              // Instalar Bun si no está ya instalado
              sh '''
              if ! command -v bun &> /dev/null; then
                  echo "Bun no está instalado. Instalando..."
                  curl -fsSL https://bun.sh/install | bash
                  export PATH="$HOME/.bun/bin:$PATH"
                  echo "Bun instalado correctamente."
              else
                  echo "Bun ya está instalado."
              fi
              '''
          }
        }
      }

      stage('Build Frontend with Bun') {
        steps {
          script {
              // Asegurarse de que Bun esté en el PATH
              sh '''
              export PATH="$HOME/.bun/bin:$PATH"
              '''
          }

          dir('client'){
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
            def images = 'api-login:v2.1'
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
