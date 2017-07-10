import React,{ Component } from 'react'
import ReactDom from 'react-dom'
import {Card,Input,Button,message} from 'antd'
import * as utils from 'utils'
export default class articleCompoent extends Component{
	componentWillMount(){
		/*if(!this.props.articleId) return 
		utils.post('/blogs/queryById',{id:this.props.articleId}).then(data=>{
			this.setState({listData:data.value})
		})*/
	}
	state = {
	    user:null,
	    pwd:null
	}
	handleLoginClick(){
		let login = this.props.login
		utils.post('/blogs/login',{user:this.state.user,password:this.state.pwd}).then(data=>{
			if(!data.result){
				message.error(data.error.message)
			}else{
				message.success('登陆成功！')
				login(data.result)
			}
		})
	}
	handleUserChange(e){
		this.setState({user:e.target.value})
	}
	handlePwdChange(e){
		this.setState({pwd:e.target.value})
	}
	render(){
		return (
			<div style={{display:'flex',flex:'1',height:'100%',alignItems:'center',justifyContent:'center'}}>
				<Card className='login' style={{padding:'25px 25px 80px 25px',border:'1px solid #dadada'}}>
					<h3 style={{textAlign:'center',marginBottom:'10px'}}>登陆</h3>
					<Input type='text' onChange={::this.handleUserChange} placeholder='请输入用户名'></Input>
					<Input style={{margin:'10px 0'}} onChange={::this.handlePwdChange} type='password' placeholder='请输入密码'></Input>
					<Button type="primary" style={{width:'100%'}} onClick={::this.handleLoginClick}>登陆</Button>
				</Card>
			</div>
		)
	}
}