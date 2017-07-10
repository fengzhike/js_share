import * as requestHelpers from './src/request-creator-helpers.js';
import fetchWrapper from './src/fetch-wrapper.js';
// import config from '../../../web.config.js'

// base
const postReq = requestHelpers.postReq;
const getReq = requestHelpers.getReq;
const putReq = requestHelpers.putReq;
const delReq = requestHelpers.delReq;
const postAuthReq = requestHelpers.postAuthReq;
const putAuthReq = requestHelpers.putAuthReq;
const getAuthReq = requestHelpers.getAuthReq;
const delAuthReq = requestHelpers.delAuthReq;
const sendRequest = fetchWrapper;
var accessToken = ''

export function getAccessToken(){
	return sessionStorage['_accessToken']||'';
}

export function setAccessToken(token){
	sessionStorage['_accessToken'] = token
}

export function clearAccessToken(){
	sessionStorage['_accessToken'] = ''
}


// utils
export const get = (url, header) => {
	return new Promise((resolve, reject) => sendRequest({
		request: getReq(url, header),
		responseType: 'json',
		onSuccess: resolve,
		onError: reject
	}));
};


export const post = (url, data, header, isFree) => {
	// if(url.indexOf('/') == 0) {
	// 	url = config.RootPath+url;
	// }
	// else if(url.indexOf("http") != 0){
	// 	url = config.RootPath + '/' + url;
	// }
	// var backendserver="";
	// var hash = window.location.hash;
	// if(hash && hash.indexOf("server=")!=-1){
	// 	backendserver = "http://" + hash.substr(hash.indexOf("=") + 1);
	// }
	//转发本地端口
	// var apiInfo = window.__dev_webapi;
	// if(apiInfo && !!apiInfo.proxy && url.indexOf("/v1/")==0){
	// 	if(apiInfo.proxy.indexOf("http://")==0){
	// 		backendserver = apiInfo.proxy;
	// 	}else{
	// 		var arr = url.substr(3).split("/");
	// 		arr.pop();arr.push("");
	// 		var key = apiInfo.proxy+","+arr.join("/");
	// 		if(apiInfo.projapis[key]){
	// 			//本地的tomcat
	// 			if(!backendserver)backendserver = "http://127.0.0.1:" + apiInfo.port  ;
	// 			url = "/" + apiInfo.proxy + url.substr(3);
	// 		}else{
	// 			backendserver = "";
	// 		}
	// 	}
	// }
	// if(backendserver){
	// 	url = backendserver + url;
	// }
	// accessToken = getAccessToken();//toke in sessionStorage
	// if( !!accessToken && !isFree){
	// 	header = header || {};
	// 	if(!header.token){ //toke in header is first
	// 		header.token = accessToken;
	// 	}
	// }
	// if(window.__record){
	// 	window.__record(url,data);
	// }else{
	// 	console.log("__post('"+url+"',"+JSON.stringify(data)+")");//TODO:remove on release
	// }
	return new Promise((resolve, reject) => sendRequest({
		request: postReq(url, data),
		responseType: 'json',
		onSuccess: resolve,
		onError: reject
	}));
};

window.__post = post;//注入到全局变量中，后台开发测试时使用。//TODO:remove on release

export const put = (url, data, header) => {
	//if(accessToken && !isFree)
	//	data.token = accessToken
	return new Promise((resolve, reject) => sendRequest({
		request: putReq(url, data, header),
		responseType: 'json',
		onSuccess: resolve,
		onError: reject
	}));
};

export const del = (url, header) => {
	return new Promise((resolve, reject) => sendRequest({
		request: delReq(url, header),
		responseType: 'json',
		onSuccess: resolve,
		onError: reject
	}));
};

window.getAccessToken = getAccessToken
//
// export const getAuth = (url, token, header) => {
// 	return new Promise((resolve, reject) => sendRequest({
// 		request: getAuthReq(url,token, header),
// 		responseType: 'json',
// 		onSuccess: resolve,
// 		onError: reject
// 	}));
// };
//
// export const postAuth = (url, data, token,header) => {
// 	return new Promise((resolve, reject) => sendRequest({
// 		request: postAuthReq(url, data, token,header),
// 		responseType: 'json',
// 		onSuccess: resolve,
// 		onError: reject
// 	}));
// };
//
// export const putAuth = (url, data,token, header) => {
// 	return new Promise((resolve, reject) => sendRequest({
// 		request: putAuthReq(url, data, token,header),
// 		responseType: 'json',
// 		onSuccess: resolve,
// 		onError: reject
// 	}));
// };
//
// export const delAuth = (url,token, header) => {
// 	return new Promise((resolve, reject) => sendRequest({
// 		request: delAuthReq(url, token,header),
// 		responseType: 'json',
// 		onSuccess: resolve,
// 		onError: reject
// 	}));
// };

/**
EXAMPLE USAGE

sendRequest({
  request: postReq('localhost:9009/login', {name: 'name'}), //this should be a function that returns a fetch request
  responseType: 'json'
  onSuccess: json => {},
  onError: (error) => {}
})
**/
