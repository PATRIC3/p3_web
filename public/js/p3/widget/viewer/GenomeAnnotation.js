define([
	"dojo/_base/declare", "./JobResult"
], function(declare, JobResult){
	return declare([JobResult], {
		containerType: "GenomeAnnotation",
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
		}
	});
});
