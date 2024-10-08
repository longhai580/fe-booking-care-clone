import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './HomeHeader.scss'
import logo from '../../assets/images/logo.png';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../utils';
import { changeLanguageApp } from '../../store/actions/appActions';

import { withRouter } from 'react-router';

class HomeHeader extends Component {

    changeLanguage = (language) => { 
        this.props.changeLanguageAppRedux(language);
    }
    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`);
        }
    }
    render() {
        let language = this.props.language;
        return (
            <React.Fragment>
                <div className="home-header-container">
                    <div className="home-header-content">
                        <div className="left-content">
                            <i className="fas fa-bars"></i>
                            <img src={logo} onClick={() => this.returnToHome()} />
                            <div className="header-logo">

                            </div>
                        </div>
                        <div className="center-content">
                            <div className="child-content">
                                <div> <b><FormattedMessage id="homeheader.speciality"/></b></div>
                                <div className="sub-title"><FormattedMessage id="homeheader.searchdoctor"/></div>
                            </div>
                            <div className="child-content">
                                <div>  <b> <FormattedMessage id="homeheader.health-facility"/></b></div>
                                <div className="sub-title"><FormattedMessage id="homeheader.select-room"/></div>

                            </div>
                            <div className="child-content">

                                <div><b><FormattedMessage id="homeheader.doctor"/></b></div>
                                <div className="sub-title"><FormattedMessage id="homeheader.select-doctor"/></div>

                            </div>
                            <div className="child-content">
                                <div><b><FormattedMessage id="homeheader.fee"/></b></div>
                                <div className="sub-title"><FormattedMessage id="homeheader.check-health"/></div>
                            </div>
                            
                        </div>
                        <div className="right-content">
                            <div className="booking-date"> <i className="fas fa-history"></i> <FormattedMessage id="homeheader.booking-date"/></div>
                            <div className="support"><i className="far fa-question-circle"></i> <FormattedMessage id="homeheader.support"/></div>
                            <div className="language">
                                <i className="fas fa-language"></i>
                                <div className='change-language'>

                            <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}><span onClick={() =>{this.changeLanguage(LANGUAGES.VI)}}>VN</span></div>
                            <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}><span onClick={() =>{this.changeLanguage(LANGUAGES.EN)}}>EN</span></div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
                {this.props.isShowBanner === true &&
                    
                    <div className="home-header-banner">
                        <div className="content-up">

                            <div className="title1"><FormattedMessage id="banner.title1" /></div>
                            <div className="title2"><FormattedMessage id="banner.title2" /></div>
                            <div className="search">
                                <i className="fas fa-search"></i>
                                <input type='text' placeholder='Tìm chuyên khoa khám bệnh' />
                            </div>
                        </div>
                        <div className="content-down">
                            <div className="options">
                                <div className="option-child">
                                    <div className="icon-child"><i className="far fa-hospital"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.speciality" /></div>

                                </div>
              
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-mobile-alt"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.remote" /></div>

                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-hospital-alt"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.general" /></div>

                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-flask"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.test" /></div>

                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-user-md"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.mental" /></div>

                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-briefcase-medical"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.dentistry" /></div>

                                </div>
                            </div>
                        </div>

                    </div>
                
                }
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
