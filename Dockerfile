FROM node:22-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://www.openclaw.com/install.sh | bash && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN mkdir -p data

EXPOSE 5000

CMD ["npm", "start"]
