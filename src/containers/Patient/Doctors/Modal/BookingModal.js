import React, { Component } from 'react';
import { connect } from "react-redux";
import { Modal } from 'reactstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { toast } from 'react-toastify';
import moment from 'moment';
import _ from 'lodash';
import ProfileDoctor from '../ProfileDoctor'
import * as actions from '../../../../store/actions'
import DatePicker from '../../../../components/Input/DatePicker';
import { LANGUAGES } from '../../../../utils';
import { postPatientBookingAppoinment } from '../../../../services/userService'
import './BookingModal.scss';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+?84|0)\d{8,10}$/;

const INITIAL_FORM = {
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    reason: '',
    birthday: '',
    selectedGender: '',
};

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_FORM,
            errors: {},
            isSubmitting: false,
            verifyLink: '',
            isSuccess: false,
        }
    }

    componentDidMount() {
        this.props.getGenders();
    }

    componentDidUpdate(prevProps) {
        if (this.props.isOpenModal && !prevProps.isOpenModal) {
            this.setState({ errors: {}, verifyLink: '', isSuccess: false });
        }
    }

    handleOnChangeInput = (event, id) => {
        let errors = { ...this.state.errors };
        delete errors[id];
        this.setState({ [id]: event.target.value, errors });
    }

    handleOnChangeDataPicker = (date) => {
        this.setState({ birthday: date[0] })
    }

    validate = () => {
        let { fullName, phoneNumber, email, address, selectedGender } = this.state;
        let errors = {};
        if (!fullName.trim()) errors.fullName = 'patient.booking-modal.required';
        if (!phoneNumber.trim()) errors.phoneNumber = 'patient.booking-modal.required';
        else if (!PHONE_REGEX.test(phoneNumber.replace(/[\s.-]/g, ''))) errors.phoneNumber = 'patient.booking-modal.invalid-phone';
        if (!email.trim()) errors.email = 'patient.booking-modal.required';
        else if (!EMAIL_REGEX.test(email.trim())) errors.email = 'patient.booking-modal.invalid-email';
        if (!address.trim()) errors.address = 'patient.booking-modal.required';
        if (!selectedGender) errors.selectedGender = 'patient.booking-modal.required';
        this.setState({ errors });
        return Object.keys(errors).length === 0;
    }

    handleConfirmBooking = async () => {
        if (!this.validate()) return;
        let { dataTime, language } = this.props;
        this.setState({ isSubmitting: true });
        let res;
        try {
            res = await postPatientBookingAppoinment({
                fullName: this.state.fullName.trim(),
                phoneNumber: this.state.phoneNumber.trim(),
                email: this.state.email.trim(),
                address: this.state.address.trim(),
                reason: this.state.reason.trim(),
                date: dataTime.date,
                birthday: this.state.birthday ? new Date(this.state.birthday).getTime() : '',
                doctorId: dataTime.doctorId,
                selectedGender: this.state.selectedGender,
                timeType: dataTime.timeType,
                language: language,
                timeString: this.buildTimeBooking(dataTime),
                doctorName: this.buildDoctorName(dataTime)
            });
        } catch (e) {
            res = null;
        }
        this.setState({ isSubmitting: false });
        let { intl } = this.props;
        if (res && res.errCode === 0) {
            if (this.props.onBooked) this.props.onBooked();
            if (res.verifyLink) {
                this.setState({ ...INITIAL_FORM, isSuccess: true, verifyLink: res.verifyLink });
            } else {
                toast.success(intl.formatMessage({ id: 'patient.booking-modal.success' }));
                this.setState({ ...INITIAL_FORM });
                this.props.closeModalBooking();
            }
        } else if (res && res.errCode === 2) {
            toast.warn(intl.formatMessage({ id: 'patient.booking-modal.duplicated' }));
        } else if (res && res.errCode === 3) {
            toast.warn(intl.formatMessage({ id: 'patient.booking-modal.full' }));
        } else {
            toast.error(intl.formatMessage({ id: 'patient.booking-modal.error' }));
        }
    }

    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
            let date = language === LANGUAGES.VI ?
                moment(+dataTime.date).locale('vi').format('dddd - DD/MM/YYYY')
                : moment(+dataTime.date).locale('en').format('ddd - MM/DD/YYYY');
            return `${time} - ${date}`
        }
        return ''
    }

    buildDoctorName = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime) && dataTime.doctorData) {
            return language === LANGUAGES.VI ?
                `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
                : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;
        }
        return ''
    }

    renderField = (id, labelId, options = {}) => {
        let { errors } = this.state;
        return (
            <div className={options.full ? 'col-12' : 'col-md-6'}>
                <div className="bc-field">
                    <label htmlFor={`booking-${id}`}>
                        <FormattedMessage id={labelId} />
                        {options.required && <span className="required">*</span>}
                    </label>
                    <input id={`booking-${id}`} type={options.type || 'text'}
                        className={errors[id] ? 'bc-input is-invalid' : 'bc-input'}
                        value={this.state[id]}
                        onChange={(event) => this.handleOnChangeInput(event, id)} />
                    {errors[id] && <div className="bc-field-error"><FormattedMessage id={errors[id]} /></div>}
                </div>
            </div>
        );
    }

    renderSuccess = () => (
        <div className="booking-success">
            <span className="success-icon"><i className="fas fa-check"></i></span>
            <p><FormattedMessage id="patient.booking-modal.success-no-email" /></p>
            <a className="bc-btn" href={this.state.verifyLink}>
                <i className="fas fa-check-double"></i> <FormattedMessage id="patient.booking-modal.verify-now" />
            </a>
        </div>
    )

    render() {
        let { isOpenModal, closeModalBooking, dataTime, genders, language } = this.props;
        let { errors, isSubmitting, isSuccess } = this.state;
        let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : '';
        return (
            <Modal
                isOpen={isOpenModal}
                toggle={closeModalBooking}
                size="lg"
                centered={true}
                className={'booking-modal-container'}>
                <div className="booking-modal-content">
                    <div className="booking-modal-header">
                        <h5><FormattedMessage id="patient.booking-modal.title" /></h5>
                        <button type="button" onClick={closeModalBooking} className="btn-close-modal" aria-label="Close">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <div className="booking-modal-body">
                        <div className="doctor-infor">
                            <ProfileDoctor
                                doctorId={doctorId}
                                isShowDescriptionDoctor={false}
                                isShowLinkDetail={false}
                                isShowPrice={true}
                                dataTime={dataTime}
                            />
                        </div>
                        {isSuccess ? this.renderSuccess() : (
                            <div className="row">
                                {this.renderField('fullName', 'patient.booking-modal.fullName', { required: true })}
                                {this.renderField('phoneNumber', 'patient.booking-modal.phoneNumber', { required: true, type: 'tel' })}
                                {this.renderField('email', 'patient.booking-modal.email', { required: true, type: 'email' })}
                                {this.renderField('address', 'patient.booking-modal.address', { required: true })}
                                <div className="col-md-6">
                                    <div className="bc-field">
                                        <label><FormattedMessage id="patient.booking-modal.birthday" /></label>
                                        <DatePicker
                                            onChange={this.handleOnChangeDataPicker}
                                            className="bc-input"
                                            value={this.state.birthday}
                                            maxDate={new Date()}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="bc-field">
                                        <label htmlFor="booking-gender">
                                            <FormattedMessage id="patient.booking-modal.gender" /><span className="required">*</span>
                                        </label>
                                        <select id="booking-gender"
                                            className={errors.selectedGender ? 'bc-select is-invalid' : 'bc-select'}
                                            value={this.state.selectedGender}
                                            onChange={(event) => this.handleOnChangeInput(event, 'selectedGender')}>
                                            <option value="">--</option>
                                            {(genders || []).map(item => (
                                                <option key={item.keyMap} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.selectedGender && <div className="bc-field-error"><FormattedMessage id={errors.selectedGender} /></div>}
                                    </div>
                                </div>
                                {this.renderField('reason', 'patient.booking-modal.reason', { full: true })}
                                <div className="col-12 booking-note">
                                    <i className="fas fa-lock"></i> <FormattedMessage id="patient.booking-modal.note" />
                                </div>
                            </div>
                        )}
                    </div>
                    {!isSuccess && (
                        <div className="booking-modal-footer">
                            <button type="button" className="bc-btn bc-btn-ghost" onClick={closeModalBooking}>
                                <FormattedMessage id="patient.booking-modal.cancel" />
                            </button>
                            <button type="button" className="bc-btn" disabled={isSubmitting} onClick={this.handleConfirmBooking}>
                                {isSubmitting && <span className="spinner-border spinner-border-sm"></span>}
                                <FormattedMessage id="patient.booking-modal.confirm" />
                            </button>
                        </div>
                    )}
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(BookingModal));
