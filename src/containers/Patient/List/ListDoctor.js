import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import PageLayout from '../../../components/Common/PageLayout';
import { getListDoctors, getAllSpecialty, getAllCodeService } from '../../../services/userService';
import { buildDoctorName, formatPrice, pickLang } from '../../../utils';
import ListToolbar from './ListToolbar';
import './List.scss';

class ListDoctor extends Component {
    constructor(props) {
        super(props);
        let params = new URLSearchParams(props.location ? props.location.search : '');
        this.state = {
            doctors: [],
            specialties: [],
            provinces: [],
            keyword: params.get('keyword') || '',
            specialtyId: params.get('specialtyId') || 'ALL',
            provinceId: 'ALL',
            isLoading: true,
        };
        this.timer = null;
    }

    async componentDidMount() {
        let [resSpecialty, resProvince] = await Promise.all([getAllSpecialty(), getAllCodeService('PROVINCE')]);
        this.setState({
            specialties: resSpecialty && resSpecialty.errCode === 0 ? resSpecialty.data : [],
            provinces: resProvince && resProvince.errCode === 0 ? resProvince.data : [],
        });
        this.loadDoctors();
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.search !== prevProps.location.search) {
            let params = new URLSearchParams(this.props.location.search);
            this.setState({ keyword: params.get('keyword') || '' }, this.loadDoctors);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    loadDoctors = async () => {
        let { keyword, specialtyId, provinceId } = this.state;
        this.setState({ isLoading: true });
        let res = await getListDoctors({ keyword: keyword.trim(), specialtyId, provinceId });
        this.setState({ doctors: res && res.errCode === 0 ? res.data : [], isLoading: false });
    }

    handleKeywordChange = (keyword) => {
        this.setState({ keyword });
        clearTimeout(this.timer);
        this.timer = setTimeout(this.loadDoctors, 350);
    }

    handleSelectChange = (field, value) => {
        this.setState({ [field]: value }, this.loadDoctors);
    }

    renderDoctor = (item) => {
        let { language } = this.props;
        let infor = item.Doctor_Infor || {};
        return (
            <div key={item.id} className="bc-card doctor-row">
                <Link to={`/detail-doctor/${item.id}`} className="bc-avatar"
                    style={item.image ? { backgroundImage: `url(${item.image})` } : {}}>
                    {!item.image && <i className="fas fa-user-md"></i>}
                </Link>
                <div className="doctor-row-main">
                    <Link to={`/detail-doctor/${item.id}`} className="doctor-row-name">{buildDoctorName(item, language)}</Link>
                    {item.Markdown && item.Markdown.description && (
                        <div className="doctor-row-desc">{item.Markdown.description}</div>
                    )}
                    <div className="doctor-row-meta">
                        {infor.specialtyData && infor.specialtyData.name && (
                            <span><i className="fas fa-stethoscope"></i>{infor.specialtyData.name}</span>
                        )}
                        {infor.provinceTypeData && infor.provinceTypeData.valueVi && (
                            <span><i className="fas fa-map-marker-alt"></i>{pickLang(infor.provinceTypeData, language)}</span>
                        )}
                        {infor.nameClinic && <span><i className="far fa-hospital"></i>{infor.nameClinic}</span>}
                    </div>
                </div>
                <div className="doctor-row-action">
                    {infor.priceTypeData && infor.priceTypeData.valueVi && (
                        <span className="price">{formatPrice(infor.priceTypeData, language)}</span>
                    )}
                    <Link to={`/detail-doctor/${item.id}`} className="bc-btn bc-btn-sm">
                        <i className="far fa-calendar-alt"></i> <FormattedMessage id="list.book-now" />
                    </Link>
                </div>
            </div>
        );
    }

    render() {
        let { doctors, specialties, provinces, keyword, specialtyId, provinceId, isLoading } = this.state;
        let { intl, language } = this.props;
        return (
            <PageLayout
                title={intl.formatMessage({ id: 'list.doctor-title' })}
                description={intl.formatMessage({ id: 'list.doctor-desc' })}
                breadcrumb={[{ label: intl.formatMessage({ id: 'nav.doctor' }) }]}
            >
                <div className="bc-container">
                    <ListToolbar keyword={keyword} total={doctors.length} onChange={this.handleKeywordChange}>
                        <select className="bc-select" value={specialtyId}
                            onChange={(event) => this.handleSelectChange('specialtyId', event.target.value)}>
                            <option value="ALL">{intl.formatMessage({ id: 'list.all-specialty' })}</option>
                            {specialties.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                        </select>
                        <select className="bc-select" value={provinceId}
                            onChange={(event) => this.handleSelectChange('provinceId', event.target.value)}>
                            <option value="ALL">{intl.formatMessage({ id: 'list.all-province' })}</option>
                            {provinces.map(item => <option key={item.keyMap} value={item.keyMap}>{pickLang(item, language)}</option>)}
                        </select>
                    </ListToolbar>
                    {isLoading ? (
                        <div className="doctor-list">{[1, 2, 3].map(i => <div key={i} className="bc-skeleton" style={{ height: 136 }}></div>)}</div>
                    ) : doctors.length === 0 ? (
                        <div className="bc-empty"><i className="fas fa-user-md"></i><FormattedMessage id="list.empty" /></div>
                    ) : (
                        <div className="doctor-list">{doctors.map(this.renderDoctor)}</div>
                    )}
                </div>
            </PageLayout>
        );
    }
}

const mapStateToProps = state => ({ language: state.app.language });

export default connect(mapStateToProps)(injectIntl(ListDoctor));
