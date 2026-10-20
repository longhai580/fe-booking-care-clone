import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getDetailInforDoctorService } from '../../../services/userService';
import { buildDoctorName } from '../../../utils';
import PageLayout from '../../../components/Common/PageLayout';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfor from './DoctorExtraInfor';
import './DetailDoctor.scss';

class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: -1,
            isLoading: true,
        }
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.loadData();
        }
    }

    loadData = async () => {
        let id = this.props.match && this.props.match.params ? this.props.match.params.id : null;
        if (!id) return;
        this.setState({ currentDoctorId: id, isLoading: true });
        let res = await getDetailInforDoctorService(id);
        this.setState({
            detailDoctor: res && res.errCode === 0 ? res.data : {},
            isLoading: false,
        })
    }

    render() {
        let { language, intl } = this.props;
        let { detailDoctor, currentDoctorId, isLoading } = this.state;
        let name = detailDoctor && detailDoctor.firstName ? buildDoctorName(detailDoctor, language) : '';
        let markdown = detailDoctor.Markdown || {};
        let infor = detailDoctor.Doctor_Infor || {};
        return (
            <PageLayout hero={null}>
                <div className="bc-container doctor-detail-container">
                    <div className="bc-breadcrumb-light">
                        <Link to="/home"><FormattedMessage id="nav.home" /></Link>
                        <span>/</span>
                        <Link to="/doctors"><FormattedMessage id="nav.doctor" /></Link>
                        {name && <><span>/</span>{name}</>}
                    </div>

                    <section className="bc-card doctor-intro">
                        <div className="bc-avatar doctor-avatar" style={detailDoctor.image ? { backgroundImage: `url(${detailDoctor.image})` } : {}}>
                            {!detailDoctor.image && <i className="fas fa-user-md"></i>}
                        </div>
                        <div className="doctor-intro-content">
                            {isLoading ? (
                                <>
                                    <div className="bc-skeleton" style={{ height: 28, width: '60%' }}></div>
                                    <div className="bc-skeleton" style={{ height: 60, marginTop: 12 }}></div>
                                </>
                            ) : (
                                <>
                                    <h1>{name || intl.formatMessage({ id: 'list.empty' })}</h1>
                                    {infor.provinceTypeData && infor.provinceTypeData.valueVi && (
                                        <div className="doctor-location">
                                            <i className="fas fa-map-marker-alt"></i>
                                            {language === 'vi' ? infor.provinceTypeData.valueVi : infor.provinceTypeData.valueEn}
                                        </div>
                                    )}
                                    {markdown.description && <p className="doctor-description">{markdown.description}</p>}
                                </>
                            )}
                        </div>
                    </section>

                    <section className="bc-card doctor-booking">
                        <div className="booking-left">
                            <DoctorSchedule doctorIdFromParent={currentDoctorId} />
                        </div>
                        <div className="booking-right">
                            <DoctorExtraInfor doctorIdFromParent={currentDoctorId} />
                        </div>
                    </section>

                    {markdown.contentHTML && (
                        <section className="bc-card doctor-about">
                            <h2><FormattedMessage id="detail.about-doctor" /></h2>
                            <div className="bc-richtext" dangerouslySetInnerHTML={{ __html: markdown.contentHTML }}></div>
                        </section>
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

export default connect(mapStateToProps)(injectIntl(DetailDoctor));
