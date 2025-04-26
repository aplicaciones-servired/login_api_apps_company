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

        stage('down docker compose'){
            steps {
                script {
                    sh 'sudo docker compose down'
                }
            }
        }

        stage('delete images if exist') {
            steps{
                script {
                    def images = 'login:v1.0'
                    if (sh(script: "docker images -q ${images}", returnStdout: true).trim()) {
                        sh "sudo docker rmi ${images}"
                    } else {
                        echo "Image ${images} does not exist."
                        echo "continuing..."
                    }
                }
            }
        }
        stage('run docker compose'){
            steps {
                script {
                    sh 'sudo docker compose up -d'
                }
            }
        }
    }
}