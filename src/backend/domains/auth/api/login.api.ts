import {Express} from "express";
import {buildCharacterSSOURL} from "../../../dataSources/ESI/SSO/buildCharacterSSOURL";
import {buildCorporationSSOURL} from "../../../dataSources/ESI/SSO/buildCorporationSSOURL";

function login(app:Express) {
  app.get('/public/login', (req, res) => {
    res.redirect(buildCharacterSSOURL());
  });

  app.get('/public/loginWithCorp', (req, res) => {
    res.redirect(buildCorporationSSOURL());
  });

  app.get('/auth/link', (req, res) => {
    if (res.locals.character) {
      res.redirect(buildCharacterSSOURL(res.locals.character));
    }
  });
}


export default login;
