FROM --platform=linux/arm64 mcr.microsoft.com/playwright:focal

# install git
RUN apt get install -y git

# fetch and copy project
COPY . /app
WORKDIR /app

# Install dependencies
RUN npm install

# Install browsers
RUN npx playwright install --with-deps

# Run playwright test
RUN npx playwright show-report