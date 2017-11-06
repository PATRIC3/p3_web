define([
	"dojo/_base/declare", "./GridContainer", "dojo/on",
	"./SubSystemsMemoryGrid", "dijit/popup", "dojo/topic", "dojo/request", "dojo/when",
	"dijit/TooltipDialog", "./FilterContainerActionBar", "FileSaver", "../util/PathJoin",
	"dojo/_base/lang", "dojo/dom-construct", "./PerspectiveToolTip",
	"./SelectionToGroup", "dijit/Dialog", "./DownloadTooltipDialog", "dojo/_base/Deferred"

], function(declare, GridContainer, on,
			SubSystemsGrid, popup, Topic, request, when,
			TooltipDialog, ContainerActionBar, saveAs, PathJoin,
			lang, domConstruct, PerspectiveToolTipDialog,
			SelectionToGroup, Dialog, DownloadTooltipDialog, Deferred){

	var vfc = '<div class="wsActionTooltip" rel="dna">View FASTA DNA</div><div class="wsActionTooltip" rel="protein">View FASTA Proteins</div><hr><div class="wsActionTooltip" rel="dna">Download FASTA DNA</div><div class="wsActionTooltip" rel="downloaddna">Download FASTA DNA</div><div class="wsActionTooltip" rel="downloadprotein"> ';
	var viewFASTATT = new TooltipDialog({
		content: vfc, onMouseLeave: function(){
			popup.close(viewFASTATT);
		}
	});

	on(viewFASTATT.domNode, "click", function(evt){
		var rel = evt.target.attributes.rel.value;
		var sel = viewFASTATT.selection;
		delete viewFASTATT.selection;
		var idType;

		var ids = sel.map(function(d, idx){
			if(!idType){
				if(d['feature_id']){
					idType = "feature_id";
				}else if(d['patric_id']){
					idType = "patric_id"
				}else if(d['alt_locus_tag']){
					idType = "alt_locus_tag";
				}
			}

			return d[idType];
		});

		Topic.publish("/navigate", {href: "/view/FASTA/" + rel + "/?in(" + idType + ",(" + ids.map(encodeURIComponent).join(",") + "))", target: "blank"});
	});

	var downloadSelectionTT = new DownloadTooltipDialog({});
	downloadSelectionTT.startup();

	var dfc = '<div>Download Table As...</div><div class="wsActionTooltip" rel="text/tsv">Text</div><div class="wsActionTooltip" rel="text/csv">CSV</div>';
	var downloadTT = new TooltipDialog({
		content: dfc, onMouseLeave: function(){
			popup.close(downloadTT);
		}
	});

	on(downloadTT.domNode, "div:click", lang.hitch(function(evt){
		var rel = evt.target.attributes.rel.value;
		var data = downloadTT.get("data");
		var headers = downloadTT.get("headers");
		var filename = downloadTT.get("filename");

		var DELIMITER, ext;
		if(rel === 'text/csv'){
			DELIMITER = ',';
			ext = 'csv';
		}else{
			DELIMITER = '\t';
			ext = 'txt';
		}

		var content = data.map(function(d){
			return d.join(DELIMITER);
		});

		saveAs(new Blob([headers.join(DELIMITER) + '\n' + content.join('\n')], {type: rel}), filename + '.' + ext);

		popup.close(downloadTT);
	}));

	var firstView = true;

	return declare([GridContainer], {
		gridCtor: SubSystemsGrid,
		containerType: "subsystem_data",
		enableFilterPanel: true,
		apiServer: window.App.dataServiceURL,
		store: null,
		visible: true,
		dataModel: "subsystem",
		type: "subsystem",
		primaryKey: "id",
		maxDownloadSize: 25000,
		typeMap: {
			"subsystems": "subsystem_id",
			"role_id": "role_id",
			"genes": "feature_id"
		},
		_setQueryAttr: function(query){
			// override _setQueryAttr since we're going to build query inside PathwayMemoryStore
		},

		buildQuery: function(){
			return "";
		},

		_setStoreAttr: function(store){
			if(this.grid){
				this.grid.store = store;
			}
			this._set('store', store);
		},

		// not needed unless future requirements change
		// getGenomeIds: function(data){

		// 	var def = new Deferred();
		// 	if(data.hasOwnProperty('taxon_id')){

		// 		var taxon_ids = data.selection.map(function(row) {
		// 			return row.taxon_id;
		// 		})

		// 		var query = "?eq(taxon_lineage_ids," + taxon_ids.join(" OR ") + ")&select(genome_id)&limit(25000)";
		// 		return when(request.get(PathJoin(this.apiServer, "genome", query), {
		// 			headers: {
		// 				'Accept': "application/json",
		// 				'Content-Type': "application/rqlquery+x-www-form-urlencoded"
		// 			},
		// 			handleAs: "json"
		// 		}), function(response){

		// 			var genome_ids = response.map(function(d){
		// 				return d.genome_id;
		// 			});
					
		// 			def.resolve(genome_ids);
		// 			return def.promise;
		// 		});
		// 	} else {
		// 		var genome_ids = data.selection.map(function(s){
		// 			return s.genome_id
		// 		});
		// 		def.resolve(genome_ids);
		// 		return def.promise;
		// 	}
		// },

		createFilterPanel: function(){
			
			if(this.type === 'genes'){
				this.inherited(arguments)
			} else {
				var _self = this;
				this.containerActionBar = this.filterPanel = new ContainerActionBar({
					region: "top",
					layoutPriority: 7,
					splitter: true,
					"className": "BrowserHeader",
					dataModel: this.dataModel,
					facetFields: this.facetFields,
					currentContainerWidget: this,
					_setQueryAttr: function(query){
						var p = _self.typeMap[_self.type];
						query = query + "&limit(25000)&group((field," + p + "),(format,simple),(ngroups,true),(limit,1),(facet,true))";
						this._set("query", query);
						this.getFacets(query).then(lang.hitch(this, function(facets){
							if(!facets){
								return;
							}
							if (firstView) {
								firstView = false;
								Object.keys(facets).forEach(function(cat){
								if(this._ffWidgets[cat]){
									var selected = this.state.selected;
									this._ffWidgets[cat].set('data', facets[cat], selected);
								}else{

								}
								}, this);
							}
						}));
					}
				});

				this.filterPanel.watch("filter", lang.hitch(this, function(attr, oldVal, newVal){
					if((oldVal != newVal) && (newVal != this.state.hashParams.filter)){
						on.emit(this.domNode, "UpdateHash", {
							bubbles: true,
							cancelable: true,
							hashProperty: "filter",
							value: newVal,
							oldValue: oldVal
						})
					}
				}));
			}
		},

		containerActions: GridContainer.prototype.containerActions.concat([
			[
				"DownloadTable",
				"fa icon-download fa-2x",
				{
					label: "DOWNLOAD",
					multiple: false,
					validTypes: ["*"],
					tooltip: "Download Table",
					tooltipDialog: downloadTT
				},
				function(){

					downloadTT.set("content", dfc);

					var data = this.grid.store.query("", {});
					var headers, content = [], filename;

					switch(this.type){

						case "subsystems":
							headers = [
									"Superclass",
									"Class",
									"Subclass",
									"Subsystem Name",
									//"Genome Count",
									"Gene Count",
									"Role Count",
									"Active"

								]

							data.forEach(function(row){
								content.push([
									JSON.stringify(row.superclass),
									JSON.stringify(row['class']),
									JSON.stringify(row.subclass),
									JSON.stringify(row.subsystem_name),
									//JSON.stringify(row.genome_count),
									JSON.stringify(row.gene_count),
									JSON.stringify(row.role_count),
									JSON.stringify(row.active)
									
								]);
							});
							filename = "PATRIC_subsystems";
							break;

						case "genes":
							headers = [
									"Superclass",
									"Class",
									"Subclass",
									"Subsystem Name",
									"Role ID",
									"Role Name",
									"Active",
									"Patric ID",
									"Gene",
									"Product"
								]

							data.forEach(function(row){
								content.push([
									JSON.stringify(row.superclass),
									JSON.stringify(row['class']),
									JSON.stringify(row.subclass),
									JSON.stringify(row.subsystem_name),
									JSON.stringify(row.role_id),
									JSON.stringify(row.role_name),
									JSON.stringify(row.active),
									JSON.stringify(row.patric_id),
									JSON.stringify(row.gene),
									JSON.stringify(row.product)
								]);
							});
							filename = "PATRIC_subsystems";
							break;

						default:
							break;
					}

					downloadTT.set("data", content);
					downloadTT.set("headers", headers);
					downloadTT.set("filename", filename);

					popup.open({
						popup: this.containerActionBar._actions.DownloadTable.options.tooltipDialog,
						around: this.containerActionBar._actions.DownloadTable.button,
						orient: ["below"]
					});
				},
				true
			]
		]),
		
		selectionActions: GridContainer.prototype.selectionActions.concat([

			[
				"ViewFASTA",
				"fa icon-fasta fa-2x",
				{
					label: "FASTA",
					ignoreDataType: true,
					multiple: true,
					validTypes: ["*"],
					max: 5000,
					tooltip: "View FASTA Data",
					tooltipDialog: viewFASTATT,
					validContainerTypes: ["subsystem_data"]
				},
				function(selection){

					var subsystem_ids = selection.map(function(s){
						return s.subsystem_id
					});

					var query = "q=genome_id:(" + this.state.genome_ids.join(" OR ") + ") AND subsystem_id:(\"" + subsystem_ids.join("\" OR \"") + "\")&fl=feature_id&rows=25000";
					var that = this;
					when(request.post(PathJoin(window.App.dataAPI, '/subsystem/'), {
						handleAs: 'json',
						headers: {
							'Accept': "application/solr+json",
							'Content-Type': "application/solrquery+x-www-form-urlencoded",
							'X-Requested-With': null,
							'Authorization': (window.App.authorizationToken || "")
						},
						data: query
					}), function(response){

						var feature_ids = response.response.docs.map(function(feature) {
							return {"feature_id": feature.feature_id}
						})
						viewFASTATT.selection = feature_ids;
						popup.open({
							popup: that.selectionActionBar._actions.ViewFASTA.options.tooltipDialog,
							around: that.selectionActionBar._actions.ViewFASTA.button,
							orient: ["below"]
						});
					});
				},
				false
			],

			[
				"DownloadSelection",
				"fa icon-download fa-2x",
				{
					label: "DWNLD",
					multiple: true,
					validTypes: ["*"],
					ignoreDataType: true,
					tooltip: "Download Selection",
					max: 10000,
					tooltipDialog: downloadSelectionTT,
					validContainerTypes: ["subsystem_data"]
				},
				function(selection, container){


					var selectedRows = [];

					switch(this.type){

						case "subsystems":

							selection.forEach(function(row) {
								var selectedRow = {};

								selectedRow["Superclass"] = row["superclass"];
								selectedRow["Class"] = row["class"];
								selectedRow["Subclass"] = row["subclass"];
								selectedRow["Subsystem Name"] = row["subsystem_name"];
								selectedRow["Gene Count"] = row["gene_count"];
								selectedRow["Role Count"] = row["role_count"];
								selectedRow["Active"] = row["active"];

								selectedRows.push(selectedRow)
							})

							break;

						case "genes":


							selection.forEach(function(row) {
								var selectedRow = {};

								selectedRow["Superclass"] = row["superclass"];
								selectedRow["Class"] = row["class"];
								selectedRow["Subclass"] = row["subclass"];
								selectedRow["Subsystem Name"] = row["subsystem_name"];
								selectedRow["Role ID"] = row["role_id"];
								selectedRow["Role Name"] = row["role_name"];
								selectedRow["Active"] = row["active"];
								selectedRow["Patric Id"] = row["patric_id"];
								selectedRow["Gene"] = row["gene"];
								selectedRow["Product"] = row["product"];

								selectedRows.push(selectedRow)
							})
							break;

						default:
							break;
					}

					this.selectionActionBar._actions.DownloadSelection.options.tooltipDialog.set("selection", selectedRows);
					this.selectionActionBar._actions.DownloadSelection.options.tooltipDialog.set("containerType", this.containerType);
					if(container && container.grid){
						this.selectionActionBar._actions.DownloadSelection.options.tooltipDialog.set("grid", container.grid);
					}

					this.selectionActionBar._actions.DownloadSelection.options.tooltipDialog.timeout(3500);

					setTimeout(lang.hitch(this, function(){
						popup.open({
							popup: this.selectionActionBar._actions.DownloadSelection.options.tooltipDialog,
							around: this.selectionActionBar._actions.DownloadSelection.button,
							orient: ["below"]
						});
					}), 10);

				},
				false
			],

			[
				"ViewFeatureItems",
				"MultiButton fa icon-selection-FeatureList fa-2x",
				{
					label: "FEATURES",
					validTypes: ["*"],
					multiple: true,
					tooltip: "Switch to Feature List View. Press and Hold for more options.",
					validContainerTypes: ["subsystem_data"],
					pressAndHold: function(selection, button, opts, evt){
						console.log("PressAndHold");
						console.log("Selection: ", selection, selection[0])
						popup.open({
							popup: new PerspectiveToolTipDialog({
								perspective: "Feature",
								perspectiveUrl: "/view/Feature/" + selection[0].feature_id
							}),
							around: button,
							orient: ["below"]
						});
					}
				},
				function(selection, container){
					if (selection[0].document_type === "subsystems_subsystem") {

						var subsystem_ids = selection.map(function(s){
							return encodeURIComponent(s.subsystem_id)
						});

						var query = "q=genome_id:(" + this.state.genome_ids.join(" OR ") + ") AND subsystem_id:(\"" + subsystem_ids.join("\" OR \"") + "\")&fl=feature_id&rows=25000";

						when(request.post(PathJoin(window.App.dataAPI, '/subsystem/'), {
							handleAs: 'json',
							headers: {
								'Accept': "application/solr+json",
								'Content-Type': "application/solrquery+x-www-form-urlencoded",
								'X-Requested-With': null,
								'Authorization': (window.App.authorizationToken || "")
							},
							data: query
						}), function(response){
							Topic.publish("/navigate", {href: "/view/FeatureList/?in(feature_id,(" + response.response.docs.map(function(x){
								return x.feature_id;
							}).join(",") + "))#view_tab=features", target: "blank"});
						});
					}
					//gene tab - selection has id already
					else if (selection[0].document_type === "subsystems_gene") {
						var feature_ids = selection.map(function(s){
							return s.feature_id
						});
						Topic.publish("/navigate", {href: "/view/FeatureList/?in(feature_id,(" + feature_ids.join(",") + "))#view_tab=features", target: "blank"});
					}

				},
				false
			],
			[
				"AddGroup",
				"fa icon-object-group fa-2x",
				{
					label: "GROUP",
					ignoreDataType: true,
					multiple: true,
					validTypes: ["*"],
					requireAuth: true,
					tooltip: "Add selection to a new or existing group",
					validContainerTypes: ["subsystem_data"]
				},
				function(selection){

					var subsystem_ids = selection.map(function(s){
						return encodeURIComponent(s.subsystem_id)
					});

					var query = "q=genome_id:(" + this.state.genome_ids.join(" OR ") + ") AND subsystem_id:(\"" + subsystem_ids.join("\" OR \"") + "\")&fl=feature_id&rows=25000";

					when(request.post(PathJoin(window.App.dataAPI, '/subsystem/'), {
						handleAs: 'json',
						headers: {
							'Accept': "application/solr+json",
							'Content-Type': "application/solrquery+x-www-form-urlencoded",
							'X-Requested-With': null,
							'Authorization': (window.App.authorizationToken || "")
						},
						data: query
					}), function(response){

						var feature_ids = response.response.docs.map(lang.hitch(this, function(val) {
							return {"feature_id": val.feature_id};
						}))

						var dlg = new Dialog({title: "Add selected items to group"});
						var stg = new SelectionToGroup({
							selection: feature_ids,
							type: "feature_group",
							inputType: "feature_data",
							path: ""
						});
						on(dlg.domNode, "dialogAction", function(){
							dlg.hide();
							setTimeout(function(){
								dlg.destroy();
							}, 2000);
						});
						domConstruct.place(stg.domNode, dlg.containerNode, "first");
						stg.startup();
						dlg.startup();
						dlg.show();
					});
				},
				false
			],
			[
				"ViewSubsystemMap",
				"fa icon-map-o fa-2x",
				{
					label: "Map",
					multiple: false,
					validTypes: ["*"],
					tooltip: "View Subsystem Map",
					validContainerTypes: ["subsystem_data"]
				},
				function(selection){
	
					var url = {};
					if(this.state.hasOwnProperty('taxon_id')){
						url['taxon_id'] = this.state.taxon_id;
					};

					//used to query data
					url['genome_ids'] = this.state.genome_ids;
					url['subsystem_id'] = selection[0].subsystem_id;

					//used to create DOM
					// url['subsystem_name'] =  selection[0].subsystem_name;
					// url['class'] =  selection[0]['class'];
					// url['subclass'] =  selection[0].subclass;

					var params = Object.keys(url).map(function(p){
						return p + "=" + url[p]
					}).join("&");

					Topic.publish("/navigate", {href: "/view/SubSystemMap/?" + params, target: "blank", genomeIds: this.state.genome_ids});
				},
				false
			]

		]),
		_setStateAttr: function(state){
			this._set("state", state);
			// console.log("from _setState", state)
			// this.filterPanel.set("state", lang.mixin({}, state));
			this.filterPanel.set("state", lang.mixin({}, state, {hashParams: lang.mixin({}, state.hashParams)}));
			if(this.grid){
				this.grid.set("state", lang.mixin({}, state, {hashParams: lang.mixin({}, state.hashParams)}));
			}
		}
	});
});
