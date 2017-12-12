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
			// var def = xhr.post(userServiceURL + '/authenticate', {
			// 	data: vals
			// });
			// def.then(function(data){
			// 	//console.log(data);
			// 	var dataArr = data.split('|');
			// 	var keyValueArr = [];
			// 	//console.log(dataArr);
			// 	var dataobj =  {};
			// 	for(var i = 0; i < dataArr.length; i++){
			// 		keyValueArr = dataArr[i].split('=');
			// 		dataobj[keyValueArr[0]] = keyValueArr[1];
			// 	}
			// 	//console.log(dataobj);
			// 	window.App.login(dataobj, data);
			// }, function(err){
			// 	console.log(err);
			// })
		},
		// validator: function(){
		// 	console.log('validating ...');
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
			//var fname = document.getElementsByClassName('fname')[0];
			var userprofileStored = window.localStorage.getItem('userProfile');
			this.userprofileStored = JSON.parse(userprofileStored);
			this.setValues(this.userprofileStored);
			console.log(this.userprofileStored.first_name);

			// this.gethelp();
			this._started = true;
		}
	});
});
