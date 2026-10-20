import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const SectionHeader = ({ titleId, subId, link }) => (
    <div className="bc-section-head">
        <div>
            <h2 className="bc-section-title"><FormattedMessage id={titleId} /></h2>
            {subId && <p className="bc-section-sub"><FormattedMessage id={subId} /></p>}
        </div>
        {link && (
            <Link to={link} className="bc-btn bc-btn-soft bc-btn-sm">
                <FormattedMessage id="homepage.more-info" /> <i className="fas fa-arrow-right"></i>
            </Link>
        )}
    </div>
);

export default SectionHeader;
