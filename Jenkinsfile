pipeline {
    agent any

    environment {
        // 사용하던 Jenkins Credentials
        MYSQL_PW = credentials('MYSQL_PW')
        GOOGLE_CLIENT_ID = credentials('GOOGLE_CLIENT_ID')
        GOOGLE_CLIENT_SECRET = credentials('GOOGLE_CLIENT_SECRET')
        FASTAPI_URL = 'http://rag_pipeline:8000'
        PINECONE_API_KEY = credentials('PINECONE_API_KEY')
        UPSTAGE_API_KEY = credentials('UPSTAGE_API_KEY')
        OPENAI_API_KEY = credentials('OPENAI_API_KEY')
        KAKAO_API_KEY = credentials('KAKAO_API_KEY')

        // GitLab Access Token (Webhook 인증용)
        GITLAB_ACCESS_TOKEN = credentials('GITLAB_ACCESS_TOKEN')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: 'release2']],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [],
                    userRemoteConfigs: [[
                        url: 'https://lab.ssafy.com/s12-webmobile1-sub1/S12P11A107.git',
                        credentialsId: 'GITLAB_ACCESS_TOKEN'
                    ]]
                ])
            }
        }

        stage('Create .env files') {
            steps {
                script {
                    withEnv([
                        "MYSQL_PW=${env.MYSQL_PW}",
                        "GOOGLE_CLIENT_ID=${env.GOOGLE_CLIENT_ID}",
                        "GOOGLE_CLIENT_SECRET=${env.GOOGLE_CLIENT_SECRET}",
                        "FASTAPI_URL=${env.FASTAPI_URL}",
                        "PINECONE_API_KEY=${env.PINECONE_API_KEY}",
                        "UPSTAGE_API_KEY=${env.UPSTAGE_API_KEY}",
                        "OPENAI_API_KEY=${env.OPENAI_API_KEY}",
                        "KAKAO_API_KEY=${env.KAKAO_API_KEY}"
                    ]) {
                        sh '''
                            # ---- 백엔드/레거시용 .env ----
                            echo "MYSQL_PW=$MYSQL_PW" > .env
                            echo "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" >> .env
                            echo "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET" >> .env
                            echo "FASTAPI_URL=https://tarotvora.com/rag" >> .env
                            echo "PINECONE_API_KEY=$PINECONE_API_KEY" >> .env
                            echo "UPSTAGE_API_KEY=$UPSTAGE_API_KEY" >> .env
                            echo "OPENAI_API_KEY=$OPENAI_API_KEY" >> .env
                            echo "PINECONE_ENV=us-east1-gcp" >> .env
                            echo "REDIS_HOST=redis" >> .env
                            echo "REDIS_PORT=6379" >> .env

                            # ---- 프런트엔드 Next.js용 ----
                            mkdir -p frontend
                            echo "NEXT_PUBLIC_API_BASE_URL=https://tarotvora.com" > frontend/.env
                            echo "NEXT_PUBLIC_FASTAPI_BASE_URL=https://tarotvora.com/rag" >> frontend/.env
                            echo "NEXT_PUBLIC_KAKAO_API_KEY=$KAKAO_API_KEY" >> frontend/.env


                            # ▼ 만약 클라이언트에서 직접 Google Client ID가 필요하다면:
                            # echo "NEXT_PUBLIC_GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" >> frontend/.env
                        '''
                    }
                }
            }
        }

        stage('Detect Changes') {
            steps {
                script {
                    // 최근 커밋과 이전 커밋 비교
                    def changes = sh(script: "git diff --name-only HEAD~1", returnStdout: true).trim()

                    // 변경된 최상위 디렉토리
                    env.CHANGED_SERVICES = changes.split("\n")
                                                  .collect { it.split('/')[0] }
                                                  .unique()

                    // 이전 빌드가 실패하면 전체 빌드
                    def prevBuild = currentBuild.previousBuild
                    if (prevBuild && prevBuild.result != 'SUCCESS') {
                        echo "이전 빌드가 실패/불안정이므로 모든 서비스를 다시 빌드"
                        env.CHANGED_SERVICES = ['frontend', 'backend', 'rag_pipeline']
                    }

                    echo "Changed services: ${env.CHANGED_SERVICES}"
                }
            }
        }

        stage('Local Build') {
            steps {
                script {
                    def services = ['frontend', 'backend', 'rag_pipeline']
                    for (service in services) {
                        if (env.CHANGED_SERVICES.contains(service)) {
                            echo "Locally building ${service}..."
                            sh "docker-compose build ${service}"
                        } else {
                            echo "${service} not changed, skipping build."
                        }
                    }
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    sh '''
                        docker-compose down || true
                        docker-compose up -d
                    '''
                }
            }
        }

        stage('Cleanup old Docker images') {
            steps {
                script {
                    sh '''
                        # 최근 7개 태그를 제외한 오래된 이미지 삭제
                        docker image prune -a --filter "until=168h" -f || true
                    '''
                }
            }
        }
    }
}