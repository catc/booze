import './style.scss';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { Image } from 'components/icons/index'

@observer
export default class ImageFade extends Component<Props, {}> {
    constructor(props: Props) {
        super(props)
    }

    img: HTMLElement | null = null;
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
        if (!this.props.src){
            return <div className={`state_svg ${this.props.className}`}>
                <Image/>
            </div>
        }
        return (
            <div className={`state_img ${this.props.className}`}>
                <img
                    className={`image-fade ${this.hasLoaded ? 'state_loaded' : ''} ${this.props.classes || ''}`}
                    ref={el => this.img = el }
                    src={this.props.src} alt="booze"
                />
            </div>
        )
    }
}

ImageFade.propTypes = {
    // ...
}

export interface Props {
    src: string;
    className?: string;
}
