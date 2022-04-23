import * as  React from 'react';
import {Finance} from './views/Finance/Finance';
import Trading from './views/Trading/Trading';
import Navbar from './components/Navbar/Navbar';
import {
  BrowserRouter as Router,
  Switch,
  Route, Link,
} from 'react-router-dom';
import Home from "./views/Home";
import Market from "./views/Market/Market";
import QuotasView from "./views/Quotas/QuotasView";
import ProductionView from "./views/Production/ProductionView";
import {IsLoggedIn, UserContext} from "./components/IsLoggedIn";
import {useContext} from "react";
import {UserAccount} from "./views/Account/UserAccount";
import {BlockToast} from "./components/BlockToast";
import {AdminView} from "./views/Admin/AdminView";
import {Help} from "./views/Help";
import {Page} from "./components/Page";
import {Panel} from "./components/Panel";
import {Row} from "./components/Row";
import {getBackendURL, publicConfig} from "../config/publicConfig";
import {CharactersView} from "./views/Characters/CharactersView";
import {LogsView} from "./views/Logs/LogsView";


function PageContent(props: { children: React.ReactNode }) {
  const {isLoggedIn, licenseExpirationDate, LIC_MAX_CHAR, linkedCharacters, LOGIN_ERROR} = useContext(UserContext);
  const licenseExpired = new Date(licenseExpirationDate) < new Date();
  const maxCharExceeded = LIC_MAX_CHAR < linkedCharacters.length + 1;

  if (LOGIN_ERROR) {
    return (
      <BlockToast message={LOGIN_ERROR}/>
    );
  }

  if (isLoggedIn === null) {
    return (
      <div>
        <BlockToast message={'Loading...'}/>
      </div>
    );
  }



  if (isLoggedIn === false) {
    return (
      <div>
        <Page>
          <Row>
            <Panel columns={6}>
              <h1>Welcome to EVE Finance</h1>
              <h3 className='mt-3'>What is Eve Finance?</h3>
              <div>Eve Finance is a tool designed to help traders and manufacturers in controlling their ISK better.</div>
              <h3 className='mt-3'>Key features</h3>
              <ul>
                <li>Track your ISK <a target="_blank" href="https://res.cloudinary.com/iamhttp/image/upload/q_auto/f_auto/homepage">cash flow</a></li>
                <li>Manage and <a target="_blank" href="https://res.cloudinary.com/iamhttp/image/upload/q_auto/f_auto/quotas">plan your industry</a></li>
                <li>Get detailed trading reports</li>
                <li>Link multiple characters and corporations!</li>
              </ul>
              <h3 className='mt-3'>Getting started</h3>
              <ul>
                <li>Log in with your character - Free for one character and one corporation!</li>
                <li>Purchase a license to link more characters</li>
                <li>Get detailed trading reports</li>
              </ul>
            </Panel>
            <Panel columns={3} title={'Actions'}>
              <a className="btn btn-success w-100 mb-1" href={`${getBackendURL()}/public/login`}>Login with EVE</a>
              <Link className="btn btn-info w-100 mb-1" to="/help">More information</Link>
              <a className="btn btn-warning w-100 mb-1" target="_blank" href={publicConfig.ISSUE_TRACKER_URL}>Contact</a>
            </Panel>
          </Row>
        </Page>
      </div>
    );
  }

  if (licenseExpired) {
    return (
      <BlockToast message={'Your license has expired'}/>
    );
  }

  if (maxCharExceeded) {
    return (
      <BlockToast message={'You have too many linked characters for your license'}/>
    );
  }

  return (
    <>
      {props.children}
    </>
  );
}

function App() {
  return (
    <IsLoggedIn>
      <Router>
        <Navbar/>
        <Switch>
          <Route exact path="/">
            <PageContent>
              <Finance/>
            </PageContent>
          </Route>

          <Route exact path="/help">
            <Help/>
          </Route>

          <Route exact path="/market">
            <PageContent>
              <Market/>
            </PageContent>
          </Route>

          <Route exact path="/trade">
            <PageContent>
              <Trading/>
            </PageContent>
          </Route>

          <Route exact path="/quotas">
            <PageContent>
              <QuotasView/>
            </PageContent>
          </Route>

          <Route exact path="/account">
            <UserAccount/>
          </Route>

          <Route exact path="/production-materials">
            <PageContent>
              <ProductionView/>
            </PageContent>
          </Route>
          <Route exact path="/admin">
            <PageContent>
              <AdminView/>
            </PageContent>
          </Route>
          <Route exact path="/logs">
            <PageContent>
              <LogsView/>
            </PageContent>
          </Route>

          <Route exact path="/characters">
            <PageContent>
              <CharactersView/>
            </PageContent>
          </Route>
          <Route path="/characters/:characterID">
            <PageContent>
              <CharactersView/>
            </PageContent>
          </Route>
        </Switch>
      </Router>
    </IsLoggedIn>
  );
}

export default App;