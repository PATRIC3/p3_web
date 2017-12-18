define([
	"dojo/_base/declare", "dijit/_WidgetBase", "dojo/on",
	"dojo/dom-class", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/LoginForm.html", "dijit/form/Form", "dojo/request",
	"dojo/dom-form", "dojo/_base/lang", "dojox/validate/web"
], function(declare, WidgetBase, on,
	domClass, Templated, WidgetsInTemplate,
	Template, FormMixin, xhr,
	domForm, lang, validate){
		return declare([WidgetBase, FormMixin, Templated, WidgetsInTemplate], {
			"baseClass": "App Sleep",
			templateString: Template,
			callbackURL: "",
			onResetClick: function(evt){
				//console.log('I clicked the reset pw button!');
				evt.preventDefault();
				evt.stopPropagation();
				domClass.add(this.domNode, "Working");
				domClass.remove(this.domNode, "Error");
				this.resetPWbutton.set('disabled', true);
				var emailAddress = this.emailAddress.displayedValue;
				//console.log(emailAddress);
				var userServiceURL = window.App.userServiceURL;
				userServiceURL.replace(/\/+$/, "");
				var def = xhr.post(userServiceURL + '/reset_password', {
					data: {email: emailAddress},
					method: 'post',
					headers: {
						'Accept': 'application/json'
					}
				});
				def.then(function(data){
					//console.log(data);
					document.getElementsByClassName('pwReset')[0].style.display='none';
					if(data){
						document.getElementsByClassName('pwrError')[0].style.display="block";
					}else{
						document.getElementsByClassName('pwrMessage')[0].style.display="block";
					}
				}, function(err){
					console.log(err);
				})
			},
			onSubmit: function(evt){
				//console.log('I clicked the button');
				evt.preventDefault();
				evt.stopPropagation();
				domClass.add(this.domNode, "Working");
				domClass.remove(this.domNode, "Error");
				//this.submitButton.set('disabled', true);
				var vals = this.getValues();
				var _self = this;
				var userServiceURL = window.App.userServiceURL;
				userServiceURL.replace(/\/+$/, "");
				var def = xhr.post(userServiceURL + '/authenticate', {
					data: vals
				});
				def.then(function(data){
					console.log(data);
					// if(data.message){
					// 	console.log(data.message);
          //
					// } else{
						//console.log(data);
						var dataArr = data.split('|');
						var keyValueArr = [];
						//console.log(dataArr);
						var dataobj =  {};
						for(var i = 0; i < dataArr.length; i++){
							keyValueArr = dataArr[i].split('=');
							dataobj[keyValueArr[0]] = keyValueArr[1];
						}
						//console.log(dataobj);
						window.App.login(dataobj, data);
					// }
				}, function(err){
					//console.log('i am here');
					//console.log(data);
					//console.log(data.message);
					//console.log(err.response.data);
					var data = err.response.data;
					console.log(data);
					var dataObj = JSON.parse(data);
					console.log(dataObj.message);
					document.getElementsByClassName('loginError')[0].innerHTML = dataObj.message;
					//this.submitButton.set('disabled', false);
					//var errorMessage = err.response.data.message;
					//console.log(errorMessage);
				})
			},
			startup: function(){
				this.prform = false;
				if(this._started){
					return;
				}
				this.inherited(arguments);
				var state = this.get("state")
				if((state == "Incomplete") || (state == "Error")){
					this.submitButton.set("disabled", true);
				}

				this.watch("state", function(prop, val, val2){
					if(val2 == "Incomplete" || val2 == "Error"){
						this.submitButton.set("disabled", true);
					}else{
						this.submitButton.set('disabled', false);
					}
				});

				if(!this.showCancel && this.cancelButton){
					domClass.add(this.cancelButton.domNode, "dijitHidden");
				}
				// this.gethelp();
				this._started = true;
				//this.forgotPW();
			},
			// forgotPW: function(){
			// 		var fpw = document.getElementsByClassName('forgotPW')[0];
			// 		fpw.addEventListener('click', this.makeFPform);
			// 		var fpw2 = document.getElementsByClassName('forgotPW')[1];
			// 		if(fpw2 !== undefined){
			// 		fpw2.addEventListener('click', this.makeFPform);
			// 	}
			// },
			makeFPform: function(){
				console.log('howdy');
				document.getElementsByClassName('loginForm')[0].style.display='none';
				document.getElementsByClassName('pwReset')[0].style.display='block';
				var loginf2 = document.getElementsByClassName('loginForm')[1];
				if(loginf2 !== undefined){
					var loginF1 = document.getElementsByClassName('loginForm')[0];
					var pwR1 = document.getElementsByClassName('pwReset')[0];
					//loginF1.style.display="block";
					loginF1.parentNode.removeChild(loginF1);
					pwR1.parentNode.removeChild(pwR1);
					loginf2.style.display='none';
					document.getElementsByClassName('pwReset')[0].style.display='block';
				}
			}
		});
	});
