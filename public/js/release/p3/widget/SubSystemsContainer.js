define("p3/widget/SubSystemsContainer", [
	"dojo/_base/declare", "dijit/layout/BorderContainer", "dojo/on", "dojo/_base/lang",
	"./ActionBar", "./ContainerActionBar", "dijit/layout/StackContainer", "dijit/layout/TabController",
	"./SubSystemsMemoryGridContainer", "dijit/layout/ContentPane", "./GridContainer", "dijit/TooltipDialog",
	"../store/SubSystemMemoryStore", "dojo/dom-construct", "dojo/topic", "./GridSelector"
], function(declare, BorderContainer, on, lang,
			ActionBar, ContainerActionBar, TabContainer, StackController,
			SubSystemsGridContainer, ContentPane, GridContainer, TooltipDialog,
			SubSystemMemoryStore, domConstruct, topic, selector){
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
		// console.log("REL: ", rel);
		var selection = self.actionPanel.get('selection');
		var dataType = (self.actionPanel.currentContainerWidget.containerType == "genome_group") ? "genome" : "genome_feature";
		var currentQuery = self.actionPanel.currentContainerWidget.get('query');
		// console.log("selection: ", selection);
		// console.log("DownloadQuery: ", dataType, currentQuery);
		window.open("/api/" + dataType + "/" + currentQuery + "&http_authorization=" + encodeURIComponent(window.App.authorizationToken) + "&http_accept=" + rel + "&http_download");
		popup.close(downloadTT);
	});

	return declare([BorderContainer], {
		gutters: false,
		state: null,
		maxGenomeCount: 500,
		tooltip: 'The "Pathways" tab contains a list of pathways for genomes associated with the current view',
		apiServer: window.App.dataServiceURL,
		//defaultFilter: "eq(annotation,%22PATRIC%22)",

		postCreate: function(){
			this.inherited(arguments);
			this.watch("state", lang.hitch(this, "onSetState"));
		},

		onSetState: function(attr, oldVal, state){
			//console.log("PathwaysContainer set STATE.  state: ", state, " First View: ", this._firstView);

			if(!state){
				return;
			}

			if(this.tabContainer && this.tabContainer.selectedChildWidget && this._firstView && !this.tabContainer.selectedChildWidget.state){
				this.tabContainer.selectedChildWidget.set('state', state);
			}

			if(state.autoFilterMessage){
				var msg = '<table><tr style="background: #f9ff85;"><td><div class="WarningBanner">' + state.autoFilterMessage + "&nbsp;<i class='fa-1x icon-question-circle-o DialogButton' rel='help:/misc/GenomesLimit' /></div></td><td style='width:30px;'><i style='font-weight:400;color:#333;cursor:pointer;' class='fa-1x icon-cancel-circle close closeWarningBanner' style='color:#333;font-weight:200;'></td></tr></table>";
				// var msg = state.autoFilterMessage;
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

			// this._set("state", state);
		},

		visible: false,
		_setVisibleAttr: function(visible){

			this.visible = visible;

			if(this.visible && !this._firstView){
				this.onFirstView();

				// if(this.pathwaysGrid){
				// 	this.pathwaysGrid.set("visible", true)
				// }

			}
		},

		selectChild: function(child){
			topic.publish(this.id + "-selectChild", child);
		},

		onFirstView: function(){
			if(this._firstView){
				return;
			}
			//console.log("PathwaysContainer onFirstView()");
			this.tabContainer = new TabContainer({region: "center", id: this.id + "_TabContainer"});

			var tabController = new StackController({
				containerId: this.id + "_TabContainer",
				region: "top",
				"class": "TextTabButtons"
			});

			var subsystemStore = this.subsystemStore = new SubSystemMemoryStore({
				type: "subsystem"
			});

			this.subsystemsGrid = new SubSystemsGridContainer({
				title: "Subsystems",
				type: "subsystem",
				// state: this.state,
				apiServer: this.apiServer,
				defaultFilter: this.defaultFilter,
				store: subsystemStore,
				facetFields: ["subclass"],
				queryOptions: {
					sort: [{attribute: "subsystem_id"}]
				},
				enableFilterPanel: true,
				visible: true
			});

			this.addChild(tabController);
			this.addChild(this.tabContainer);
			this.tabContainer.addChild(this.subsystemsGrid);

			
			topic.subscribe(this.id + "_TabContainer-selectChild", lang.hitch(this, function(page){
				page.set('state', this.state)
			}));

			this._firstView = true;
		}

	})
});

