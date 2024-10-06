# Use the official Node.js image as a base
FROM --platform=linux/amd64 node:22

ENV WEB_SOCKET_PORT=8443
ENV EXPRESS_PORT=8080
ENV USE_TEST_CARD_NUMBER=true
ENV TEST_CARD_NUMBER=7020113200035014

ENV RECEIPT_PRINTER_CHARACTER_PER_LINE=48
ENV RECEIPT_PRINTER_CHARACTER_ENCODING=multilingual

#FOLLOWINGS SECRETS ARE AVAILABLE IN TERMINAL ALSO
ENV WEB_SOCKET_COMMUNICATION_SECRET=eb8600ca-1122-43e5-8506-1fededbf5aee
ENV WEB_SOCKET_INQUIRY_CHANNEL=web.socket.inquiry.channel
ENV WEB_SOCKET_RECEIPT_CHANNEL=web.socket.receipt.channel
#
#
# Set the working directory inside the container

RUN mkdir /app
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY . .

RUN npm i

RUN npm -g i pnpm

# Install dependencies
RUN npm run build:source

# Expose the port that the app runs on (change if necessary)
EXPOSE 8443
EXPOSE 8080

#Command to run the application
CMD ["node", "/app/dist/server.js"]
