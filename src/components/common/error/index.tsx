import './style.scss';
import React, { Component } from 'react';

import { Alertoctagon } from 'components/icons/index'

function ErrorMsg({ className, children }: Props) {
    return (
        <div className={`error-msg ${className}`}>
            <div className="error-msg__error-icon">
                <Alertoctagon />
            </div>
            <span className="error-msg__msg">{children}</span>
		</div>
    )
}

export interface Props {
    className?: string;
    children: any;
}

export default ErrorMsg