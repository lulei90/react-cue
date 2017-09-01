import React,{Component} from 'react';
import ReactDOM,{render} from 'react-dom';
import classNames from 'classnames';
import Toast from './Toast'

export default class CueBox extends Component{
    constructor(props){
        super(props);
        this.state={
            notices:[],
            hasMask:false //遮罩层判断
        }
    }
    static defaultProps={
        //默认的className前缀
        prefixCls:'cue',
        //Cue容器的className 默认为prefixCls的值加‘-box’ 例如这里是cue-box 如果传人则使用传入的值作为cue容器的className
        boxName:undefined,
        //规则同boxName，为Cue容器遮罩层的样式 默认为cue-mask
        maskName:undefined
    }
    decorateNotice(notice){
        let {hasMask,close} = notice;
        let {prefixCls} = this.props;
        notice.ref = notice.key = `${prefixCls}-${Date.now()}`;
        notice.hasMask = !!hasMask;
        notice.prefixCls = prefixCls;
        //给每个notice元素绑定一个close回调方法，用于关闭前的回调
        notice.close=()=>{
            if(close){
                close()
            }
            //调用remove完成notice再CueBox中的卸载
            this.remove(notice.key)
        };
        return notice;
    }
    close(key){
        this.refs[key].close()
    }
    add(notice){
        let {notices} = this.state,
            flag = false;
        notice = this.decorateNotice(notice);
        flag = notices.some((item)=>item.hasMask) || notice.hasMask;
        this.setState({
            notices:[...notices, notice],
            hasMask:flag
        });
        return notice.key;
    }
    remove(key){
        let {notices} = this.state;
        let newNotices=notices.filter((item)=>{
            return item.key !== key;
        });
        this.setState({
            notices:newNotices,
            hasMask:newNotices.some((item)=>item.hasMask)
        })
    }
    removeAll(){
        let {notices} = this.state;
        notices.forEach((item)=>{
            let {close,key}=item;
            close(key);
        });
        this.setState={
            notices:[],
            hasMask:false
        }
    }
    getNoticeDom(){
        let { notices } = this.state;
        let result=[];
        notices.forEach((item)=>{
            let {component = Toast} = item;
            delete item.component;
            result.push( React.createElement(component,item)
            )
        });
        return result;
    }
    componentWillUnmount(){
        this.removeAll();
    }
    render(){
        const {
            prefixCls,
            boxName=`${prefixCls}-box`,
            maskName=`${prefixCls}-mask`
        } = this.props;
        const { notices,hasMask} = this.state;
        const lengthFlag = notices.length>0;
        let boxClassName=classNames({
            [boxName]:lengthFlag,
            [maskName]:hasMask,
        });
        return(<div className={boxClassName}>
            {lengthFlag && this.getNoticeDom()}
        </div>)
    }
};
//props为初始化CueBox的属性
CueBox.renderBox = function (props={}) {
    let dom = document.createElement('div');
    document.body.appendChild(dom);
    let cuebox=render(<CueBox {...props}/>,dom);
    return Object.assign(cuebox,{
        dom,
        create(config){
            Object.keys(config).forEach(methodName=>{
                if(methodName in cuebox){
                    console.warn(`Can't set '${methodName}' instand of Cuebox.${methodName},Cuebox will delete '${methodName}' in your config `)
                    delete config[methodName]
                }
                return methodName in cuebox;
            });
            return Object.assign(cuebox,config);
        },
        destroy(){
            ReactDOM.unmountComponentAtNode(this.dom);
            document.body.removeChild(this.dom);
        }
    });
};