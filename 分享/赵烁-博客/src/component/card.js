import React,{ Component } from 'react'
import ReactDom from 'react-dom'
import {Card,Button,message,Modal} from 'antd'
import * as utils from 'utils'
export default class CardComponent extends Component{
	componentDidMount(){
	}
	state = {
	    
	}
	componentWillMount(){
		// debugger
	}
	handleCardClick(e){
		this.props.showArticle(this.props.data._id)
	}
	handleDeleteClick(){
		let data = this.props.data,
			This = this
		Modal.confirm({
		    title: '删除文章',
		    content: '您确定要删除《'+data.title+'》吗？',
		    onOk() {
		      utils.post('/blogs/delete',{id:data._id}).then(data=>{
		      	if(!data.result && !data.value){
		      		return message.error(data.error.message);
		      	}else{
		      		message.success('删除成功！')
		      		This.props.refresh()
		      	}
		      })
		    },
		    onCancel() {
		      
		    },
		});
		
	}
	render(){
		return (
			<Card title={<a onClick={::this.handleCardClick}>{this.props.data.title}</a>} style={{ marginBottom: '10px' }} extra={<div><span style={{marginRight:'10px'}}>创建时间：{this.props.data.createTime}</span><span style={{marginRight:'10px'}}>所属栏目：{this.props.data.class}</span>{this.props.isAdmin?<Button type="primary" onClick={::this.handleDeleteClick}>删除</Button> : null}</div>}>
			    <p>{this.props.data.abstract}</p>
			</Card>
		)
	}
}