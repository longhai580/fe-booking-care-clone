import React, { Component } from 'react';
import { connect } from "react-redux";
import { Modal } from 'reactstrap';
import ProfileDoctor  from '../ProfileDoctor'
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss';
import _ from 'lodash';
import * as actions from '../../../../store/actions'
import DatePicker from '../../../../components/Input/DatePicker';
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import { postPatientBookingAppoinment } from '../../../../services/userService'
import { toast } from 'react-toastify';
import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            doctorId: '',
            selectedGender: '',
            genders: '',
            timeType: '',
            isShowLoading: false

        }
    }
    async componentDidMount() {
        this.props.getGenders();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.genders !== prevProps.genders) {
           
             
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.dataTime !== prevProps.dataTime) { 
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)){
                let doctorId = this.props.dataTime.doctorId 
                let timeType = this.props.dataTime.timeType
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }
    }
    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;
        if (data && data.length > 0) {
            data.map((item) => {
                let object = {};
                
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object);
            })
        }
        return result;

    }
    handleOnChangeInput = (event, id) => {
        let valueInput = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        })
    }
    handleOnChangeDataPicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }
    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedGender: selectedOption });
     
    };
    handleConfirmBooking = async () => {
        this.setState({
            isShowLoading: true
        })
        // validate input
        let date = new Date(this.state.birthday).getTime(); 
        let timeString = this.buildTimeBooking(this.props.dataTime)
        let doctorName = this.buildDoctorName(this.props.dataTime)
        let res = await postPatientBookingAppoinment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: this.props.dataTime.date,
            birthday: date,
            doctorId: this.state.doctorId,
            selectedGender: this.state.selectedGender.value,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName

        })
        this.setState({
            isShowLoading: false
        })
        if (res && res.errCode === 0) {
            toast.success("Booking a new appoinment success!");
            this.props.closeModalBooking();

        } else {
            toast.error("Booking a new appoinment error!");

        }

    }
    buildTimeBooking = (dataTime) => {
        let { language } = this.props;

        
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.date/1000).format('dddd - DD/MM/YYYY')
                : moment.unix(+dataTime.date/1000).locale('en').format('ddd - MM/DD/YYYY');
            return ` ${time} - ${date}`
        }
        return ''
        
    }
    buildDoctorName = (dataTime) => {
        let { language } = this.props;

        
        if (dataTime && !_.isEmpty(dataTime)) {
            let name = language === LANGUAGES.VI ? 
              `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
            :
            `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
            
            return name
            }
        return ''
    }
    render() {
       let {isOpenModal, closeModalBooking, dataTime} = this.props;
        let doctorId = '';
        if (dataTime && !_.isEmpty(dataTime)){
            doctorId = dataTime.doctorId 
        }
       
        return (
            <LoadingOverlay
                active={this.state.isShowLoading}
                spinner
                text='Loading...'
            
            >

           
            <Modal
                isOpen={isOpenModal}
                size="lg"
                backdrop={true}
                centered={true}
                className={'booking-modal-container'}>
               
                <div className="booking-modal-content">
                    <div className="booking-modal-header"> 
                        <span className="left">
                            <FormattedMessage id="patient.booking-modal.title" />
                        </span>
                        <span
                            onClick={closeModalBooking}
                            className="right"><i className="fas fa-times"></i></span>
                    </div>
                    <div className="booking-modal-body">
                        <div className="doctor-infor">

                            <ProfileDoctor
                                doctorId={doctorId}
                                isShowDescriptionDoctor={false}
                                isShowLinkDetail ={false}
                                isShowPrice = {true}
                                dataTime={dataTime}
                            />
                        </div>
                       
                        <div className="row">
                            <div className="col-6 form-group">
                                <label>
                                <FormattedMessage id="patient.booking-modal.fullName" />


                                </label>
                                <input className="form-control"
                                    value={this.state.fullName}
                                    onChange={(event) =>{this.handleOnChangeInput(event, 'fullName')}}
                                
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                <FormattedMessage id="patient.booking-modal.phoneNumber" />

                                </label>
                                <input className="form-control"
                                 value={this.state.phoneNumber}
                                 onChange={(event) =>{this.handleOnChangeInput(event, 'phoneNumber')}}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                <FormattedMessage id="patient.booking-modal.email" />

                                </label>
                                <input className="form-control"
                                 value={this.state.email}
                                 onChange={(event) =>{this.handleOnChangeInput(event, 'email')}}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                <FormattedMessage id="patient.booking-modal.address" />

                                </label>
                                <input className="form-control"
                                value={this.state.address}
                                onChange={(event) =>{this.handleOnChangeInput(event, 'address')}}
                                />
                            </div>
                            <div className="col-12 form-group">
                                <label>
                                <FormattedMessage id="patient.booking-modal.reason" />


                                </label>
                                <input className="form-control"
                                
                                value={this.state.reason}
                                 onChange={(event) =>{this.handleOnChangeInput(event, 'reason')}}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                <FormattedMessage id="patient.booking-modal.birthday" />


                                </label>
                                <DatePicker
                                onChange={this.handleOnChangeDataPicker}
                                className="form-control"
                                value={this.state.birthday} 
                            />
                                
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                <FormattedMessage id="patient.booking-modal.gender" />

                                </label>
                                <Select
                                 value={this.state.selectedGender}
                                 onChange={this.handleChangeSelect}
                                 options={this.state.genders}
                                />
                            </div>

                        </div>
                    </div>
                    <div className="booking-modal-footer">
                        <button className="btn-booking-confirm"
                        onClick={() => this.handleConfirmBooking()}
                        >
                        <FormattedMessage id="patient.booking-modal.confirm" />


                        </button>
                        <button className="btn-booking-cancel"
                            onClick={closeModalBooking}
                        >
                    <FormattedMessage id="patient.booking-modal.cancel" />


                        </button>

                    </div>

                </div>
                </Modal>
                </LoadingOverlay>
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

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
