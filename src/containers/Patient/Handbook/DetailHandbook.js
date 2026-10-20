import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import PageLayout from '../../../components/Common/PageLayout';
import { getDetailHandbookById, getAllHandbook } from '../../../services/userService';
import './DetailHandbook.scss';

class DetailHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = { handbook: null, others: [], isLoading: true };
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
        let id = this.props.match.params.id;
        this.setState({ isLoading: true });
        let [res, resAll] = await Promise.all([getDetailHandbookById(id), getAllHandbook(6)]);
        this.setState({
            handbook: res && res.errCode === 0 && res.data && res.data.id ? res.data : null,
            others: resAll && resAll.errCode === 0 ? resAll.data.filter(item => +item.id !== +id).slice(0, 4) : [],
            isLoading: false,
        });
    }

    render() {
        let { handbook, others, isLoading } = this.state;
        let { intl } = this.props;
        return (
            <PageLayout
                title={handbook ? handbook.title : (isLoading ? '...' : intl.formatMessage({ id: 'list.empty' }))}
                breadcrumb={[{ label: intl.formatMessage({ id: 'nav.handbook' }), link: '/handbooks' }]}
            >
                <div className="bc-container handbook-detail">
                    <article className="bc-card handbook-article">
                        {isLoading && <div className="bc-skeleton" style={{ height: 320 }}></div>}
                        {!isLoading && handbook && (
                            <>
                                <div className="handbook-meta"><i className="far fa-clock"></i> {moment(handbook.createdAt).format('DD/MM/YYYY')}</div>
                                {handbook.description && <p className="handbook-lead">{handbook.description}</p>}
                                {handbook.image && <img className="handbook-cover" src={handbook.image} alt={handbook.title} />}
                                <div className="bc-richtext" dangerouslySetInnerHTML={{ __html: handbook.contentHTML }}></div>
                            </>
                        )}
                        {!isLoading && !handbook && (
                            <div className="bc-empty"><i className="far fa-newspaper"></i><FormattedMessage id="list.empty" /></div>
                        )}
                    </article>
                    <aside className="handbook-aside">
                        <h3><FormattedMessage id="detail.related-handbook" /></h3>
                        {others.map(item => (
                            <Link key={item.id} to={`/detail-handbook/${item.id}`} className="aside-item">
                                <span className="aside-thumb" style={{ backgroundImage: `url(${item.image})` }}></span>
                                <span className="aside-title">{item.title}</span>
                            </Link>
                        ))}
                    </aside>
                </div>
            </PageLayout>
        );
    }
}

const mapStateToProps = state => ({ language: state.app.language });

export default connect(mapStateToProps)(injectIntl(DetailHandbook));
