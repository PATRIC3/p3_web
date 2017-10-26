define([
	"dojo/_base/declare", "dijit/_WidgetBase", "dojo/on",
	"dojo/dom-class", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/SelectionToGroup.html", "dojo/_base/lang",
	"../WorkspaceManager", "dojo/dom-style", "dojo/parser", "dijit/form/Select", "./WorkspaceFilenameValidationTextBox",
	"./WorkspaceObjectSelector", "dojo/when", "dojo/request", "../util/PathJoin"
], function(declare, WidgetBase, on,
			domClass, Templated, WidgetsInTemplate,
			Template, lang, WorkspaceManager, domStyle, Parser, Select, WorkspaceFilenameValidationTextBox, 
			WorkspaceObjectSelector, when, request, PathJoin){
	return declare([WidgetBase, Templated, WidgetsInTemplate], {
		"baseClass": "Panel",
		"disabled": false,
		templateString: Template,
		selection: null,
		path: null,
		type: "genome_group",
		idType: null,
		inputType: null,
		conversionTypes: {
			"feature_data": [{label: "Feature", value: "feature_group"}, {label: "Genome",value: "genome_group"}]
		},
		selectType: false,
		_setTypeAttr: function(t){
			this.type = t;
			if(this.workspaceObjectSelector){
				this.workspaceObjectSelector.set("type", [t]);
			}
		},

		_setPathAttr: function(path){
			this.path = path;
			if(this.groupNameBox){
				this.groupNameBox.set('path', this.path);
			}

			if(this.workspaceObjectSelector){
				this.workspaceObjectSelector.set("path", this.path);
			}
		},
		onChangeOutputType: function(){
			this.set('type', this.groupTypeSelect.get('value'));
			this.set("path", WorkspaceManager.getDefaultFolder(this.type));
			this.onChangeTarget(this.type);
			if(this.type == "genome_group"){
				this.idType = "genome_id";
			}
			else if(this.type == "feature_group"){
				this.idType = "feature_id";
			} 
		},

		onChangeTarget: function(target){
			console.log("onChangeTarget ");
			if(!this._started){
				return;
			}
			var targetType = this.targetType.get('value');
			var val;
			console.log("Target Type: ", targetType);
			if(targetType == "existing"){
				domClass.remove(this.workspaceObjectSelector.domNode, "dijitHidden");
				domClass.add(this.groupNameBox.domNode, "dijitHidden");
				val = this.workspaceObjectSelector.get('value');

			}else{
				domClass.add(this.workspaceObjectSelector.domNode, "dijitHidden");
				domClass.remove(this.groupNameBox.domNode, "dijitHidden");

				val = this.groupNameBox.isValid() ? this.groupNameBox.get('value') : false;
			}
			console.log("Target Val: ", val);
			this.value = val;
			if(val){
				this.copyButton.set('disabled', false);
			}else{
				this.copyButton.set('disabled', true);
			}
		},
		startup: function(){
			var _self = this;
			if(this._started){
				return;
			}
			var currentIcon;
			this.watch("selection", lang.hitch(this, function(prop, oldVal, item){
				console.log("set selection(): ", arguments);
			}));
			if(!this.path){
				this.set("path", WorkspaceManager.getDefaultFolder(this.type));
			}
			this.inherited(arguments);
			this.groupNameBox.set('path', this.path);
			this.workspaceObjectSelector.set('path', this.path);
			this.workspaceObjectSelector.set('type', [this.type]);
			if(this.inputType in this.conversionTypes){
				this.selectType = true;
				domClass.remove(this.groupTypeBox, "dijitHidden");
				this.groupTypeSelect.set("options", this.conversionTypes[this.inputType]);
				this.groupTypeSelect.set("value", this.conversionTypes[this.inputType][0]["value"]);
				this.groupTypeSelect.set("displayedValue", this.conversionTypes[this.inputType][0]["label"]);
			}
		},

		onCancel: function(evt){
			// console.log("Cancel/Close Dialog", evt)
			on.emit(this.domNode, "dialogAction", {action: "close", bubbles: true});
		},
		onCopy: function(evt){
			// console.log("Copy Selection: ", this.selection, " to ", this.value);
			//var idType = (this.type == "genome_group") ? "genome_id" : "feature_id"

			// for subsystems grab all associated features in async call
			if (this.selection[0] && this.selection[0].hasOwnProperty("subsystem_id")) {
				var genome_ids = this.selection.map(lang.hitch(this, function(g) {
					return g.genome_id
				}))

				//filter out non-unique genome_ids
				var unique_genome_ids = [];
			    for(var i = 0; i < genome_ids.length; i++) {
			        if(unique_genome_ids.indexOf(genome_ids[i]) === -1) {
			            unique_genome_ids.push(genome_ids[i]);
			        }
			    }
			   
				var subsystem_ids = this.selection.map(lang.hitch(this, function(s) {
					return s.subsystem_id
				}))

				var query = "q=genome_id:(" + unique_genome_ids.join(" OR ") + ") AND subsystem_id:(\"" + subsystem_ids.join("\" OR \"") + "\")&select(feature_id)&limit(25000)";
				var that = this;
				when(request.post(PathJoin(window.App.dataAPI, '/subsystem/'), {
					handleAs: 'json',
					headers: {
						'Accept': "application/solr+json",
						'Content-Type': "application/solrquery+x-www-form-urlencoded",
						'X-Requested-With': null,
						'Authorization': (window.App.authorizationToken || "")
					},
					data: query
				}), function(response){
					
					that.idType = "feature_id";
					var def;
					if(that.targetType.get("value") == "existing"){
						def = WorkspaceManager.addToGroup(that.value, that.idType, response.response.docs);
					}else{
						def = WorkspaceManager.createGroup(that.value, that.type, that.path, that.idType, response.response.docs);
					}
					def.then(lang.hitch(that, function(){
						on.emit(that.domNode, "dialogAction", {action: "close", bubbles: true});
					}));
					
				});
			} else {
				if(!this.idType){
					this.idType = "genome_id";
					if(this.type == "genome_group"){
						this.idType = "genome_id";
					}
					else if(this.type == "feature_group"){
						this.idType = "feature_id";
					}
					else if(this.type == "experiment_group"){
						this.idType = "eid";
					}
				}

				var def;
				if(this.targetType.get("value") == "existing"){
					def = WorkspaceManager.addToGroup(this.value, this.idType, this.selection.filter(lang.hitch(this, function(d){
						return this.idType in d
					})).map(lang.hitch(this, function(o){
						return o[this.idType];
					})));
				}else{
					def = WorkspaceManager.createGroup(this.value, this.type, this.path, this.idType, this.selection.filter(lang.hitch(this, function(d){
						return this.idType in d
					})).map(lang.hitch(this, function(o){
						return o[this.idType];
					})));
				}
				def.then(lang.hitch(this, function(){
					on.emit(this.domNode, "dialogAction", {action: "close", bubbles: true});
				}));
			}
		}
	});
});
