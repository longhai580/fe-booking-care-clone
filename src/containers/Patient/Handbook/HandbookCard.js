import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const HandbookCard = ({ item }) => (
    <Link to={`/detail-handbook/${item.id}`} className="bc-tile">
        <div className="bc-tile-img" style={{ backgroundImage: `url(${item.image})` }}></div>
        <div className="bc-tile-body">
            <h3 className="bc-tile-title">{item.title}</h3>
            {item.description && <div className="bc-tile-sub">{item.description}</div>}
            <div className="bc-tile-sub" style={{ marginTop: 'auto', paddingTop: 6 }}>
                <i className="far fa-clock"></i> {moment(item.createdAt).format('DD/MM/YYYY')}
            </div>
        </div>
    </Link>
);

export default HandbookCard;
