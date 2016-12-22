import React from 'react';
import { reduxForm, Field } from 'redux-form';
import css from './Login.css';

function Login() {
  return (
    <div className={css.loginOverlay}>
      <div className={css.loginContainer}>
        <h1>Sign In</h1>
        <form>
          <div className={css.slabStack}>
            <div className={css.majorSlab}>
              <Field className={css.loginInput} name="username" type="text" component="input" placeholder="Username" />
            </div>
            <div className={css.minorSlab}>
              <Field className={css.loginInput} name="password" type="password" component="input" placeholder="Password" />
            </div>
            {/* This portion for login validation...
            <div>
              <span className={css.loginError} >
                Sorry, information entered does not match our records!
              </span>
            </div>
            */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default reduxForm(
  {
    form: 'login',
  },
)(Login);
