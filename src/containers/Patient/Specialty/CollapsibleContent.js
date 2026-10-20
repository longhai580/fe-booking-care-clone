import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// long HTML description, collapsed to a fixed height with a "read more" toggle
class CollapsibleContent extends Component {
    constructor(props) {
        super(props);
        this.state = { isExpanded: false, isOverflow: false };
        this.contentRef = React.createRef();
    }

    componentDidMount() {
        this.checkOverflow();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.html !== this.props.html) {
            this.setState({ isExpanded: false }, this.checkOverflow);
        }
    }

    checkOverflow = () => {
        let node = this.contentRef.current;
        if (node) {
            this.setState({ isOverflow: node.scrollHeight > (this.props.maxHeight || 220) + 40 });
        }
    }

    render() {
        let { html, maxHeight = 220 } = this.props;
        let { isExpanded, isOverflow } = this.state;
        let collapsed = isOverflow && !isExpanded;
        return (
            <div className={collapsed ? 'bc-collapsible collapsed' : 'bc-collapsible'}>
                <div ref={this.contentRef} className="bc-richtext"
                    style={collapsed ? { maxHeight, overflow: 'hidden' } : {}}
                    dangerouslySetInnerHTML={{ __html: html }}></div>
                {isOverflow && (
                    <button type="button" className="bc-btn bc-btn-soft bc-btn-sm collapsible-toggle"
                        onClick={() => this.setState({ isExpanded: !isExpanded })}>
                        <FormattedMessage id={isExpanded ? 'detail.collapse' : 'detail.read-more'} />
                        <i className={isExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'}></i>
                    </button>
                )}
            </div>
        );
    }
}

export default CollapsibleContent;
