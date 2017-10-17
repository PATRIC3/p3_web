define([
	"dojo/_base/declare", "dojo/_base/lang", "dojo/when", "dojo/request", "dojo/dom-construct",
	"dijit/layout/ContentPane",
	"./Base", "../../util/PathJoin", "../SubsystemMapContainer", "../../util/EncodeURIComponentExpanded"
], function(declare, lang, when, request, domConstruct,
			ContentPane,
			ViewerBase, PathJoin, SubsystemMapContainer, EncodeURIComponentExpanded){
	return declare([ViewerBase], {
		"disabled": false,
		"query": null,
		containerType: "transcriptomics_experiment",
		apiServiceUrl: window.App.dataAPI,

		subsystemName: "",
		subsystemClass: "",
		subclass: "",
		
		genomeIds: "",
		subsystemId: "",
		taxonId: "",

		onSetState: function(attr, oldVal, state){

			if(!state){
				return;
			}

			var subsystemData = this.getStateParams(state);

			state.genome_ids = subsystemData.genome_ids;
			state.genome_ids_arr = subsystemData.genome_ids.split(',');
			state.subsystem_id = subsystemData.subsystem_id

			var self = this;
			when(this.getGenomeIdsBySubsystemId(state.genome_ids_arr, state.subsystem_id), function(genomeIds){
				state.genome_ids = genomeIds;
				self.viewer.set('visible', true);
			});
				
			this.buildHeaderContent(state.subsystem_id);

			window.document.title = 'Subsystem Map';
		},

		getStateParams: function(state) {

			var search = state.search;

			var everythingAfterParam = /subsystem_id=(.*)/;
			var subsystem_id = everythingAfterParam.exec(search)[1];

			var everythingUpToParam = /^(.*?)&subsystem_id=/;
			var genomeIdsParam = everythingUpToParam.exec(search);
			var genome_ids = genomeIdsParam[1].replace("genome_ids=", "");

			//for taxon level
			if (genome_ids.indexOf('&') > -1)
			{
				var everythingAfterTaxonId = /taxon_id=(.*)/;
				var taxonString = genomeIdsParam[0];
				var taxonId = everythingAfterTaxonId.exec(taxonString);

				var everythingUpToTaxonid = /^(.*?)&/;
				this.taxonId = everythingUpToTaxonid.exec(taxonId[1])[1];

			  	var everythingUpAmpersand = /&(.*)/;
				var genome_ids_cleaned = everythingUpAmpersand.exec(genome_ids);
				genome_ids = genome_ids_cleaned[1];
			}

			this.genomeIds = genome_ids;
			this.subsystem_id = subsystem_id;

			var subsystemData = {};
			subsystemData.genome_ids = genome_ids;
			subsystemData.subsystem_id = subsystem_id;

			return subsystemData;
		},

		getStateParamsForSubClass: function(state) {
			var params = {};
			var qparts = state.search.split("&");
			qparts.forEach(function(qp){
				var parts = qp.split("=");
				params[parts[0]] = parts[1];
			});

			return params;
		},

		getGenomeIdsBySubsystemId: function(genome_ids, subsystem_id){

			var query = "q=genome_id:(" + genome_ids.join(" OR ") + ") AND subsystem_id:\"" + subsystem_id + "\"&rows=1&facet=true&facet.field=genome_id&facet.mincount=1&json.nl=map";
			
			return when(request.post(window.App.dataAPI + 'subsystem/', {
				handleAs: 'json',
				headers: {
					'Accept': "application/solr+json",
					'Content-Type': "application/solrquery+x-www-form-urlencoded",
					'X-Requested-With': null,
					'Authorization': window.App.authorizationToken
				},
				data: {
					q: query
				}
			}), function(response){

				this.subsystemName = response.response.docs[0].subsystem_name;
				this.subsystemClass = response.response.docs[0].class;
				this.subclass = response.response.docs[0].superclass;

				var genomeIdList = [];
				var genomeIds = response.facet_counts.facet_fields.genome_id;

				for (var key in genomeIds) {
					if (genomeIds.hasOwnProperty(key)) {
						genomeIdList.push(key);
					}
				}

				return genomeIdList;
			});

			// var encodedSubsystemId = EncodeURIComponentExpanded(subsystem_id);
			// var query = "and(in(genome_id,(" + genome_ids.join(" OR ") + ")),in(subsystem_id,(\"" + encodedSubsystemId + "\")))&limit(1)&facet((field,genome_id),(mincount,1))&json(nl,map)";

			// return when(request.post(PathJoin(window.App.dataAPI, 'subsystem/'), {
			// 	handleAs: 'json',
			// 	headers: {
			// 		'Accept': "application/rql+json",
			// 		'Content-Type': "application/rqlquery",
			// 		'X-Requested-With': null,
			// 		'Authorization': (window.App.authorizationToken || "")
			// 	},
			// 	data: query
			// }), function(response){

			// 	this.subsystemName = response.response.docs[0].subsystem_name;
			// 	this.subsystemClass = response.response.docs[0].class;
			// 	this.subclass = response.response.docs[0].superclass;

			// 	var genomeIdList = [];
			// 	var genomeIds = response.facet_counts.facet_fields.genome_id;

			// 	for (var key in genomeIds) {
			// 		if (genomeIds.hasOwnProperty(key)) {
			// 			genomeIdList.push(key);
			// 		}
			// 	}

			// 	return genomeIdList;
			// });
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

			var params = this.getStateParamsForSubClass(this.state);
			
			//subclass, class, subsystem name 
			var headerContent = domConstruct.create("div", {"class": "PerspectiveHeader"});
			domConstruct.place(headerContent, this.viewerHeader.containerNode, "last");
			domConstruct.create("i", {"class": "fa PerspectiveIcon icon-map-o"}, headerContent);
			domConstruct.create("div", {
				"class": "PerspectiveType",
				innerHTML: "Subsystem View - " + this.subsystemName + " - " + this.subsystemClass + " - " + this.subclass
			}, headerContent);

			this.queryNode = domConstruct.create("span", {"class": "PerspectiveQuery"}, headerContent);

			this.addChild(this.viewerHeader);
			this.addChild(this.viewer);
		}
	});
});
