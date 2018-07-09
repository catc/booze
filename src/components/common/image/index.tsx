import './style.scss';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
export default class ImageFade extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)
    }

    img: HTMLElement;
    componentDidMount(){
        if (this.img){
            if (this.img.complete){
                this.didLoad()
            } else {
                this.img.addEventListener('load', this.didLoad, false)
            }
        }
    }

    @observable hasLoaded = false;
    didLoad = () => {
        this.hasLoaded = true
    }

    componentWillUnmount(){
        if (this.img) {
            this.img.removeEventListener('load', this.didLoad, false)
        }
    }
	
    @observable showImage = false;

    render() {
        return (
            <img
                className={`image-fade ${this.hasLoaded ? 'state_loaded' : ''} ${this.props.classes || ''}`}
                ref={el => this.img = el }
                src={this.props.src} alt="booze"
            />
        )
    }
}

ImageFade.propTypes = {
    // ...
}

export interface Props {
    src: string;
}
