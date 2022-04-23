import {Express} from "express";

function root(app:Express) {
  app.get('/', (req, res) => {
    res.send('<a href="/public/login">Login to EvE</a>');
  });

  app.get('/ping', (req, res) => {
    res.send({});
  });
}

export default root;
