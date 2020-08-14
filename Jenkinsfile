@Library('pipeline-utils')_  // it's not a typo

// def qa_url = "https://demo.staging.gapps.platformos.com/"
def qa_url = "https://getmarketplace-qa.staging.gapps.platformos.com/"
def live_url = "https://getmarketplace.staging.gapps.platformos.com/"

pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    timeout(time: 4, unit: 'MINUTES')
    buildDiscarder(logRotator(daysToKeepStr: '1', artifactDaysToKeepStr: '1'))
  }

  stages {
    stage('build') {
      when { branch 'master' }

      agent { docker {image 'node:12-alpine'; args '-u root' } }
      steps {
        sh 'npm ci -S'
        sh 'npm run build'
      }
    }

    stage('Deploy QA') {
      when { branch 'master' }
      environment {
        MPKIT_TOKEN = credentials('POS_TOKEN')
        MPKIT_EMAIL = "darek+ci@near-me.com"
        MPKIT_URL = "${qa_url}"
        CI = true
      }
      agent { docker { image 'platformos/pos-cli' } }
      steps {
        sh 'pos-cli deploy'
      }
    }

    stage('Test') {
      when { branch 'master' }
      environment {
        MPKIT_URL = "${qa_url}"
      }

      agent { docker { image "platformos/testcafe" } }
      steps {
        sh 'testcafe "chromium:headless" test --skip-js-errors'
      }
      post { failure { archiveArtifacts "screenshots/" } }
    }

    stage('Deploy LIVE') {
      when { branch 'master' }
      environment {
        MPKIT_TOKEN = credentials('POS_TOKEN')
        MPKIT_EMAIL = "darek+ci@near-me.com"
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
