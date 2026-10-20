import React from 'react';
import ProfileDoctor from './ProfileDoctor';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfor from './DoctorExtraInfor';
import './DoctorBookingRow.scss';

// one doctor with profile on the left, schedule + clinic/price on the right
const DoctorBookingRow = ({ doctorId }) => (
    <div className="bc-card doctor-booking-row">
        <div className="dbr-left">
            <ProfileDoctor
                doctorId={doctorId}
                isShowDescriptionDoctor={true}
                isShowLinkDetail={true}
                isShowPrice={false}
            />
        </div>
        <div className="dbr-right">
            <DoctorSchedule doctorIdFromParent={doctorId} />
            <div className="dbr-extra">
                <DoctorExtraInfor doctorIdFromParent={doctorId} />
            </div>
        </div>
    </div>
);

export default DoctorBookingRow;
