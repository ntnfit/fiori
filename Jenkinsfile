@Library('piper-lib@v1.145.0') _

call script: this

void call(parameters) {
    pipeline {
        agent any
        options {
            timeout(time: 120, unit: 'MINUTES')
            timestamps()
            buildDiscarder(logRotator(numToKeepStr: '50', artifactNumToKeepStr: '50'))
            skipDefaultCheckout()
            disableConcurrentBuilds()
        }
        stages {
            stage('Init') {
                steps {
                    withCredentials([usernameColonPassword(credentialsId: 'mavenlogin', variable: 'MAVENLOGIN')]) {
                        sh '''
                        bash
                        curl -x 10.4.103.139:8080 -U "${MAVENLOGIN}" https://repo.maven.apache.org/maven2
                        sudo docker login -u orastark -p ${DOCKERLOGIN}
                  		'''
                    }
                    piperPipelineStageInit script: parameters.script, customDefaults: ['com.sap.piper/pipeline/stageOrdinals.yml'].plus(parameters.customDefaults ?: [])
                }
            }
            stage('Pull-Request Voting') {
                //when { anyOf { branch 'PR-*'; branch parameters.script.commonPipelineEnvironment.getStepConfiguration('piperPipelineStagePRVoting', 'Pull-Request Voting').customVotingBranch } }
                steps {
                    piperPipelineStagePRVoting script: parameters.script
                }
            }
            stage('Build') {
                //when {branch parameters.script.commonPipelineEnvironment.getStepConfiguration('', '').productiveBranch}
                steps {
                    piperPipelineStageBuild script: parameters.script
                }
            }
//             stage("Quality Gate") {
//                 steps {
//                     waitForQualityGate abortPipeline: true
//                 }
//             }
            stage('Release') {
                //when {allOf {branch parameters.script.commonPipelineEnvironment.getStepConfiguration('', '').productiveBranch; expression {return parameters.script.commonPipelineEnvironment.configuration.runStage?.get(env.STAGE_NAME)}}}
                when{
                    anyOf{
                        expression{env.BRANCH_NAME == 'master'}
                        expression{env.BRANCH_NAME == 'quality'}
                        expression{env.BRANCH_NAME == 'develop'}
                    }
                }
                steps {
                    piperPipelineStageRelease script: parameters.script
                }
            }
        }
        post {
            success {buildSetResult(currentBuild)}
            aborted {buildSetResult(currentBuild, 'ABORTED')}
            failure {buildSetResult(currentBuild, 'FAILURE')}
            unstable {buildSetResult(currentBuild, 'UNSTABLE')}
            cleanup {
                piperPipelineStagePost script: parameters.script
            }
        }
    }
}