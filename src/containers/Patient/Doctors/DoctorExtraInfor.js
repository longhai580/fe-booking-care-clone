import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { formatPrice, pickLang } from '../../../utils';
import { getExtraInforDoctorById } from '../../../services/userService';
import './DoctorExtraInfor.scss';

class DoctorExtraInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false,
            extraInfor: {},
        }
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            this.loadData();
        }
    }

    loadData = async () => {
        let { doctorIdFromParent } = this.props;
        if (!doctorIdFromParent || doctorIdFromParent === -1) return;
        let res = await getExtraInforDoctorById(doctorIdFromParent);
        if (res && res.errCode === 0) {
            this.setState({ extraInfor: res.data || {} })
        }
    }

    render() {
        let { language } = this.props;
        let { isShowDetailInfor, extraInfor } = this.state;
        let price = formatPrice(extraInfor.priceTypeData, language);

        return (
            <div className="doctor-extra-infor-container">
                <div className="extra-block">
                    <div className="extra-label"><i className="fas fa-map-marker-alt"></i> <FormattedMessage id="patient.extra-infor-doctor.text-address" /></div>
                    <div className="extra-clinic">{extraInfor.nameClinic || '—'}</div>
                    {extraInfor.addressClinic && <div className="extra-address">{extraInfor.addressClinic}</div>}
                </div>
                <div className="extra-block">
                    <div className="extra-price-row">
                        <span className="extra-label"><i className="fas fa-tag"></i> <FormattedMessage id="patient.extra-infor-doctor.price" /></span>
                        <span className="extra-price">{price || '—'}</span>
                    </div>
                    {isShowDetailInfor && (
                        <div className="extra-detail">
                            {extraInfor.note && <div className="extra-note">{extraInfor.note}</div>}
                            <div className="extra-payment">
                                <FormattedMessage id="patient.extra-infor-doctor.payment" />
                                <strong>{pickLang(extraInfor.paymentTypeData, language)}</strong>
                            </div>
                        </div>
                    )}
                    <button type="button" className="extra-toggle"
                        onClick={() => this.setState({ isShowDetailInfor: !isShowDetailInfor })}>
                        <FormattedMessage id={isShowDetailInfor ? 'patient.extra-infor-doctor.hide' : 'patient.extra-infor-doctor.detail'} />
                        <i className={isShowDetailInfor ? 'fas fa-chevron-up' : 'fas fa-chevron-down'}></i>
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    }
};

export default connect(mapStateToProps)(DoctorExtraInfor);
