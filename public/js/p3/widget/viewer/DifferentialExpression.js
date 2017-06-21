define([
	"dojo/_base/declare", "./JobResult"
], function(declare, JobResult){
	return declare([JobResult], {
		containerType: "DifferentialExpression",
		getExperimentId: function(){
			return (this.data.path + this.data.name);
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

          this._resultObjects.forEach(function(o){
            if(o.type == 'diffexp_experiment' || o.type == 'diffexp_sample'){
              console.log("[DifferentialExpression] _resultObject:",o);
            }
					});

    			// var paths = this.data.autoMeta.output_files.filter(function(f){
    			// 	console.log("[DifferentialExpression] Filtering f: ", f);
    			// 	if(f instanceof Array){
    			// 		var path = f[0];
    			// 	}else{
    			// 		path = f;
    			// 	}
    			// 	if(path.match("sample.json")){
    			// 		return true
    			// 	}
    			// 	if(path.match("experiment.json")){
    			// 		return true
    			// 	}
    			// 	return false;
    			// }).map(function(f){
    			// 	if(f instanceof Array){
    			// 		return f[0];
    			// 	}
    			// 	return f;
    			// });
    			// paths.sort();
          //
    			// console.log("[DifferentialExpression] Experiment Sub Paths: ", paths);
          //
          // var bubbleUpMeta;
          // Object.keys(this._resultObjects).forEach(function(o){
          //   if(typeof o.data == 'string'){
          //     o.data = JSON.parse(o.data);
          //   }
					// });
          //
    			// WorkspaceManager.getObjects(paths).then(lang.hitch(this, function(objs){
    			// 	objs.forEach(function(obj){
    			// 		if(typeof obj.data == 'string'){
    			// 			obj.data = JSON.parse(obj.data);
    			// 		}
    			// 	});
    			// 	var experiment = objs[0].data;
    			// 	var samples = objs[1].data.sample;
          //
          //   bubbleUpMeta = {
      		// 		"scientific_name": (experiment.organism || "Undefined"),
          //     "pubmed_id": (experiment.pubmed || "Undefined"),
      		// 		"genes": (experiment.geneTotal - experiment.genesMissed) + "/" + experiment.geneTotal,
      		// 		"samples": experiment.samples
      		// 	};
          //
    			// }));

				}

			}, this);

			return job_output;
		}
	});
});
