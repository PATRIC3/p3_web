define([
	"dojo/_base/declare", "dojo/_base/lang",
	"dojo/on", "dojo/topic", "dojo/dom-construct", "dojo/dom", "dojo/query", "dojo/when", "dojo/request",
	"dijit/layout/ContentPane", "dijit/layout/BorderContainer", "dijit/TooltipDialog", "dijit/Dialog", "dijit/popup",
	"dijit/TitlePane", "dijit/registry", "dijit/form/Form", "dijit/form/RadioButton", "dijit/form/Select", "dijit/form/Button",
	"./ContainerActionBar", "./HeatmapContainer", "./SelectionToGroup", "../util/PathJoin", "FileSaver", "../store/SubsystemMapMemoryStore",
	"dojo/aspect",

], function(declare, lang,
			on, Topic, domConstruct, dom, Query, when, request,
			ContentPane, BorderContainer, TooltipDialog, Dialog, popup,
			TitlePane, registry, Form, RadioButton, Select, Button,
			ContainerActionBar, HeatmapContainer, SelectionToGroup, PathJoin, saveAs, Store,
			aspect){

	return declare([BorderContainer, HeatmapContainer], {
		gutters: false,
		state: null,
		visible: false,
		pmState: null,	
		region: "center",
		query: (this.query || ""),
		store: null,
		apiToken: window.App.authorizationToken,
		apiServer: window.App.dataServiceURL,
		containerActions: [
			[
				"Flip Axis",
				"fa icon-rotate-left fa-2x",
				{label: "Flip Axis", multiple: false, validTypes: ["*"]},
				function(){
					// flip internal flag
					if(this.pmState.heatmapAxis === ""){
						this.pmState.heatmapAxis = "Transposed";
					}else{
						this.pmState.heatmapAxis = "";
					}

					Topic.publish("SubSystemMap", "refreshHeatmap");
				},
				true
			],
			[
				"Reference Genomes",
				"fa icon-eye fa-2x",
				{label: "Reference Genomes", multiple: false, validTypes: ["*"]},
				function(){
					if(this.state.display_reference_genomes){
						this.state.display_reference_genomes = false;
					}else{
						this.state.display_reference_genomes = true;
					}

					Topic.publish("SubSystemMap", "refreshHeatmap");
				},
				true
			]
		],
		constructor: function(){
			this.dialog = new Dialog({});

			var self = this;
			// subscribe
			Topic.subscribe("SubSystemMap", lang.hitch(self, function(){
				// console.log("SubsystemMapHeatmapContainer:", arguments);
				var key = arguments[0], value = arguments[1];

				switch(key){
					case "updatePmState":
						self.pmState = value;
						break;
					case "refreshHeatmap":
						Topic.publish("SubSystemMap", "requestHeatmapData", self.pmState);
						break;
					case "updateHeatmapData":
						self.currentData = value;
						if(typeof(self.flashDom.refreshData) == "function"){
							self.flashDom.refreshData();
							// Topic.publish("SubsystemMap", "hideLoadingMask");
						}
						break;
					default:
						break;
				}
			}));
		},

		_setVisibleAttr: function(visible){
			this.visible = visible;

			if(this.visible && !this._firstView){
				this.onFirstView();
				this.initializeFlash('SubsystemMapHeatMap');
			}
		},
		onFirstView: function(){
			if(this._firstView){
				return;
			}

			// action buttons for heatmap viewer
			this.containerActionBar = new ContainerActionBar({
				baseClass: "BrowserHeader",
				region: "top",
				style: "padding:0"
			});
			this.containerActions.forEach(function(a){
				this.containerActionBar.addAction(a[0], a[1], a[2], lang.hitch(this, a[3]), a[4]);
			}, this);
			this.addChild(this.containerActionBar);

			this.addChild(new ContentPane({
				region: "center",
				content: "<div id='flashTarget'></div>",
				style: "padding:0"
			}));

			this.inherited(arguments);
			this._firstView = true;
			this._setState(this.state);
		},
		flashReady: function(){
			if(typeof(this.flashDom.refreshData) == "function"){
				Topic.publish("SubSystemMap", "refreshHeatmap");
			}
		},
		flashCellClicked: function(flashObjectID, colID, rowID){
			var isTransposed = (this.pmState.heatmapAxis === 'Transposed');
			var originalAxis = this._getOriginalAxis(isTransposed, colID, rowID);

			var roleId = originalAxis.columnIds;
			var genomeId = originalAxis.rowIds;

			var that = this;

			var query = "q=role_id:(" + roleId + ") AND genome_id:(" + genomeId + ")&rows=25000";
			
			return when(request.post(window.App.dataAPI + 'subsystem/', {
				handleAs: 'json',
				headers: {
					'Accept': "application/solr+json",
					'Content-Type': "application/solrquery+x-www-form-urlencoded",
					'X-Requested-With': null,
					'Authorization': window.App.authorizationToken
				},
				data: query
			}), function(response){
				Topic.publish("SubSystemMap", "hideLoadingMask");

				var featureSet = {};
				response.response.docs.forEach(function(d){
					if(!featureSet.hasOwnProperty(d.feature_id)){
						featureSet[d.feature_id] = true;
					}
				});
				var features = Object.keys(featureSet);

				that.dialog.set('content', that._buildPanelCellsSelected(isTransposed, roleIds, genomeIds, features));
				var actionBar = that._buildPanelButtons(colIDs, rowIDs, roleIds, genomeIds, features);
				domConstruct.place(actionBar, that.dialog.containerNode, "last");

				that.dialog.show();
			});
		},

		flashCellsSelected: function(flashObjectID, colIDs, rowIDs){
			if(rowIDs.length == 0) return;
			var isTransposed = (this.pmState.heatmapAxis === 'Transposed');
			var originalAxis = this._getOriginalAxis(isTransposed, colIDs, rowIDs);

			var that = this;

			var roleIds = originalAxis.columnIds;
			var genomeIds = originalAxis.rowIds;

			var roleIdsQuotes = roleIds.map(function(role) {
				return "\"" + role + "\""
			});

			var query = "q=role_id:(" + roleIdsQuotes.join(" OR ") + ") AND genome_id:(" + genomeIds.join(" OR ") + ")&rows=25000";
			
			return when(request.post(window.App.dataAPI + 'subsystem/', {
				handleAs: 'json',
				headers: {
					'Accept': "application/solr+json",
					'Content-Type': "application/solrquery+x-www-form-urlencoded",
					'X-Requested-With': null,
					'Authorization': window.App.authorizationToken
				},
				data: query
			}), function(response){
				Topic.publish("SubSystemMap", "hideLoadingMask");

				var featureSet = {};
				response.response.docs.forEach(function(d){
					if(!featureSet.hasOwnProperty(d.feature_id)){
						featureSet[d.feature_id] = true;
					}
				});
				var features = Object.keys(featureSet);

				that.dialog.set('content', that._buildPanelCellsSelected(isTransposed, roleIds, genomeIds, features));
				var actionBar = that._buildPanelButtons(colIDs, rowIDs, roleIds, genomeIds, features);
				domConstruct.place(actionBar, that.dialog.containerNode, "last");

				that.dialog.show();
			});
		},
		_buildPanelCellClicked: function(isTransposed, roleId, genomeId, features){

			var gfs = this.pmState.genomeFilterStatus;

			var genomeName = gfs[genomeId].getLabel();
			var description = '', memberCount = 0, index = 0;

			if(isTransposed){
				// rows: families, columns: genomes
				this.currentData.rows.forEach(function(row, idx){
					if(row.rowID === roleId){
						description = row.rowLabel;
						index = idx;
					}
				});
				this.currentData.columns.forEach(function(col){
					if(col.colID === genomeId){
						memberCount = parseInt(col.distribution.substr(2 * index, 2), 16);
					}
				})
			}else{
				index = gfs[genomeId].getIndex();
				this.currentData.columns.forEach(function(col){
					if(col.colID === roleId){
						description = col.colLabel;
						memberCount = parseInt(col.distribution.substr(2 * index, 2), 16);
					}
				});
			}

			var text = [];
			text.push('<b>Genome:</b> ' + genomeName);
			text.push('<b>Product:</b> ' + description);
			text.push('<b>Role ID:</b> ' + roleId);
			//text.push('<b>Members:</b> ' + memberCount);

			return text.join("<br>");
		},
		_buildPanelCellsSelected: function(isTransposed, roleIds, genomeIds, features){

			var text = [];
			text.push('<b>Genomes Selected:</b> ' + genomeIds.length);
			text.push('<b>Roles Selected:</b> ' + roleIds.length);
			//text.push('<b>Members:</b> ' + features.length);

			return text.join("<br>");
		},
		_buildPanelButtons: function(colIDs, rowIDs, ecNumbers, genomeIds, features){
			var _self = this;
			var featureIds = (typeof(features[0]) === 'string')? features.join(',') : features.map(function(d){ return d.feature_id;}).join(',');

			var actionBar = domConstruct.create("div", {
				"class": "dijitDialogPaneActionBar"
			});

			var dhc = '<div>Download Table As...</div><div class="wsActionTooltip" rel="text/tsv">Text</div><div class="wsActionTooltip" rel="text/csv">CSV</div>';

			var dfc = '<div>Download Table As...</div><div class="wsActionTooltip" rel="text/tsv">Text</div><div class="wsActionTooltip" rel="text/csv">CSV</div><div class="wsActionTooltip" rel="application/vnd.openxmlformats">Excel</div>';
			var downloadHM = new TooltipDialog({
				content: dhc,
				onMouseLeave: function(){
					popup.close(downloadHM);
				}
			});
			var downloadPT = new TooltipDialog({
				content: dfc,
				onMouseLeave: function(){
					popup.close(downloadPT);
				}
			});

			var btnDownloadHeatmap = new Button({
				label: 'Download Heatmap Data'
			});
			on(downloadHM.domNode, "click", function(e){
				if(e.target.attributes.rel === undefined)return;
				var rel = e.target.attributes.rel.value;
				var DELIMITER, ext;
				if(rel === 'text/csv'){
					DELIMITER = ',';
					ext = 'csv';
				}else{
					DELIMITER = '\t';
					ext = 'txt';
				}

				var colIndexes = [];
				_self.currentData.columns.forEach(function(col, idx){
					if(colIDs.indexOf(col.colID) > -1){
						colIndexes[colIDs.indexOf(col.colID)] = idx;
					}
				});

				var header = _self.currentData.rowLabel + "/" + _self.currentData.colLabel;
				colIndexes.forEach(function(colIdx){
					header += DELIMITER + _self.currentData.columns[colIdx].colLabel;
				});

				var data = [];
				_self.currentData.rows.forEach(function(row, idx){
					if(rowIDs.indexOf(row.rowID) > -1){
						var r = [];
						r.push(row.rowLabel);
						colIndexes.forEach(function(colIdx){
							var val = parseInt(_self.currentData.columns[colIdx].distribution.substr(idx * 2, 2), 16);
							r.push(val);
						});
						data[rowIDs.indexOf(row.rowID)] = r.join(DELIMITER);
					}
				});

				saveAs(new Blob([header + '\n' + data.join('\n')], {type: rel}), 'PATRIC_subsystem_map_heatmap.' + ext);
				popup.close(downloadHM);
			});
			on(btnDownloadHeatmap.domNode, "click", function(){
				popup.open({
					popup: downloadHM,
					around: btnDownloadHeatmap.domNode,
					orient: ["below"]
				});
			});

			var btnDownloadProteins = new Button({
				label: 'Download Proteins',
				disabled: (featureIds.length === 0)
			});
			on(downloadPT.domNode, "click", function(e){
				if(e.target.attributes.rel === undefined)return;
				var rel = e.target.attributes.rel.value;
				var currentQuery = "?in(feature_id,(" + featureIds + "))&sort(+feature_id)";

				window.open(window.App.dataServiceURL + "/genome_feature/" + currentQuery + "&http_authorization=" + encodeURIComponent(window.App.authorizationToken) + "&http_accept=" + rel + "&http_download=true");
				popup.close(downloadPT);
			});

			on(btnDownloadProteins.domNode, "click", function(){
				popup.open({
					popup: downloadPT,
					around: btnDownloadProteins.domNode,
					orient: ["below"]
				});
			});

			var btnShowDetails = new Button({
				label: 'Show Proteins',
				disabled: (featureIds.length === 0)
			});
			on(btnShowDetails.domNode, "click", function(){
				Topic.publish("/navigate", {href: "/view/FeatureList/?in(feature_id,(" + featureIds + "))#view_tab=features", target: "blank"});

				_self.dialog.hide();
			});

			var btnAddToWorkspace = new Button({
				label: 'Add Proteins to Group',
				disabled: (featureIds.length === 0)
			});
			on(btnAddToWorkspace.domNode, "click", function(){
				if(!window.App.user || !window.App.user.id){
					Topic.publish("/login");
					return;
				}

				var dlg = new Dialog({title: "Add This Feature To Group"});
				var stg = new SelectionToGroup({
					selection: features.map(function(f){ return {feature_id:f}; }),
					type: 'feature_group'
				});
				on(dlg.domNode, "dialogAction", function(evt){
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

			var btnCancel = new Button({
				label: 'Cancel',
				onClick: function(){
					_self.dialog.hide();
				}
			});

			btnDownloadHeatmap.placeAt(actionBar);
			btnDownloadProteins.placeAt(actionBar);
			btnShowDetails.placeAt(actionBar);
			btnAddToWorkspace.placeAt(actionBar);
			btnCancel.placeAt(actionBar);

			return actionBar;
		},
		_getOriginalAxis: function(isTransposed, columnIds, rowIds){
			var originalAxis = {};
			//console.log("_getOriginalAxis: ", isTransposed, columnIds, rowIds);

			if(isTransposed){
				originalAxis.columnIds = rowIds;
				originalAxis.rowIds = columnIds;
			}else{
				originalAxis.columnIds = columnIds;
				originalAxis.rowIds = rowIds;
			}
			return originalAxis;
		}, 
		// Store
		_setApiServer: function(server){
			this.apiServer = server;
		},
		_setState: function(state){
			if(!this.store){
				this.set('store', this.createStore(this.apiServer, this.apiToken || window.App.authorizationToken, state));
			}else{
				// console.log("ProteinFamiliesGrid _setState()");
				this.store.set('state', state);

				// console.log("ProteinFamiliesGrid Call Grid Refresh()");
				this.refresh();
			}
		},
		_setSort: function(sort){
			this.inherited(arguments);
			this.store.sort = sort;
		},
		createStore: function(server, token, state){

			var store = new Store({
				token: token,
				apiServer: this.apiServer || window.App.dataServiceURL,
				state: state || this.state
			});
			//store.watch('refresh', lang.hitch(this, "refresh"));

			return store;
		}
	});
});
