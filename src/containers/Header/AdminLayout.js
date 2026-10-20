import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import * as actions from "../../store/actions";
import { LANGUAGES, USER_ROLE } from '../../utils'
import { adminMenu, doctorMenu } from './menuApp';
import logo from '../../assets/images/logo.png';
import './AdminLayout.scss';

class AdminLayout extends Component {
    constructor(props) {
        super(props);
        this.state = { isSidebarOpen: false };
    }

    getMenu = () => {
        let { userInfo } = this.props;
        if (userInfo && !_.isEmpty(userInfo)) {
            if (userInfo.roleId === USER_ROLE.ADMIN) return adminMenu;
            if (userInfo.roleId === USER_ROLE.DOCTOR) return doctorMenu;
        }
        return [];
    }

    render() {
        const { processLogout, language, userInfo, children, changeLanguageAppRedux } = this.props;
        let { isSidebarOpen } = this.state;
        let displayName = userInfo ? `${userInfo.lastName || ''} ${userInfo.firstName || ''}`.trim() : '';
        return (
            <div className={isSidebarOpen ? 'admin-layout sidebar-open' : 'admin-layout'}>
                <aside className="admin-sidebar">
                    <Link to="/home" className="sidebar-logo"><img src={logo} alt="BookingCare" /></Link>
                    <nav>
                        {this.getMenu().map(group => (
                            <div key={group.name} className="sidebar-group">
                                <div className="sidebar-group-title"><FormattedMessage id={group.name} /></div>
                                {group.menus.map(item => (
                                    <NavLink key={item.link} to={item.link} className="sidebar-link" activeClassName="active"
                                        onClick={() => this.setState({ isSidebarOpen: false })}>
                                        <i className={item.icon}></i>
                                        <FormattedMessage id={item.name} />
                                    </NavLink>
                                ))}
                            </div>
                        ))}
                    </nav>
                </aside>
                {isSidebarOpen && <div className="sidebar-backdrop" onClick={() => this.setState({ isSidebarOpen: false })}></div>}
                <div className="admin-main">
                    <header className="admin-topbar">
                        <button className="sidebar-toggle" onClick={() => this.setState({ isSidebarOpen: !isSidebarOpen })} aria-label="Menu">
                            <i className="fas fa-bars"></i>
                        </button>
                        <div className="topbar-welcome">
                            <FormattedMessage id="admin-layout.welcome" />, <strong>{displayName}</strong>
                        </div>
                        <div className="topbar-actions">
                            <Link to="/home" className="bc-btn bc-btn-ghost bc-btn-sm">
                                <i className="fas fa-external-link-alt"></i> <span><FormattedMessage id="admin-layout.view-site" /></span>
                            </Link>
                            <div className="lang-switch">
                                <button className={language === LANGUAGES.VI ? 'active' : ''} onClick={() => changeLanguageAppRedux(LANGUAGES.VI)}>VI</button>
                                <button className={language === LANGUAGES.EN ? 'active' : ''} onClick={() => changeLanguageAppRedux(LANGUAGES.EN)}>EN</button>
                            </div>
                            <button className="bc-btn bc-btn-danger bc-btn-sm" onClick={processLogout} title="Log out">
                                <i className="fas fa-sign-out-alt"></i> <span><FormattedMessage id="admin-layout.logout" /></span>
                            </button>
                        </div>
                    </header>
                    <main className="admin-content">
                        {children}
                    </main>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminLayout);
