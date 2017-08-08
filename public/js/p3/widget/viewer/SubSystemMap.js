define([
	"dojo/_base/declare", "dojo/_base/lang", "dojo/when", "dojo/request", "dojo/dom-construct",
	"dijit/layout/ContentPane",
	"./Base", "../../util/PathJoin", "../SubsystemMapContainer"
], function(declare, lang, when, request, domConstruct,
			ContentPane,
			ViewerBase, PathJoin, SubsystemMapContainer){
	return declare([ViewerBase], {
		"disabled": false,
		"query": null,
		containerType: "transcriptomics_experiment",
		apiServiceUrl: window.App.dataAPI,

		onSetState: function(attr, oldVal, state){
			// console.log("subsystemMap onSetState", state);

			if(!state){
				return;
			}

			var params = {};
			var qparts = state.search.split("&");
			qparts.forEach(function(qp){
				var parts = qp.split("=");
				params[parts[0]] = parts[1].split(",");
			});
			state = lang.mixin(state, params);

			// if(!state.taxon_id) return;

			// taxon_id -> state.genome_ids or genome_id ->state.genome_ids
			if(state.hasOwnProperty('genome_ids')){
				state.genome_ids = state.genome_ids;
				this.viewer.set('visible', true);
			} else if(state.hasOwnProperty('genome_id')){
				state.genome_ids = [state.genome_id];
				this.viewer.set('visible', true);
			}
						// else if(state.hasOwnProperty('genome_ids')){
			// 	this.viewer.set('visible', true);
			// }

			
			// if(state.hasOwnProperty('feature_id')){
			// 	this.viewer.set('visible', true);
			// }
			
			var self = this;
			when(this.getGenomeIdsByFeatureId(state.taxon_id), function(genomeIds){
				state.genome_ids = genomeIds;
				self.viewer.set('visible', true);
			});


			// update header
			this.buildHeaderContent(state.subsystem_id[0]);

			// update page title
			window.document.title = 'Subsystem Map';
		},

	// $ curl -X POST -H 'Content-Type: application/jsonrpc+json' 
	// -d '{"id”:1,"method":"subSystem","params":[{"genomeIds":["83332.12"]},{"token":""}],
	//"jsonrpc":"2.0"}' 'https://www.alpha.patricbrc.org/api/‘
		getGenomeIdsByFeatureId: function(taxon_id){

			var query = "?eq(taxon_lineage_ids," + taxon_id + ")&select(genome_id)&limit(25000)";
			return when(request.get(PathJoin(this.apiServiceUrl, "genome", query), {
				headers: {
					'Accept': "application/json",
					'Content-Type': "application/rqlquery+x-www-form-urlencoded"
				},
				handleAs: "json"
			}), function(response){
				return response.map(function(d){
					return d.genome_id;
				});
			});
		},

		// getGenomeIdsByTaxonId: function(taxon_id){

		// 	var query = "?eq(taxon_lineage_ids," + taxon_id + ")&select(genome_id)&limit(25000)";
		// 	return when(request.get(PathJoin(this.apiServiceUrl, "genome", query), {
		// 		headers: {
		// 			'Accept': "application/json",
		// 			'Content-Type': "application/rqlquery+x-www-form-urlencoded"
		// 		},
		// 		handleAs: "json"
		// 	}), function(response){
		// 		return response.map(function(d){
		// 			return d.genome_id;
		// 		});
		// 	});
		// },

		buildHeaderContent: function(mapId){
			var self = this;
			var query = "?eq(Subsystem_id," + mapId + ")&limit(1)";
			// return when(request.get(PathJoin(this.apiServiceUrl, "Subsystem_ref", query), {
			// 	headers: {
			// 		'Accept': "application/json",
			// 		'Content-Type': "application/rqlquery+x-www-form-urlencoded"
			// 	},
			// 	handleAs: "json"
			// }), function(response){
			// 	var p = response[0];

			// 	self.queryNode.innerHTML = "<b>" + p.Subsystem_id + " | " + p.Subsystem_name + "</b>";
			// });
		},

		postCreate: function(){
			if(!this.state){
				this.state = {};
			}

			this.inherited(arguments);

			this.viewer = new SubsystemMapContainer({
				region: "center",
				state: this.state,
				apiServer: this.apiServiceUrl
			});

			this.viewerHeader = new ContentPane({
				content: "",
				region: "top"
			});
			var headerContent = domConstruct.create("div", {"class": "PerspectiveHeader"});
			domConstruct.place(headerContent, this.viewerHeader.containerNode, "last");
			domConstruct.create("i", {"class": "fa PerspectiveIcon icon-map-o"}, headerContent);
			domConstruct.create("div", {
				"class": "PerspectiveType",
				innerHTML: "Subsystem View"
			}, headerContent);

			this.queryNode = domConstruct.create("span", {"class": "PerspectiveQuery"}, headerContent);

			// this.totalCountNode = domConstruct.create("span", {
			// 	"class": "PerspectiveTotalCount",
			// 	innerHTML: "( loading... )"
			// }, headerContent);

			this.addChild(this.viewerHeader);
			this.addChild(this.viewer);
		}
	});
});
