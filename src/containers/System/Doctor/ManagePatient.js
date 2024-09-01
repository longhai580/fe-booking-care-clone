import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import { toast } from 'react-toastify';

import { FormattedMessage } from 'react-intl';
import './ManagePatient.scss';
import {getAllPatientForDoctor, postSendRemedy} from '../../../services/userService'
import moment from 'moment';
import RemedyModal from './RemedyModal';
import LoadingOverlay from 'react-loading-overlay';
class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoading: false
        }
    }
    async componentDidMount() {
      
         this.getDataPatient()
    }
    getDataPatient = async () => {
        let { user } = this.props;
        let { currentDate } = this.state
        let formatedDate = new Date(currentDate).getTime();
        let res = await getAllPatientForDoctor({
            doctorId: user.id,
            date: formatedDate
        });
        console.log('check res', res.data)
        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot ) {
        if (this.props.language === prevProps.language) {
            
        }
    }
    handleOnChangeDataPicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async() => {         
            await this.getDataPatient()
        })
    }
    handleBtnConfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.firstName,
        }
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })
    }
    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })
    }
    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state;
        this.setState({
            isShowLoading: true
        })
        let res = await postSendRemedy({
            email: dataChild.email,
            imgBase64: dataChild.imgBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName
        });
        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false
            })
            toast.success('Send Remedy Success');
            this.closeRemedyModal()
            await this.getDataPatient()

        } else {
            toast.error('Something wrongs...')
        }

    }
    render() {
        let { language } = this.props;
        let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
        console.log('check manage patient data',dataPatient)
        return (
            <>
                      <LoadingOverlay
            active={this.state.isShowLoading}
            spinner
            text='Loading...'
            >
                <div className="manage-patient-container">
                <div className="m-p-title">
                    Quản lý bệnh nhân khám bệnh
                </div>
                <div className="manage-patient-body row">
                    <div className="col-4 form-group ">
                        <label>Chọn ngày khám</label>
                        <DatePicker
                                onChange={this.handleOnChangeDataPicker}
                                className="form-control"
                                value={this.state.currentDate} 
                                minDate= {new Date()}
                            />
                        
                    </div>
                    <div className="col-12 table-manage-patient">
                        <table class="table">
                        <tbody>
                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">Thời gian</th>
                                    <th scope="col">Họ và tên</th>
                                    <th scope="col">Địa chỉ</th>

                                <th scope="col">Giới tính</th>
                                <th scope="col">Actions</th>
                            </tr>
                                 {dataPatient && dataPatient.length > 0 
                                    && dataPatient.map((item, index) => {
                                        let time = language === LANGUAGES.VI ? item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn;
                                        let gender = language === LANGUAGES.VI ? item.patientData.genderData.valueVi : item.patientData.genderData.valueEn;
                                        return (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{time}</td>
                                                <td>{item.patientData.firstName}</td>
                                                <td>{item.patientData.address}</td>
                                                <td>{gender}</td>

                                                {/* <td>{item.gender === 1? 'Nam' : 'Nữ'}</td> */}
                                                <td>
                                                    <button className="btn btn-primary mp-btn-confirm"
                                                    onClick= {() => this.handleBtnConfirm(item)}
                                                    >Xác nhận</button>
                                                   
                                                </td>
                                            </tr>
                                        )
                                    })
                                    

                                } 
                            
                            
                            
                          
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>
                <RemedyModal
                    isOpenModal={isOpenRemedyModal}
                    dataModal={dataModal}
                    closeRemedyModal={this.closeRemedyModal}
                    sendRemedy={this.sendRemedy}
                />
          
            </LoadingOverlay>
            </>
            
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language, 
        user: state.user.userInfo, 

    }
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
