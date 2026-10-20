import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from "connected-react-router";
import { FormattedMessage, injectIntl } from 'react-intl';
import * as actions from "../../store/actions";
import { handleLoginApi } from '../../services/userService';
import { USER_ROLE } from '../../utils';
import logo from '../../assets/images/logo.png';
import './Login.scss';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errMessage: '',
            isLoading: false,
        }
    }

    handleLogin = async (event) => {
        if (event) event.preventDefault();
        let { username, password } = this.state;
        let { intl } = this.props;
        if (!username.trim() || !password) {
            this.setState({ errMessage: intl.formatMessage({ id: 'login.empty' }) });
            return;
        }
        this.setState({ errMessage: '', isLoading: true });
        try {
            let data = await handleLoginApi(username.trim(), password);
            if (data && data.errCode !== 0) {
                this.setState({ errMessage: data.message, isLoading: false });
            }
            if (data && data.errCode === 0) {
                if (data.user.roleId === USER_ROLE.PATIENT) {
                    this.setState({ errMessage: intl.formatMessage({ id: 'login.patient-not-allowed' }), isLoading: false });
                    return;
                }
                this.props.userLoginSuccess(data.user)
            }
        } catch (error) {
            let message = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : intl.formatMessage({ id: 'manage.error' });
            this.setState({ errMessage: message, isLoading: false });
        }
    }

    render() {
        let { username, password, isShowPassword, errMessage, isLoading } = this.state;
        let { intl } = this.props;
        return (
            <div className="login-page">
                <div className="login-side">
                    <Link to="/home" className="login-logo"><img src={logo} alt="BookingCare" /></Link>
                    <div className="login-side-content">
                        <h2><FormattedMessage id="login.side-title" /></h2>
                        <p><FormattedMessage id="login.side-desc" /></p>
                    </div>
                </div>
                <div className="login-main">
                    <form className="login-form" onSubmit={this.handleLogin} noValidate>
                        <Link to="/home" className="login-back"><i className="fas fa-arrow-left"></i> <FormattedMessage id="login.back-home" /></Link>
                        <h1><FormattedMessage id="login.title" /></h1>
                        <p className="login-subtitle"><FormattedMessage id="login.subtitle" /></p>

                        <div className="bc-field">
                            <label htmlFor="login-email"><FormattedMessage id="login.email" /></label>
                            <input id="login-email" type="email" className="bc-input" autoComplete="username"
                                placeholder={intl.formatMessage({ id: 'login.email-placeholder' })}
                                value={username}
                                onChange={(event) => this.setState({ username: event.target.value, errMessage: '' })} />
                        </div>
                        <div className="bc-field">
                            <label htmlFor="login-password"><FormattedMessage id="login.password" /></label>
                            <div className="password-wrap">
                                <input id="login-password" type={isShowPassword ? 'text' : 'password'} className="bc-input"
                                    autoComplete="current-password"
                                    placeholder={intl.formatMessage({ id: 'login.password-placeholder' })}
                                    value={password}
                                    onChange={(event) => this.setState({ password: event.target.value, errMessage: '' })} />
                                <button type="button" className="toggle-password" aria-label="Show password"
                                    onClick={() => this.setState({ isShowPassword: !isShowPassword })}>
                                    <i className={isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}></i>
                                </button>
                            </div>
                        </div>

                        {errMessage && <div className="login-error"><i className="fas fa-exclamation-circle"></i> {errMessage}</div>}

                        <button type="submit" className="bc-btn bc-btn-lg login-submit" disabled={isLoading}>
                            {isLoading && <span className="spinner-border spinner-border-sm"></span>}
                            <FormattedMessage id="login.submit" />
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Login));
