import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index.js';

const app = express();
app.use(bodyParser.json());
app.use(routes);

// Middleware untuk menangkap kesalahan
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3002, () => {
  console.log('Server is running on port 3002');
});
