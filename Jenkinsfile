pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'chmod -R 755 node_modules/.bin'
                }
                dir('frontend') {
                    sh 'npm install'
                    sh 'chmod -R 755 node_modules/.bin'
                }
            }
        }

        stage('Build') {
            steps {
                dir('frontend') {
                    sh '''
                        export PATH=$PATH:$(pwd)/node_modules/.bin
                        ./node_modules/.bin/react-scripts build
                    '''
                }
            }
        }

        stage('Test') {
            steps {
                dir('backend') {
                    sh '''
                        export PATH=$PATH:$(pwd)/node_modules/.bin
                        ./node_modules/.bin/jest
                    '''
                }
                dir('frontend') {
                    sh '''
                        export PATH=$PATH:$(pwd)/node_modules/.bin
                        ./node_modules/.bin/react-scripts test --watchAll=false
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
} 