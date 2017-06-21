define([
	"dojo/_base/declare", "../../WorkspaceManager", "dojo/_base/lang",
  "./Experiment", "./JobResult",
], function(declare, WorkspaceManager, lang, Experiment, JobResult){
	return declare([JobResult], {
		containerType: "DifferentialExpression",
		getExperimentId: function(){
			return (this.data.path + this.data.name);
		},
    getExperimentName: function(){
			return this.data.name;
		},
		setupResultType: function(){
			console.log("[DifferentialExpression] setupResultType()");
			this._resultMetaTypes = {"experiment": {"label": "Experiment"}};
			this._appLabel = "Differential Expression";
			this._autoLabels = {
				"scientific_name": {"label": "Platform Organism"},
        "pubmed_id": {"label": "Pubmed ID"},
				"genes": {"label": "Genes Mapped/Genes Total"},
				"samples": {"label": "Samples"}
			};
		},
    getExtraMetaDataForHeader: function(job_output){
			Object.keys(this._resultMetaTypes).forEach(function(metaType){
				console.log("[DifferentialExpression] _resultMetaTypes:",metaType);

				// add additional types to bubble up to the header
				if (metaType == 'experiment') {

          // get the paths for the files we want
          var paths = []
          this._resultObjects.forEach(function(o){
            if(o.type == 'diffexp_experiment' || o.type == 'diffexp_sample'){
              paths.push(o.path+o.name)
            }
					});
          console.log("[DifferentialExpression] paths:",paths);

          // get the actual files and pull the data we want
          WorkspaceManager.getObjects(paths).then(lang.hitch(this, function(objs){
    				objs.forEach(function(obj){
    					if(typeof obj.data == 'string'){
    						obj.data = JSON.parse(obj.data);
    					}
    				});
            this.experiment = objs[0].data;
          }));

          if (this.experiment) {
            // put it in a nice format
            bubbleUpMeta = {
              "scientific_name": (this.experiment.organism || "Undefined"),
              "pubmed_id": (this.experiment.pubmed || "Undefined"),
              "genes": (this.experiment.geneTotal - this.experiment.genesMissed) + "/" + this.experiment.geneTotal,
              "samples": this.experiment.samples
            };

            // create the lines for the table
            var subRecord = [];
            Object.keys(this._autoLabels).forEach(function(prop){
              console.log("[DifferentialExpression] _autoLabels:",prop);
              if(!bubbleUpMeta[prop] || prop == "inspection_started"){
                  return;
                }
              var label = this._autoLabels.hasOwnProperty(prop) ? this._autoLabels[prop]["label"] : prop;
              subRecord.push(label + " (" + bubbleUpMeta[prop] + ")");
            }, this);

            console.log("[DifferentialExpression] subRecord:",subRecord.join(","));
            job_output.push('<tr class="alt"><th scope="row" style="width:20%"><b>' + this._resultMetaTypes[metaType]["label"] + '</b></th><td class="last">' + subRecord.join(", ") + "</td></tr>");

  				}
        }
			}, this);

      console.log("[DifferentialExpression] job_output:",job_output);
			return job_output;
		}
	});
});
