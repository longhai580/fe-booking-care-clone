import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer } from 'react-toastify';
import { userIsAuthenticated, userIsNotAuthenticated } from '../hoc/authentication';
import { path } from '../utils';
import Home from '../routes/Home';
import Login from './Auth/Login';
import System from '../routes/System';
import HomePage from './HomePage/HomePage';
import DetailDoctor from './Patient/Doctors/DetailDoctor';
import Doctor from '../routes/Doctor';
import VerifyEmail from './Patient/VerifyEmail';
import DetailSpecialty from './Patient/Specialty/DetailSpecialty';
import DetailClinic from './Patient/Clinic/DetailClinic';
import DetailHandbook from './Patient/Handbook/DetailHandbook';
import ListSpecialty from './Patient/List/ListSpecialty';
import ListClinic from './Patient/List/ListClinic';
import ListDoctor from './Patient/List/ListDoctor';
import ListHandbook from './Patient/List/ListHandbook';
import MyBookings from './Patient/MyBookings/MyBookings';

class App extends Component {

    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
        // scroll to top when navigating to another page
        this.unlisten = history.listen((location, action) => {
            if (action !== 'POP') {
                window.scrollTo(0, 0);
            }
        });
    }

    componentWillUnmount() {
        if (this.unlisten) this.unlisten();
    }

    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <div className="content-container">
                            <Switch>
                                <Route path={path.HOME} exact component={(Home)} />
                                <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                <Route path={path.SYSTEM} component={userIsAuthenticated(System)} />
                                <Route path={'/doctor'} component={userIsAuthenticated(Doctor)} />

                                <Route path={path.HOMEPAGE} component={HomePage} />
                                <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                                <Route path={path.DETAIL_SPECIALTY} component={DetailSpecialty} />
                                <Route path={path.DETAIL_CLINIC} component={DetailClinic} />
                                <Route path={path.DETAIL_HANDBOOK} component={DetailHandbook} />
                                <Route path={path.LIST_SPECIALTY} component={ListSpecialty} />
                                <Route path={path.LIST_CLINIC} component={ListClinic} />
                                <Route path={path.LIST_DOCTOR} component={ListDoctor} />
                                <Route path={path.LIST_HANDBOOK} component={ListHandbook} />
                                <Route path={path.MY_BOOKINGS} component={MyBookings} />

                                <Route path={path.VERIFY_EMAIL_BOOKING} component={VerifyEmail} />
                                <Route render={() => <Redirect to={path.HOMEPAGE} />} />
                            </Switch>
                        </div>

                        <ToastContainer
                            position="top-right"
                            autoClose={4000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                    </div>
                </Router>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
