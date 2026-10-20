import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import PageLayout from '../../../components/Common/PageLayout';
import { getAllHandbook } from '../../../services/userService';
import HandbookCard from '../Handbook/HandbookCard';
import ListToolbar from './ListToolbar';
import './List.scss';

class ListHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = { items: [], keyword: '', isLoading: true };
    }

    async componentDidMount() {
        let res = await getAllHandbook();
        this.setState({ items: res && res.errCode === 0 ? res.data : [], isLoading: false });
    }

    render() {
        let { items, keyword, isLoading } = this.state;
        let { intl } = this.props;
        let q = keyword.trim().toLowerCase();
        let filtered = items.filter(item => !q
            || (item.title || '').toLowerCase().includes(q)
            || (item.description || '').toLowerCase().includes(q));
        return (
            <PageLayout
                title={intl.formatMessage({ id: 'list.handbook-title' })}
                description={intl.formatMessage({ id: 'list.handbook-desc' })}
                breadcrumb={[{ label: intl.formatMessage({ id: 'nav.handbook' }) }]}
            >
                <div className="bc-container">
                    <ListToolbar keyword={keyword} total={filtered.length}
                        onChange={(value) => this.setState({ keyword: value })} />
                    {isLoading ? (
                        <div className="bc-grid bc-grid-3">{[1, 2, 3].map(i => <div key={i} className="bc-skeleton" style={{ height: 300 }}></div>)}</div>
                    ) : filtered.length === 0 ? (
                        <div className="bc-empty"><i className="far fa-folder-open"></i><FormattedMessage id="list.empty" /></div>
                    ) : (
                        <div className="bc-grid bc-grid-3">
                            {filtered.map(item => <HandbookCard key={item.id} item={item} />)}
                        </div>
                    )}
                </div>
            </PageLayout>
        );
    }
}

const mapStateToProps = state => ({ language: state.app.language });

export default connect(mapStateToProps)(injectIntl(ListHandbook));
