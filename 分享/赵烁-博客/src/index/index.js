import React,{ Component,PropTypes } from 'react'
import {Button,Icon,Menu,Layout,Breadcrumb} from 'antd'
const { Header, Sider, Content } = Layout
import List from '../component/list.js'
import Article from '../component/articleCompoent.js'
import * as utils from 'utils'
import './index.less'
export default class Index extends Component{
	componentDidMount(){
		/*utils.post('/blogs/insert',{title:'测试插入linux数据',author:'赵烁',class:'linux',abstract:'这是测试插入数据的摘要',content:'这是测试插入数据的内容部分'}).then(data=>{
			debugger
			console.log(data.value)
			return utils.post('/blogs/query')
		}).then(data=>{
			debugger
			console.log(data.value)
		})*/

		// utils.post('/blogs/query').then(data=>{
		// 	debugger
		// 	this.setState({list:data.value})
		// })
	}
	state = {
	    collapsed: false,
	    queryType:'index',
	    showArticle:false,
	    articleId:null
	}
	handleAdminClick(){
		this.props.onRedirect('admin')
	}
	handleMenuClick(e){
		this.setState({queryType:e.key,showArticle:false})
	}
	handleShowArticle(id){
		this.setState({showArticle:true,articleId:id})
	}
	/*getRootState(){
		return this.state
	}
	setRootState(obj){
		this.setState(obj)
	}*/
	render(){
		return (
			<Layout className='index'>
		        <Sider
		          trigger={null}
		          collapsible
		          collapsed={this.state.collapsed}
		        >
		        <div className="adminImg">
		        	<img src={require('./img/user.jpg')}/>
		        	<p>赵烁</p>
		        	<p>前端开发</p>
		        </div>
		        <Menu theme="dark" mode="inline" onClick={::this.handleMenuClick} defaultSelectedKeys={[this.state.queryType]}>
		            <Menu.Item key="index">
		              <Icon type="user" />
		              <span className="nav-text">首页</span>
		            </Menu.Item>
		            <Menu.Item key="javascript">
		              <Icon type="video-camera" />
		              <span className="nav-text">Javascript</span>
		            </Menu.Item>
		            <Menu.Item key="nodejs">
		              <Icon type="upload" />
		              <span className="nav-text">NodeJs</span>
		            </Menu.Item>
		            <Menu.Item key="linux">
		              <Icon type="upload" />
		              <span className="nav-text">Linux</span>
		            </Menu.Item>
		        </Menu>
		        </Sider>
		        <Layout style={{overflow: 'hidden'}}>
		        	<div className="contentHeader">
			        	<Breadcrumb style={{ margin: '12px 0' }}>
		        	        <Breadcrumb.Item>Home</Breadcrumb.Item>
		        	        <Breadcrumb.Item>List</Breadcrumb.Item>
		        	        <Breadcrumb.Item>App</Breadcrumb.Item>
		        	    </Breadcrumb>
		        	    <div className="adminBtn">
			        	    <Button type="primary" onClick={::this.handleAdminClick}>后台管理</Button>
		        	    </div>
		        	</div>
			        <Content style={{ padding: 24, background: '#fff',overflow: 'auto'}}>
			            <div>
			            { this.state.showArticle ? <Article {...this.state}></Article> : <List {...this.state} showArticle={::this.handleShowArticle}></List>
			            }
			            </div>
			        </Content>
		        </Layout>
	        </Layout>
		)
	}
}