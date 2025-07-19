FROM node:18

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate client before app code
COPY prisma ./prisma
RUN npx prisma generate

# Install nodemon globally (optional, but okay)
RUN npm install -g nodemon

# Copy the rest of the code after generating Prisma client
COPY . .

# Expose the port your app listens on
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]
