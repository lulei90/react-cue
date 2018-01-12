# react-cue
基于react15版本 移动Toast提示组件
该项目使用lib-flexible来进行适配，所以如果使用的是1倍不缩放的viewport请覆盖index.css文件
## 安装
```
npm install --save react-cue
```
## 使用
```
import React,{Component} from 'react';
import ReactDOM,{render} from 'react-dom';
import 'react-cue/lib/index.css';
import Cue from 'react-cue';

class Demo extends Component{
	handleClick(){
            Cue.msg('hello world')
        }
        handleMaskClick(){
            Cue.add({
                content: `现在现在时间是现在时间是现在时间是现在时间是s时间是：${Date.now()}`,
                hasMask: true
            })
        }
        alert(){
            var content = (<div><div>一二三四五六七八九十</div><div>一二三四五六七八九十</div></div>);
            Cue.alert(
                content,
                function(close){
                    close();
                    Cue.alert('系统又好了')
            },'失败')
        }
        confirm(){
            Cue.confirm({
                content:'放弃本次操作',
                title:'离开',
                actions:[{
                    text:'我在想想',
                },{
                    text:'去意已决',
                    color:'#108ee9',
                    click:function(close){
                        Cue.msg('拜拜');
                        close()
                    }
                }]
            })
        }
        handleLoadingClick() {
            var key=Cue.loading('正在加载...');
            setTimeout(()=>{
                Cue.close(key)
            },10000)
        }
        render(){
            return(<div>
                <button style={{fontSize:'40px'}} onClick={this.handleClick}>点我</button>
                <button style={{fontSize:'40px'}} onClick={this.handleMaskClick}>Cue带遮罩</button>
                <button style={{fontSize:'40px'}} onClick={this.handleLoadingClick}>Cue loading</button>
                <button style={{fontSize:'40px'}} onClick={this.alert}>Alert</button>
                <button style={{fontSize:'40px'}} onClick={this.confirm}>Confirm</button>
            </div>)
        }
}

```