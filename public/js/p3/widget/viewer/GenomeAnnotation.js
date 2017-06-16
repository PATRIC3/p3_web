define([
	"dojo/_base/declare", "dijit/layout/BorderContainer", "dojo/on",
	"dojo/dom-class", "dijit/layout/ContentPane", "dojo/dom-construct",
	"../PageGrid", "../formatter", "../../WorkspaceManager", "dojo/_base/lang",
	"dojo/dom-attr","../WorkspaceExplorerView"
], function(declare, BorderContainer, on,
			domClass, ContentPane, domConstruct,
			Grid, formatter, WorkspaceManager, lang,
			domAttr, WorkspaceExplorerView){
	return declare([BorderContainer], {
		"baseClass": "ExperimentViewer",
		"disabled": false,
		"query": null,
		data: null,
		containerType: "GenomeAnnotation",
		_resultType: null,
		_jobOut: {
			"start_time": {"label": "Start time", "format": formatter.epochDate},
			"elapsed_time": {"label": "Run time", "format": formatter.runTime},
			"end_time": {"label": "End time", "format": formatter.epochDate},
			"parameters": {"label": "Parameters", "format": function(d){ return '<pre style="font-size:.8em;">' + JSON.stringify(d,null,2) + "</pre>"}}
		},
		_jobOrder: ["start_time", "end_time", "elapsed_time", "parameters"],
		_appLabel: "",
		_resultMetaTypes: {},
		_autoLabels: {},
		getGenomeId: function(){
			var id;
			this._resultObjects.some(function(o){
				if(o.type == "genome"){
					console.log("GENOME OBJECT: ", o);
					id = o.autoMeta.genome_id;
					console.log("Id: ", id);
					return true;
				}
				return false;
			});
			if(id){
				return id;
			}
			throw Error("Missing ID");
		},
		_setDataAttr: function(data){
			this.data = data;
			console.log("job result viewer data: ", data);
			this._hiddenPath = data.path + "." + data.name;
			var paths = this.data.autoMeta.output_files.map(function(o){
				return o[0];
			});

			WorkspaceManager.getObjects(paths, true).then(lang.hitch(this, function(objs){
				this._resultObjects = objs;
				console.log("got objects: ", objs);
				this.setupResultType();
				this.refresh();
			}));

		},
		setupResultType: function(){
			if(this.data.autoMeta.app.id){
				this._resultType = this.data.autoMeta.app.id;
			}
			if(this._resultType == "GenomeAnnotation"){
				this._resultMetaTypes = {"genome": {"label": "Genome"}};
				this._appLabel = "Genome Annotation";
				this._autoLabels = {
					"scientific_name": {"label": "Organism"},
					"domain": {"label": "Domain"},
					"num_features": {"label": "Feature count"},
					"genome_id": {"label": "Annotation ID"}
				};
			}
			if(this._resultType == "GenomeAssembly"){
				this._appLabel = "Genome Assembly";
			}
		},
		refresh: function(){
			if(this.data){
				var jobHeader = '<div><h3 class="section-title-plain close2x">';
				if(this.data.autoMeta && this.data.autoMeta.app){
					jobHeader = jobHeader + this._appLabel + " ";
				}
				jobHeader = jobHeader + "Job Result" + '</span></h3>';
				//this.viewer.set('content',jobHeader);

				var output = [];
				output.push(jobHeader + '<table class="p3basic striped far2x" id="data-table"><tbody>');
				var job_output = [];

				if(this.data.autoMeta){
					this._jobOrder.forEach(function(prop){
						/*if (prop=="output_files") { return; }
						if (prop=="app") { return; }
						if (prop=="job_output") { return; }
						if (prop=="hostname") { return; }*/
						if(!this.data.autoMeta[prop]){
							return;
						}
						if(this._jobOut.hasOwnProperty(prop)){
							//this._jobOut[prop]["value"]=this.data.autoMeta[prop];
							var tableLabel = this._jobOut[prop].hasOwnProperty("label") ? this._jobOut[prop]["label"] : prop;
							var tableValue = this._jobOut[prop].hasOwnProperty("format") ? this._jobOut[prop]["format"](this.data.autoMeta[prop]) : this.data.autoMeta[prop];
							job_output.push('<tr class="alt"><th scope="row" style="width:20%"><b>' + this._jobOut[prop]["label"] + '</b></th><td class="last">' + tableValue + "</td></tr>");
						}
					}, this);
				}

				output.push.apply(output, job_output);
				output.push("</tbody></table></div>");

				if(this.data.userMeta){
					Object.keys(this.data.userMeta).forEach(function(prop){
						output.push("<div>" + prop + ": " + this.data.userMeta[prop] + "</div>");
					}, this);
				}

				output.push("</div>");
				this.viewHeader.set("content", output.join(""));
 				this.resize();
			}
		},
		startup: function(){
			if(this._started){
				return;
			}
			this.inherited(arguments);
			this.viewHeader = new ContentPane({content: "View Header", region: "top", style:"width:90%;"});
			//this.viewer= new ContentPane({content: "", region: "center"});
			this.viewer = new WorkspaceExplorerView({region: "center", path: this._hiddenPath});
			console.log("WSV: ", this.viewer);
			this.addChild(this.viewHeader);
			this.addChild(this.viewer);

			this.on("i:click", function(evt){
				var rel = domAttr.get(evt.target, 'rel');
				if(rel){
					WorkspaceManager.downloadFile(rel);
				}else{
					console.warn("link not found: ", rel);
				}
			});
		}
	});
});
