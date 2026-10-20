import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { toast } from 'react-toastify';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { CommonUtils } from '../../../utils';
import './ContentManager.scss';

const mdParser = new MarkdownIt();

/*
 * Generic create / edit / delete screen for markdown content with an image
 * (specialty, clinic, handbook). Each field: { key, labelId, type: 'text' | 'textarea' }.
 * `contentKeys` maps the markdown/html field names used by the API.
 */
class ContentManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            form: this.emptyForm(),
            editingId: null,
            isSaving: false,
            isLoading: true,
        };
        this.formRef = React.createRef();
        this.fileRef = React.createRef();
    }

    emptyForm = () => {
        let form = { imageBase64: '', previewImage: '', markdown: '', html: '' };
        this.props.fields.forEach(field => { form[field.key] = ''; });
        return form;
    }

    componentDidMount() {
        this.loadItems();
    }

    loadItems = async () => {
        let res = await this.props.api.getAll();
        this.setState({ items: res && res.errCode === 0 ? res.data || [] : [], isLoading: false });
    }

    handleChange = (key, value) => {
        this.setState({ form: { ...this.state.form, [key]: value } });
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({ form: { ...this.state.form, markdown: text, html: html } });
    }

    handleOnChangeImage = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({ form: { ...this.state.form, imageBase64: base64, previewImage: base64 } });
        }
    }

    resetForm = () => {
        this.setState({ form: this.emptyForm(), editingId: null });
        if (this.fileRef.current) this.fileRef.current.value = '';
    }

    handleEdit = async (item) => {
        let { api, contentKeys, fields } = this.props;
        let data = item;
        if (api.getDetail) {
            let res = await api.getDetail(item.id);
            if (res && res.errCode === 0) data = res.data;
        }
        let form = this.emptyForm();
        fields.forEach(field => { form[field.key] = data[field.key] || ''; });
        form.markdown = data[contentKeys.markdown] || '';
        form.html = data[contentKeys.html] || '';
        form.previewImage = data.image || '';
        this.setState({ form, editingId: item.id });
        if (this.formRef.current) this.formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    handleDelete = async (item) => {
        let { intl, api } = this.props;
        if (!window.confirm(intl.formatMessage({ id: 'manage.confirm-delete' }))) return;
        let res = await api.remove(item.id);
        if (res && res.errCode === 0) {
            toast.success(intl.formatMessage({ id: 'manage.deleted' }));
            if (this.state.editingId === item.id) this.resetForm();
            this.loadItems();
        } else {
            toast.error(intl.formatMessage({ id: 'manage.error' }));
        }
    }

    handleSave = async () => {
        let { intl, api, fields, contentKeys } = this.props;
        let { form, editingId } = this.state;
        let missing = fields.some(field => field.required && !String(form[field.key]).trim())
            || !form.markdown.trim()
            || (!editingId && !form.imageBase64);
        if (missing) {
            toast.warn(intl.formatMessage({ id: 'manage.required' }));
            return;
        }
        let payload = {
            imageBase64: form.imageBase64,
            [contentKeys.markdown]: form.markdown,
            [contentKeys.html]: form.html || mdParser.render(form.markdown),
        };
        fields.forEach(field => { payload[field.key] = String(form[field.key]).trim(); });
        this.setState({ isSaving: true });
        let res = editingId ? await api.update({ ...payload, id: editingId }) : await api.create(payload);
        this.setState({ isSaving: false });
        if (res && res.errCode === 0) {
            toast.success(intl.formatMessage({ id: 'manage.saved' }));
            this.resetForm();
            this.loadItems();
        } else {
            toast.error(res && res.errMessage ? res.errMessage : intl.formatMessage({ id: 'manage.error' }));
        }
    }

    render() {
        let { titleId, fields, listColumns, viewLink } = this.props;
        let { items, form, editingId, isSaving, isLoading } = this.state;
        return (
            <div className="admin-page content-manager">
                <div className="admin-page-head">
                    <h1><FormattedMessage id={titleId} /></h1>
                </div>

                <div className="admin-card" ref={this.formRef}>
                    <h2>
                        {editingId
                            ? <><FormattedMessage id="manage.editing" />: <span className="editing-name">{form[fields[0].key]}</span></>
                            : <FormattedMessage id="manage.add-new" />}
                    </h2>
                    <div className="cm-form">
                        <div className="cm-fields">
                            {fields.map(field => (
                                <div key={field.key} className="bc-field">
                                    <label>
                                        <FormattedMessage id={field.labelId} />
                                        {field.required && <span className="required">*</span>}
                                    </label>
                                    {field.type === 'textarea' ? (
                                        <textarea className="bc-input cm-textarea" rows={3}
                                            value={form[field.key]}
                                            onChange={(event) => this.handleChange(field.key, event.target.value)} />
                                    ) : (
                                        <input className="bc-input" type="text"
                                            value={form[field.key]}
                                            onChange={(event) => this.handleChange(field.key, event.target.value)} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="cm-image">
                            <label className="cm-image-label"><FormattedMessage id="manage.image" />{!editingId && <span className="required">*</span>}</label>
                            <label className="cm-image-drop" style={form.previewImage ? { backgroundImage: `url(${form.previewImage})` } : {}}>
                                {!form.previewImage && (
                                    <span><i className="far fa-image"></i><FormattedMessage id="manage.choose-image" /></span>
                                )}
                                <input ref={this.fileRef} type="file" accept="image/*" hidden onChange={this.handleOnChangeImage} />
                            </label>
                        </div>
                    </div>
                    <div className="bc-field">
                        <label><FormattedMessage id="manage.content" /><span className="required">*</span></label>
                        <MdEditor style={{ height: '320px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={form.markdown} />
                    </div>
                    <div className="cm-actions">
                        {editingId && (
                            <button type="button" className="bc-btn bc-btn-ghost" onClick={this.resetForm}>
                                <FormattedMessage id="manage.cancel" />
                            </button>
                        )}
                        <button type="button" className="bc-btn" disabled={isSaving} onClick={this.handleSave}>
                            {isSaving ? <span className="spinner-border spinner-border-sm"></span> : <i className="fas fa-save"></i>}
                            <FormattedMessage id={editingId ? 'manage.update' : 'manage.save'} />
                        </button>
                    </div>
                </div>

                <div className="admin-card">
                    <h2><FormattedMessage id="manage.list" /> ({items.length})</h2>
                    <div className="table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th style={{ width: 90 }}><FormattedMessage id="manage.image" /></th>
                                    {listColumns.map(column => <th key={column.key}><FormattedMessage id={column.labelId} /></th>)}
                                    <th style={{ textAlign: 'right' }}><FormattedMessage id="manage.actions" /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && (
                                    <tr><td colSpan={listColumns.length + 2}><div className="bc-skeleton" style={{ height: 40 }}></div></td></tr>
                                )}
                                {!isLoading && items.length === 0 && (
                                    <tr><td colSpan={listColumns.length + 2} className="bc-empty"><FormattedMessage id="manage.empty" /></td></tr>
                                )}
                                {items.map(item => (
                                    <tr key={item.id} className={item.id === editingId ? 'is-editing' : ''}>
                                        <td><div className="thumb" style={{ backgroundImage: `url(${item.image})` }}></div></td>
                                        {listColumns.map(column => <td key={column.key}>{item[column.key]}</td>)}
                                        <td>
                                            <div className="row-actions">
                                                {viewLink && (
                                                    <a className="bc-btn bc-btn-ghost bc-btn-sm" href={viewLink(item)} target="_blank" rel="noopener noreferrer"
                                                        title="View"><i className="far fa-eye"></i></a>
                                                )}
                                                <button type="button" className="bc-btn bc-btn-soft bc-btn-sm" onClick={() => this.handleEdit(item)}>
                                                    <i className="fas fa-pen"></i> <FormattedMessage id="manage.edit" />
                                                </button>
                                                <button type="button" className="bc-btn bc-btn-danger bc-btn-sm" onClick={() => this.handleDelete(item)}>
                                                    <i className="far fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default injectIntl(ContentManager);
