import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import AdminLayout from '../containers/Header/AdminLayout';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import ManageClinic from '../containers/System/Clinic/ManageClinic';
import ManageHandbook from '../containers/System/Handbook/ManageHandbook';
import Dashboard from '../containers/System/Dashboard/Dashboard';
import { USER_ROLE } from '../utils';

class System extends Component {
    render() {
        const { userInfo } = this.props;
        if (userInfo && userInfo.roleId !== USER_ROLE.ADMIN) {
            return <Redirect to="/doctor/manage-schedule" />;
        }
        return (
            <AdminLayout>
                <div className="system-container">
                    <Switch>
                        <Route path="/system/dashboard" component={Dashboard} />
                        <Route path="/system/user-manage" component={UserManage} />
                        <Route path="/system/user-redux" component={UserRedux} />
                        <Route path="/system/manage-doctor" component={ManageDoctor} />
                        <Route path="/system/manage-specialty" component={ManageSpecialty} />
                        <Route path="/system/manage-clinic" component={ManageClinic} />
                        <Route path="/system/manage-handbook" component={ManageHandbook} />
                        <Route component={() => { return (<Redirect to="/system/dashboard" />) }} />
                    </Switch>
                </div>
            </AdminLayout>
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
    };
};

export default connect(mapStateToProps)(System);
