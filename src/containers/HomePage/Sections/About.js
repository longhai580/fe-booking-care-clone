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

class About extends Component {

    

    render() {
        
        return (
            <div className='section-share section-about'>
                <div className="section-about-header">
                    Truyền thông nói về Booking Care
                </div>
                <div className="section-about-content">
                    <div className="content-left section-about-link">
                        <iframe width="100%" height="387"
                        className="link-ytb"
                            src="https://www.youtube.com/embed/zoEtcR5EW08?list=RDSLpU2LGv54g" title="SƠN TÙNG M-TP | CHÚNG TA CỦA TƯƠNG LAI | OFFICIAL MUSIC VIDEO" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>                    </div>
                    <div className="content-right">
                        <div className="section-about-news">
                            <div className="news-left">
                                <span className="news-item">
                                <img src={vtv1} style={{ width: '135px', height: '40px' }}/>

                                </span>
                            </div>
                            <div className="news-right">
    
                            <span className="news-item"></span>
                            <img src={cntt} style={{ width: '135px', height: '40px' }}/>

                            </div>
                        </div>
                        <div className="section-about-news">
                            <div className="news-left">
                                <span className="news-item">
                                <img src={ictnews} style={{ width: '135px', height: '40px' }}/>

                                </span>
                            </div>
                            <div className="news-right">
    
                            <span className="news-item"></span>
                            <img src={vnexpress} style={{ width: '135px', height: '40px' }}/>

                            </div>
                        </div>
                        <div className="section-about-news">
                            <div className="news-left">
                                <span className="news-item">
                                <img src={infonet} style={{ width: '135px', height: '40px' }}/>

                                </span>
                            </div>
                            <div className="news-right">
    
                            <span className="news-item"></span>
                            <img src={dantri} style={{ width: '135px', height: '40px' }}/>

                            </div>
                        </div>
                        <div className="section-about-news">
                            <div className="news-left">
                                <span className="news-item">
                                <img src={vtv1} style={{ width: '135px', height: '40px' }}/>

                                </span>
                            </div>
                            <div className="news-right">
    
                            <span className="news-item"></span>
                            <img src={vtcnews} style={{ width: '135px', height: '40px' }}/>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,

    };
};

const mapDispatchToProps = dispatch => {
    return {
       
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
