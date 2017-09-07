import React,{Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
export default class Model extends Component{
    constructor(props,context){
        super(props,context);
        this.state={
            leave:false,
        }
    }
    static defaultProps={
        prefixCls:'cue',
        eTime: 500,
        enterName:'cue-bouncein',
        leaveName:'cue-bounceout',
        actions:[]
    };
    close=()=>{
        this.setState({
            leave:true
        });
        this.removeTimer = setTimeout(()=>{
            clearTimeout(this.removeTimer);
            if(this.props.close){
                this.props.close();
            }
        },this.props.eTime)
    };
    componentWillUnmount () {
        this.removeTimer = this.removeTimer && clearTimeout(this.removeTimer) && null;
    }
    getFooter(buttonName){
        const {actions} = this.props;
        let result=[];
        if(actions.length>0){
            result = actions.map((item,index)=>{
                const {text,click,color} = item;
                const onClick=()=>{
                    if(click){
                        click(this.close);
                    }else{
                        this.close();
                    }
                };
                return (<a className={buttonName} key={`button-${index}`} style={{color}} onClick={onClick} role="button">{text}</a>)
            });
        }
        return result;
    }
    render(){
        const {
            prefixCls,
            boxName = `${prefixCls}-model-container`,
            contentName = `${prefixCls}-model-content`,
            headerName = `${prefixCls}-model-header`,
            articleName = `${prefixCls}-model-article`,
            footerName = `${prefixCls}-model-footer`,
            buttonName =`${prefixCls}-model-button`,
            enterName,
            leaveName,
            title,
            content
        } = this.props;
        const {leave} = this.state;
        const contentCls = classNames({
            [contentName] : true,
            [enterName]:!leave,
            [leaveName]:leave
        });
        const footer = this.getFooter(buttonName);
        return(<div className={boxName}>
            <section className={contentCls}>
                {title && (<header className={headerName}>{title}</header>)}
                <article className={articleName}>{content}</article>
                {footer.length>0 && <footer className={footerName}>{footer}</footer>}
            </section>
        </div>)
    }
}

Model.propTypes={
    //Model className前缀
    prefixCls:PropTypes.string,
    //Model 离开动画时间 毫秒
    eTime: PropTypes.number,
    //Model 容器样式名
    boxName:PropTypes.string,
    //Model 内容样式名
    contentName:PropTypes.string,
    //Model 标题样式名
    headerName:PropTypes.string,
    //Model 标题样式名
    articleName:PropTypes.string,
    //Model 底部按钮容器样式名
    footerName:PropTypes.string,
    //Model 底部按钮样式名
    buttonName:PropTypes.string,
    //Model 进场动画
    enterName:PropTypes.string,
    //Model 离场动画
    leaveName:PropTypes.string,
    //Model 标题
    title:PropTypes.node,
    //Model 内容
    content:PropTypes.node.isRequired,
    //Model 关闭事件
    close:PropTypes.func,
    //Model 底部按钮控制组 数组对象形式,包含:
    // text：按钮显示的文字
    // color：文字的颜色
    // click：按钮的点击事件 默认会把colse当形参传入 用于关闭Model
    actions:PropTypes.array
};