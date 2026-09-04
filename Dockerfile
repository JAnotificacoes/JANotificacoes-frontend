# NOTE (cloud): a Vercel IGNORA este Dockerfile — ela builda via `npm run build`
# com NEXT_PUBLIC_API_URL vindo das envs do projeto. Este arquivo serve só
# para dev local via docker-compose.
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]