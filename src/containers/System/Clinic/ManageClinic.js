import React from 'react';
import ContentManager from '../Common/ContentManager';
import { createNewClinic, getAllClinic, editClinic, deleteClinic } from '../../../services/userService';

const api = {
    getAll: getAllClinic,
    create: createNewClinic,
    update: editClinic,
    remove: deleteClinic,
};

const ManageClinic = () => (
    <ContentManager
        titleId="manage.clinic-title"
        api={api}
        fields={[
            { key: 'name', labelId: 'manage.name', required: true },
            { key: 'address', labelId: 'manage.address', required: true },
        ]}
        contentKeys={{ markdown: 'descriptionMarkdown', html: 'descriptionHTML' }}
        listColumns={[{ key: 'name', labelId: 'manage.name' }, { key: 'address', labelId: 'manage.address' }]}
        viewLink={item => `/detail-clinic/${item.id}`}
    />
);

export default ManageClinic;
