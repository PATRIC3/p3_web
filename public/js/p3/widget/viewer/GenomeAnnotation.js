define([
	"dojo/_base/declare", "./JobResult"
], function(declare, JobResult){
	return declare([JobResult], {
		containerType: "GenomeAnnotation",
		getGenomeId: function(){
			var id;
			this._resultObjects.some(function(o){
				if(o.type == "genome"){
					console.log("[GenomeAnnotation] GENOME OBJECT: ", o);
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
		setupResultType: function(){
			console.log("[GenomeAnnotation] setupResultType()");
			this._resultMetaTypes = {"genome": {"label": "Genome"}};
			this._appLabel = "Genome Annotation";
			this._autoLabels = {
				"scientific_name": {"label": "Organism"},
				"domain": {"label": "Domain"},
				"num_features": {"label": "Feature count"},
				"genome_id": {"label": "Annotation ID"}
			};
		}
	});
});
