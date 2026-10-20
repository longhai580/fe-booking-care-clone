export const adminMenu = [
    {
        name: 'menu.admin.overview',
        menus: [
            { name: 'menu.admin.dashboard', link: '/system/dashboard', icon: 'fas fa-chart-pie' },
        ]
    },
    {
        name: 'menu.admin.manage-user',
        menus: [
            { name: 'menu.admin.crud', link: '/system/user-manage', icon: 'fas fa-users' },
            { name: 'menu.admin.crud-redux', link: '/system/user-redux', icon: 'fas fa-user-plus' },
        ]
    },
    {
        name: 'menu.admin.doctor-group',
        menus: [
            { name: 'menu.admin.manage-doctor', link: '/system/manage-doctor', icon: 'fas fa-user-md' },
            { name: 'menu.doctor.schedule', link: '/doctor/manage-schedule', icon: 'far fa-calendar-alt' },
        ]
    },
    {
        name: 'menu.admin.content',
        menus: [
            { name: 'menu.admin.manage-specialty', link: '/system/manage-specialty', icon: 'fas fa-stethoscope' },
            { name: 'menu.admin.manage-clinic', link: '/system/manage-clinic', icon: 'far fa-hospital' },
            { name: 'menu.admin.manage-handbook', link: '/system/manage-handbook', icon: 'far fa-newspaper' },
        ]
    },
];

export const doctorMenu = [
    {
        name: 'menu.doctor.header',
        menus: [
            { name: 'menu.doctor.schedule', link: '/doctor/manage-schedule', icon: 'far fa-calendar-alt' },
            { name: 'menu.doctor.manage-patient', link: '/doctor/manage-patient', icon: 'fas fa-user-injured' },
        ]
    }
];
