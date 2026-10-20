import { Buffer } from 'buffer';
import { LANGUAGES } from './constant';

// image from API can be a data URL string or a serialized Buffer ({ type: 'Buffer', data: [...] })
export const toImageSrc = (image) => {
    if (!image) return '';
    if (typeof image === 'string') return image;
    if (image.data) return Buffer.from(image.data).toString('binary');
    return Buffer.from(image, 'base64').toString('binary');
};

export const buildDoctorName = (doctor, language) => {
    if (!doctor) return '';
    let firstName = (doctor.firstName || '').trim();
    let lastName = (doctor.lastName || '').trim();
    let position = doctor.positionData && doctor.positionData.valueVi ? doctor.positionData : null;
    if (language === LANGUAGES.EN) {
        let name = `${firstName} ${lastName}`.trim();
        return position && position.valueEn ? `${position.valueEn}, ${name}` : name;
    }
    let name = `${lastName} ${firstName}`.trim();
    return position ? `${position.valueVi}, ${name}` : name;
};

export const pickLang = (item, language) => {
    if (!item) return '';
    return language === LANGUAGES.EN ? item.valueEn : item.valueVi;
};

export const formatPrice = (item, language) => {
    if (!item || !item.valueVi) return '';
    if (language === LANGUAGES.EN) return `$${item.valueEn}`;
    return `${Number(item.valueVi).toLocaleString('vi-VN')}đ`;
};

// start hour of each time slot code, used to hide slots that have already passed today
export const TIME_SLOT_START_HOUR = { T1: 8, T2: 9, T3: 10, T4: 11, T5: 13, T6: 14, T7: 15, T8: 16 };
