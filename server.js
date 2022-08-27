/* eslint-disable no-console */
const mongoose = require('mongoose');

const dotenv = require('dotenv');
const app = require('./app');

process.on('uncaughtException', err => {
  console.log('UNCOUGHT EXCEPTION');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: `${__dirname}/config.env` });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('Connection DB successful!');
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
