import React from 'react';
import ContentManager from '../Common/ContentManager';
import { createNewHandbook, getAllHandbook, getDetailHandbookById, editHandbook, deleteHandbook } from '../../../services/userService';

const api = {
    getAll: () => getAllHandbook(),
    getDetail: getDetailHandbookById,
    create: createNewHandbook,
    update: editHandbook,
    remove: deleteHandbook,
};

const ManageHandbook = () => (
    <ContentManager
        titleId="manage.handbook-title"
        api={api}
        fields={[
            { key: 'title', labelId: 'manage.title', required: true },
            { key: 'description', labelId: 'manage.description', type: 'textarea' },
        ]}
        contentKeys={{ markdown: 'contentMarkdown', html: 'contentHTML' }}
        listColumns={[{ key: 'title', labelId: 'manage.title' }]}
        viewLink={item => `/detail-handbook/${item.id}`}
    />
);

export default ManageHandbook;
