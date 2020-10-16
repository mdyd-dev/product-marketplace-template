@Library('pipeline-utils')_  // it's not a typo

def qa_url = "https://getmarketplace-qa.staging.gapps.platformos.com/"
def live_url = "https://getmarketplace.staging.gapps.platformos.com/"
def pr_url = "https://getmarketplace-dg.staging.gapps.platformos.com/"

def project_name = 'getmarketplace-template'
pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    timeout(time: 10, unit: 'MINUTES')
    buildDiscarder(logRotator(daysToKeepStr: '1', artifactDaysToKeepStr: '1'))
  }

  environment {
    PROJECT_NAME = "${env.BRANCH_NAME}-${env.GIT_COMMIT[0..5]}-${env.BUILD_ID}"
    GIT_AUTHOR   = commitAuthor()
    APP_VERSION  = "${env.GIT_COMMIT}"
  }

  stages {
    stage('build') {
      agent { docker {image 'node:12-alpine'; args '-u root' } }
      steps {
        sh 'npm ci'
        sh 'npm run build'
      }
    }

    stage('Deploy PR') {
      when { expression { env.BRANCH_NAME != 'master' } }
      environment {
        MPKIT_TOKEN = credentials('MPKIT_TOKEN')
        MPKIT_EMAIL = credentials('MPKIT_EMAIL')
        MPKIT_URL = "${pr_url}"
        CI = true
      }
      agent { docker { image 'platformos/pos-cli' } }
      steps {
        sh 'pos-cli data clean --auto-confirm --include-schema'
        sh 'pos-cli deploy'
        sh 'pos-cli data import --path=./seed/data.zip --zip'
      }
    }

    stage('Test PR') {
      options { timeout(time: 4, unit: 'MINUTES') }

      when { expression { env.BRANCH_NAME != 'master' } }
      environment {
        MPKIT_URL = "${pr_url}"
      }

      agent { docker { image "platformos/testcafe" } }
      steps {
        sh 'testcafe "chromium:headless" test --skip-js-errors'
      }
      post {
        failure {
          archiveArtifacts "screenshots/"
          script {
            if (env.BRANCH_NAME != 'master') {
              alert("${project_name} ${env.PROJECT_NAME} ${env.GIT_AUTHOR} Failed after ${buildDuration()}.")
            }
          }
        }
      }
    }

    // MASTER

    stage('Deploy QA') {
      when { branch 'master' }
      environment {
        MPKIT_TOKEN = credentials('MPKIT_TOKEN')
        MPKIT_EMAIL = credentials('MPKIT_EMAIL')
        MPKIT_URL = "${qa_url}"
        CI = true
      }
      agent { docker { image 'platformos/pos-cli' } }
      steps {
        sh 'pos-cli data clean --auto-confirm --include-schema'
        sh 'pos-cli deploy'
        sh 'pos-cli data import --path=./seed/data.zip --zip'
      }
    }

    stage('Test') {
      options { timeout(time: 4, unit: 'MINUTES') }
      when { branch 'master' }
      environment {
        MPKIT_URL = "${qa_url}"
      }

      agent { docker { image "platformos/testcafe" } }
      steps {
        sh 'testcafe "chromium:headless" test --skip-js-errors'
      }
      post {
        success {
          script {
            if (currentBuild.getPreviousBuild() && currentBuild.getPreviousBuild().getResult().toString() != "SUCCESS") {
              notify("${project_name} ${env.PROJECT_NAME} ${env.GIT_AUTHOR} Build is back to normal after ${buildDuration()}.")
            }
          }
        }
        failure {
          archiveArtifacts "screenshots/"
          script {
            alert("${project_name} ${env.PROJECT_NAME} ${env.GIT_AUTHOR} Failed after ${buildDuration()}.")
          }
        }
      }
    }

    stage('Deploy LIVE') {
      when { branch 'master' }
      environment {
        MPKIT_TOKEN = credentials('MPKIT_TOKEN')
        MPKIT_EMAIL = credentials('MPKIT_EMAIL')
        MPKIT_URL = "${live_url}"
        CI = true
      }
      agent { docker { image 'platformos/pos-cli' } }
      steps {
        sh 'pos-cli deploy'
      }
    }
  }
}
