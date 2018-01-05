define([
  "dojo/_base/declare", "dijit/layout/BorderContainer", "dojo/on", "dojo/_base/Deferred",
  "dojo/dom-class", "dijit/layout/ContentPane", "dojo/dom-construct", "dijit/Tooltip",
  "dojo/_base/xhr", "dojo/_base/lang", "./PageGrid", "./formatter", "../store/SubsystemsOverviewMemoryStore", "dojo/request",
  "dojo/aspect", "./GridSelector", "dojo/when", "d3/d3", "dojo/Stateful", "dojo/topic", "../util/PathJoin", "dojo/promise/all", "./DataVisualizationTheme"
], function(declare, BorderContainer, on, Deferred,
      domClass, ContentPane, domConstruct, Tooltip,
      xhr, lang, Grid, formatter, SubsystemsOverviewMemoryStore, request,
      aspect, selector, when, d3, Stateful, Topic, PathJoin, All, Theme){
  return declare([Stateful], {
    store: null,
    subsystemSvg: null,
    genomeView: false,
    subsystemReferenceData: {},

    constructor: function(){

      this.watch("state", lang.hitch(this, "onSetState"));
    },

    superClassColorCodes: {
      "CELLULAR PROCESSES":                   Theme.colors[0],
      "MEMBRANE TRANSPORT":                   Theme.colors[1],
      "METABOLISM":                           Theme.colors[2],
      "REGULATION AND CELL SIGNALING":        Theme.colors[3],
      "STRESS RESPONSE, DEFENSE, VIRULENCE":  Theme.colors[4],
      "CELL ENVELOPE":                        Theme.colors[5],
      "CELLULAR PROCESSES":                   Theme.colors[6],
      "DNA PROCESSING":                       Theme.colors[7],
      "ENERGY":                               Theme.colors[8],
      "MEMBRANE TRANSPORT":                   Theme.colors[9],
      "METABOLISM":                           Theme.colors[10],
      "MISCELLANEOUS":                        Theme.colors[11],
      "PROTEIN PROCESSING":                   Theme.colors[12],
      "REGULATION AND CELL SIGNALING":        Theme.colors[13],
      "RNA PROCESSING":                       Theme.colors[14],
      "STRESS RESPONSE, DEFENSE, VIRULENCE":  Theme.colors[15]
    },


    // x + "Other" as aggregation of what is left over
    subsystemMaxNumToDisplay: 16,

    onSetState: function(attr, oldState, state){

      var ov, nv;
      if(oldState){
        ov = oldState.search;
        if(oldState.hashParams.filter){
          ov = ov + oldState.hashParams.filter;
        }
      }

      if(state){
        nv = state.search;
        if(state.hashParams.filter){
          nv = nv + state.hashParams.filter;
        }
      }

      this.state = state;

      if(!this.store){
        this.set('store', this.createStore(this.apiServer, this.apiToken || window.App.authorizationToken, state));
      }else{
        this.store.set("state", lang.mixin({}, state));
      }
      
      var that = this;

      Deferred.when(this.store.query(), function(data) {
        if (!oldState) {
          that.subsystemReferenceData = $.extend(true, [], data);
          that.drawSubsystemPieChartGraph(data);
        }
        
      });
    },

    //function is coupled because color data is used across circle and tree to match
    //color data is rendered via d3 library programmatically
    drawSubsystemPieChartGraph: function(subsystemData) {

      var that = this;

      var titleText; 

      if (this.state.genome) {
        this.genomeView = true;
        titleText = this.state.genome.genome_name
      } 
      else if (this.state.taxonomy) {
        titleText = this.state.taxonomy.taxon_name
      } 
      else {
        titleText = "";
      }

      //var formattedSubsystemData = this.formatSubsystemData(subsystemData);

      var width = $( window ).width() * .85;
      var height = $( window ).height() * .6;

      var radius = Math.min(width, height) / 2 - 50;

      var color = d3.scale.category20();

      var svg = d3.select('#subsystemspiechart')
        .append('svg')
        .attr("id", "piechart")
        .attr("class", "summarychart")
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + (height / 2 + 200) +
          ',' + (height / 2 + 50) + ')');

      d3.select('#subsystemspiechart svg')
        .append("text")
        .attr("x", height / 2 + 200)             
        .attr("y", 50)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", "14px")
        .text("Subsystem Category Distribution - " + titleText);

      var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(radius);

      var pie = d3.layout.pie()
        .value(function(d) { return d.count; })
        .sort(null);

      var path = svg.selectAll('path')
        .data(pie(subsystemData))
        .enter()
        .append('path')
        .attr('d', arc)
        .on("mouseover", function(d) {
          return tooltip.style("visibility", "visible").text(d.data.val + " (" + d.data.count + ")");
        })
        .on("click", function(d) {
          that.navigateToSubsystemsSubTab(d);
        })
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
        .style("stroke", "#000")
        .attr("stroke-width", "1px")
        .attr('fill', function(d) {
          //return color(d.data.val + " (" + d.data.count + ")");
          return that.superClassColorCodes[d.data.val.toUpperCase()]
      });

      this.drawSubsystemLegend(subsystemData, svg, radius, false);

      var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("background-color", "white")
        .style("visibility", "hidden")

      if (this.genomeView) {
        var summaryBarWidth = width / 4;
        var summaryBarHeight = height;

        this.getSubsystemCoverageData(summaryBarWidth, summaryBarHeight);
      }
    },

    selectedSuperclass: "",

    drawSubsystemLegend: function(subsystemData, svg, radius, legendExpandedClassData) {
      
      var that = this;

      var margin = {left: 60};
      var legendRectSize = 18;
      var legendSpacing = 4;

      subsystemData.forEach(function(data) {
        data.colorCodeKey = data.val.toUpperCase();
      });

      //deep copy, not a reference
      var originalSubsystemData = $.extend(true, [], subsystemData);
      d3.select("#legendHolder").remove();
      //add class data to superclass data in correct order
      if (legendExpandedClassData) { 
        
        legendExpandedClassData.class.buckets.forEach(function(classData) {
          classData.baseClass = true;
          classData.colorCodeKey = legendExpandedClassData.colorCodeKey;
        })
        var superClassIndex = subsystemData.map(function(e) { return e.val; }).indexOf(legendExpandedClassData.val);
        for (var i = 0; i < legendExpandedClassData.class.buckets.length; i++) {
          //place behind index
          var index = superClassIndex + i + 1;
          subsystemData.splice(index, 0, legendExpandedClassData.class.buckets[i]);
        }
      }

      var legendHolder = svg.append('g')
        .attr('transform', "translate(" + (margin.left + radius) + ",0)")
        .attr("id", "legendHolder");

      var subsystemslegend = legendHolder.selectAll('.subsystemslegend')
        .data(subsystemData)
        .enter()
        .append('g')
        .attr('class', 'subsystemslegend')
        .attr('transform', function(d, i) {
          var height = legendRectSize + legendSpacing;
          var offset =  height * subsystemData.length / 2;
          var horz = -1 * legendRectSize;
          var vert = i * height - offset;
          return 'translate(' + horz + ',' + vert + ')';
      });

      var legendCount = legendHolder.selectAll('.subsystemslegend').size();
      if (legendExpandedClassData) {
        legendCount += legendExpandedClassData.class.buckets.length;
      }
      var legendTitleOffset = legendCount * legendRectSize / 2 + 30;

      legendHolder.append('text')
        .attr('x', 0)
        .attr('y', -legendTitleOffset)
        .style("font-weight", "bold")
        .style("font-size", "14px")
        .text("Subsystem Superclass Counts");

      subsystemslegend.append("text")
        .attr("style","font-family:FontAwesome;")
        .attr('font-size', "20px" )
        .attr('x', function(d) { 
          if (d.hasOwnProperty("baseClass")) {
            return 20;
          } else {
            return 0;
          }
        })
        .attr('y', '16px')
        .text(function(d) { 
          if (d.hasOwnProperty("baseClass")) {
            return;
          } else {
            return '\uf054' 
          }
        })
        .on("click", function(d) {
          if (!d.baseClass) {
            //used to close an opened node
            if (that.selectedSuperclass === d.colorCodeKey) {
              d = false;
            }
            that.selectedSuperclass = d.colorCodeKey;
            that.drawSubsystemLegend(originalSubsystemData, svg, radius, d);
          }
        });

      subsystemslegend.append('rect')
        .attr('x', function(d) { 
          if (d.hasOwnProperty("baseClass")) {
            return 20 + legendRectSize;
          } else {
            return 0 + legendRectSize;
          }
        })
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)                                  
        .style('fill', function(d) { 
          return that.superClassColorCodes[d.colorCodeKey]
        })
        .style('stroke',function(d) { 
          return that.superClassColorCodes[d.colorCodeKey]
        })
        .on("click", function(d) {
          if (d.hasOwnProperty("baseClass")) {
            that.navigateToSubsystemsSubTabClass(d);
          } else {
            that.navigateToSubsystemsSubTabSuperclass(d);
          }
        });
        
      subsystemslegend.append('text')
        .attr('x', function(d) { 
          if (d.hasOwnProperty("baseClass")) {
            return legendRectSize + legendRectSize + legendSpacing + 20;
          } else {
            return legendRectSize + legendRectSize + legendSpacing;
          }
        })
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d) { return d.val + " (" + d.count + ")"; })
        .on("click", function(d) {
          if (d.hasOwnProperty("baseClass")) {
            that.navigateToSubsystemsSubTabClass(d);
          } else {
            that.navigateToSubsystemsSubTabSuperclass(d);
          }
          
        });
        this.setSubsystemPieGraph();
    },

    getTotalSubsystems: function() {
      var def = new Deferred();
      //total subsystems
      var query = "?and(eq(genome_id," + this.state.genome.genome_id + "))&limit(1)"
      when(request.get(PathJoin(window.App.dataAPI, 'subsystem/', query), {
        handleAs: 'json',
        headers: {
          'Accept': "application/solr+json",
          'Content-Type': "application/rqlquery+x-www-form-urlencoded",
          'X-Requested-With': null,
          'Authorization': (window.App.authorizationToken || "")
        }
      }), function(data){
        def.resolve(data.response.numFound);
      }, function(err){
        console.log(err)
      });
      return def.promise;
    },

    getTotalSubsystemsHypothetical: function() {
      var def = new Deferred();
       //total subsystems hypothetical
      var query = "?and(eq(genome_id," + this.state.genome.genome_id + "),eq(product,*hypothetical*protein*))&limit(1)"
      when(request.get(PathJoin(window.App.dataAPI, 'subsystem/', query), {
        handleAs: 'json',
        headers: {
          'Accept': "application/solr+json",
          'Content-Type': "application/rqlquery+x-www-form-urlencoded",
          'X-Requested-With': null,
          'Authorization': (window.App.authorizationToken || "")
        }
      }), function(data){
        def.resolve(data.response.numFound);
      }, function(err){
        console.log(err)
      });
      return def.promise;
    },

    getTotalGenomes: function() {
      var def = new Deferred();
      //total genome features
      var query = "?and(eq(genome_id," + this.state.genome.genome_id + "),eq(annotation,PATRIC))&limit(1)"
      when(request.get(PathJoin(window.App.dataAPI, 'genome_feature/', query), {
        handleAs: 'json',
        headers: {
          'Accept': "application/solr+json",
          'Content-Type': "application/rqlquery+x-www-form-urlencoded",
          'X-Requested-With': null,
          'Authorization': (window.App.authorizationToken || "")
        }
      }), function(data){
        def.resolve(data.response.numFound);
      }, function(err){
        console.log(err)
      });
      return def.promise;
    },

    getTotalGenomesHypothetical: function() {
      var def = new Deferred();
      //total genome features hypothetical
      var query = "?and(eq(genome_id," + this.state.genome.genome_id + "),eq(annotation,PATRIC),eq(product,hypothetical+protein))&limit(1)"
      when(request.get(PathJoin(window.App.dataAPI, 'genome_feature/', query), {
        handleAs: 'json',
        headers: {
          'Accept': "application/solr+json",
          'Content-Type': "application/rqlquery+x-www-form-urlencoded",
          'X-Requested-With': null,
          'Authorization': (window.App.authorizationToken || "")
        }
      }), function(data){
        def.resolve(data.response.numFound);
      }, function(err){
        console.log(err)
      });
      return def.promise;
    },

    getSubsystemCoverageData: function(width, height) {
      var that = this;

      All({
        totalSubsystems:              this.getTotalSubsystems(),
        totalSubsystemsHypothetical:  this.getTotalSubsystemsHypothetical(),
        totalGenomes:                 this.getTotalGenomes(),
        totalGenomesHypothetical:     this.getTotalGenomesHypothetical()
      }).then(function(subsystemCoverageData) {
        that.renderSubsystemCoverageData(subsystemCoverageData, width, height);
      });
    },

    renderSubsystemCoverageData: function(subsystemCoverageData, width, height) {

      var that = this;

      subsystemCoverageData.totalSubsystemsNotHypothetical = subsystemCoverageData.totalSubsystems - subsystemCoverageData.totalSubsystemsHypothetical;
      subsystemCoverageData.totalNotCovered = subsystemCoverageData.totalGenomes - subsystemCoverageData.totalSubsystems;
      subsystemCoverageData.totalNotCoveredHypothetical = subsystemCoverageData.totalGenomesHypothetical - subsystemCoverageData.totalSubsystemsHypothetical;
      subsystemCoverageData.totalNotCoveredNotHypothetical = subsystemCoverageData.totalNotCovered - subsystemCoverageData.totalNotCoveredHypothetical;

      var proportionCovered = (subsystemCoverageData.totalSubsystems / subsystemCoverageData.totalGenomes).toFixed(2);
      var proportionNotCovered = (subsystemCoverageData.totalNotCovered / subsystemCoverageData.totalGenomes).toFixed(2);

      var marginAdjustedTotalbarHeight = height * .7;
      var marginTop = height - marginAdjustedTotalbarHeight;

      var divHeightCovered = proportionCovered * marginAdjustedTotalbarHeight;
      var divHeightNotCovered = proportionNotCovered * marginAdjustedTotalbarHeight;

      var percentCovered = proportionCovered * 100;
      var percentNotCovered = proportionNotCovered * 100;

      var totalHeight = divHeightCovered + divHeightNotCovered;

      var svg = d3.select("#subsystemspiechart svg"),
          margin = {top: 0, right: 20, bottom: 30, left: 100},
          width = +svg.attr("width") - margin.left - margin.right,
          height = +svg.attr("height") - margin.top - margin.bottom,
          g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var coveredRect = svg.append("rect")
                          .attr("x", 120)
                          .attr("y", marginTop)
                          .attr("width", 50)
                          .style("fill", "#399F56")
                          .attr("id", "subsystemsCovered")
                          .attr("height", divHeightCovered)
                          .on("click", function() {
                            that.navigateToSubsystemsSubTabFromCoverageBar();
                          });

      var notCoveredRect = svg.append("rect")
                            .attr("x", 120)
                            .attr("y", divHeightCovered + marginTop)
                            .attr("width", 50)
                            .style("fill", "#3F6993")
                            .attr("id", "subsystemsNotCovered")
                            .attr("height", divHeightNotCovered)
                            .on("click", function() {
                              that.navigateToSubsystemsSubTabFromCoverageBar();
                            });

      svg.append("text")
        .attr("x", 150)             
        .attr("y", 100)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", "14px")
        .text("Subsystem Coverage");

      //percentages
      svg.append("text")
        .attr("x", 145)             
        .attr("y", divHeightCovered / 2 + height / 3)
        .attr("text-anchor", "middle")
        .style("fill", "#ffffff")
        .text(percentCovered + "%");

      svg.append("text")
        .attr("x", 145)             
        .attr("y", divHeightNotCovered / 2 + divHeightCovered + height / 3)
        .attr("text-anchor", "middle")
        .style("fill", "#ffffff")
        .text(percentNotCovered + "%");

      //reset print svg to include new graph after long api call
      this.setSubsystemPieGraph();

      new Tooltip({
        connectId: ["subsystemsCovered"],
        label: "<b>In Subsystem</b></br>"
              + "Total (" + subsystemCoverageData.totalSubsystems + ")</br>"
              + "Non-Hypothetical (" + subsystemCoverageData.totalSubsystemsNotHypothetical + ")</br>"
              + "Hypothetical (" + subsystemCoverageData.totalSubsystemsHypothetical + ")"
      });

      new Tooltip({
        connectId: ["subsystemsNotCovered"],
        label: "<b>Not In Subsystem</b></br>"
              + "Total (" + subsystemCoverageData.totalNotCovered + ")</br>"
              + "Non-Hypothetical (" + subsystemCoverageData.totalNotCoveredNotHypothetical + ")</br>"
              + "Hypothetical (" + subsystemCoverageData.totalNotCoveredHypothetical + ")"
      });
    },

    navigateToSubsystemsSubTab: function(d) {
      switch (d.data.val) {
        case "Other":
          //do nothing
          break;
        default:
          Topic.publish("navigateToSubsystemsSubTab", d.data.val);
          break;
      }
    },

    navigateToSubsystemsSubTabSuperclass: function(d) {
      switch (d.val) {
        case "Other":
          //do nothing
          break;
        default:
          Topic.publish("navigateToSubsystemsSubTabSuperclass", d.val);
          break;
      }
    },

    navigateToSubsystemsSubTabClass: function(d) {
      switch (d.val) {
        case "Other":
          //do nothing
          break;
        default:
          Topic.publish("navigateToSubsystemsSubTabClass", d.val);
          break;
      }
    },

    navigateToSubsystemsSubTabFromCoverageBar: function() {
      Topic.publish("navigateToSubsystemsSubTabFromCoverageBar");
    },

    setSubsystemPieGraph: function () {

      var html = d3.select("svg")
          .attr("title", "svg_title")
          .attr("version", 1.1)
          .attr("xmlns", "http://www.w3.org/2000/svg")
          .node().parentNode.innerHTML;
    
      this.subsystemSvg = html;
    },

    getSubsystemPieGraph: function() {
      return this.subsystemSvg;
    },

    createStore: function(server, token, state){
      if(this.store){
        return this.store
      }

      return new SubsystemsOverviewMemoryStore({
        token: window.App.authorizationToken,
        apiServer: window.App.dataServiceURL,
        state: this.state,
        type: "subsystems_overview"
      });
    }
  });
});
