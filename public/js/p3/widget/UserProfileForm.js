define([
	"dojo/_base/declare", "dijit/_WidgetBase", "dojo/on",
	"dojo/dom-class", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/UserProfileForm.html", "dijit/form/Form", "dojo/request",
	"dojo/dom-form", "dojo/_base/lang", "dojox/validate/web"
], function(declare, WidgetBase, on,
	domClass, Templated, WidgetsInTemplate,
	Template, FormMixin, xhr,
	domForm, lang, validate){
		return declare([WidgetBase, FormMixin, Templated, WidgetsInTemplate], {
			"baseClass": "App Sleep",
			templateString: Template,
			callbackURL: "",
			fieldChanged: function(evt){
				this.submitButton.set('disabled', true);
				//console.log('this is the email field');
				//console.log(this.emailField);
				if(this.UNF.get('value') !== '' && this.emailField.state === '' && this.fname.get('value') !== '' && this.lname.get('value') !== ''){
					this.submitButton.set('disabled', false);
				}
			},
			pwChanged: function(evt){
				this.cPWbutton.set('disabled', true);
				//console.log('I changed a pw field');
				if(this.pw1.get('value') !== '' && this.pw2.get('value') !== ''){
					this.cPWbutton.set('disabled', false);
				}
			},
			onResetClick: function(evt){
				//console.log('I clicked the change password button');
				evt.preventDefault();
				evt.stopPropagation();
				domClass.add(this.domNode, "Working");
				domClass.remove(this.domNode, "Error");
				this.cPWbutton.set('disabled', true);
				if(this.pw1.get('value') !== this.pw2.get('value')){
					//console.log('they do not match!');
					document.getElementsByClassName('pwError')[0].style.display="block";
					this.cPWbutton.set('disabled', false);
				}else{
					console.log('they match, yeah');
				}
			},
			onSubmit: function(evt){
				//console.log('I clicked the button');
				evt.preventDefault();
				evt.stopPropagation();
				domClass.add(this.domNode, "Working");
				domClass.remove(this.domNode, "Error");
				this.submitButton.set('disabled', true);
				var vals = this.getValues();
				var _self = this;
				this.userServiceURL = window.App.userServiceURL;
				this.userServiceURL.replace(/\/+$/, "");
				//console.log(vals);
				if(this.auth){
					this.runPatch(vals);
				} else{
					this.createNewUser(vals);
				}
			},
			createNewUser: function(vals){
				//console.log(vals);
				var def = xhr(this.userServiceURL + '/register', {
					data: vals,
					method: 'post',
					headers: {
						'Accept': 'application/json'
					}
				});
				def.then(function(data){
					console.log(data);
					// var dataArr = data.split('|');
					// var keyValueArr = [];
					// //console.log(dataArr);
					// var dataobj =  {};
					// for(var i = 0; i < dataArr.length; i++){
					// 	keyValueArr = dataArr[i].split('=');
					// 	dataobj[keyValueArr[0]] = keyValueArr[1];
					// }
					//console.log(dataobj);
					//window.App.login(dataobj, data);
				}, function(err){
					console.log(err);
				})
			},
			runPatch: function(vals){
				//build patch
				var patchObj = {};
				if(vals.affiliation !== this.userprofileStored.affiliation){
					patchObj.affiliation = vals.affiliation;
				}
				if(vals.email !== this.userprofileStored.email){
					patchObj.email = vals.email;
				}
				if(vals.first_name !== this.userprofileStored.first_name){
					patchObj.first_name = vals.first_name;
				}
				if(vals.last_name !== this.userprofileStored.last_name){
					patchObj.last_name = vals.last_name;
				}
				if(vals.interests !== this.userprofileStored.interests){
					patchObj.interests = vals.interests;
				}
				if(vals.organisms !== this.userprofileStored.organisms){
					patchObj.organisms = vals.organisms;
				}
				console.log(patchObj);
				var def = xhr(this.userServiceURL + '/user/' + window.localStorage.userid, {
					data: patchObj,
					method: 'patch',
					headers: {
						'Accept': 'application/json',
						'Authorization': window.localStorage.getItem('tokenstring')
					}
				});
				def.then(function(data){
					console.log(data);
					// var dataArr = data.split('|');
					// var keyValueArr = [];
					// //console.log(dataArr);
					// var dataobj =  {};
					// for(var i = 0; i < dataArr.length; i++){
					// 	keyValueArr = dataArr[i].split('=');
					// 	dataobj[keyValueArr[0]] = keyValueArr[1];
					// }
					//console.log(dataobj);
					//window.App.login(dataobj, data);
				}, function(err){
					console.log(err);
				})
			},
			// postCreate: function(){
			// 	this.inherited(arguments);
			// 	this.UNH.destroy;
			// 	this.UNF.destroy;
			// },
			startup: function(){
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

				//console.log(window.App.authorizationToken);
				if(window.App.authorizationToken !== null && window.App.authorizationToken !== undefined){
					this.auth = true;
					var userprofileStored = window.localStorage.getItem('userProfile');
					this.userprofileStored = JSON.parse(userprofileStored);
					this.setValues(this.userprofileStored);
					var uidfield = document.getElementsByClassName('useridField')[0];
					uidfield.parentNode.removeChild(uidfield);
					var usernamehdr = document.getElementsByClassName('usernamehdr')[0];
					usernamehdr.parentNode.removeChild(usernamehdr);
				} else {
					this.auth = false;
					document.getElementsByClassName('upSubmit')[0].style.display = 'none';
					document.getElementsByClassName('newSubmit')[0].style.display = 'block';
					var changepwsection = document.getElementsByClassName('changepwsection')[0];
					changepwsection.parentNode.removeChild(changepwsection);
					// document.getElementsByClassName('useridField')[0].style.display = 'block';
					// document.getElementsByClassName('usernamehdr')[0].style.display = 'block';
				}
				//console.log(this.userprofileStored.first_name);

				// this.gethelp();
				this._started = true;
				this.cPWbutton.set('disabled', true);
			}
		});
	});
