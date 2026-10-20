import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import { withRouter } from 'react-router';
import { getAllClinic } from '../../../services/userService'
import SectionHeader from './SectionHeader';
import './MedicalFacility.scss'

class MedicalFacility extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataClinics: [],
            isLoading: true,
        }
    }

    async componentDidMount() {
        let res = await getAllClinic();
        this.setState({
            dataClinics: res && res.errCode === 0 && res.data ? res.data : [],
            isLoading: false,
        })
    }

    handleViewDetailClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`);
        }
    }

    render() {
        let { dataClinics, isLoading } = this.state;
        return (
            <section className="bc-section bc-section-soft section-medical-facility">
                <div className="bc-container">
                    <SectionHeader titleId="home.clinic-title" subId="home.clinic-sub" link="/clinics" />
                    {isLoading ? (
                        <div className="bc-grid">{[1, 2, 3, 4].map(i => <div key={i} className="bc-skeleton" style={{ height: 230 }}></div>)}</div>
                    ) : (
                        <Slider {...this.props.settings} className="bc-slider">
                            {dataClinics.map((item) => (
                                <div key={item.id}>
                                    <div className="bc-tile" onClick={() => this.handleViewDetailClinic(item)}>
                                        <div className="bc-tile-img contain" style={{ backgroundImage: `url(${item.image})` }}></div>
                                        <div className="bc-tile-body">
                                            <h3 className="bc-tile-title">{item.name}</h3>
                                            <div className="bc-tile-sub"><i className="fas fa-map-marker-alt"></i> {item.address}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    )}
                </div>
            </section>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default withRouter(connect(mapStateToProps)(MedicalFacility));
