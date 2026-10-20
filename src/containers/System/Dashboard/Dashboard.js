import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { getStatistics, getAllCodeService } from '../../../services/userService';
import { pickLang } from '../../../utils';
import './Dashboard.scss';

const STAT_ITEMS = [
    { key: 'doctors', icon: 'fas fa-user-md', link: '/system/manage-doctor' },
    { key: 'patients', icon: 'fas fa-user-injured', link: '/system/user-manage' },
    { key: 'specialties', icon: 'fas fa-stethoscope', link: '/system/manage-specialty' },
    { key: 'clinics', icon: 'far fa-hospital', link: '/system/manage-clinic' },
    { key: 'handbooks', icon: 'far fa-newspaper', link: '/system/manage-handbook' },
];

const QUICK_ACTIONS = [
    { id: 'dashboard.add-user', icon: 'fas fa-user-plus', link: '/system/user-redux' },
    { id: 'dashboard.add-doctor-info', icon: 'fas fa-id-card', link: '/system/manage-doctor' },
    { id: 'dashboard.add-schedule', icon: 'far fa-calendar-plus', link: '/doctor/manage-schedule' },
    { id: 'dashboard.add-handbook', icon: 'fas fa-pen', link: '/system/manage-handbook' },
];

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = { stats: null, statuses: [] };
    }

    async componentDidMount() {
        let [res, resStatus] = await Promise.all([getStatistics(), getAllCodeService('STATUS')]);
        this.setState({
            stats: res && res.errCode === 0 ? res.data : null,
            statuses: resStatus && resStatus.errCode === 0 ? resStatus.data : [],
        });
    }

    render() {
        let { stats, statuses } = this.state;
        let { language } = this.props;
        let byStatus = stats ? stats.bookingByStatus : {};
        let totalBookings = Object.values(byStatus || {}).reduce((sum, value) => sum + value, 0);
        return (
            <div className="admin-page dashboard-page">
                <div className="admin-page-head">
                    <div>
                        <h1><FormattedMessage id="dashboard.title" /></h1>
                        <p><FormattedMessage id="dashboard.subtitle" /></p>
                    </div>
                </div>

                <div className="stat-grid">
                    {STAT_ITEMS.map(item => (
                        <Link key={item.key} to={item.link} className="stat-card">
                            <span className="stat-icon"><i className={item.icon}></i></span>
                            <span className="stat-value">{stats ? stats[item.key] : '—'}</span>
                            <span className="stat-label"><FormattedMessage id={`dashboard.${item.key}`} /></span>
                        </Link>
                    ))}
                </div>

                <div className="dashboard-grid">
                    <div className="admin-card">
                        <h2><FormattedMessage id="dashboard.bookings" /></h2>
                        {statuses.map(status => {
                            let value = (byStatus && byStatus[status.keyMap]) || 0;
                            let percent = totalBookings ? Math.round(value * 100 / totalBookings) : 0;
                            return (
                                <div key={status.keyMap} className="status-row">
                                    <div className="status-row-head">
                                        <span className={`bc-badge status-${status.keyMap}`}>{pickLang(status, language)}</span>
                                        <strong>{value}</strong>
                                    </div>
                                    <div className="status-bar">
                                        <span className={`status-fill status-${status.keyMap}`} style={{ width: `${percent}%` }}></span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="admin-card">
                        <h2><FormattedMessage id="dashboard.quick-actions" /></h2>
                        <div className="quick-actions">
                            {QUICK_ACTIONS.map(item => (
                                <Link key={item.id} to={item.link} className="quick-action">
                                    <i className={item.icon}></i>
                                    <FormattedMessage id={item.id} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({ language: state.app.language });

export default connect(mapStateToProps)(Dashboard);
