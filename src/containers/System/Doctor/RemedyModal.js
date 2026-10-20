import React, { Component } from 'react';
import { connect } from "react-redux";
import { Modal } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { CommonUtils } from '../../../utils';
import './RemedyModal.scss';

class RemedyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imgBase64: '',
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email || '',
                imgBase64: '',
            })
        }
    }

    handleOnChangeImage = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({ imgBase64: base64 })
        }
    }

    render() {
        let { isOpenModal, closeRemedyModal, dataModal, sendRemedy, isSending } = this.props;
        return (
            <Modal isOpen={isOpenModal} toggle={closeRemedyModal} size="md" centered={true} className="booking-modal-container remedy-modal">
                <div className="booking-modal-header">
                    <h5><FormattedMessage id="remedy.title" /></h5>
                    <button type="button" className="btn-close-modal" aria-label="Close" onClick={closeRemedyModal}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="booking-modal-body">
                    <div className="bc-field">
                        <label><FormattedMessage id="remedy.patient" /></label>
                        <input className="bc-input" value={dataModal.patientName || ''} disabled />
                    </div>
                    <div className="bc-field">
                        <label><FormattedMessage id="remedy.email" /></label>
                        <input className="bc-input" type="email" value={this.state.email}
                            onChange={(event) => this.setState({ email: event.target.value })} />
                    </div>
                    <div className="bc-field">
                        <label><FormattedMessage id="remedy.file" /></label>
                        <input className="form-control" type="file" accept="image/*" onChange={this.handleOnChangeImage} />
                        {this.state.imgBase64 && <img className="remedy-preview" src={this.state.imgBase64} alt="" />}
                    </div>
                    <p className="remedy-hint"><i className="fas fa-info-circle"></i> <FormattedMessage id="remedy.hint" /></p>
                </div>
                <div className="booking-modal-footer">
                    <button type="button" className="bc-btn bc-btn-ghost" onClick={closeRemedyModal}>
                        <FormattedMessage id="remedy.cancel" />
                    </button>
                    <button type="button" className="bc-btn" disabled={isSending} onClick={() => sendRemedy(this.state)}>
                        {isSending ? <span className="spinner-border spinner-border-sm"></span> : <i className="far fa-paper-plane"></i>}
                        <FormattedMessage id="remedy.send" />
                    </button>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    }
};

export default connect(mapStateToProps)(RemedyModal);
