# Next v13.4.19 / React v18.2.0

# env 설정 파일
1. .evn.localhost - 로컬에서 실행할 환경 변수 설정 파일 
2. .evn.development - 개발에서 실행할 환경 변수 설정 파일 
3. .env.production - 운영에서 실행할 환경 변수 설정 파일

# 환경에 따른 도커 빌드 방식
## 개발용 빌드
    docker build -t barogoplay-admin-frontend:버전 -f ./Dockerfile . --build-arg ENV_MODE=:dev
## 배포용 빌드
    docker build -t barogoplay-admin-frontend:prod_버전 .