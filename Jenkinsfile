pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'fintrack'
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_REGISTRY = "SvetoslavVachkov" // Docker Hub username
        DOCKER_CREDENTIALS_ID = "docker-hub-credentials" // Jenkins credential ID for Docker Hub
    }

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
                }
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Test') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
                dir('frontend') {
                    sh 'npm test'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -f backend.Dockerfile .'
                sh 'docker build -t ${DOCKER_IMAGE}-frontend:${DOCKER_TAG} -f frontend.Dockerfile .'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d'
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh 'echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin ${DOCKER_REGISTRY}'
                        sh 'docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}'
                        sh 'docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}-frontend:${DOCKER_TAG}'
                    }
                }
            }
        }

        stage('Deploy to Kubernetes (ArgoCD will handle this)') {
            steps {
                echo 'This stage is a placeholder. ArgoCD will handle the actual deployment to Kubernetes by monitoring the Git repository for changes in Kubernetes manifests.'
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