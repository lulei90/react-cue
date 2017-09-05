import CueBox from './CueBox'
import React from 'react'
import './index.less'
const CueBoxCtrl =CueBox.renderBox();
const Cue = CueBoxCtrl.create({
    msg(content,time=3000,icon){
        return this.add({
            content,
            time,
            icon
        })
    },
    loading(content,hasMask=true,keep=true){
        return this.add({
            content,
            icon:(<div className="cue-loader"></div>),
            hasMask,
            keep,
            close(){
                console.log('loading 消失了')
            }
        })
    }
});
export default Cue;