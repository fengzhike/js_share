import React,{ Component } from 'react'
import ReactDom from 'react-dom'
import {Input,Select,Button,message} from 'antd'
import ReactMarkdown from 'react-markdown'
import * as utils from 'utils'
const Option = Select.Option;
import './createArticle.less'
export default class createArticleComponent extends Component{
	componentWillMount(){
		if(this.props.id){
			utils.post('/blogs/queryById',{id:this.props.id}).then(data=>{
				if(!data.result && !data.value){
					return message.error(data.error.message);
				}
				this.setState({
					contentMd:data.value.content,//内容
					title:data.value.title,
					abstract:data.value.abstract,//摘要
					author:data.value.title,//作者
					class:data.value.class//所属栏目
				})
			})
		}
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.id){
			utils.post('/blogs/queryById',{id:this.props.id}).then(data=>{
				if(!data.result && !data.value){
					return message.error(data.error.message);
				}
				this.setState({
					contentMd:data.value.content,//内容
					title:data.value.title,
					abstract:data.value.abstract,//摘要
					author:data.value.title,//作者
					class:data.value.class//所属栏目
				})
			})
		}else{
			this.setState({
				contentMd:'',//内容
			    title:'',
			    abstract:'',//摘要
			    author:'',//作者
			    class:'javascript'//所属栏目
			})
		}
	}
	state = {
	    contentMd:'',//内容
	    title:'',
	    abstract:'',//摘要
	    author:'',//作者
	    class:'javascript'//所属栏目
	}
	handleContentChange(e){
		this.setState({contentMd:e.target.value})
	}
	handleClassChange(e){
		this.setState({class:e})
	}
	handleTitleChange(e){
		this.setState({title:e.target.value})
	}
	handleAbstractChange(e){
		this.setState({abstract:e.target.value})
	}
	handleAuthorChange(e){
		this.setState({author:e.target.value})
	}
	handleSaveClick(){
		let data = this.state
		if(!data.title || !data.contentMd || !data.abstract || !data.author){
			message.error('请完善信息！');
		}else{
			if(this.props.id){
				debugger
				utils.post('/blogs/update',{id:this.props.id,title:data.title,author:data.author,class:data.class,abstract:data.abstract,content:data.contentMd}).then(data=>{
					if(data.result && data.value){
						message.success('更新成功！');
						this.setState({
							contentMd:'',//内容
							title:'',
							abstract:'',//摘要
							author:'',//作者
							class:'javascript'//所属栏目
						})
					}else{
						message.error(data.error.message);
					}
					
				})
			}else{
				utils.post('/blogs/insert',{title:data.title,author:data.author,class:data.class,abstract:data.abstract,content:data.contentMd}).then(data=>{
					if(data.result && data.value){
						message.success('新增成功！');
					}else{
						message.error(data.error.message);
					}
					this.setState({
						contentMd:'',//内容
						title:'',
						abstract:'',//摘要
						author:'',//作者
						class:'javascript'//所属栏目
					})
				})
			}
		}
	}
	render(){
		return (
			<div>
				<div className='createArticle'>
					<div className='edit'>
						<p><span>标题:</span><Input value={this.state.title} onChange={::this.handleTitleChange} /></p>
						<p><span>摘要:</span><Input value={this.state.abstract} onChange={::this.handleAbstractChange} size="large" /></p>
						<p><span>作者:</span><Input value={this.state.author} onChange={::this.handleAuthorChange} size="large" /></p>
						<p>
							<span>所属栏目:</span>
							<Select defaultValue="javascript" value={this.state.class} style={{ width: '100%' }} onChange={::this.handleClassChange}>
						      	<Option value="javascript" key='Javascript'>javascript</Option>
						      	<Option value="nodejs" key='nodejs'>nodeJs</Option>
						      	<Option value="linux" key='Linux'>linux</Option>
						    </Select>
						</p>
						<p><span>内容:</span><Input value={this.state.contentMd} type='textarea' style={{height:'500px'}} onChange={::this.handleContentChange} /></p>
					</div>
					<div className='view'>
						<ReactMarkdown source={this.state.contentMd} />
					</div>
				</div>
				<div className="adminBtn" style={{width:'100%',textAlign:'center',marginTop:'20px'}}>
	        	    <Button type="primary" style={{width:'200px'}} onClick={::this.handleSaveClick}>保存并新增</Button>
	    	    </div>
			</div>
		)
	}
}