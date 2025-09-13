FROM node:20-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install all dependencies (not just production) so build works
RUN npm install

# Copy the rest of the source
COPY . .

# Build Next.js app
RUN npm run build

# Verify that `.next` exists (debug line)
RUN ls -la .next

# Expose port
EXPOSE 3001

# Start Next.js
CMD ["npm", "start"]
