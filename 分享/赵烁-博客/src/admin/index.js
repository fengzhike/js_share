import React,{ Component,PropTypes } from 'react'
import {Button,Icon,Menu,Layout,Breadcrumb,Input} from 'antd'
const { Header, Sider, Content } = Layout
import './admin.less'
import Login from '../component/login.js'
import CreateArticle from '../component/createArticle.js'
// import ArticleList from '../component/articleList.js'
import List from '../component/list.js'
export default class Admin extends Component{
	handleIndexClick(){
		this.props.onRedirect('index')
	}
	state = {
		collapsed:false,
		login:false,
		appPath:'admin'
	}
	login(login){
		if(login){
			this.setState({login:true})
		}
	}
	handleMenuClick(e){
		this.setState({appPath:e.key,id:null})
	}
	showArticle(id){
		this.setState({appPath:'createArticle',id:id})
	}
	render(){
		if(!this.state.login){
			return (<Login login={::this.login}></Login>)
		}
		return (<div className='admin'>
				<Layout>
			        <Sider
			          trigger={null}
			          collapsible
			          collapsed={this.state.collapsed}
			        >
			        <Menu theme="dark" mode="inline" onClick={::this.handleMenuClick} defaultSelectedKeys={['admin']}>
			            <Menu.Item key="admin">
			              <Icon type="user" />
			              <span className="nav-text">首页</span>
			            </Menu.Item>
			            <Menu.Item key="createArticle">
			              <Icon type="video-camera" />
			              <span className="nav-text">发表文章</span>
			            </Menu.Item>
			            <Menu.Item key="articleManager">
			              <Icon type="upload" />
			              <span className="nav-text">管理文章</span>
			            </Menu.Item>
			            <Menu.Item key="linux">
			              <Icon type="upload" />
			              <span className="nav-text">管理栏目</span>
			            </Menu.Item>
			            <Menu.Item key="linux1">
			              <Icon type="upload" />
			              <span className="nav-text">管理用户</span>
			            </Menu.Item>
			            <Menu.Item key="linux2">
			              <Icon type="upload" />
			              <span className="nav-text">修改登录密码</span>
			            </Menu.Item>
			        </Menu>
			        </Sider>
			        <Layout style={{overflow: 'hidden'}}>
			        	<div className="contentHeader" style={{height:'35px',minHeight:'35px'}}>
			        	    <div className="adminBtn" style={{textAlign:'right',paddingRight:'10px'}}>
				        	    <Button type="primary" onClick={::this.handleIndexClick}>返回首页</Button>
			        	    </div>
			        	</div>
				        <Content style={{ padding: 24, background: '#fff',overflow: 'auto' }}>
				            {(()=>{
				            	if(this.state.appPath == 'createArticle'){
				            		return (
				            			<CreateArticle id={this.state.id}></CreateArticle>
				            		)
				            	}else if(this.state.appPath == 'articleManager'){
				            		return (<List isAdmin={true} showArticle={::this.showArticle}></List>)
				            	}else{
        		            		return (<div>
        					            这里是后台管理的首页
        				            </div>)
				            	}
				            })()}
				        </Content>
			        </Layout>
		        </Layout>
		</div>)
	}
}