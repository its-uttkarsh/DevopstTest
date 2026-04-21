pipeline {
  agent {
    node {
      label 'start'
    }

  }
  stages {
    stage('devopstest') {
      steps {
        echo 'test application'
        bat 'echo "Deploying application"'
      }
    }

  }
}