require({cache:{
'url:p3/widget/templates/GlobalSearch.html':"<div class=\"GlobalSearch\">\n\t<table style=\"width:100%;\">\n\t\t<tbody>\n\t\t\t<tr>\n\t\t\t\t<td style=\"width:120px\">\n\t\t\t\t\t<span data-dojo-attach-point=\"searchFilter\" data-dojo-type=\"dijit/form/Select\" style=\"display:inline-block;width:100%\">\n\t\t\t\t\t\t<option selected=\"true\" value=\"everything\">All Data Types</option>\n\t\t\t\t\t\t<option value=\"genomes\">Genomes</option>\n\t\t\t\t\t\t<option value=\"genome_features\">Genomic Features</option>\n\t\t\t\t\t\t<option value=\"sp_genes\">Specialty Genes</option>\n\t\t\t\t\t\t<option value=\"taxonomy\">Taxa</option>\n\t\t\t\t\t\t<option value=\"transcriptomics_experiments\">Transcriptomics Experiments</option>\n\t\t\t\t\t\t<option value=\"antibiotic\">Antibiotic</option>\n\t\t\t\t\t\t<!--\n\t\t\t\t\t\t<option value=\"workspaces\">Workspaces</option>-->\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-event=\"onChange:onInputChange,keypress:onKeypress\" data-dojo-attach-point=\"searchInput\" style=\"width:100%;\"/>\n\t\t\t\t</td>\n\t\t\t\t<td style=\"width:1em;padding:2px;font-size:1em;\"><i class=\"fa fa-1x icon-search\" data-dojo-attach-event=\"click:onClickAdvanced\" title=\"Advanced Search\"/></td>\n\t\t\t\t<td style=\"width:1em;padding:2px;font-size:1em;\"><i class='fa fa-1x icon-question-circle-o DialogButton' rel='help:/misc/GlobalSearchOptions' title=\"Select search options from the dropdown list. Click to view the help information\"/></td>\n\t\t\t\t<td style=\"width:50px\">\n\t\t\t\t\t<span data-dojo-attach-point=\"searchOption\" data-dojo-type=\"dijit/form/Select\" style=\"display:inline-block;width:100%\">\n\t\t\t\t\t\t<option selected=\"true\" value=\"option_and\">All terms</option>\n\t\t\t\t\t\t<option value=\"option_or\">Any term</option>\n\t\t\t\t\t\t<option value=\"option_and2\">All exact terms</option>\n\t\t\t\t\t\t<option value=\"option_or2\">Any exact term</option>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</tbody>\n\t</table>\n</div>\n"}});
define("p3/widget/GlobalSearch", [
	"dojo/_base/declare", "dijit/_WidgetBase", "dojo/on", "dojo/dom-construct",
	"dojo/dom-class", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/GlobalSearch.html", "./Button", "dijit/registry", "dojo/_base/lang",
	"dojo/dom", "dojo/topic", "dijit/form/TextBox", "dojo/keys", "dijit/_FocusMixin", "dijit/focus",
	"../util/searchToQuery", "../util/searchToQueryWithOr", "../util/searchToQueryWithQuoteOr", "../util/searchToQueryWithQuoteAnd"
], function(declare, WidgetBase, on, domConstruct,
			domClass, Templated, WidgetsInTemplate,
			template, Button, Registry, lang,
			dom, Topic, TextBox, keys, FocusMixin, focusUtil,
			searchToQuery, searchToQueryWithOr, searchToQueryWithQuoteOr, searchToQueryWithQuoteAnd
){

	function processQuery(query, searchOption){
		//console.log("processQuery query: ", query, "searchOption: ", searchOption);	
		query = query.replace(/'/g, "").replace(/:/g, " ");
					
		var keywords = query.split(/\s/);
		// console.log("keywords", keywords);
		
		// Add quotes for IDs: handle fig id (e.g. fig|83332.12.peg.1),  genome id (e.g. 83332.12), EC number (e.g. 2.1.1.1), other ids with number.number, number only, IDs ending with numbers (at least 1 digit). 		
		for (var i=0; i<keywords.length; i++){
			if (keywords[i].charAt(0) != '"' && keywords[i].charAt(keywords[i].length-1) != '"'){ // if not already quoted
				// if (keywords[i].match(/^fig\|[0-9]+/) != null || keywords[i].match(/[0-9]+\.[0-9]+/) != null || keywords[i].match(/^[0-9]+$/) != null || keywords[i].match(/[0-9]+$/) != null){
				if (keywords[i].match(/^fig\|[0-9]+/) != null || keywords[i].match(/[0-9]+\.[0-9]+/) != null || keywords[i].match(/[0-9]+$/) != null){
					keywords[i] = '"' + keywords[i] + '"';
				}
			}				
		}
		query = keywords.join(" ");

		var q = searchToQuery(query);

		if (searchOption == "option_or") {
			q = searchToQueryWithOr(query);
		}
		else if (searchOption == "option_or2") {
			q = searchToQueryWithQuoteOr(query);
		}
		else if (searchOption == "option_and2") {
			q = searchToQueryWithQuoteAnd(query);
		}
		
		return q;
	}
	
	return declare([WidgetBase, Templated, WidgetsInTemplate, FocusMixin], {
		templateString: template,
		"baseClass": "GlobalSearch",
		"disabled": false,
		"value": "",
		_setValueAttr: function(q){
			this.query = q;
			this.searchInput.set("value", q);
		},

		onKeypress: function(evt){
			if(evt.charOrCode == keys.ENTER){
				var query = this.searchInput.get('value').replace(/^\s+|\s+$/g, '');
				var searchFilter = this.searchFilter.get('value');
				var searchOption = this.searchOption.get('value');
				if(!query || !query.match(/[a-z0-9]/i)){
					return;
				}

				console.log("Search Filter: ", searchFilter, "searchOption=", searchOption);
				var q = processQuery(query, searchOption);
				console.log("Search query q=: ", q);

				var clear = false;
				switch(searchFilter){
					case "everything":
						Topic.publish("/navigate", {href: "/search/?" + q});
						clear = true;
						break;
					case "sp_genes":
						Topic.publish("/navigate", {href: "/view/SpecialtyGeneList/?" + q});
						clear = true;
						break;
					case "genome_features":
						Topic.publish("/navigate", {href: "/view/FeatureList/?" + q + "#view_tab=features&defaultSort=-score"});
						clear = true;
						break;
					case "genomes":
						Topic.publish("/navigate", {href: "/view/GenomeList/?" + q});
						clear = true;
						break;
					case "transcriptomics_experiments":
						Topic.publish("/navigate", {href: "/view/TranscriptomicsExperimentList/?" + q});
						clear = true;
						break;
					case "taxonomy":
						Topic.publish("/navigate", {href: "/view/TaxonList/?" + q});
						clear = true;
						break;
					case "antibiotic":
						Topic.publish("/navigate", {href: "/view/AntibioticList/?" + q});
						clear = true;
						break;
					default:
						console.log("Do Search: ", searchFilter, query);
				}

				//disabled for now per #978
				// if(clear){
					// this.searchInput.set("value", '');
				// }

				on.emit(this.domNode, "dialogAction", {action: "close", bubbles: true});

				if(window.ga){
					window.ga('send', 'pageview', '/search?keyword=' + encodeURIComponent(query) + "&cat=" + searchFilter);
				}
				console.log("Do Search: ", searchFilter, query);
			}
		},
		onClickAdvanced: function(evt){
			var query = this.searchInput.get('value').replace(/^\s+|\s+$/g, '');
			var searchFilter = this.searchFilter.get('value');
			var searchOption = this.searchOption.get('value');

			if(!query || !query.match(/[a-z0-9]/i)){
				return;
			}

			var q = processQuery(query, searchOption);

			Topic.publish("/navigate", {href: "/search/" + (q?("?"+q):"")});
			// this.searchInput.set("value", '');
		},
		onInputChange: function(val){

		}
	});
});


