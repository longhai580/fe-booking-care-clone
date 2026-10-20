import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../containers/HomePage/HomeHeader';
import HomeFooter from '../../containers/HomePage/HomeFooter';

// shared shell for public pages: header, optional hero with breadcrumb, body, footer
const PageLayout = ({ title, description, breadcrumb, hero, children }) => (
    <div className="bc-page">
        <HomeHeader isShowBanner={false} />
        {hero !== undefined ? hero : (title && (
            <div className="bc-page-hero">
                <div className="bc-container">
                    <div className="bc-breadcrumb">
                        <Link to="/home"><FormattedMessage id="nav.home" /></Link>
                        {breadcrumb && breadcrumb.map((item, index) => (
                            <React.Fragment key={index}>
                                <span>/</span>
                                {item.link ? <Link to={item.link}>{item.label}</Link> : item.label}
                            </React.Fragment>
                        ))}
                    </div>
                    <h1>{title}</h1>
                    {description && <p>{description}</p>}
                </div>
            </div>
        ))}
        <main className="bc-page-body">
            {children}
        </main>
        <HomeFooter />
    </div>
);

export default PageLayout;
