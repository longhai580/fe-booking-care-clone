import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";
import { USER_ROLE } from '../utils/constant';

const locationHelper = locationHelperBuilder({});

export const getHomePathByRole = (userInfo) => {
    if (userInfo && userInfo.roleId === USER_ROLE.DOCTOR) return '/doctor/manage-schedule';
    if (userInfo && userInfo.roleId === USER_ROLE.ADMIN) return '/system/dashboard';
    return '/home';
};

export const userIsAuthenticated = connectedRouterRedirect({
    authenticatedSelector: state => state.user.isLoggedIn,
    wrapperDisplayName: 'UserIsAuthenticated',
    redirectPath: '/login'
});

export const userIsNotAuthenticated = connectedRouterRedirect({
    // Want to redirect the user when they are authenticated
    authenticatedSelector: state => !state.user.isLoggedIn,
    wrapperDisplayName: 'UserIsNotAuthenticated',
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || getHomePathByRole(state.user.userInfo),
    allowRedirectBack: false
});
