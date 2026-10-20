import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import './HomeHeader.scss'
import logo from '../../assets/images/logo.png';
import { LANGUAGES, USER_ROLE } from '../../utils';
import { changeLanguageApp } from '../../store/actions/appActions';
import SearchBox from './SearchBox';
import { getStatistics } from '../../services/userService';

const NAV_ITEMS = [
    { id: 'nav.specialty', link: '/specialties', icon: 'fas fa-stethoscope' },
    { id: 'nav.clinic', link: '/clinics', icon: 'far fa-hospital' },
    { id: 'nav.doctor', link: '/doctors', icon: 'fas fa-user-md' },
    { id: 'nav.handbook', link: '/handbooks', icon: 'far fa-newspaper' },
];

const QUICK_SERVICES = [
    { id: 'banner.speciality', icon: 'fas fa-stethoscope', link: '/specialties' },
    { id: 'banner.general', icon: 'far fa-hospital', link: '/clinics' },
    { id: 'homeheader.doctor', icon: 'fas fa-user-md', link: '/doctors' },
    { id: 'banner.mental', icon: 'fas fa-brain', link: '/doctors' },
    { id: 'banner.test', icon: 'fas fa-flask', link: '/clinics' },
    { id: 'nav.handbook', icon: 'fas fa-book-medical', link: '/handbooks' },
];

class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMenuOpen: false,
            stats: null,
        };
    }

    async componentDidMount() {
        if (this.props.isShowBanner) {
            try {
                let res = await getStatistics();
                if (res && res.errCode === 0) this.setState({ stats: res.data });
            } catch (e) {
                // stats are decorative, ignore errors
            }
        }
    }

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    toggleMenu = () => {
        this.setState({ isMenuOpen: !this.state.isMenuOpen });
    }

    getDashboardLink = () => {
        let { userInfo } = this.props;
        if (userInfo && userInfo.roleId === USER_ROLE.DOCTOR) return '/doctor/manage-schedule';
        return '/system/dashboard';
    }

    renderAccount = () => {
        let { isLoggedIn } = this.props;
        if (isLoggedIn) {
            return (
                <Link to={this.getDashboardLink()} className="bc-btn bc-btn-sm">
                    <i className="fas fa-th-large"></i> <span><FormattedMessage id="nav.dashboard" /></span>
                </Link>
            );
        }
        return (
            <Link to="/login" className="bc-btn bc-btn-sm bc-btn-outline">
                <i className="far fa-user"></i> <span><FormattedMessage id="nav.login" /></span>
            </Link>
        );
    }

    renderHero = () => {
        let { stats } = this.state;
        return (
            <section className="home-hero">
                <div className="bc-container hero-inner">
                    <div className="hero-content">
                        <span className="hero-badge"><i className="fas fa-shield-alt"></i> <FormattedMessage id="hero.badge" /></span>
                        <h1>
                            <FormattedMessage id="hero.title" />{' '}
                            <span className="highlight"><FormattedMessage id="hero.title-highlight" /></span>
                        </h1>
                        <p className="hero-desc"><FormattedMessage id="hero.desc" /></p>
                        <SearchBox />
                        {stats && (
                            <div className="hero-stats">
                                <div><strong>{stats.doctors}+</strong><span><FormattedMessage id="hero.stat-doctors" /></span></div>
                                <div><strong>{stats.specialties}+</strong><span><FormattedMessage id="hero.stat-specialties" /></span></div>
                                <div><strong>{stats.clinics}+</strong><span><FormattedMessage id="hero.stat-clinics" /></span></div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bc-container">
                    <div className="hero-services">
                        {QUICK_SERVICES.map(item => (
                            <Link key={item.id + item.icon} to={item.link} className="service-item">
                                <span className="service-icon"><i className={item.icon}></i></span>
                                <span className="service-text"><FormattedMessage id={item.id} /></span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    render() {
        let { language, isShowBanner } = this.props;
        let { isMenuOpen } = this.state;
        return (
            <React.Fragment>
                <header className="home-header">
                    <div className="bc-container header-inner">
                        <button className="menu-toggle" onClick={this.toggleMenu} aria-label="Menu">
                            <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
                        </button>
                        <Link to="/home" className="header-logo" aria-label="BookingCare">
                            <img src={logo} alt="BookingCare" />
                        </Link>
                        <nav className={isMenuOpen ? 'header-nav open' : 'header-nav'}>
                            {NAV_ITEMS.map(item => (
                                <NavLink key={item.link} to={item.link} className="nav-item" activeClassName="active"
                                    onClick={() => this.setState({ isMenuOpen: false })}>
                                    <i className={item.icon}></i>
                                    <FormattedMessage id={item.id} />
                                </NavLink>
                            ))}
                            <NavLink to="/my-bookings" className="nav-item nav-item-mobile" activeClassName="active"
                                onClick={() => this.setState({ isMenuOpen: false })}>
                                <i className="far fa-calendar-check"></i>
                                <FormattedMessage id="nav.my-bookings" />
                            </NavLink>
                        </nav>
                        <div className="header-right">
                            <NavLink to="/my-bookings" className="header-link" activeClassName="active">
                                <i className="far fa-calendar-check"></i>
                                <span><FormattedMessage id="nav.my-bookings" /></span>
                            </NavLink>
                            <div className="lang-switch" role="group" aria-label="Language">
                                <button className={language === LANGUAGES.VI ? 'active' : ''} onClick={() => this.changeLanguage(LANGUAGES.VI)}>VI</button>
                                <button className={language === LANGUAGES.EN ? 'active' : ''} onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</button>
                            </div>
                            {this.renderAccount()}
                        </div>
                    </div>
                    {isMenuOpen && <div className="nav-backdrop" onClick={this.toggleMenu}></div>}
                </header>
                {isShowBanner === true && this.renderHero()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
