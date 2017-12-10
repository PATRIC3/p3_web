define([
	"dojo/_base/declare", "dijit/_WidgetBase", "dojo/on",
	"dojo/dom-class", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/LoginForm.html", "dijit/form/Form", "dojo/request",
	"dojo/dom-form", "dojo/_base/lang"
], function(declare, WidgetBase, on,
			domClass, Templated, WidgetsInTemplate,
			Template, FormMixin, xhr,
			domForm, lang){
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
			//TODO set p3-user as env var
			var def = xhr.post("https://user.patricbrc.org/authenticate", {
				data: vals
				// data: vals,
				// withCredentials: true
			});
			def.then(function(data){
				console.log(data);
				var dataArr = data.split('|');
				var keyValueArr = [];
				console.log(dataArr);
				var dataobj =  {};
				for(var i = 0; i < dataArr.length; i++){
					keyValueArr = dataArr[i].split('=');
					//console.log(keyValueArr);
					dataobj[keyValueArr[0]] = keyValueArr[1];
				}
				console.log(dataobj);
				window.App.login(dataobj, data);
				//window.location.reload();
				//console.log(status);
			}, function(err){
				console.log(err);
			})
			//def.then(lang.hitch(this, function(results){
				//console.log("Login Results: ", results, arguments);
				//console.log(this);
				//console.log("Login Window location: ", window.location, window.location.query);
				//domClass.remove(this.domNode, "Working");
				//console.log("this.callbackURL", this.callbackURL);

				//window.location.reload();
      //
			// }), lang.hitch(this, function(err){
			// 	domClass.remove(this.domNode, "Working");
			// 	domClass.add(this.domNode, "Error");
			// 	this.submitButton.set('disabled', false);
			// }));
		},
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

			// this.gethelp();
			this._started = true;
		}
	});
});
