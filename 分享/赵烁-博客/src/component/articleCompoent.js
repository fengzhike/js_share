import React,{ Component } from 'react'
import ReactDom from 'react-dom'
import {Card} from 'antd'
import * as utils from 'utils'
import ReactMarkdown from 'react-markdown'
export default class articleCompoent extends Component{
	componentWillMount(){
		if(!this.props.articleId) return 
		utils.post('/blogs/queryById',{id:this.props.articleId}).then(data=>{
			this.setState({data:data.value})
		})
	}
	state = {
	}
	render(){
		let data = this.state.data
		if(!data) return null
		return (
			<div>
				<h2 style={{textAlign:'center',lineHeight:'30px'}}>{data.title}</h2>
				<p style={{textAlign:'center'}}><span style={{marginRight:'25px'}}>作者：{data.author}</span><span>创建时间：{data.createTime}</span></p>
				<ReactMarkdown source={data.content} />
			</div>
		)
	}
}