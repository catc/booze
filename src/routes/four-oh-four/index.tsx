// import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import P from 'prop-types';

// stateless
function FourOhFour({ someProp }: Props) {
    return (
        <div>
            <h1>Page not found</h1>
		</div>
    )
}

export default FourOhFour