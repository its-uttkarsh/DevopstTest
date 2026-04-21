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
        error 'there\'s an error'
        bat 'echo "Deploying application"'
      }
    }

  }
}