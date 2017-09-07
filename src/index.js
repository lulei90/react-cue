import CueBox from './CueBox'
import React from 'react'
import Model from './Model'
import './index.less'
const CueBoxCtrl =CueBox.renderBox();
const Cue = CueBoxCtrl.create({
    msg(content,time,icon){
        return this.add({
            content,
            time,
            icon
        })
    },
    alert(content,click,title){
        return this.add({
            component:Model,
            content,
            title,
            hasMask:true,
            actions:[{
                text: '确认',
                color:'#108ee9',
                //按钮的点击事件，默认带参数close方法用于关闭弹框
                click: click
            }]
        })
    },
    confirm({content,actions,title,enterName,leaveName}){
        return this.add({
            component:Model,
            content,
            title,
            enterName,
            leaveName,
            hasMask:true,
            actions
        })
    },
    loading(content,hasMask=true,keep=true){
        return this.add({
            content,
            icon:(<div className="cue-loader"></div>),
            hasMask,
            keep
        })
    }
});
export default Cue;