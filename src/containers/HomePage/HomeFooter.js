import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import logo from '../../assets/images/logo.png';
import applestore from '../../assets/applestore.png';
import ggplay from '../../assets/ggplay.png';
import qr from '../../assets/qr.png';
import './HomeFooter.scss'

class HomeFooter extends Component {
    render() {
        return (
            <footer className="home-footer">
                <div className="bc-container footer-grid">
                    <div className="footer-col footer-brand">
                        <img src={logo} alt="BookingCare" className="footer-logo" />
                        <p><FormattedMessage id="footer.about" /></p>
                        <ul className="footer-contact">
                            <li><i className="fas fa-map-marker-alt"></i> Lô B4/D21, KĐT mới Cầu Giấy, Hà Nội</li>
                            <li><i className="fas fa-phone-alt"></i> <a href="tel:02473012468">024-7301-2468</a> (7h - 18h)</li>
                            <li><i className="far fa-envelope"></i> <a href="mailto:support@bookingcare.vn">support@bookingcare.vn</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4><FormattedMessage id="footer.links" /></h4>
                        <ul>
                            <li><Link to="/specialties"><FormattedMessage id="nav.specialty" /></Link></li>
                            <li><Link to="/clinics"><FormattedMessage id="nav.clinic" /></Link></li>
                            <li><Link to="/doctors"><FormattedMessage id="nav.doctor" /></Link></li>
                            <li><Link to="/handbooks"><FormattedMessage id="nav.handbook" /></Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4><FormattedMessage id="footer.support" /></h4>
                        <ul>
                            <li><Link to="/my-bookings"><FormattedMessage id="nav.my-bookings" /></Link></li>
                            <li><Link to="/handbooks"><FormattedMessage id="footer.faq" /></Link></li>
                            <li><Link to="/home"><FormattedMessage id="footer.policy" /></Link></li>
                            <li><Link to="/home"><FormattedMessage id="footer.terms" /></Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4><FormattedMessage id="footer.download" /></h4>
                        <div className="footer-app">
                            <img src={qr} alt="QR" className="footer-qr" />
                            <div className="footer-stores">
                                <span className="store-badge"><img src={applestore} alt="App Store" /></span>
                                <span className="store-badge"><img src={ggplay} alt="Google Play" /></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="bc-container">
                        &copy; {new Date().getFullYear()} BookingCare. <FormattedMessage id="footer.copyright" />
                    </div>
                </div>
            </footer>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default withRouter(connect(mapStateToProps)(HomeFooter));
