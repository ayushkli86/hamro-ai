FROM node:22-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache tini curl
COPY --from=frontend /app/dist ./dist
COPY --from=frontend /app/server ./server
COPY --from=frontend /app/scripts ./scripts
COPY --from=frontend /app/package*.json ./
RUN npm ci --omit=dev --ignore-scripts
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server/cluster.js"]
