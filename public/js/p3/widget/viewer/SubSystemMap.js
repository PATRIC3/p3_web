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

			// taxon_id -> state.genome_ids or genome_id ->state.genome_ids
			if(state.hasOwnProperty('genome_ids')){
				state.genome_ids = state.genome_ids;
			} else if(state.hasOwnProperty('genome_id')){
				state.genome_ids = [state.genome_id];
			}

			var self = this;
			when(this.getGenomeIdsBySubsystemId(state.genome_ids, state.subsystem_id[0]), function(genomeIds){
				state.genome_ids = genomeIds;
				self.viewer.set('visible', true);
			});
				
			this.buildHeaderContent(state.subsystem_id[0]);

			window.document.title = 'Subsystem Map';
		},

		getGenomeIdsBySubsystemId: function(genome_ids, subsystem_id){

			var query = "and(in(genome_id,(" + genome_ids.join(',') + ")),in(subsystem_id,(" + subsystem_id + ")))&limit(1)&facet((field,genome_id),(mincount,1))&json(nl,map)";

			return when(request.post(PathJoin(window.App.dataAPI, '/subsystem/'), {
				handleAs: 'json',
				headers: {
					'Accept': "application/solr+json",
					'Content-Type': "application/rqlquery+x-www-form-urlencoded",
					'X-Requested-With': null,
					'Authorization': (window.App.authorizationToken || "")
				},
				data: query
			}), function(response){
				var genomeIdList = [];
				var genomeIds = response.facet_counts.facet_fields.genome_id;

				for (var key in genomeIds) {
					if (genomeIds.hasOwnProperty(key)) {
						genomeIdList.push(key);
					}
				}
				return genomeIdList;
			});
		},

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

			this.addChild(this.viewerHeader);
			this.addChild(this.viewer);
		}
	});
});
