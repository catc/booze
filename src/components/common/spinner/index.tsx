import './style.scss';
import React, { Component } from 'react';
import { Aperture } from 'components/icons';

function Spinner({ className }: Props) {
    return (
        <div className={`spinner ${className ? className : ''}`}>
            <Aperture/>
		</div>
    )
}

export interface Props {
    className?: string;
}

export default Spinner