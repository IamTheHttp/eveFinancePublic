import * as React from 'react';
import {Link} from 'react-router-dom';
import {useContext, useState} from "react";
import {UserContext} from "../IsLoggedIn";
import {getBackendURL, publicConfig} from "../../../config/publicConfig";
import {formatTime} from "../../utils/formatTime";
import postData from "../../utils/postData";
import deleteData from "../../utils/deleteData";


function Navbar() {
  const {isLoggedIn, charID, status, licenseExpirationDate, LIC_MAX_CHAR, linkedCharacters} = useContext(UserContext);

  const canLinkMoreCharacters = LIC_MAX_CHAR > linkedCharacters.length + 1;

  const licenseExpired = new Date(licenseExpirationDate) < new Date();


  const [isNavbarOpen, setNavbarOpen] = useState(false);

  return (
    <div className="bs-component">
      <nav className={"navbar navbar-expand-lg navbar-dark bg-primary "}>
        <Link className="navbar-brand" to='/'>Eve Finance (Beta)</Link>
        <button
          className="navbar-toggler collapsed"
          type="button"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => {
            setNavbarOpen(!isNavbarOpen);
          }}
        >
          <span className="navbar-toggler-icon"/>
        </button>
        <div className={(isNavbarOpen ? '' : 'collapse') +  " navbar-collapse"}>
          <ul
          onClick={() => {
            // Close the menu whenever the menu is clicked upon...
            setNavbarOpen(false);
          }}
            className={"navbar-nav mr-auto w-100"}>
            {isLoggedIn && (
              <>
                <Link className="nav-link" to="/">Home</Link>
                <li className="nav-item active">
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/market">Market</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/trade">Trade</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/quotas">Industry</Link>
                </li>
                {canLinkMoreCharacters && <li className="nav-item">
                  <a className="nav-link" href={licenseExpired ? '' : `${getBackendURL()}/auth/link`}>Link</a>
                </li>
                }
                {licenseExpirationDate && status !== 'trial' && <li className='text-white ml-3 mt-auto mb-auto'>
                  {'License'} Expiration: {formatTime(licenseExpirationDate)}
                </li>}
                <li className={'nav-item '  + (isNavbarOpen ? '' : 'ml-auto')}>
                  <Link className="nav-link" to={'/'} onClick={async () => {
                    await postData('secure/logout', {});
                    location.href = '/';
                  }}>
                    Logout
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/help">Help</Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" target="_blank" href={publicConfig.ISSUE_TRACKER_URL}>Contact</a>
                </li>
                {status === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Admin</Link>
                  </li>
                )}
                {status === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/characters">Characters</Link>
                  </li>
                )}
                {status === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/logs">Logs</Link>
                  </li>
                )}
                <li className='nav-item'>
                  <Link to="/account">
                    <img
                      src={`https://images.evetech.net/characters/${charID}/portrait?size=64`}
                      width="50"
                      height="50"
                    />
                  </Link>
                </li>
              </>
            )}

            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <a className="nav-link" href={`${getBackendURL()}/public/login`}>Login</a>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/help">Help</Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" target="_blank" href={publicConfig.ISSUE_TRACKER_URL}>Contact</a>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;