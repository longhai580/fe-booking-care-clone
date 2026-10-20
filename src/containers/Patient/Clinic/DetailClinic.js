import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { getAllDetailClinicById } from '../../../services/userService'
import PageLayout from '../../../components/Common/PageLayout';
import DoctorBookingRow from '../Doctors/DoctorBookingRow';
import CollapsibleContent from '../Specialty/CollapsibleContent';
import '../Specialty/DetailSpecialty.scss';
import './DetailClinic.scss';

class DetailClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailClinic: {},
            isLoading: true,
        }
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.loadData();
        }
    }

    loadData = async () => {
        let id = this.props.match.params.id;
        this.setState({ isLoading: true });
        let res = await getAllDetailClinicById({ id: id });
        if (res && res.errCode === 0) {
            let data = res.data || {};
            this.setState({
                dataDetailClinic: data,
                arrDoctorId: (data.doctorClinic || []).map(item => item.doctorId),
                isLoading: false,
            })
        } else {
            this.setState({ isLoading: false });
        }
    }

    render() {
        let { arrDoctorId, dataDetailClinic, isLoading } = this.state;
        let hero = (
            <div className="bc-page-hero clinic-hero">
                <div className="bc-container clinic-hero-inner">
                    {dataDetailClinic.image && (
                        <div className="clinic-logo" style={{ backgroundImage: `url(${dataDetailClinic.image})` }}></div>
                    )}
                    <div>
                        <div className="bc-breadcrumb">
                            <Link to="/home"><FormattedMessage id="nav.home" /></Link>
                            <span>/</span>
                            <Link to="/clinics"><FormattedMessage id="nav.clinic" /></Link>
                        </div>
                        <h1>{dataDetailClinic.name || '...'}</h1>
                        {dataDetailClinic.address && <p><i className="fas fa-map-marker-alt"></i> {dataDetailClinic.address}</p>}
                    </div>
                </div>
            </div>
        );
        return (
            <PageLayout hero={hero}>
                <div className="bc-container detail-specialty-body">
                    {dataDetailClinic.descriptionHTML && (
                        <div className="bc-card des-specialty">
                            <CollapsibleContent html={dataDetailClinic.descriptionHTML} />
                        </div>
                    )}

                    <div className="doctors-head">
                        <h2><FormattedMessage id="detail.doctors-of-clinic" /> <span className="count">({arrDoctorId.length})</span></h2>
                    </div>

                    {isLoading ? (
                        <div className="bc-skeleton" style={{ height: 220 }}></div>
                    ) : arrDoctorId.length === 0 ? (
                        <div className="bc-card bc-empty"><i className="fas fa-user-md"></i><FormattedMessage id="detail.no-doctor" /></div>
                    ) : (
                        <div className="doctor-rows">
                            {arrDoctorId.map(item => <DoctorBookingRow key={item} doctorId={item} />)}
                        </div>
                    )}
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

export default connect(mapStateToProps)(DetailClinic);
