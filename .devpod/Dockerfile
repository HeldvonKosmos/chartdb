FROM fedora:latest

RUN dnf install git fish -y

# Install Yarn
RUN dnf install nodejs sqlite-devel -y
RUN npm install --global yarn

# cd into project folder by default
WORKDIR /app

# Ports to use for dev
EXPOSE 5173