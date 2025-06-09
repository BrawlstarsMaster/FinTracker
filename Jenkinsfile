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
                        echo "Docker is not installed in Jenkins environment. Skipping deployment."
                        echo "To enable deployment, install Docker in the Jenkins environment:"
                        echo "1. Install Docker: sudo apt-get install docker.io"
                        echo "2. Add Jenkins user to docker group: sudo usermod -aG docker jenkins"
                        echo "3. Restart Jenkins: sudo systemctl restart jenkins"
                        exit 0
                    fi
                    
                    if ! command -v docker-compose &> /dev/null; then
                        echo "Docker Compose is not installed in Jenkins environment. Skipping deployment."
                        echo "To enable deployment, install Docker Compose: sudo apt-get install docker-compose"
                        exit 0
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