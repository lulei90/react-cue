import React , { Component } from 'react';
import classNames from 'classnames'
export default class Toast extends Component{
    constructor(props,context){
        super(props,context);
        this.state={
            leave:false,
        }
    }
    static defaultProps={
        prefixCls:'cue',
        time:3000, //Toast 显示总时间 毫秒
        eTime: 500,//Toast离开动画时间 毫秒
        boxName:undefined, // Toast容器样式名
        contentName:undefined, // Toast内容样式名
        enterName:'cue-bouncein',//Toast 进场动画
        leaveName:'cue-bounceout',//Toast 离场动画
        content:'',//Toast 显示的具体内容
        icon:undefined,//Toast 图标
        close:()=>{} //Toast 关闭事件
    }
    setAnimateTime(time,eTime){
        this.clearTimer();
        if(time>eTime){
            this.closeTimer = setTimeout(() => {
                this.clearTimer();
                this.close();
            }, time - eTime);
        }else{
            this.close();
        }
    }
    componentDidMount(){
        let {time,eTime}= this.props;
        if(time === 'keep'){
            return
        }
        this.setAnimateTime(time,eTime);
    }
    componentWillUnmount () {
        this.clearTimer();
    }
    clearTimer(){
        this.closeTimer = this.closeTimer && clearTimeout(this.closeTimer) && null;
        this.removeTimer = this.removeTimer && clearTimeout(this.removeTimer) && null;
    }
    close(){
        this.setState({
            leave:true
        });
        this.removeTimer = setTimeout(()=>{
            this.clearTimer();
            if(this.props.close){
                this.props.close();
            }
        },this.props.eTime)
    }
    render(){
        let {
            prefixCls,
            boxName = `${prefixCls}-toast-container`,
            contentName =`${prefixCls}-toast-content`,
            enterName,
            leaveName,
            content,
            icon
        } = this.props;
        let { leave } =this.state;

        let divClassName=classNames({
            [contentName]:true,
            [enterName]:!leave,
            [leaveName]:leave
        });
        return (
            <div className={boxName}>
                <div className={ divClassName } >
                    {icon}
                    {content}
                </div>
            </div>
        )
    }
}
