pipeline {
    agent { docker { image 'node:14-alpine' } }
    stages {
        stage('build') {
            steps {
                bat 'npm --version'
            }
        }
    }
}
