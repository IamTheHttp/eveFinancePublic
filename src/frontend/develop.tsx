/*
 This file is the entry point for the webpack dev server,
 To get started, run 'npm start'.
 */
import * as  React from 'react';
import {render} from 'react-dom';

import './styles/bootstrap.min.css';
import './styles/my.scss';
import App from './App';

const el = document.createElement('div');

el.id = 'app';
document.body.appendChild(el);

render(<App/>, document.getElementById('app'));