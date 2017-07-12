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
		containerType: "job_result",
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
		_setDataAttr: function(data){
			this.data = data;
			// console.log("[JobResult] data: ", data);
			this._hiddenPath = data.path + "." + data.name;
			// console.log("[JobResult] Output Files: ", this.data.autoMeta.output_files);
			var paths = this.data.autoMeta.output_files.map(function(o){
				return o[0];
			});

			// console.log("[JobResult] getObjects(): ", paths);
			WorkspaceManager.getObjects(paths, true).then(lang.hitch(this, function(objs){
				this._resultObjects = objs;
				// console.log("[JobResult] got objects: ", objs);
				this.setupResultType();
				this.refresh();
			}));
		},
		isSummaryView: function(){
			return false;
		},
		setupResultType: function(){
			// console.log("[JobResult] setupResultType()");
			if(this.data.autoMeta.app.id){
				this._resultType = this.data.autoMeta.app.id;
				// console.log("[JobResult] _resultType:",this._resultType);
			}
			if(this._resultType == "GenomeAssembly"){
				this._appLabel = "Genome Assembly";
			}
			else{
				this._appLabel = this._resultType;
			}
		},
		getExtraMetaDataForHeader: function(job_output){
			return job_output;
		},
		refresh: function(){
			// console.log("[JobResult] refresh()");
			if(this.data){
				var jobHeader = '<div style="width:100%"><div style="width:100%;" ><h3 style="color:#888;font-size:1.3em;font-weight:normal;" class="normal-case close2x"><span style="" class="wrap">';
				if(this.data.autoMeta && this.data.autoMeta.app){
					jobHeader = jobHeader + this._appLabel + " ";
				}
				jobHeader = jobHeader + "Job Result" + '</span></h3>';
				//this.viewer.set('content',jobHeader);

				var output = [];
				output.push(jobHeader + '<table style="width:90%" class="p3basic striped far2x" id="data-table"><tbody>');
				var job_output = [];

				// add extra metadata header lines
				job_output = this.getExtraMetaDataForHeader(job_output)

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
		},
		startup: function(){
			if(this._started){
				return;
			}
			this.inherited(arguments);
			this.viewHeader = new ContentPane({content: "View Header", region: "top", style:"width:90%;height:40%;"});
			//this.viewer= new ContentPane({content: "", region: "center"});
			this.viewer = new WorkspaceExplorerView({region: "center", path: this._hiddenPath});
			// console.log("[JobResult] WSV: ", this.viewer);
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
