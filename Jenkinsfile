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
      parallel {
        stage('Test') {
          steps {
            sh 'test -f index.html'
          }
        }

        stage('Test1') {
          steps {
            echo 'test1'
          }
        }

      }
    }

  }
  environment {
    a = '1'
    b = '2'
  }
}