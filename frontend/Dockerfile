
FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the frontend files
COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]
