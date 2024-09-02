import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { withRouter } from 'react-router';
import applestore from '../../assets/applestore.png';
import appgalarry from '../../assets/appgalarry.png';

import ggplay from '../../assets/ggplay.png';
import qr from '../../assets/qr.png';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faLocationDot,  faTruck, faMapMarkerAlt, faEnvelope,faPhone , faClipboard } from '@fortawesome/free-solid-svg-icons';
// import { faFacebookSquare, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import './HomeFooter.scss'
class HomeFooter extends Component {

    
  
    render() {
        
        return (
            <div className='footer-container'>
            <div className="row  footer-body-row justify-content-center">
                <div className='col-6 footer-support '>
                    <div className="support-container">

                            <div className="footer-support-title">
                                <p>Công ty Cổ phần Công nghệ BookingCare </p>
                            </div>
                            <div className="footer-support-content">
                                <ul className="support_">
                                    <li className="support-item">
                                        <span className="support-item-icon">
                                        <FontAwesomeIcon icon={faLocationDot} />
                                        </span>
                                        <span>
                                        Lô B4/D21, Khu đô thị mới Cầu Giấy, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Thành phố Hà Nội, Việt Nam
                                        </span>
                                        
                                    </li>
                                    <li className="support-item">
                                    <span className="support-item-icon">
                                    <FontAwesomeIcon icon={faClipboard} />
                                        </span>
                                        <span>
                                        ĐKKD số. 0106790291. Sở KHĐT Hà Nội cấp ngày 16/03/2015
                                        </span>
                                    </li>

                                    <li className="support-item">
                                    <span className="support-item-icon">
                                    <FontAwesomeIcon icon={faPhone} />
                                        </span>
                                        <span>
                                        024-7301-2468 (7h - 18h)
                                        </span>
                                    </li>
                                    <li className="support-item">
                                    <span className="support-item-icon">
                                    <FontAwesomeIcon icon={faEnvelope} />                                        </span>
                                        <span>
                                        support@bookingcare.vn (7h - 18h)
                                        </span>
                                    </li>
                                    
                                    
                                </ul>

                            </div>
                    </div>
                    <div className="col-4 support-container about-shop">

                            <div className="footer-support-title ">
                            <img src={logo}  />

                            </div>
                            <div className="footer-support-content">
                                <ul className="support_">
                                    <li className="support-item">
                                    <Link to="/about" className="support-item-link">
                                        Tuyển dụng
                                    </Link>
                                    </li>
                                    <li className="support-item">
                                    <Link to="/about" className="support-item-link">
                                    Chính sách bảo mật
                                    </Link>
                                    </li>
                                    <li className="support-item">
                                    <Link to="/about" className="support-item-link">
                                    Quy chế hoạt động
                                    </Link>
                                    </li>
                                    <li className="support-item">
                                    <Link to="/about" className="support-item-link">
                                    Liên hệ hợp tác
                                    </Link>  
                                    </li>
                                    <li className="support-item">
                                    <Link to="/about" className="support-item-link">
                                    Điều khoản sử dụng
                                    </Link>
                                    </li>
                                    <li className="support-item">
                                    <Link to="/about" className="support-item-link">
                                    Câu hỏi thường gặp
                                    </Link>
                                    </li>
                                    
                                </ul>

                            </div>
                    </div>


                </div>
       
                <div className='col-4 app-footer '>
                    <div className="footer-app-title">
                        Tải ứng dụng BookingCare
                    </div>
                    <div className="footer-app-content">
                        <div className="app-qr">
                            <span className="app-qr_download">
                            <img src={qr}/>

                            </span>
                        </div>
                        <div className="app-link">
                            <div className="app-link-item">
                                <span className='app-link-icon'>
                                <img src={applestore}/>

                                </span>
                                <span clasName="app-link-name">

                                </span>
                            </div>
                            <div className="app-link-item app-gg">
                                <span className='app-link-icon'>
                                <img src={ggplay}/>

                                </span>
                                <span clasName="app-link-name">
                                    
                                </span>
                            </div>
                            <div className="app-link-item app-gala">
                                <span className='app-link-icon'>
                                    <img src={appgalarry}/>
                                </span>
                                <span clasName="app-link-name">
                                    
                                </span>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div className='col-12 footer-end'>
                        <div>&copy; 2023 - Bản quyền Công ty Cổ phần Công nghệ BookingCare</div>
                </div>
            </div>
           
        </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,

    };
};

const mapDispatchToProps = dispatch => {
    return {
       
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeFooter));
