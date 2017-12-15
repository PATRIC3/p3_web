require({cache:{
'url:p3/widget/templates/LoginForm.html':"<div>\n  <div class=\"loginForm\" style=\"border: 2px\">\n    <form dojoAttachPoint=\"containerNode\" class=\"${baseClass} PanelForm\"\n    dojoAttachEvent=\"onreset:_onReset,onsubmit:_onSubmit,onchange:validate\">\n    <div style=\"padding:2px; margin:10px;\">\n      <input type=\"text\" name=\"username\" data-dojo-type=\"dijit/form/TextBox\" style=\"width:100%\" data-dojo-props='placeholder:\"Your Username or Email Address\"'><br/>\n    </div>\n    <div style=\"padding:2px;margin:10px;\">\n      <input type=\"password\" name=\"password\" data-dojo-type=\"dijit/form/TextBox\" style=\"width:100%\" data-dojo-props='placeholder:\"Your Password\"'>\n    </div>\n    <div class=\"messageContainer workingMessage\">\n      Logging into PATRIC....\n    </div>\n\n    <div class=\"messageContainer errorMessage\">\n      We were unable to log you in with the credentials provided.\n    </div>\n    <div style=\"text-align:center;padding:2px;margin:10px;\">\n      <div data-dojo-attach-point=\"cancelButton\" type=\"submit\" value=\"Submit\" data-dojo-type=\"dijit/form/Button\" class=\"dijitHidden\">Login</div>\n      <div data-dojo-attach-point=\"submitButton\" type=\"submit\" value=\"Submit\" data-dojo-type=\"dijit/form/Button\">Login</div>\n    </div>\n    <div style=\"font-size:.85em;\">\n      <!-- New to PATRIC?  <a href=\"/register\">REGISTER HERE</a> </br> -->\n      <a class=\"forgotPW\" data-dojo-attach-event=\"click: makeFPform\">Forgot Your password?</a>\n    </div>\n  </form>\n</div>\n<div class=\"pwReset\" style=\"display:none; max-width:200px; margin:auto; border:2px\">\n  <h2 style=\"margin:0px;padding:4px;font-size:1.2em;text-align:center;background:#eee;\">PASSWORD RESET</h2>\n  <p>&nbsp;</p>\n  <form>\n    <input data-dojo-attach-point=\"emailAddress\" style=\"width:100%\" type=\"email\" name=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='placeholder:\"Email Address\",promptMessage:\"Enter your Email Address\",invalidMessage:\"Invalid Email Address\",validator:dojox.validate.isEmailAddress,trim:true' required=\"true\" value=\"\">\n    <p>&nbsp;</p>\n    <div class=\"RSPWbutton\" data-dojo-attach-event=\"click: onResetClick\" style=\"margin:auto\" data-dojo-attach-point=\"resetPWbutton\" type=\"button\" data-dojo-type=\"dijit/form/Button\">Reset Password</div>\n  </form>\n</div>\n<div class=\"pwrMessage\" style=\"display:none; border:2px\">\n  <h2 style=\"margin:0px;padding:4px;font-size:1.2em;text-align:center;background:#eee;\">Your Password has been reset</h2>\n  <p>Please check your email for instructions to complete the reset process.</p>\n</div>\n<div class=\"pwrError\" style=\"text-align: center; padding: 2px; margin: 10px; border: 1px solid red; border-radius: 4px;display:none\">\n  Unable to reset the account with the provided email address\n</div>\n</div>\n"}});
define("p3/widget/LoginForm", [
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
				this.submitButton.set('disabled', true);
				var vals = this.getValues();
				var _self = this;
				var userServiceURL = window.App.userServiceURL;
				userServiceURL.replace(/\/+$/, "");
				var def = xhr.post(userServiceURL + '/authenticate', {
					data: vals
				});
				def.then(function(data){
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
				}, function(err){
					console.log(err);
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
