import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getAllHandbook } from '../../../services/userService';
import SectionHeader from './SectionHeader';
import HandbookCard from '../../Patient/Handbook/HandbookCard';

class HandBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            handbooks: [],
        }
    }

    async componentDidMount() {
        let res = await getAllHandbook(3);
        if (res && res.errCode === 0) {
            this.setState({ handbooks: res.data || [] });
        }
    }

    render() {
        let { handbooks } = this.state;
        if (handbooks.length === 0) return null;
        return (
            <section className="bc-section bc-section-soft section-handbook">
                <div className="bc-container">
                    <SectionHeader titleId="home.handbook-title" subId="home.handbook-sub" link="/handbooks" />
                    <div className="bc-grid bc-grid-3">
                        {handbooks.map(item => <HandbookCard key={item.id} item={item} />)}
                    </div>
                </div>
            </section>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default withRouter(connect(mapStateToProps)(HandBook));
