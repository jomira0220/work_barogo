
# node.js 18 버전의 알파인 리눅스 이미지를 기반으로 합니다.
FROM node:lts-alpine3.18 as builder


# 작업 디렉토리를 설정합니다.
WORKDIR /app

# 의존성 설치를 위해 package.json 파일을 복사합니다.
COPY package.json ./

# 의존성을 설치합니다.
RUN npm install

# 필요한 모든 파일을 복사합니다.
COPY . /app

# Docker를 build할때 개발 모드 구분용 환경 변수를 명시함
ARG ENV_MODE

# COPY .env.${ENV_MODE} ./.env.production

# Next.js 앱을 빌드합니다.
RUN npm run build${ENV_MODE}

# COPY --from=builder /usr/src/app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

# 컨테이너의 포트 3000을 열어줍니다.
EXPOSE 3000

# 애플리케이션을 실행합니다.
CMD [ "npm", "start" ]