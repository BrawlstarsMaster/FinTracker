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
                        ./node_modules/.bin/jest --passWithNoTests
                    '''
                }
                dir('frontend') {
                    sh '''
                        export PATH=$PATH:$(pwd)/node_modules/.bin
                        ./node_modules/.bin/react-scripts test --watchAll=false --passWithNoTests
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    if ! command -v docker &> /dev/null; then
                        echo "Docker is not installed. Please install Docker first."
                        exit 1
                    fi
                    
                    if ! command -v docker-compose &> /dev/null; then
                        echo "Docker Compose is not installed. Please install Docker Compose first."
                        exit 1
                    fi
                    
                    echo "Stopping existing containers..."
                    docker-compose down || true
                    
                    echo "Starting containers..."
                    docker-compose up -d
                '''
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