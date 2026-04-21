pipeline {
  agent {
    node {
      label 'start'
    }

  }
  stages {
    stage('devops1') {
      steps {
        bat 'echo "Deploying Application"'
      }
    }

    stage('devops2') {
      steps {
        echo 'print(devops2)'
      }
    }

  }
}