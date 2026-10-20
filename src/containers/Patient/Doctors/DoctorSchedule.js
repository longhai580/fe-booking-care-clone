import React, { Component } from 'react';
import { connect } from "react-redux";
import moment from 'moment';
import 'moment/locale/vi';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, TIME_SLOT_START_HOUR } from '../../../utils';
import { getScheduleDoctorByDateService } from '../../../services/userService';
import BookingModal from './Modal/BookingModal';
import './DoctorSchedule.scss';

class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            selectedDay: null,
            allAvailableTime: [],
            isLoading: false,
            isOpenModalBooking: false,
            dataScheduleTimeModal: {},
        }
    }

    async componentDidMount() {
        let allDays = this.getArrDays(this.props.language);
        this.setState({ allDays: allDays, selectedDay: allDays[0].value }, this.loadSchedule);
    }

    async componentDidUpdate(prevProps) {
        if (this.props.language !== prevProps.language) {
            this.setState({ allDays: this.getArrDays(this.props.language) });
        }
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            this.loadSchedule();
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getArrDays = (language) => {
        let allDays = [];
        for (let i = 0; i < 7; i++) {
            let day = moment(new Date()).add(i, 'days');
            if (language === LANGUAGES.EN) day = day.locale('en');
            else day = day.locale('vi');
            let weekday;
            if (i === 0) weekday = language === LANGUAGES.VI ? 'Hôm nay' : 'Today';
            else if (i === 1) weekday = language === LANGUAGES.VI ? 'Ngày mai' : 'Tomorrow';
            else weekday = this.capitalizeFirstLetter(day.format(language === LANGUAGES.VI ? 'dddd' : 'ddd'));
            allDays.push({
                weekday: weekday,
                date: day.format('DD/MM'),
                value: moment(new Date()).add(i, 'days').startOf('day').valueOf(),
            });
        }
        return allDays;
    }

    loadSchedule = async () => {
        let { doctorIdFromParent } = this.props;
        let { selectedDay } = this.state;
        if (!doctorIdFromParent || doctorIdFromParent === -1 || !selectedDay) return;
        this.setState({ isLoading: true });
        let res = await getScheduleDoctorByDateService(doctorIdFromParent, selectedDay);
        let slots = res && res.errCode === 0 && res.data ? res.data : [];
        // hide slots that already started today
        if (selectedDay === moment().startOf('day').valueOf()) {
            let currentHour = new Date().getHours();
            slots = slots.filter(item => (TIME_SLOT_START_HOUR[item.timeType] || 0) > currentHour);
        }
        slots.sort((a, b) => (TIME_SLOT_START_HOUR[a.timeType] || 0) - (TIME_SLOT_START_HOUR[b.timeType] || 0));
        this.setState({ allAvailableTime: slots, isLoading: false });
    }

    handleSelectDay = (value) => {
        this.setState({ selectedDay: value }, this.loadSchedule);
    }

    handleClickScheduleTime = (time) => {
        if (time.isFull) return;
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time
        })
    }

    closeModalBooking = () => {
        this.setState({ isOpenModalBooking: false })
    }

    render() {
        let { allDays, selectedDay, allAvailableTime, isLoading, isOpenModalBooking, dataScheduleTimeModal } = this.state;
        let { language } = this.props;

        return (
            <>
                <div className="doctor-schedule-container">
                    <div className="schedule-title">
                        <i className="far fa-calendar-alt"></i>
                        <FormattedMessage id="patient.detail-doctor.schedule" />
                    </div>
                    <div className="schedule-days">
                        {allDays.map(item => (
                            <button key={item.value} type="button"
                                className={item.value === selectedDay ? 'day-item active' : 'day-item'}
                                onClick={() => this.handleSelectDay(item.value)}>
                                <span className="day-weekday">{item.weekday}</span>
                                <span className="day-date">{item.date}</span>
                            </button>
                        ))}
                    </div>
                    <div className="time-content">
                        {isLoading ? (
                            <div className="time-grid">{[1, 2, 3, 4].map(i => <div key={i} className="bc-skeleton" style={{ height: 40 }}></div>)}</div>
                        ) : allAvailableTime.length > 0 ? (
                            <>
                                <div className="time-grid">
                                    {allAvailableTime.map((item) => (
                                        <button key={item.id || item.timeType} type="button"
                                            disabled={item.isFull}
                                            onClick={() => this.handleClickScheduleTime(item)}
                                            className="time-item">
                                            {language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn}
                                            {item.isFull && <small><FormattedMessage id="patient.detail-doctor.slot-full" /></small>}
                                        </button>
                                    ))}
                                </div>
                                <div className="book-free">
                                    <FormattedMessage id="patient.detail-doctor.choose" />
                                    <i className="far fa-hand-point-up"></i>
                                    <FormattedMessage id="patient.detail-doctor.book-free" />
                                </div>
                            </>
                        ) : (
                            <div className="no-schedule">
                                <i className="far fa-calendar-times"></i>
                                <FormattedMessage id="patient.detail-doctor.no-schedule" />
                            </div>
                        )}
                    </div>
                </div>
                <BookingModal
                    isOpenModal={isOpenModalBooking}
                    closeModalBooking={this.closeModalBooking}
                    onBooked={this.loadSchedule}
                    dataTime={dataScheduleTimeModal}
                />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    }
};

export default connect(mapStateToProps)(DoctorSchedule);
