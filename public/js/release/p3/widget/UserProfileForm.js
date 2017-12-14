require({cache:{
'url:p3/widget/templates/UserProfileForm.html':"\n<div class=\"UserProfileForm\" style=\"max-width:400px\">\n  <!-- <h1><%= results.first_name||results.id %>'s User Profile</h1> -->\n  <!-- <form data-dojo-type=\"p3/widget/UserProfileEditor\" data-dojo-props=\"userId:'<%= results.id %>'\"> -->\n  <form dojoAttachPoint=\"containerNode\" class=\"${baseClass} PanelForm\" dojoAttachEvent=\"onreset:_onReset,onsubmit:_onSubmit,onchange:validate\">\n    <table style=\"border-spacing:0\">\n      <tbody>\n        <tr><th style=\"padding:0\">FIRST NAME</th><th style=\"padding:0\">LAST NAME</th></tr>\n        <tr><td style=\"padding-top:0\">\n          <div style=\"width:100%\" data-dojo-type=\"dijit/form/TextBox\" name=\"first_name\" value=\"\"></div>\n\n        </td><td style=\"padding-top:0\">\n          <div data-dojo-type=\"dijit/form/TextBox\" style=\"width:100%\" name=\"last_name\" value=\"\"></div></td></tr>\n          <tr><th style=\"padding:0\">EMAIL ADDRESS</th><th class=\"usernamehdr\" style=\"padding:0\" data-dojo-attach-point=\"UNH\">USERNAME</th></tr>\n          <tr><td style=\"padding-top:0\">\n            <input type=\"text\" name=\"email\" style=\"width:100%\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='placeholder:\"Email Address\",promptMessage:\"Enter your Email Address\",invalidMessage:\"Invalid Email Address\",validator:dojox.validate.isEmailAddress,trim:true' required=\"true\" value=\"\">\n          </td><td style=\"padding-top:0\">\n            <input class=\"useridField\" type=\"text\" style=\"display:block\" name=\"username\" data-dojo-attach-point=\"UNF\" data-dojo-type=\"dijit/form/TextBox\" value=\"\" required=\"true\">\n          </td></tr>\n          <tr><th colspan=\"2\" style=\"padding:0\">ORGANIZATION</th></tr>\n          <tr><td colspan=\"2\" style=\"padding-top:0\"><div style=\"width:100%\" data-dojo-type=\"dijit/form/TextBox\" name=\"affiliation\" value=\"\"></div></td></tr>\n          <tr><th colspan=\"2\" style=\"padding:0\">ORGANISMS</th></tr>\n          <tr><td colspan=\"2\" style=\"padding-top:0\"><div name=\"organisms\" data-dojo-type=\"dijit/form/Textarea\" value=\"\"></div></td></tr>\n          <tr><th colspan=\"2\" style=\"padding:0\">INTERESTS</th></tr>\n          <tr><td colspan=\"2\" style=\"padding-top:0\"><div rows=\"5\" name=\"interests\" style=\"height:75px;max-width:99%\" data-dojo-type=\"dijit/form/SimpleTextarea\" value=\"\"></div></td></tr>\n        </tbody>\n      </table>\n      <div class=\"upSubmit\" style=\"position: absolute; right: 20px;\" data-dojo-attach-point=\"submitButton\" type=\"submit\" value=\"Submit\" data-dojo-type=\"dijit/form/Button\">Update Profile</div>\n      <div class=\"newSubmit\" style=\"position: absolute; right: 20px;display:none\" data-dojo-attach-point=\"submitButton\" type=\"submit\" value=\"Submit\" data-dojo-type=\"dijit/form/Button\">Submit</div>\n    </form>\n    <p>&nbsp;</p>\n    <p>&nbsp;</p>\n    <div class=\"changepwsection\" data-dojo-attach-point=\"changePWsec\">\n    <hr>\n        <p>&nbsp;</p>\n    <form dojoAttachPoint=\"containerNode\" class=\"${baseClass} PanelForm\" dojoAttachEvent=\"onreset:_onReset,onsubmit:_onSubmit,onchange:validate\">\n      <table>\n        <tbody>\n          <tr><th style=\"padding:0\">NEW PASSWORD</th></tr>\n          <tr><td style=\"padding-top:0\">\n            <input class=\"pw1field\" type=\"password\" style=\"display:block\" name=\"pw1\" data-dojo-attach-point=\"pw1\" data-dojo-type=\"dijit/form/TextBox\" value=\"\" required=\"true\" data-dojo-props=\"intermediateChanges: true\" data-dojo-attach-event=\"onChange: pwChanged\">\n          </td></tr>\n          <tr><th style=\"padding:0\">NEW PASSWORD (reenter)</th></tr>\n          <tr><td style=\"padding-top:0\">\n            <input class=\"pw2field\" type=\"password\" style=\"display:block\" name=\"pw2\" data-dojo-attach-point=\"pw2\" data-dojo-type=\"dijit/form/TextBox\" value=\"\" required=\"true\" data-dojo-props=\"intermediateChanges: true\" data-dojo-attach-event=\"onChange: pwChanged\">\n          </td></tr>\n        </tbody>\n      </table>\n      <div class=\"changePWbutton\" data-dojo-attach-event=\"click: onResetClick\" style=\"margin:auto\" data-dojo-attach-point=\"cPWbutton\" type=\"button\" data-dojo-type=\"dijit/form/Button\">Change Password</div>\n    </form>\n    <div class=\"pwError\" style=\"color:red; margin-top:20px;display:none\"><p>The passwords do not match, please fix</p></div>\n  </div>\n  </div>\n"}});
define("p3/widget/UserProfileForm", [
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
		pwChanged: function(evt){
			this.cPWbutton.set('disabled', true);
			console.log('I changed a pw field');
			if(this.pw1.get('value') !== '' && this.pw2.get('value') !== ''){
				this.cPWbutton.set('disabled', false);
			}
		},
		onResetClick: function(evt){
			console.log('I clicked the change password button');
			evt.preventDefault();
			evt.stopPropagation();
			domClass.add(this.domNode, "Working");
			domClass.remove(this.domNode, "Error");
			this.cPWbutton.set('disabled', true);
			if(this.pw1.get('value') !== this.pw2.get('value')){
				console.log('they do not match!');
				document.getElementsByClassName('pwError')[0].style.display="block";
				this.cPWbutton.set('disabled', false);
			}else{
				console.log('they match, yeah');
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
			console.log(vals);
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
