import React, { Component, PropTypes } from 'react'; // eslint-disable-line

import { connect as reduxConnect } from 'react-redux'; // eslint-disable-line

import { reset } from 'redux-form';

import { setCurrentUser, clearCurrentUser, setOkapiToken, clearOkapiToken, authFailure, clearAuthFailure } from '../../okapiActions';
import Login from './Login';

class LoginCtrl extends Component {
  static contextTypes = {
    store: PropTypes.object,
    router: PropTypes.object,
    authFail: PropTypes.bool,
  }

  static propTypes = {
    authFail: PropTypes.bool,
  }

  constructor(props, context) {
    super();
    this.store = context.store;
    this.router = context.router;
    this.requestLogin = this.requestLogin.bind(this);
    this.sys = require('@folio/stripes-loader!'); // eslint-disable-line
    this.okapiUrl = this.sys.okapi.url;
    this.tenant = this.sys.okapi.tenant;
    this.store.dispatch(clearAuthFailure());
    this.initialValues = { username: '', password: '' };
  }


  getUser(username) {
    fetch(`${this.okapiUrl}/users?query=(username="${username}")`, { headers: Object.assign({}, { 'X-Okapi-Tenant': this.tenant, 'X-Okapi-Token': this.store.getState().okapi.token }) })
      .then((response) => {
        if (response.status >= 400) {
          this.store.dispatch(clearCurrentUser());
        } else {
          response.json().then((json) => {
            this.store.dispatch(setCurrentUser(json.users[0].personal));
          });
        }
      });
  }

  requestLogin(data) {
    fetch(`${this.okapiUrl}/authn/login`, {
      method: 'POST',
      headers: Object.assign({}, { 'X-Okapi-Tenant': this.tenant, 'Content-Type': 'application/json'}),
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.status >= 400) {
        this.store.dispatch(clearOkapiToken());
        this.store.dispatch(reset('login'));
        this.initialValues.username = data.username;
        this.store.dispatch(authFailure());
      } else {
        const token = response.headers.get('X-Okapi-Token');
        this.store.dispatch(setOkapiToken(token));
        this.store.dispatch(clearAuthFailure());
        this.getUser(data.username);
      }
    });
  }

  render() {
    const authFail = this.props.authFail;
    return (
      <Login
        onSubmit={this.requestLogin}
        authFail={authFail}
        initialValues={this.initialValues}
      />
    );
  }
}

function mapStateToProps(state) {
  return { authFail: state.okapi.authFailure };
}

export default reduxConnect(mapStateToProps)(LoginCtrl);
