import session from "express-session";
import {uri} from "../../mongoConnect";
import {Express} from "express";
const MongoDBStore = require('connect-mongodb-session')(session);

function sessionMiddleware(app:Express) {
  const store = new MongoDBStore({
    uri: `${uri}/eveonline`,
    collection: 'sessions'
  });

// Catch errors
  store.on('error', function (error: Error) {
    console.error('ERR', error);
  });

  // Get our session connected
  app.use(session({
    secret: 'abc',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false},
    store
  }));
}

export default sessionMiddleware;
