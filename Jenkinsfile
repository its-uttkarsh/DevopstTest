pipeline {
  agent {
    node {
      label 'index '
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
  environment {
    a = '1'
    b = '2'
  }
}