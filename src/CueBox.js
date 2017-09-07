import React,{Component} from 'react';
import ReactDOM,{render} from 'react-dom';
import PropTypes from 'prop-types';
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
        prefixCls:'cue',
    };
    decorateNotice(notice){
        let {hasMask} = notice;
        let {prefixCls} = this.props;
        //增加唯一索引 key和ref 使用当前毫秒数加1~100的随机数字
        notice.ref = notice.key = `${prefixCls}-${Date.now()}${Math.ceil(Math.random()*(100-1)+1)}`;
        //用来表示当前的notice是否需要展示遮罩层
        notice.hasMask = !!hasMask;
        //把当前的className前缀像子集传递
        notice.prefixCls = prefixCls;
        //count 用来判断当前notice被促发几次更改 默认初始化为1;
        notice.count = 0;
        return notice;
    }
    close(key){
        this.refs[key].close()
    }
    /**
     * @param notice 默认包含hasMask、component、close、unique等配置
     * hasMask {boolean} 表示是否需要显示遮罩层
     * component {element} 需要显示的件
     * close {function} 组件默认的关闭方法
     * @returns {string} 返回新增成功后的notice的key值
     */
    add(notice){
        const { notices } = this.state;
        let newNotices=[],
            hasEqual=false,
            hasMask = false;
        //判断新增的notice是否已经存在于当前的notices中
        if(notices.length>0){
            newNotices = notices.map((item,index)=>{
                //浅比对
                let flag = Object.keys(notice).every(key => {
                    if(notice[key] && !item[key]) return false;
                    if(typeof notice[key] == 'function'){
                        return notice[key].toString() === item[key].toString();
                    }
                    return notice[key] === item[key];
                });
                //如果存在则使用当前的notice并给count计数加1
                if(flag){
                    notice = item;
                    item.count += 1;
                    hasEqual = true;
                }
                if(item.hasMask) hasMask = true;
                return item;
            });
        }
        if(!hasEqual){
            notice = this.decorateNotice(notice);
            newNotices.push(notice)
        }
        this.setState({
            notices: newNotices,
            hasMask: hasMask || notice.hasMask
        });
        return notice.key;
    }
    remove(key){
        this.setState(prevState=>{
            const {notices} = prevState;
            let newNotices = notices.filter(item=>item.key!==key);
            return{
                notices:newNotices,
                hasMask:newNotices.some((item)=>item.hasMask)
            }
        });
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
            let {component = Toast,close} = item;
            // 绑定一个close回调方法
            const newItem = Object.assign({},item);
            delete newItem.component;
            newItem.close=()=>{
                if(close){
                    close()
                }
                //调用remove完成notice再CueBox中的卸载
                this.remove(newItem.key)
            };
            result.push(React.createElement(component,newItem))
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
            maskName=`${prefixCls}-mask`,
            hideName=`${prefixCls}-hide`,
        } = this.props;
        const { notices,hasMask} = this.state;
        const lengthFlag = notices.length>0;
        let boxClassName=classNames({
            [boxName]:lengthFlag,
            // [hideName]:!lengthFlag,
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

CueBox.propTypes={
    //默认的className前缀
    prefixCls:PropTypes.string,
    //Cue容器的className 默认为prefixCls的值加‘-box’ 例如这里是cue-box 如果传人则使用传入的值作为cue容器的className
    boxName:PropTypes.string,
    //规则同boxName，为Cue容器遮罩层的样式 默认为cue-mask
    maskName:PropTypes.string
};