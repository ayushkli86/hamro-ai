FROM node:22-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache tini
COPY --from=frontend /app/dist ./dist
COPY --from=frontend /app/server ./server
COPY --from=frontend /app/scripts ./scripts
COPY --from=frontend /app/package*.json ./
RUN npm ci --omit=dev
EXPOSE 5000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server/server.js"]
