import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import { searchAll } from '../../services/userService';
import { buildDoctorName } from '../../utils';
import './SearchBox.scss';

const EMPTY_RESULT = { doctors: [], specialties: [], clinics: [], handbooks: [] };

class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            result: EMPTY_RESULT,
            isOpen: false,
            isLoading: false,
        };
        this.wrapperRef = React.createRef();
        this.timer = null;
        this.requestId = 0;
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        clearTimeout(this.timer);
    }

    handleClickOutside = (event) => {
        if (this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
            this.setState({ isOpen: false });
        }
    }

    handleOnChange = (event) => {
        let keyword = event.target.value;
        this.setState({ keyword, isOpen: true });
        clearTimeout(this.timer);
        if (!keyword.trim()) {
            this.setState({ result: EMPTY_RESULT, isLoading: false });
            return;
        }
        this.setState({ isLoading: true });
        this.timer = setTimeout(() => this.doSearch(keyword), 300);
    }

    doSearch = async (keyword) => {
        let requestId = ++this.requestId;
        try {
            let res = await searchAll(keyword);
            if (requestId !== this.requestId) return;
            this.setState({
                result: res && res.errCode === 0 ? res.data : EMPTY_RESULT,
                isLoading: false,
            });
        } catch (e) {
            if (requestId === this.requestId) this.setState({ result: EMPTY_RESULT, isLoading: false });
        }
    }

    goTo = (link) => {
        this.setState({ isOpen: false, keyword: '' });
        this.props.history.push(link);
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter' && this.state.keyword.trim()) {
            this.goTo(`/doctors?keyword=${encodeURIComponent(this.state.keyword.trim())}`);
        }
        if (event.key === 'Escape') {
            this.setState({ isOpen: false });
        }
    }

    renderGroup = (titleId, icon, items, renderItem) => {
        if (!items || items.length === 0) return null;
        return (
            <div className="sb-group">
                <div className="sb-group-title"><FormattedMessage id={titleId} /></div>
                {items.map(item => (
                    <div key={item.id} className="sb-item" onClick={() => this.goTo(renderItem(item).link)}>
                        <span className="sb-item-icon"><i className={icon}></i></span>
                        <span className="sb-item-text">
                            <span className="sb-item-name">{renderItem(item).name}</span>
                            {renderItem(item).sub && <span className="sb-item-sub">{renderItem(item).sub}</span>}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    render() {
        let { keyword, result, isOpen, isLoading } = this.state;
        let { language, intl } = this.props;
        let hasResult = result.doctors.length + result.specialties.length + result.clinics.length + result.handbooks.length > 0;
        return (
            <div className="search-box" ref={this.wrapperRef}>
                <div className="sb-input-wrap">
                    <i className="fas fa-search sb-icon"></i>
                    <input
                        type="text"
                        value={keyword}
                        placeholder={intl.formatMessage({ id: 'hero.search-placeholder' })}
                        onChange={this.handleOnChange}
                        onFocus={() => this.setState({ isOpen: true })}
                        onKeyDown={this.handleKeyDown}
                        aria-label={intl.formatMessage({ id: 'hero.search-placeholder' })}
                    />
                    {isLoading && <span className="spinner-border spinner-border-sm sb-spinner" role="status"></span>}
                </div>
                {isOpen && keyword.trim() && (
                    <div className="sb-dropdown">
                        {isLoading && !hasResult && (
                            <div className="sb-empty"><FormattedMessage id="search.searching" /></div>
                        )}
                        {!isLoading && !hasResult && (
                            <div className="sb-empty"><FormattedMessage id="hero.search-empty" /></div>
                        )}
                        {this.renderGroup('search.doctors', 'fas fa-user-md', result.doctors, item => ({
                            name: buildDoctorName(item, language), link: `/detail-doctor/${item.id}`
                        }))}
                        {this.renderGroup('search.specialties', 'fas fa-stethoscope', result.specialties, item => ({
                            name: item.name, link: `/detail-specialty/${item.id}`
                        }))}
                        {this.renderGroup('search.clinics', 'far fa-hospital', result.clinics, item => ({
                            name: item.name, sub: item.address, link: `/detail-clinic/${item.id}`
                        }))}
                        {this.renderGroup('search.handbooks', 'far fa-newspaper', result.handbooks, item => ({
                            name: item.title, link: `/detail-handbook/${item.id}`
                        }))}
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default withRouter(connect(mapStateToProps)(injectIntl(SearchBox)));
