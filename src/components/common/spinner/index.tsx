import './style.scss';
import React, { Component } from 'react';
import { Aperture } from 'components/icons';

function Spinner({ classes }: Props) {
    return (
        <div className={`spinner ${classes ? classes : ''}`}>
            <Aperture/>
		</div>
    )
}

export interface Props {
    classes?: string;
}

export default Spinner