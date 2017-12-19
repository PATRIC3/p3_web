define([
	"dojo/_base/declare", "dijit/_WidgetBase", "dojo/on",
	"dojo/dom-class", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/SuLogin.html", "dijit/form/Form", "dojo/request",
	"dojo/dom-form", "dojo/_base/lang", "dojox/validate/web"
], function(declare, WidgetBase, on,
	domClass, Templated, WidgetsInTemplate,
	Template, FormMixin, xhr,
	domForm, lang, validate){
		return declare([WidgetBase, FormMixin, Templated, WidgetsInTemplate], {
			"baseClass": "App Sleep",
			templateString: Template,
			fieldChanged: function(evt){
				this.submitButton.set('disabled', true);
				if(this.uidField.get('value') !== '' && this.pwField.get('value') !== ''){
					this.submitButton.set('disabled', false);
				}
			},
			onSubmit: function(evt){
				console.log('I clicked the button');
				evt.preventDefault();
				evt.stopPropagation();
				domClass.add(this.domNode, "Working");
				domClass.remove(this.domNode, "Error");
				this.submitButton.set('disabled', true);
				var vals = this.getValues();
				var _self = this;
				var userServiceURL = window.App.userServiceURL;
				userServiceURL.replace(/\/+$/, "");
				// var def = xhr.post(userServiceURL + '/sulogin', {
				// 	data: vals
				// });
				// def.then(function(data){
				// 	console.log(data);
				// 	var dataArr = data.split('|');
				// 	var keyValueArr = [];
				// 	//console.log(dataArr);
				// 	var dataobj =  {};
				// 	for(var i = 0; i < dataArr.length; i++){
				// 		keyValueArr = dataArr[i].split('=');
				// 		dataobj[keyValueArr[0]] = keyValueArr[1];
				// 	}
				// 	window.App.login(dataobj, data);
				// }, function(err){
				// 	var data = err.response.data;
				// 	console.log(data);
				// 	var dataObj = JSON.parse(data);
				// 	console.log(dataObj.message);
				// 	document.getElementsByClassName('loginError')[0].innerHTML = dataObj.message;
				// })
				//TODO set these variables:
				// window.App.authorizationToken
				// window.App.user
				// set the localStorage variables
				localStorage.setItem('Aauth', localStorage.getItem('auth'));
				localStorage.setItem('Atokenstring', localStorage.getItem('tokenstring'));
				localStorage.setItem('AuserProfile', localStorage.getItem('userProfile'));
				localStorage.setItem('Auserid', localStorage.getItem('userid'));
				//redirect to homepage
			},
			constructor: function(){
				var wrongRole = true;
				console.log(window.location.href);
				var auth = localStorage.getItem('auth');
				auth = JSON.parse(auth);
				if (auth.roles !== null && auth.roles !== undefined){
					if(auth.roles.includes('admin')){
						wrongRole = false;
					}
					console.log(auth.roles);
				}
				if(wrongRole){
					window.location.href = '/';
				}
			},
			startup: function(){
				// var wrongRole = true;
				// console.log(window.location.href);
				// var auth = localStorage.getItem('auth');
				// auth = JSON.parse(auth);
				// if (auth.roles !== null && auth.roles !== undefined){
				// 	if(auth.roles.includes('admin')){
				// 		wrongRole = false;
				// 	}
				// 	console.log(auth.roles);
				// }
				// // else{
				// // 	console.log('redirecting you to homepage');
				// // }
				// if(wrongRole){
				// 	window.location.href = '/';
				// }
				// var str = window.location.href;
				// var strArr = str.split("/user/");
				// console.log(strArr[1]);
				//this.getUser(strArr[1], this);
				if(this._started){
					return;
				}
				this.inherited(arguments);
				this._started = true;
				this.submitButton.set('disabled', true);
			}
		});
	});
