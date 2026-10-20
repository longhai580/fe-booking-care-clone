import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import vtv1 from '../../../assets/about/vtv1.png'
import cntt from '../../../assets/about/cntt.png'
import ictnews from '../../../assets/about/ictnews.png'
import vnexpress from '../../../assets/about/vnexpress.png'
import infonet from '../../../assets/about/infonet.png'
import dantri from '../../../assets/about/dantri.png'
import vtcnews from '../../../assets/about/vtcnews.png'
import './About.scss';

const REASONS = [
    { icon: 'fas fa-user-check', id: 1 },
    { icon: 'far fa-clock', id: 2 },
    { icon: 'far fa-envelope', id: 3 },
    { icon: 'fas fa-hand-holding-heart', id: 4 },
];

const PRESS = [vtv1, vnexpress, dantri, ictnews, infonet, vtcnews, cntt];

class About extends Component {

    render() {
        return (
            <section className="bc-section section-about">
                <div className="bc-container">
                    <div className="about-why">
                        <h2 className="bc-section-title text-center"><FormattedMessage id="home.why-title" /></h2>
                        <div className="why-grid">
                            {REASONS.map(item => (
                                <div className="why-item" key={item.id}>
                                    <span className="why-icon"><i className={item.icon}></i></span>
                                    <h3><FormattedMessage id={`home.why-${item.id}-title`} /></h3>
                                    <p><FormattedMessage id={`home.why-${item.id}-desc`} /></p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="about-steps">
                        <h2 className="bc-section-title"><FormattedMessage id="home.steps-title" /></h2>
                        <ol className="steps">
                            {[1, 2, 3].map(step => (
                                <li key={step}>
                                    <span className="step-number">{step}</span>
                                    <span><FormattedMessage id={`home.step-${step}`} /></span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="about-press">
                        <div className="press-title"><FormattedMessage id="home.press" /></div>
                        <div className="press-logos">
                            {PRESS.map((logo, index) => <img key={index} src={logo} alt="" />)}
                        </div>
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

export default connect(mapStateToProps)(About);
