define([
	"dojo/_base/declare", "dijit/layout/BorderContainer", "dojo/on", "dojo/_base/lang", 
	"./ActionBar", "./ContainerActionBar", "dijit/layout/StackContainer", "dijit/layout/TabController",
	"./SubSystemsMemoryGridContainer", "dijit/layout/ContentPane", "./GridContainer", "dijit/TooltipDialog",
	"../store/SubSystemMemoryStore", "../store/SubsystemsOverviewMemoryStore", "dojo/dom-construct", "dojo/topic", 
	"./GridSelector", "./SubSystemsOverview", "dojox/widget/Standby"
], function(declare, BorderContainer, on, lang,
			ActionBar, ContainerActionBar, TabContainer, StackController,
			SubSystemsGridContainer, ContentPane, GridContainer, TooltipDialog,
			SubSystemMemoryStore, SubsystemsOverviewMemoryStore, domConstruct, Topic, 
			selector, SubSystemsOverview, Standby){
	var vfc = '<div class="wsActionTooltip" rel="dna">View FASTA DNA</div><div class="wsActionTooltip" rel="protein">View FASTA Proteins</div><hr><div class="wsActionTooltip" rel="dna">Download FASTA DNA</div><div class="wsActionTooltip" rel="downloaddna">Download FASTA DNA</div><div class="wsActionTooltip" rel="downloadprotein"> ';
	var viewFASTATT = new TooltipDialog({
		content: vfc, onMouseLeave: function(){
			popup.close(viewFASTATT);
		}
	});

	var dfc = '<div>Download Table As...</div><div class="wsActionTooltip" rel="text/tsv">Text</div><div class="wsActionTooltip" rel="text/csv">CSV</div><div class="wsActionTooltip" rel="application/vnd.openxmlformats">Excel</div>';
	var downloadTT = new TooltipDialog({
		content: dfc, onMouseLeave: function(){
			popup.close(downloadTT);
		}
	});

	on(downloadTT.domNode, "div:click", function(evt){
		var rel = evt.target.attributes.rel.value;
		var selection = self.actionPanel.get('selection');
		var dataType = (self.actionPanel.currentContainerWidget.containerType == "genome_group") ? "genome" : "genome_feature";
		var currentQuery = self.actionPanel.currentContainerWidget.get('query');

		window.open("/api/" + dataType + "/" + currentQuery + "&http_authorization=" + encodeURIComponent(window.App.authorizationToken) + "&http_accept=" + rel + "&http_download");
		popup.close(downloadTT);
	});

	return declare([BorderContainer], {
		gutters: false,
		state: null,
		maxGenomeCount: 500,
		tooltip: 'The "Subsystems" tab contains a list of subsystems for genomes associated with the current view',
		apiServer: window.App.dataServiceURL,

		constructor: function(options){
			// console.log(options);
			this.topicId = "SubSystemMap_" + options.id.split('_subsystems')[0];

			Topic.subscribe(this.topicId, lang.hitch(this, function(){
				// console.log("ProteinFamiliesHeatmapContainer:", arguments);
				var key = arguments[0], value = arguments[1];

				switch(key){
					case "showMainGrid":
						this.tabContainer.selectChild(this.mainGridContainer);
						break;
					case "updatePfState":
						this.pfState = value;
						//this.updateFilterPanel(value);
						break;
					case "showLoadingMask":
						this.loadingMask.show();
						break;
					case "hideLoadingMask":
						this.loadingMask.hide();
						break;
					default:
						break;
				}
			}));
		},

		postCreate: function(){
			this.inherited(arguments);
			this.watch("state", lang.hitch(this, "onSetState"));

			this.loadingMask = new Standby({
				target: this.id,
				image: "/public/js/p3/resources/images/spin.svg",
				color: "#efefef"
			});
			this.addChild(this.loadingMask);
			this.loadingMask.startup();
		},

		onSetState: function(attr, oldVal, state){

			if(!state){
				return;
			}

			if(this.tabContainer && this.tabContainer.selectedChildWidget && this._firstView && this.tabContainer.selectedChildWidget.state != state){
				this.tabContainer.selectedChildWidget.set('state', state);
			}

			if(this.mainGridContainer){
				this.mainGridContainer.set('state', state);
			}

			if(state.autoFilterMessage){
				var msg = '<table><tr style="background: #f9ff85;"><td><div class="WarningBanner">' + state.autoFilterMessage + "&nbsp;<i class='fa-1x icon-question-circle-o DialogButton' rel='help:/misc/GenomesLimit' /></div></td><td style='width:30px;'><i style='font-weight:400;color:#333;cursor:pointer;' class='fa-1x icon-cancel-circle close closeWarningBanner' style='color:#333;font-weight:200;'></td></tr></table>";
				if(!this.messagePanel){
					this.messagePanel = new ContentPane({
						"class": "WarningPanel",
						region: "top",
						content: msg
					});

					var _self = this;
					on(this.messagePanel.domNode, ".closeWarningBanner:click", function(evt){
						if(_self.messagePanel){
							_self.removeChild(_self.messagePanel);
						}
					});
				}else{
					this.messagePanel.set("content", msg);
				}
				this.addChild(this.messagePanel);
			}else{
				if(this.messagePanel){
					this.removeChild(this.messagePanel)
				}
			}
		},

		visible: false,
		_setVisibleAttr: function(visible){
			this.visible = visible;
			if(this.visible && !this._firstView){
				this.onFirstView();
			}
			if(this.mainGridContainer){
				this.mainGridContainer.set('visible', true);
			}
		},

		selectChild: function(child){
			Topic.publish(this.id + "-selectChild", child);
		},

		onFirstView: function(){
			if(this._firstView){
				return;
			}
			this.tabContainer = new TabContainer({region: "center", id: this.id + "_TabContainer"});

			var subsystemsOverviewStore = this.subsystemsStore = new SubsystemsOverviewMemoryStore({type: "subsystems_overview"});
			var subsystemsStore = this.subsystemsStore = new SubSystemMemoryStore({type: "subsystems"});
			var geneSubsystemsStore = this.geneSubsystemsStore = new SubSystemMemoryStore({type: "genes"});

			var tabController = new StackController({
				containerId: this.id + "_TabContainer",
				region: "top",
				"class": "TextTabButtons"
			});

			this.subsystemsOverviewGrid = new SubSystemsOverview({
				title: "Subsystems Overview",
				type: "subsystems_overview",
				apiServer: this.apiServer,
				store: subsystemsOverviewStore,
				facetFields: ["class"],
				queryOptions: {
					sort: [{attribute: "subsystem_name"}]
				},
				enableFilterPanel: true,
				visible: true
			});

			//taxonomy view does not have the active filter tab
			var currentUri = this.containerNode.baseURI;
			var isTaxonomyView = /Taxonomy/.test(currentUri);

			//the taxonomy and gene level tabs have some differences
			if (isTaxonomyView) {
				this.subsystemsGrid = new SubSystemsGridContainer({
					title: "Subsystems",
					type: "subsystems",
					apiServer: this.apiServer,
					defaultFilter: this.defaultFilter,
					store: subsystemsStore,
					getFilterPanel: function(opts){

					},
					facetFields: ["superclass", "class", "subclass", "active"],
					columns: {
						"Selection Checkboxes": selector({unhidable: true}),
						superclass: 		{label: "Superclass", field: "superclass"},
						"class": 			{label: "Class", field: "class"},
						subclass: 			{label: 'Subclass', field: 'subclass'},
						subsystem_name: 	{label: 'Subsystem Name', field: 'subsystem_name'},
						genome_count: 		{label: 'Genome Count', field: 'genome_count'},
						gene_count: 		{label: 'Gene Count', field: 'gene_count'},
						role_count: 		{label: 'Role Count', field: 'role_count'},
						subsystem_id: 		{label: "Subsystem ID", field: "subsystem_id", hidden: true}
					},
					queryOptions: {
						sort: [{attribute: "subsystem_name"}]
					},
					enableFilterPanel: true,
					visible: true
				});

				this.genesGrid = new SubSystemsGridContainer({
					title: "Genes",
					type: "genes",
					apiServer: this.apiServer,
					store: geneSubsystemsStore,
					getFilterPanel: function(opts){

					},
					facetFields: ["superclass", "class", "subclass", "active", "subsystem_name"],
					columns: {
						"Selection Checkboxes": selector({unhidable: true}),
						superclass: 		{label: "Superclass", field: "superclass"},
						"class": 			{label: "Class", field: "class"},
						subclass: 			{label: 'Subclass', field: 'subclass'},
						subsystem_name: 	{label: 'Subsystem Name', field: 'subsystem_name'},
						role_id: 			{label: "Role ID", field: "role_id", hidden: true},
						role_name: 			{label: "Role Name", field: "role_name"},
						patric_id: 			{label: "Patric ID", field: "patric_id"},
						gene: 				{label: "Gene", field: "gene"},
						product: 			{label: "Product", field: "product"},
						refseq_locus_tag: 	{label: 'RefSeq Locus Tag', field: 'refseq_locus_tag'},
						alt_locus_tag: 		{label: 'Alt Locus Tag', field: 'alt_locus_tag', hidden: true},
						product: 			{label: 'Product', field: 'product'},
						genome_id: 			{label: "Genome ID", field: "genome_id", hidden: true},
						genome_name: 		{label: "Genome Name", field: "genome_name"},
						taxon_id: 			{label: "Taxon ID", field: "taxon_id", hidden: true},
						subsystem_id: 		{label: "Subsystem ID", field: "subsystem_id", hidden: true}
					},
					queryOptions: {
						sort: [{attribute: "subsystem_name"}]
					},
					enableFilterPanel: true,
					visible: true
				});
			} else {
				this.subsystemsGrid = new SubSystemsGridContainer({
					title: "Subsystems",
					type: "subsystems",
					getFilterPanel: function(opts){

					},
					apiServer: this.apiServer,
					defaultFilter: this.defaultFilter,
					store: subsystemsStore,
					facetFields: ["superclass", "class", "subclass", "active"],
					columns: {
						"Selection Checkboxes": selector({unhidable: true}),
						superclass: 		{label: "Superclass", field: "superclass"},
						"class": 			{label: "Class", field: "class"},
						subclass: 			{label: 'Subclass', field: 'subclass'},
						subsystem_name: 	{label: 'Subsystem Name', field: 'subsystem_name'},
						gene_count: 		{label: 'Gene Count', field: 'gene_count'},
						role_count: 		{label: 'Role Count', field: 'role_count'},
						active: 			{label: "Active", field: "active"},
						subsystem_id: 		{label: "Subsystem ID", field: "subsystem_id", hidden: true}
					},
					queryOptions: {
						sort: [{attribute: "subsystem_name"}]
					},
					enableFilterPanel: true,
					visible: true
				});

				this.genesGrid = new SubSystemsGridContainer({
					title: "Genes",
					type: "genes",
					getFilterPanel: function(opts){

					},
					// state: this.state,
					apiServer: this.apiServer,
					// defaultFilter: this.defaultFilter,
					store: geneSubsystemsStore,
					facetFields: ["superclass", "class", "subclass", "active", "subsystem_name"],
					columns: {
						"Selection Checkboxes": selector({unhidable: true}),
						superclass: 		{label: "Superclass", field: "superclass"},
						"class": 			{label: "Class", field: "class"},
						subclass: 			{label: 'Subclass', field: 'subclass'},
						subsystem_name: 	{label: 'Subsystem Name', field: 'subsystem_name'},
						role_id: 			{label: "Role ID", field: "role_id", hidden: true},
						role_name: 			{label: "Role Name", field: "role_name"},
						active: 			{label: "Active", field: "active"},
						patric_id: 			{label: "Patric ID", field: "patric_id"},
						gene: 				{label: "Gene", field: "gene"},
						product: 			{label: "Product", field: "product"},
						subsystem_id: 		{label: "Subsystem ID", field: "subsystem_id", hidden: true}
					},
					queryOptions: {
						sort: [{attribute: "subsystem_name"}]
					},
					enableFilterPanel: true,
					visible: true
				});
			}

			this.addChild(tabController);
			this.addChild(this.tabContainer);

			this.tabContainer.addChild(this.subsystemsOverviewGrid);
			this.tabContainer.addChild(this.subsystemsGrid);
			//this.tabContainer.addChild(this.subsystemMapHeatmapContainer);
			this.tabContainer.addChild(this.genesGrid);

			Topic.subscribe(this.id + "_TabContainer-selectChild", lang.hitch(this, function(page){
				this.state.autoFilterMessage = "";
				if (this.tabContainer.selectedChildWidget.type === "subsystems_overview") {
					//do nothing
				} else if (this.tabContainer.selectedChildWidget.type === "subsystems_heatmap") {
					Topic.publish(this.topicId, "showMainGrid");
				} else {
					page.set('state', this.state);
				}
			}));

			Topic.subscribe(this.subsystemsOverviewGrid.id, lang.hitch(this, function(page){
				console.log(page);
			}));

			Topic.subscribe("navigateToSubsystemsSubTab", lang.hitch(this, function(val){

				var encodedClassKeyword = encodeURIComponent('"' + val + '"');
				var searchHashParam = "eq(superclass," + encodedClassKeyword + ")"

				var newState = lang.mixin({}, this.state, {hashParams:
					lang.mixin({}, {filter: searchHashParam})
				});

				this.state = newState;
				this.tabContainer.selectChild(this.subsystemsGrid);
			}));

			Topic.subscribe("navigateToSubsystemsSubTabSuperclass", lang.hitch(this, function(val){

				var encodedClassKeyword = encodeURIComponent('"' + val + '"');
				var searchHashParam = "eq(superclass," + encodedClassKeyword + ")"

				var newState = lang.mixin({}, this.state, {hashParams:
					lang.mixin({}, {filter: searchHashParam})
				});

				this.state = newState;
				//this.tabContainer.selectChild(this.genesGrid);
				this.tabContainer.selectChild(this.subsystemsGrid);
			}));

			Topic.subscribe("navigateToSubsystemsSubTabClass", lang.hitch(this, function(val){

				var encodedClassKeyword = encodeURIComponent('"' + val + '"');
				var searchHashParam = "eq(class," + encodedClassKeyword + ")"

				var newState = lang.mixin({}, this.state, {hashParams:
					lang.mixin({}, {filter: searchHashParam})
				});

				this.state = newState;
				//this.tabContainer.selectChild(this.genesGrid);
				this.tabContainer.selectChild(this.subsystemsGrid);
			}));

			Topic.subscribe("navigateToSubsystemsSubTabSubclass", lang.hitch(this, function(val){

				var encodedClassKeyword = encodeURIComponent('"' + val + '"');
				var searchHashParam = "eq(subclass," + encodedClassKeyword + ")"

				var newState = lang.mixin({}, this.state, {hashParams:
					lang.mixin({}, {filter: searchHashParam})
				});

				this.state = newState;
				//this.tabContainer.selectChild(this.genesGrid);
				this.tabContainer.selectChild(this.subsystemsGrid);
			}));

			Topic.subscribe("navigateToSubsystemsSubTabFromCoverageBar", lang.hitch(this, function(){
				this.tabContainer.selectChild(this.subsystemsGrid);
			}));

			this._firstView = true;
		}
	})
});
