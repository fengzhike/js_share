import React,{ Component } from 'react'
import ReactDom from 'react-dom'
import Card from '../component/card.js'
import * as utils from 'utils'
import {Select} from 'antd'
const Option = Select.Option
export default class ListComponent extends Component{
	componentWillMount(){
		this.initView()
	}
	state = {
	    listData: null,
	    class:'index'
	}
	componentWillReceiveProps(nextProps){
		this.initView(nextProps.queryType)
	}
	initView(type){
		let queryType = type || 'index'
		utils.post('/blogs/query',{type:queryType}).then(data=>{
			this.setState({listData:data.value,class:queryType})
		})
	}
	handleClassChange(e){
		this.initView(e)
	}
	refresh(){
		this.initView(this.state.class)
	}
	render(){
		if(!this.state.listData) return null
		let list = this.state.listData,
			elementArr=[]
		list.map((e,i)=>{
			elementArr.push(<Card key={i} data={e} isAdmin={this.props.isAdmin} refresh={::this.refresh} showArticle={this.props.showArticle}>i</Card>)
		})
		return (
			<div>
				{this.props.isAdmin ? <div className='articleListHeader' style={{display:'flex',marginBottom:'15px'}}>
				    <p>栏目：</p>
				    <Select defaultValue="javascript" style={{width:'100px'}} value={this.state.class} onChange={::this.handleClassChange}>
				        <Option value="index" key='Javascript'>全部</Option>
				        <Option value="javascript" key='Javascript'>javascript</Option>
				        <Option value="nodejs" key='nodejs'>nodeJs</Option>
				        <Option value="linux" key='Linux'>linux</Option>
				    </Select>
				</div>: null}
				{elementArr}
			</div>
		)
	}
}