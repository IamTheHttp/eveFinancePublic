import {Express} from "express";

function logoutUser(app: Express) {
  app.post('/secure/logout', async (req, res) => {
    // Clear session of user
    delete req.session.charID;

    res.status(200);
    res.send({});
  });
}

export default logoutUser;
