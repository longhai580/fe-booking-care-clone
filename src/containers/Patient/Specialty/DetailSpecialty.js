import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';
import { getAllDetailSpecialtyById, getAllCodeService } from '../../../services/userService'
import PageLayout from '../../../components/Common/PageLayout';
import DoctorBookingRow from '../Doctors/DoctorBookingRow';
import CollapsibleContent from './CollapsibleContent';
import './DetailSpecialty.scss';

class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailSpecialty: {},
            listProvince: [],
            location: 'ALL',
            isLoading: true,
        }
    }

    async componentDidMount() {
        let resProvince = await getAllCodeService('PROVINCE');
        this.setState({ listProvince: resProvince && resProvince.errCode === 0 ? resProvince.data : [] });
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.setState({ location: 'ALL' }, this.loadData);
        }
    }

    loadData = async () => {
        let id = this.props.match.params.id;
        this.setState({ isLoading: true });
        let res = await getAllDetailSpecialtyById({ id: id, location: this.state.location });
        if (res && res.errCode === 0) {
            let data = res.data || {};
            this.setState({
                dataDetailSpecialty: data,
                arrDoctorId: (data.doctorSpecialty || []).map(item => item.doctorId),
                isLoading: false,
            })
        } else {
            this.setState({ isLoading: false });
        }
    }

    handleOnChangeSelect = (event) => {
        this.setState({ location: event.target.value }, this.loadData);
    }

    render() {
        let { arrDoctorId, dataDetailSpecialty, listProvince, location, isLoading } = this.state;
        let { language, intl } = this.props;
        let hasData = !_.isEmpty(dataDetailSpecialty);
        return (
            <PageLayout
                title={dataDetailSpecialty.name || '...'}
                breadcrumb={[{ label: intl.formatMessage({ id: 'nav.specialty' }), link: '/specialties' }]}
            >
                <div className="bc-container detail-specialty-body">
                    {hasData && dataDetailSpecialty.descriptionHTML && (
                        <div className="bc-card des-specialty">
                            <CollapsibleContent html={dataDetailSpecialty.descriptionHTML} />
                        </div>
                    )}

                    <div className="doctors-head">
                        <h2><FormattedMessage id="detail.doctors-of-specialty" /> <span className="count">({arrDoctorId.length})</span></h2>
                        <select className="bc-select" value={location} onChange={this.handleOnChangeSelect}>
                            <option value="ALL">{intl.formatMessage({ id: 'list.all-province' })}</option>
                            {listProvince.map(item => (
                                <option key={item.keyMap} value={item.keyMap}>
                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                </option>
                            ))}
                        </select>
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

export default connect(mapStateToProps)(injectIntl(DetailSpecialty));
