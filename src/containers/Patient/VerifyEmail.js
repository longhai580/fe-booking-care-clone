import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { postVerifyBookingAppoinment } from '../../services/userService'
import PageLayout from '../../components/Common/PageLayout';
import './VerifyEmail.scss'

class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: 0
        }
    }

    async componentDidMount() {
        let urlParams = new URLSearchParams(this.props.location ? this.props.location.search : '');
        let token = urlParams.get('token');
        let doctorId = urlParams.get('doctorId');
        let res = null;
        if (token && doctorId) {
            res = await postVerifyBookingAppoinment({ token, doctorId });
        }
        this.setState({
            statusVerify: true,
            errCode: res && res.errCode !== undefined ? res.errCode : -1,
        })
    }

    render() {
        let { statusVerify, errCode } = this.state;
        let isSuccess = +errCode === 0;
        return (
            <PageLayout hero={null}>
                <div className="bc-container verify-email-container">
                    <div className="bc-card verify-card">
                        {statusVerify === false ? (
                            <>
                                <div className="spinner-border text-info" role="status"></div>
                                <p><FormattedMessage id="verify.loading" /></p>
                            </>
                        ) : (
                            <>
                                <span className={isSuccess ? 'verify-icon success' : 'verify-icon fail'}>
                                    <i className={isSuccess ? 'fas fa-check' : 'fas fa-exclamation'}></i>
                                </span>
                                <h1><FormattedMessage id={isSuccess ? 'verify.success-title' : 'verify.fail-title'} /></h1>
                                <p><FormattedMessage id={isSuccess ? 'verify.success-desc' : 'verify.fail-desc'} /></p>
                                <div className="verify-actions">
                                    <Link to="/home" className="bc-btn bc-btn-outline"><FormattedMessage id="verify.back-home" /></Link>
                                    <Link to="/my-bookings" className="bc-btn"><FormattedMessage id="verify.view-bookings" /></Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </PageLayout>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    }
};

export default connect(mapStateToProps)(VerifyEmail);
