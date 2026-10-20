import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import PageLayout from '../../../components/Common/PageLayout';
import { getPatientBookings } from '../../../services/userService';
import { buildDoctorName, pickLang, LANGUAGES } from '../../../utils';
import './MyBookings.scss';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class MyBookings extends Component {
    constructor(props) {
        super(props);
        this.state = { email: '', bookings: null, isLoading: false, error: '' };
    }

    handleSearch = async (event) => {
        event.preventDefault();
        let email = this.state.email.trim();
        if (!EMAIL_REGEX.test(email)) {
            this.setState({ error: 'my-bookings.invalid-email' });
            return;
        }
        this.setState({ isLoading: true, error: '' });
        let res = await getPatientBookings(email);
        this.setState({ bookings: res && res.errCode === 0 ? res.data : [], isLoading: false });
    }

    renderBooking = (item) => {
        let { language } = this.props;
        let date = moment(+item.date);
        if (language === LANGUAGES.EN) date = date.locale('en');
        return (
            <div key={item.id} className="bc-card booking-item">
                <div className="booking-date">
                    <span className="day">{date.format('DD')}</span>
                    <span className="month">{date.format('MM/YYYY')}</span>
                </div>
                <div className="booking-main">
                    <Link to={`/detail-doctor/${item.doctorId}`} className="booking-doctor">
                        {buildDoctorName(item.doctorBookingData, language)}
                    </Link>
                    <div className="booking-time">
                        <i className="far fa-clock"></i> {pickLang(item.timeTypeDataPatient, language)} · {date.format('dddd')}
                    </div>
                    {item.statusId === 'S1' && <div className="booking-note"><FormattedMessage id="my-bookings.note-S1" /></div>}
                </div>
                <span className={`bc-badge status-${item.statusId}`}>{pickLang(item.statusData, language)}</span>
            </div>
        );
    }

    render() {
        let { email, bookings, isLoading, error } = this.state;
        let { intl } = this.props;
        return (
            <PageLayout
                title={intl.formatMessage({ id: 'my-bookings.title' })}
                description={intl.formatMessage({ id: 'my-bookings.desc' })}
                breadcrumb={[{ label: intl.formatMessage({ id: 'nav.my-bookings' }) }]}
            >
                <div className="bc-container my-bookings">
                    <form className="bc-card lookup-form" onSubmit={this.handleSearch}>
                        <div className="bc-field">
                            <label htmlFor="lookup-email"><FormattedMessage id="my-bookings.email" /></label>
                            <input id="lookup-email" type="email" className={error ? 'bc-input is-invalid' : 'bc-input'}
                                value={email} placeholder="email@example.com"
                                onChange={(event) => this.setState({ email: event.target.value, error: '' })} />
                            {error && <div className="bc-field-error"><FormattedMessage id={error} /></div>}
                        </div>
                        <button type="submit" className="bc-btn" disabled={isLoading}>
                            {isLoading ? <span className="spinner-border spinner-border-sm"></span> : <i className="fas fa-search"></i>}
                            <FormattedMessage id="my-bookings.search" />
                        </button>
                    </form>

                    {bookings && bookings.length === 0 && (
                        <div className="bc-empty"><i className="far fa-calendar-times"></i><FormattedMessage id="my-bookings.empty" /></div>
                    )}
                    {bookings && bookings.length > 0 && (
                        <div className="booking-list">{bookings.map(this.renderBooking)}</div>
                    )}
                </div>
            </PageLayout>
        );
    }
}

const mapStateToProps = state => ({ language: state.app.language });

export default connect(mapStateToProps)(injectIntl(MyBookings));
