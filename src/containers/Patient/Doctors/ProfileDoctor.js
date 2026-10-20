import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/vi';
import { LANGUAGES, buildDoctorName, formatPrice } from '../../../utils';
import { getProfileDoctorById } from '../../../services/userService'
import './ProfileDoctor.scss';

class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {},
        }
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.doctorId !== prevProps.doctorId) {
            this.loadData();
        }
    }

    loadData = async () => {
        let { doctorId } = this.props;
        if (!doctorId) return;
        let res = await getProfileDoctorById(doctorId);
        if (res && res.errCode === 0) {
            this.setState({ dataProfile: res.data || {} });
            if (this.props.onLoaded) this.props.onLoaded(res.data);
        }
    }

    renderTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
            let date = language === LANGUAGES.VI ?
                moment(+dataTime.date).locale('vi').format('dddd - DD/MM/YYYY')
                : moment(+dataTime.date).locale('en').format('ddd - MM/DD/YYYY');
            return (
                <div className="profile-time">
                    <div className="profile-time-main"><i className="far fa-clock"></i> {time} · <span className="text-capitalize">{date}</span></div>
                    <div className="profile-free"><i className="fas fa-check-circle"></i> <FormattedMessage id="patient.booking-modal.freeBooking" /></div>
                </div>
            )
        }
        return null;
    }

    render() {
        let { dataProfile } = this.state;
        let { language, isShowDescriptionDoctor, dataTime, isShowLinkDetail, isShowPrice, doctorId } = this.props;
        let name = dataProfile && dataProfile.positionData ? buildDoctorName(dataProfile, language) : '';
        let infor = dataProfile.Doctor_Infor;
        return (
            <div className="profile-doctor-container">
                <div className="profile-intro">
                    <div className="bc-avatar" style={dataProfile.image ? { backgroundImage: `url(${dataProfile.image})` } : {}}>
                        {!dataProfile.image && <i className="fas fa-user-md"></i>}
                    </div>
                    <div className="profile-content">
                        <div className="profile-name">{name || <span className="bc-skeleton" style={{ display: 'block', height: 20, width: 220 }}></span>}</div>
                        {isShowDescriptionDoctor === true
                            ? (dataProfile.Markdown && dataProfile.Markdown.description && (
                                <div className="profile-desc">{dataProfile.Markdown.description}</div>
                            ))
                            : this.renderTimeBooking(dataTime)
                        }
                        {isShowLinkDetail === true && (
                            <Link className="profile-link" to={`/detail-doctor/${doctorId}`}>
                                <FormattedMessage id="detail.read-more" /> <i className="fas fa-arrow-right"></i>
                            </Link>
                        )}
                    </div>
                </div>
                {isShowPrice === true && infor && infor.priceTypeData && (
                    <div className="profile-price">
                        <FormattedMessage id="patient.booking-modal.priceBooking" />
                        <strong>{formatPrice(infor.priceTypeData, language)}</strong>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    }
};

export default connect(mapStateToProps)(ProfileDoctor);
