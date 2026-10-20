import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import AdminLayout from '../containers/Header/AdminLayout';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import ManagePatient from '../containers/System/Doctor/ManagePatient';

class Doctor extends Component {
    render() {
        return (
            <AdminLayout>
                <div className="doctor-container">
                    <Switch>
                        <Route path="/doctor/manage-schedule" component={ManageSchedule} />
                        <Route path="/doctor/manage-patient" component={ManagePatient} />
                        <Route component={() => <Redirect to="/doctor/manage-schedule" />} />
                    </Switch>
                </div>
            </AdminLayout>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

export default connect(mapStateToProps)(Doctor);
