import React, { Component } from 'react';
import { connect } from "react-redux";
import {  Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import './RemedyModal.scss';
import _ from 'lodash';
import * as actions from '../../../store/actions'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils';

import Select from 'react-select';
import { toast } from 'react-toastify';
import moment from 'moment';


class RemedyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imgBase64: '',
        }
    }
    async componentDidMount() {
        if (this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email,
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot ) {
        if (this.props.language === prevProps.language) {
            
        }
        if (prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email,
            })
        }
    }
    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }
    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imgBase64: base64
            })
            
        }
    }
    handleSendRemedy = () => {
        this.props.sendRemedy(this.state)
    }
    render() {
       let {isOpenModal, closeRemedyModal, dataModal, sendRemedy} = this.props;
    
       
        return (
            <Modal
                isOpen={isOpenModal}
                size="lg"
                backdrop={true}
                centered={true}
                className={'booking-modal-container'}>
           
                <div class="modal-header">
                    
                    <h5 class="modal-title">Modal title</h5>

                    <button type="button" class="close btn-close-modal" aria-label="Close"
                        onClick={closeRemedyModal}
                    >
                            <span aria-hidden="true">x</span>
                        </button>
                  
                  </div>
            <ModalBody>
                <div className="row">
                    <div className="col-6 form-group" >
                        <label>Ten benh nhan</label>
                        <input className="form-control"
                            type="email"
                            value={this.state.email}
                            onChange={() => this.handleOnChangeEmail()}
                        />
                    </div>
                    <div className="col-6 form-group" >
                            <label>Chon hoa don</label>
                        <input className="form-control-file"
                            type='file'
                            onChange={(event) => this.handleOnChangeImage(event)}
                        />
                    </div>
                </div>
            
            </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => this.handleSendRemedy()}>
            Send
          </Button>{' '}
          <Button color="secondary" onClick={closeRemedyModal}>
            Cancel
          </Button>
        </ModalFooter>
          
              
           </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language, 
        genders: state.admin.genders,

    }
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
