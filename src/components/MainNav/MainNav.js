import React, { Component, PropTypes } from 'react';
import Link from 'react-router/Link';
import { connect } from 'react-redux';

import { modules } from 'stripes-loader'; // eslint-disable-line

import { Dropdown } from 'react-bootstrap';

import { clearOkapiToken, clearCurrentUser } from '../../okapiActions';

import css from './MainNav.css';
import NavButton from './NavButton';
import NavDivider from './NavDivider';
import NavGroup from './NavGroup';
import Breadcrumbs from './Breadcrumbs';
import NavIcon from './NavIcon';

import NavDropdownMenu from './NavDropdownMenu';

if (!Array.isArray(modules.app) || modules.app.length < 1) {
  throw new Error('At least one module of type "app" must be enabled.');
}

class MainNav extends Component {

  static contextTypes = {
    store: PropTypes.object,
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    currentUser: PropTypes.shape({ username: PropTypes.string }),
  }

  constructor(props, context) {
    super(props);
    this.state = {
      userMenuOpen: false,
    };
    this.store = context.store;
    this.toggleUserMenu = this.toggleUserMenu.bind(this);
    this.logout = this.logout.bind(this);
  }

  toggleUserMenu() {
    const isOpen = this.state.userMenuOpen;
    this.setState({
      userMenuOpen: !isOpen,
    });
  }

  logout() {
    this.store.dispatch(clearOkapiToken());
    this.store.dispatch(clearCurrentUser());
    this.toggleUserMenu();
    this.context.router.transitionTo('/');
  }

  render() {
    const { currentUser } = this.props;
    const userIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 26 26">
        <rect width="26" height="26" style={{ fill: '#3D9964' }} />
        <path d="M1.1 24.9c0 0 0-2.6 0.8-3.7 0.8-1 5.8-5.2 11.1-5.1s9.9 3.1 10.9 4.4 1.1 4.4 1.1 4.4L1.1 24.9z" style={{ fill: '#FFF' }} />
        <path d="M18.6 11.4c0 4.2-2.5 7.6-5.6 7.6 -3.1 0-5.6-3.4-5.6-7.6S8.4 3.8 13 3.8 18.6 7.2 18.6 11.4z" style={{ fill: '#FFF' }} />
        <path d="M13 19.5c-3.4 0-6.1-3.6-6.1-8.1 0-3.5 0.6-8.1 6.1-8.1 5.5 0 6.1 4.6 6.1 8.1C19.1 15.9 16.4 19.5 13 19.5zM13 4.3c-3.6 0-5.1 2.1-5.1 7.1 0 3.9 2.3 7.1 5.1 7.1 2.8 0 5.1-3.2 5.1-7.1C18.1 6.5 16.6 4.3 13 4.3z" style={{ fill: '#3D9964' }} />
      </svg>
    );

    const userDD = (
      <ul>
        <li className={`${css.nowrap} ${css.ddTextItem}`}>Logged in as <strong>{ currentUser != null ? `${currentUser.first_name} ${currentUser.last_name}` : null }</strong></li>
        <li className={css.ddDivider} aria-hidden="true" />
        <li><button className={css.ddButton} type="button" onClick={this.logout}><span>Log out</span></button></li>
      </ul>
    );

    const menuLinks = modules.app.map(entry =>
      <Link to={entry.home || entry.route} key={entry.route}>
        {
          ({ href, onClick }) =>
            <NavButton onClick={onClick} href={href} title={entry.displayName}>
              <NavIcon color="#61f160" />
              <span className={css.linkLabel}>
                {entry.displayName}
              </span>
            </NavButton>
        }
      </Link>,
    );

    let firstNav;
    let breadcrumbArray = []; // eslint-disable-line

    if (breadcrumbArray.length === 0) {
      firstNav = (
        <NavGroup md="hide">
          <NavButton href="#">
            <NavIcon color="#fdae35" />
            <span className={css.brandingLabel} style={{ fontSize: '22px' }}>FOLIO</span>
          </NavButton>
        </NavGroup>
      );
    } else {
      firstNav = (
        <NavGroup>
          <NavButton md="hide">
            <NavIcon color="#fdae35" />
          </NavButton>
          <Breadcrumbs linkArray={breadcrumbArray} />
        </NavGroup>
      );
    }

    return (
      <nav role="navigation" className={css.navRoot}>
        {firstNav}
        <NavGroup>
          <NavGroup>
            {menuLinks}
            <NavDivider md="hide" />
            <NavButton md="hide" ><NavIcon color="#7eb970" /></NavButton>
            <NavButton md="hide"><NavIcon color="#b33f3f" /></NavButton>
            <NavButton md="hide"><NavIcon color="#3fb38e" /></NavButton>
            <NavButton md="hide"><NavIcon color="#3f6cb3" /></NavButton>
            <NavDivider md="hide" />
            <NavButton md="hide"><NavIcon color="#7d3fb3" /></NavButton>
          </NavGroup>
          <NavGroup className={css.smallAlignRight}>
            <Dropdown open={this.state.userMenuOpen} id="UserMenuDropDown" onToggle={this.toggleUserMenu} pullRight >
              <NavButton bsRole="toggle" title="User Menu" aria-haspopup="true" aria-expanded={this.state.userMenuOpen}><NavIcon icon={userIcon} /></NavButton>
              <NavDropdownMenu bsRole="menu" onToggle={this.toggleUserMenu} aria-label="User Menu">{userDD}</NavDropdownMenu>
            </Dropdown>
          </NavGroup>
        </NavGroup>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return { currentUser: state.okapi.currentUser };
}

export default connect(mapStateToProps)(MainNav);
