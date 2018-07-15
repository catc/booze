import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';

// stateless
function FourOhFour({ someProp }: Props) {
    return (
        <div className="not-found container">
            <h1>404</h1>
            <h2>Page not found</h2>
		</div>
    )
}

export default FourOhFour