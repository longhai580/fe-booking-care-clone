import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

const ListToolbar = ({ keyword, total, onChange, intl, children }) => (
    <div className="list-toolbar">
        <div className="list-search">
            <i className="fas fa-search"></i>
            <input
                className="bc-input"
                value={keyword}
                placeholder={intl.formatMessage({ id: 'list.search-placeholder' })}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
        {children}
        <div className="list-total">{total} <FormattedMessage id="list.result" /></div>
    </div>
);

export default injectIntl(ListToolbar);
