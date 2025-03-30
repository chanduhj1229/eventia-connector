
FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json ./
RUN npm install

# Copy the rest of the backend files
COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
