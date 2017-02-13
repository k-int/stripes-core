import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import configureStore from './configureStore';
import Root from './Root';
import { okapi, config } from '@folio/stripes-loader!'; // eslint-disable-line

const initialState = { okapi };
const store = configureStore(initialState, config);

render(
  <Root store={store} disableAuth={(config && config.disableAuth) || false} />,
  document.getElementById('root'),
);
