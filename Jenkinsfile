@Library('pipeline-utils')_  // it's not a typo

def qa_url = "https://getmarketplace-qa.staging.gapps.platformos.com/"
def live_url = "https://getmarketplace.staging.gapps.platformos.com/"
def pr_url = "https://getmarketplace-dg.staging.gapps.platformos.com/"

pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    timeout(time: 4, unit: 'MINUTES')
    buildDiscarder(logRotator(daysToKeepStr: '1', artifactDaysToKeepStr: '1'))
  }

  stages {
    stage('build PR') {
      agent { docker {image 'node:12-alpine'; args '-u root' } }
      when { expression { env.BRANCH_NAME != 'master' } }
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
      when { expression { env.BRANCH_NAME != 'master' } }
      environment {
        MPKIT_URL = "${pr_url}"
      }

      agent { docker { image "platformos/testcafe" } }
      steps {
        sh 'testcafe "chromium:headless" test --skip-js-errors'
      }
      post { failure { archiveArtifacts "screenshots/" } }
    }

    // MASTER

    stage('build') {
      when { branch 'master' }

      agent { docker {image 'node:12-alpine'; args '-u root' } }
      steps {
        sh 'npm ci'
        sh 'npm run build'
      }
    }

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
