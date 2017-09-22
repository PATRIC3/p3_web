define([
	"dojo/_base/declare", "./GridContainer", "dojo/on",
	"./SubSystemsMemoryGrid", "dijit/popup", "dojo/topic", "dojo/request", "dojo/when",
	"dijit/TooltipDialog", "./FilterContainerActionBar", "FileSaver", "../util/PathJoin",
	"dojo/_base/lang", "dojo/dom-construct", "./PerspectiveToolTip"

], function(declare, GridContainer, on,
			SubSystemsGrid, popup, Topic, request, when,
			TooltipDialog, ContainerActionBar, saveAs, PathJoin,
			lang, domConstruct, PerspectiveToolTipDialog){

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

		createFilterPanel: function(){
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

						Object.keys(facets).forEach(function(cat){
							if(this._ffWidgets[cat]){
								var selected = this.state.selected;
								this._ffWidgets[cat].set('data', facets[cat], selected);
							}else{
							}
						}, this);

					}));

				}
			});

			this.filterPanel.watch("filter", lang.hitch(this, function(attr, oldVal, newVal){

				if((oldVal != newVal) && (this.state && this.state.hashParams && (newVal != this.state.hashParams.filter))){
					on.emit(this.domNode, "UpdateHash", {
						bubbles: true,
						cancelable: true,
						hashProperty: "filter",
						value: newVal,
						oldValue: oldVal
					})
				}
			}));
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
									"Class",
									"Subclass",
									"Subsystem Id",
									"Subsystem Name",
									"Genome Count",
									"Gene Count",
									"Role Count",
									"Role ID",
									"Role Name",
									"Active",
									"Patric ID",
									"Gene",
									"Product"
								]

							data.forEach(function(row){
								content.push([
									row['class'],
									JSON.stringify(row.subclass),
									row.subsystem_id,
									JSON.stringify(row.subsystem_name),
									row.genome_count,
									row.gene_count,
									row.role_count,
									row.role_id,
									row.role_name,
									row.active,
									row.patric_id,
									row.gene,
									row.product
								]);
							});
							filename = "PATRIC_subsystems";
							break;

						case "genes":
							headers = [
									"Class",
									"Subclass",
									"Subsystem Id",
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
									row['class'],
									JSON.stringify(row.subclass),
									row.subsystem_id,
									JSON.stringify(row.subsystem_name),
									row.role_id,
									row.role_name,
									row.active,
									row.patric_id,
									row.gene,
									row.product
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
				"ViewFeatureItems",
				"MultiButton fa icon-selection-FeatureList fa-2x",
				{
					label: "FEATURES",
					validTypes: ["*"],
					multiple: true,
					max: 10,
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
					//subsystem tab
					if (selection[0].document_type === "subsystems_subsystem") {
						var query = "and(in(genome_id,(" + container.state.genome_ids.join(',') + ")),in(subsystem_id,(" + selection.map(function(s){
							return s.subsystem_id;
						}).join(',') + ")))&select(feature_id)&limit(25000)";

						when(request.post(PathJoin(window.App.dataAPI, '/subsystem/'), {
							handleAs: 'json',
							headers: {
								'Accept': "application/json",
								'Content-Type': "application/rqlquery+x-www-form-urlencoded",
								'X-Requested-With': null,
								'Authorization': (window.App.authorizationToken || "")
							},
							data: query
						}), function(featureIds){
							Topic.publish("/navigate", {href: "/view/FeatureList/?in(feature_id,(" + featureIds.map(function(x){
								return x.feature_id;
							}).join(",") + "))#view_tab=features", target: "blank"});
						});
					}
					//gene tab - selection has id already
					else if (selection[0].document_type === "subsystems_gene") {
						Topic.publish("/navigate", {href: "/view/FeatureList/?in(feature_id,(" + selection[0].feature_id + "))#view_tab=features", target: "blank"});
					}

				},
				false
			], [
				"PathwaySummary",
				"fa icon-git-pull-request fa-2x",
				{
					label: "PTHWY",
					ignoreDataType: true,
					multiple: true,
					max: 5000,
					validTypes: ["subsystems_gene"],
					tooltip: "Pathway Summary",
					validContainerTypes: ["subsystem_data"]
				},
				function(selection, containerWidget){
					var ids = [];
					var queryContext = containerWidget.grid.store.state.search;
					if(containerWidget.grid.store.state.hashParams.filter != "false" && containerWidget.grid.store.state.hashParams.filter != undefined){
						queryContext += "&" + containerWidget.grid.store.state.hashParams.filter;
					}

					var subsystem_ids = selection.map(function(d){
						return d['subsystem_id']
					});

					when(request.post(this.apiServer + '/subsystem/', {
						handleAs: 'json',
						headers: {
							'Accept': "application/json",
							'Content-Type': "application/rqlquery+x-www-form-urlencoded",
							'X-Requested-With': null,
							'Authorization': (window.App.authorizationToken || "")
						},
						data: "and(in(subsystem_id,(" + subsystem_ids.join(",") + "))," + queryContext + ")&select(feature_id)&limit(25000)"
					}), function(response){
						ids = response.map(function(d){
							return d['feature_id']
						});
						Topic.publish("/navigate", {
							href: "/view/PathwaySummary/?features=" + ids.join(','),
							target: "blank"
						});
					});
				},
				false
			], [
				"ViewGenomeItem",
				"MultiButton fa icon-selection-Genome fa-2x",
				{
					label: "GENOME",
					validTypes: ["subsystems_gene"],
					multiple: false,
					tooltip: "Switch to Genome View. Press and Hold for more options.",
					ignoreDataType: true,
					validContainerTypes: ["subsystem_data"],
					pressAndHold: function(selection, button, opts, evt){
						console.log("PressAndHold");
						console.log("Selection: ", selection, selection[0])
						popup.open({
							popup: new PerspectiveToolTipDialog({perspectiveUrl: "/view/Genome/" + selection[0].genome_id}),
							around: button,
							orient: ["below"]
						});

					}
				},
				function(selection, container){

					if(container.type !== "genes"){
						return;
					}
					var sel = selection[0];
					Topic.publish("/navigate", {
						href: "/view/Genome/" + sel.genome_id,
						target: "blank"
					});
				},
				false
			], [
				"ViewFASTA",
				"fa icon-fasta fa-2x",
				{
					label: "FASTA",
					ignoreDataType: true,
					multiple: true,
					validTypes: ["subsystems_gene"],
					max: 5000,
					tooltip: "View FASTA Data",
					tooltipDialog: viewFASTATT,
					validContainerTypes: ["subsystem_data"]
				},
				function(selection){
					// console.log("view FASTA")
					viewFASTATT.selection = selection;
					// console.log("ViewFasta Sel: ", this.selectionActionBar._actions.ViewFASTA.options.tooltipDialog)
					popup.open({
						popup: this.selectionActionBar._actions.ViewFASTA.options.tooltipDialog,
						around: this.selectionActionBar._actions.ViewFASTA.button,
						orient: ["below"]
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
					url['subsystem_name'] =  selection[0].subsystem_name;
					url['class'] =  selection[0]['class'];
					url['subclass'] =  selection[0].subclass;

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
			this.filterPanel.set("state", lang.mixin({}, state));
			if(this.grid){
				this.grid.set("state", lang.mixin({}, state, {hashParams: lang.mixin({}, state.hashParams)}));
			}
		}
	});
});
