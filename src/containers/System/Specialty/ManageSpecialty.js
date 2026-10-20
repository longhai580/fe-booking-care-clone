import React from 'react';
import ContentManager from '../Common/ContentManager';
import { createNewSpecialty, getAllSpecialty, editSpecialty, deleteSpecialty } from '../../../services/userService';

const api = {
    getAll: getAllSpecialty,
    create: createNewSpecialty,
    update: editSpecialty,
    remove: deleteSpecialty,
};

const ManageSpecialty = () => (
    <ContentManager
        titleId="manage.specialty-title"
        api={api}
        fields={[{ key: 'name', labelId: 'manage.name', required: true }]}
        contentKeys={{ markdown: 'descriptionMarkdown', html: 'descriptionHTML' }}
        listColumns={[{ key: 'name', labelId: 'manage.name' }]}
        viewLink={item => `/detail-specialty/${item.id}`}
    />
);

export default ManageSpecialty;
