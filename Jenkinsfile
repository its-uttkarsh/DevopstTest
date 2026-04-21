pipeline {
  agent {
    node {
      label 'index '
    }

  }
  stages {
    stage('Build') {
      steps {
        bat 'echo "Deploying Application"'
      }
    }

    stage('Test') {
      steps {
        sh 'test -f index.html'
      }
    }

  }
  environment {
    a = '1'
    b = '2'
  }
}