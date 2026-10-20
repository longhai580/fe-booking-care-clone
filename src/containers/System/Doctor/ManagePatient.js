import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import { toast } from 'react-toastify';
import moment from 'moment';
import DatePicker from '../../../components/Input/DatePicker';
import { pickLang } from '../../../utils';
import { getAllPatientForDoctor, postSendRemedy, cancelBooking, getAllCodeService } from '../../../services/userService'
import RemedyModal from './RemedyModal';
import './ManagePatient.scss';

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            statusId: 'S2',
            statuses: [],
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isSending: false,
            isLoading: true,
        }
    }

    async componentDidMount() {
        let res = await getAllCodeService('STATUS');
        if (res && res.errCode === 0) this.setState({ statuses: res.data });
        this.getDataPatient();
    }

    getDataPatient = async () => {
        let { user } = this.props;
        let { currentDate, statusId } = this.state;
        this.setState({ isLoading: true });
        let res = await getAllPatientForDoctor({
            doctorId: user.id,
            date: new Date(currentDate).getTime(),
            statusId: statusId,
        });
        this.setState({
            dataPatient: res && res.errCode === 0 ? res.data : [],
            isLoading: false,
        })
    }

    handleOnChangeDataPicker = (date) => {
        if (!date || !date[0]) return;
        this.setState({ currentDate: moment(date[0]).startOf('day').valueOf() }, this.getDataPatient);
    }

    handleBtnConfirm = (item) => {
        this.setState({
            isOpenRemedyModal: true,
            dataModal: {
                doctorId: item.doctorId,
                patientId: item.patientId,
                email: item.patientData.email,
                timeType: item.timeType,
                date: item.date,
                patientName: item.patientData.firstName,
            }
        })
    }

    handleCancel = async (item) => {
        let { intl } = this.props;
        if (!window.confirm(intl.formatMessage({ id: 'manage-patient.confirm-cancel' }))) return;
        let res = await cancelBooking({ id: item.id, doctorId: item.doctorId });
        if (res && res.errCode === 0) {
            toast.success(intl.formatMessage({ id: 'manage-patient.cancelled' }));
            this.getDataPatient();
        } else {
            toast.error(intl.formatMessage({ id: 'manage.error' }));
        }
    }

    closeRemedyModal = () => {
        this.setState({ isOpenRemedyModal: false, dataModal: {} })
    }

    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state;
        let { intl } = this.props;
        this.setState({ isSending: true });
        let res = await postSendRemedy({
            email: dataChild.email,
            imgBase64: dataChild.imgBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            date: dataModal.date,
            language: this.props.language,
            patientName: dataModal.patientName
        });
        this.setState({ isSending: false });
        if (res && res.errCode === 0) {
            toast.success(intl.formatMessage({ id: 'manage-patient.send-success' }));
            this.closeRemedyModal()
            this.getDataPatient()
        } else {
            toast.error(intl.formatMessage({ id: 'manage-patient.send-error' }));
        }
    }

    render() {
        let { language, intl } = this.props;
        let { dataPatient, isOpenRemedyModal, dataModal, statuses, statusId, isLoading, isSending } = this.state;
        return (
            <div className="admin-page manage-patient-container">
                <div className="admin-page-head">
                    <h1><FormattedMessage id="manage-patient.title" /></h1>
                </div>
                <div className="admin-card">
                    <div className="mp-filters">
                        <div className="bc-field">
                            <label><FormattedMessage id="manage-patient.date" /></label>
                            <DatePicker
                                onChange={this.handleOnChangeDataPicker}
                                className="bc-input"
                                value={this.state.currentDate}
                            />
                        </div>
                        <div className="bc-field">
                            <label><FormattedMessage id="manage-patient.status" /></label>
                            <select className="bc-select" value={statusId}
                                onChange={(event) => this.setState({ statusId: event.target.value }, this.getDataPatient)}>
                                <option value="ALL">{intl.formatMessage({ id: 'manage-patient.all' })}</option>
                                {statuses.map(item => <option key={item.keyMap} value={item.keyMap}>{pickLang(item, language)}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th><FormattedMessage id="manage-patient.time" /></th>
                                    <th><FormattedMessage id="manage-patient.name" /></th>
                                    <th><FormattedMessage id="manage-patient.phone" /></th>
                                    <th><FormattedMessage id="manage-patient.address" /></th>
                                    <th><FormattedMessage id="manage-patient.gender" /></th>
                                    <th><FormattedMessage id="manage-patient.status" /></th>
                                    <th style={{ textAlign: 'right' }}><FormattedMessage id="manage-patient.actions" /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && <tr><td colSpan={8}><div className="bc-skeleton" style={{ height: 40 }}></div></td></tr>}
                                {!isLoading && dataPatient.length === 0 && (
                                    <tr><td colSpan={8} className="bc-empty"><i className="far fa-calendar-times"></i><FormattedMessage id="manage-patient.empty" /></td></tr>
                                )}
                                {!isLoading && dataPatient.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td><strong>{pickLang(item.timeTypeDataPatient, language)}</strong></td>
                                        <td>
                                            <div>{item.patientData.firstName}</div>
                                            <small className="text-muted">{item.patientData.email}</small>
                                        </td>
                                        <td>{item.patientData.phonenumber || '—'}</td>
                                        <td>{item.patientData.address}</td>
                                        <td>{pickLang(item.patientData.genderData, language)}</td>
                                        <td><span className={`bc-badge status-${item.statusId}`}>{pickLang(item.statusData, language)}</span></td>
                                        <td>
                                            <div className="row-actions">
                                                {item.statusId === 'S2' && (
                                                    <button className="bc-btn bc-btn-sm" onClick={() => this.handleBtnConfirm(item)}>
                                                        <i className="far fa-paper-plane"></i> <FormattedMessage id="manage-patient.confirm" />
                                                    </button>
                                                )}
                                                {(item.statusId === 'S1' || item.statusId === 'S2') && (
                                                    <button className="bc-btn bc-btn-danger bc-btn-sm" onClick={() => this.handleCancel(item)}>
                                                        <FormattedMessage id="manage-patient.cancel" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <RemedyModal
                    isOpenModal={isOpenRemedyModal}
                    dataModal={dataModal}
                    isSending={isSending}
                    closeRemedyModal={this.closeRemedyModal}
                    sendRemedy={this.sendRemedy}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo,
    }
};

export default connect(mapStateToProps)(injectIntl(ManagePatient));
