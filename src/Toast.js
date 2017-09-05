import React , { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
export default class Toast extends Component{
    constructor(props,context){
        super(props,context);
        this.state={
            leave:false,
        }
    }
    static defaultProps={
        prefixCls:'cue',
        keep: false,
        time:3000,
        eTime: 500,
        enterName:'cue-bouncein',
        leaveName:'cue-bounceout',
    }
    init(props){
        this.clearTimer();
        const {time,eTime,keep}= props;
        this.state={
            leave:false,
        }
        if(keep)return;
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
        this.init(this.props)
    }
    componentWillUnmount () {
        this.clearTimer();
    }
    componentWillReceiveProps(nextprops){
        //判断是否再次加载
        if(this.props.count !== nextprops.count){
            this.init(nextprops)
        }
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
Toast.propTypes={
    prefixCls:PropTypes.string,//Toast className前缀
    keep:PropTypes.bool,//Toast 是否一直保持展示状态
    time:PropTypes.number, //Toast 显示总时间 毫秒
    eTime: PropTypes.number,//Toast离开动画时间 毫秒
    boxName:PropTypes.string, // Toast容器样式名
    contentName:PropTypes.string, // Toast内容样式名
    enterName:PropTypes.string,//Toast 进场动画
    leaveName:PropTypes.string,//Toast 离场动画
    content:PropTypes.string,//Toast 显示的具体内容
    icon:PropTypes.node,//Toast 图标
    close:PropTypes.func//Toast 关闭事件
}