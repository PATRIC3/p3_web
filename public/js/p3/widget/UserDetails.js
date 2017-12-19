define([
	"dojo/_base/declare", "dijit/_WidgetBase", "dojo/on",
	"dojo/dom-class", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/UserDetails.html", "dijit/form/Form", "dojo/request",
	"dojo/dom-form", "dojo/_base/lang", "dojox/validate/web"
], function(declare, WidgetBase, on,
	domClass, Templated, WidgetsInTemplate,
	Template, FormMixin, xhr,
	domForm, lang, validate){
		return declare([WidgetBase, FormMixin, Templated, WidgetsInTemplate], {
			"baseClass": "App Sleep",
			templateString: Template,
			getUser: function(uid, thisForm){
				var userServiceURL = window.App.userServiceURL;
				userServiceURL.replace(/\/+$/, "");
				var def = xhr(userServiceURL + '/user/' + uid, {
					method: 'get',
					headers: {
						'Accept': 'application/json',
						'Authorization': window.App.authorizationToken
					}
				});
				def.then(function(data){
					//console.log(data);
					data = JSON.parse(data);
					thisForm.setValues(data);
				}, function(err){
					console.log(err);
					window.location.href = '/';
				})
			},
			startup: function(){
				console.log(window.location.href);
				var str = window.location.href;
				var strArr = str.split("/user/");
				console.log(strArr[1]);
				this.getUser(strArr[1], this);
				if(this._started){
					return;
				}
				this.inherited(arguments);
				this._started = true;
			}
		});
	});
