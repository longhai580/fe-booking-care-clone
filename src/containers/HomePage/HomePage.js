import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import Specialty from './Sections/Specialty';
import MedicalFacility from './Sections/MedicalFacility';
import OutStandingDoctor from './Sections/OutStandingDoctor';
import HandBook from './Sections/HandBook';
import About from './Sections/About';
import HomeFooter from './HomeFooter';

import './HomePage.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
class HomePage extends Component {

    render() {
        let settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1
          };
        return (
            <div>
                <HomeHeader isShowBanner = {true} />
                <Specialty
                    settings = {settings}
                />
                <MedicalFacility
                    settings = {settings}
                />
                <OutStandingDoctor
                    settings = {settings}
                />
                <HandBook
                    settings = {settings}
                />
                <About />
                <HomeFooter />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
