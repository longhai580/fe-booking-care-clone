import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import { withRouter } from 'react-router';
import * as actions from '../../../store/actions';
import { buildDoctorName, toImageSrc } from '../../../utils';
import SectionHeader from './SectionHeader';
import DoctorCard from '../../Patient/Doctors/DoctorCard';

class OutStandingDoctor extends Component {
    componentDidMount() {
        this.props.loadTopDoctors();
    }

    render() {
        let { language, topDoctorsRedux } = this.props;
        let arrDoctors = topDoctorsRedux || [];
        return (
            <section className="bc-section section-outstanding-doctor">
                <div className="bc-container">
                    <SectionHeader titleId="homepage.outstanding-doctor" subId="home.doctor-sub" link="/doctors" />
                    <Slider {...this.props.settings} className="bc-slider">
                        {arrDoctors.map((item) => (
                            <div key={item.id}>
                                <DoctorCard
                                    id={item.id}
                                    name={buildDoctorName(item, language)}
                                    image={toImageSrc(item.image)}
                                    specialty={item.Doctor_Infor && item.Doctor_Infor.specialtyData ? item.Doctor_Infor.specialtyData.name : ''}
                                />
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>
        );
    }

}

const mapStateToProps = state => {
    return {
        topDoctorsRedux: state.admin.topDoctors,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
