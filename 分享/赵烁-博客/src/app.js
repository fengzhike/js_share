import React,{ Component,PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Index from './index/index'
import Admin from './admin/index'
export default class Play extends Component{
	state = {
		data:'index'
	}
	componentWillMount(){
		
	}
	redirect(str){
		this.setState({data:str})
	}
	getRenderView(){
		let data = this.state.data
		if(data == 'index'){
			return <Index onRedirect={::this.redirect} />
		}else if(data == 'admin'){
			return <Admin onRedirect={::this.redirect} />
		}
	}
	render(){
		return this.getRenderView()
	}
}
ReactDOM.render(<Play />, document.getElementById('app'));