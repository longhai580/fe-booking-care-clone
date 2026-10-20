import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import PageLayout from '../../../components/Common/PageLayout';
import { getAllClinic } from '../../../services/userService';
import ListToolbar from './ListToolbar';
import './List.scss';

class ListClinic extends Component {
    constructor(props) {
        super(props);
        this.state = { items: [], keyword: '', isLoading: true };
    }

    async componentDidMount() {
        let res = await getAllClinic();
        this.setState({ items: res && res.errCode === 0 ? res.data : [], isLoading: false });
    }

    render() {
        let { items, keyword, isLoading } = this.state;
        let { intl } = this.props;
        let q = keyword.trim().toLowerCase();
        let filtered = items.filter(item => !q
            || (item.name || '').toLowerCase().includes(q)
            || (item.address || '').toLowerCase().includes(q));
        return (
            <PageLayout
                title={intl.formatMessage({ id: 'list.clinic-title' })}
                description={intl.formatMessage({ id: 'list.clinic-desc' })}
                breadcrumb={[{ label: intl.formatMessage({ id: 'nav.clinic' }) }]}
            >
                <div className="bc-container">
                    <ListToolbar keyword={keyword} total={filtered.length}
                        onChange={(value) => this.setState({ keyword: value })} />
                    {isLoading ? (
                        <div className="bc-grid bc-grid-3">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bc-skeleton" style={{ height: 260 }}></div>)}</div>
                    ) : filtered.length === 0 ? (
                        <div className="bc-empty"><i className="far fa-folder-open"></i><FormattedMessage id="list.empty" /></div>
                    ) : (
                        <div className="bc-grid bc-grid-3">
                            {filtered.map(item => (
                                <Link key={item.id} to={`/detail-clinic/${item.id}`} className="bc-tile">
                                    <div className="bc-tile-img contain" style={{ backgroundImage: `url(${item.image})` }}></div>
                                    <div className="bc-tile-body">
                                        <h3 className="bc-tile-title">{item.name}</h3>
                                        <div className="bc-tile-sub"><i className="fas fa-map-marker-alt" style={{ color: 'var(--bc-primary)' }}></i> {item.address}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </PageLayout>
        );
    }
}

const mapStateToProps = state => ({ language: state.app.language });

export default connect(mapStateToProps)(injectIntl(ListClinic));
