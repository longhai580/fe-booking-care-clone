import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import { withRouter } from 'react-router';
import { getAllSpecialty } from '../../../services/userService'
import SectionHeader from './SectionHeader';
import './Specialty.scss'

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: [],
            isLoading: true,
        }
    }

    async componentDidMount() {
        let res = await getAllSpecialty();
        this.setState({
            dataSpecialty: res && res.errCode === 0 && res.data ? res.data : [],
            isLoading: false,
        })
    }

    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    }

    render() {
        let { dataSpecialty, isLoading } = this.state;
        return (
            <section className="bc-section section-specialty">
                <div className="bc-container">
                    <SectionHeader titleId="homepage.specialty-popular" subId="home.specialty-sub" link="/specialties" />
                    {isLoading ? (
                        <div className="bc-grid">{[1, 2, 3, 4].map(i => <div key={i} className="bc-skeleton" style={{ height: 210 }}></div>)}</div>
                    ) : (
                        <Slider {...this.props.settings} className="bc-slider">
                            {dataSpecialty.map((item) => (
                                <div key={item.id}>
                                    <div className="bc-tile" onClick={() => this.handleViewDetailSpecialty(item)}>
                                        <div className="bc-tile-img" style={{ backgroundImage: `url(${item.image})` }}></div>
                                        <div className="bc-tile-body">
                                            <h3 className="bc-tile-title">{item.name}</h3>
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

export default withRouter(connect(mapStateToProps)(Specialty));
