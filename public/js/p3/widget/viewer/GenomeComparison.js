define([
	"dojo/_base/declare", "./JobResult",
], function(declare, JobResult){
	return declare([JobResult], {
		containerType: "GenomeComparison",
    getComparisonName: function(){
			return this.data.name;
		},
		setupResultType: function(){
			console.log("[GenomeComparison] setupResultType()");
			this._resultMetaTypes = {};
			this._appLabel = "Proteome Comparison";
			this._autoLabels = {};
		}
	});
});
