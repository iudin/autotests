FROM codeceptjs/codeceptjs
WORKDIR /tests
COPY ./package.json ./package-lock.json ./tsconfig.json ./
COPY ./ ./
RUN npm install
CMD [ "npm", "run", "e2e" ]