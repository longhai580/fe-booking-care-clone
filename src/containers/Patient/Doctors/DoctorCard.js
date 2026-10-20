import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './DoctorCard.scss';

const DoctorCard = ({ id, name, image, specialty }) => (
    <Link to={`/detail-doctor/${id}`} className="doctor-card">
        <div className="bc-avatar" style={image ? { backgroundImage: `url(${image})` } : {}}>
            {!image && <i className="fas fa-user-md"></i>}
        </div>
        <div className="doctor-card-name">{name}</div>
        {specialty && <div className="doctor-card-specialty"><i className="fas fa-stethoscope"></i> {specialty}</div>}
        <span className="doctor-card-cta"><FormattedMessage id="list.book-now" /> <i className="fas fa-arrow-right"></i></span>
    </Link>
);

export default DoctorCard;
