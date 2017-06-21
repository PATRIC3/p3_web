define([
  "dojo/_base/declare", "dijit/layout/BorderContainer", "dojo/on", "dojo/_base/Deferred",
  "dojo/dom-class", "dijit/layout/ContentPane", "dojo/dom-construct",
  "dojo/_base/xhr", "dojo/_base/lang", "./PageGrid", "./formatter", "../store/SubsystemsOverviewMemoryStore", "dojo/request",
  "dojo/aspect", "./GridSelector", "dojo/when", "d3/d3", "dojo/Stateful", "dojo/topic"
], function(declare, BorderContainer, on, Deferred,
      domClass, ContentPane, domConstruct,
      xhr, lang, Grid, formatter, SubsystemsOverviewMemoryStore, request,
      aspect, selector, when, d3, Stateful, Topic){
  return declare([Stateful], {
    store: null,
    subsystemSvg: null,

    constructor: function(){

      this.watch("state", lang.hitch(this, "onSetState"));
    },

    // x + "Other" as aggregation of what is left over
    subsystemMaxNumToDisplay: 10,

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
          that.drawGraphAndLegend(data);
        }
        
      });
    },

    //subsystemData is returned in descending order by count. This code depends on that. 
    applyMaxLimitToSubsystemPieCharts: function(subsystemData) {
      if (this.subsystemMaxNumToDisplay >= subsystemData.length) {
        return subsystemData;
      } else {
        var maxLimitedPieChartData = subsystemData.splice(0, this.subsystemMaxNumToDisplay);
        var subsystemsOtherCategory = {};
        subsystemsOtherCategory.val = "Other";
        subsystemsOtherCategory.count = 0;

        for (var i = 0; i < subsystemData.length; i++) {
          subsystemsOtherCategory.count += subsystemData[i].count;
        };

        maxLimitedPieChartData.push(subsystemsOtherCategory);
        return maxLimitedPieChartData;
      }
    },

    //function is coupled because color data is used across circle and tree to match
    //color data is rendered via d3 library programmatically
    drawGraphAndLegend: function(subsystemData) {

      var that = this;

      var maxLimitedPieChartData = this.applyMaxLimitToSubsystemPieCharts(subsystemData);

      var width = $( window ).width() * .85;
      var height = $( window ).height() * .5;

      var radius = Math.min(width, height) / 2 - 50;

      var legendRectSize = 18;
      var legendSpacing = 4;

      var color = d3.scale.category20();

      var svg = d3.select('#subsystemspiechart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + (height / 2 + 100) +
          ',' + (height / 2 + 50) + ')');

      d3.select('#subsystemspiechart svg')
        .append("text")
        .attr("x", height / 2 + 100)             
        .attr("y", 50)
        .attr("text-anchor", "middle")
        .text(this.state.genome.genome_name);

      var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(radius);

      var pie = d3.layout.pie()
        .value(function(d) { return d.count; })
        .sort(null);

      var path = svg.selectAll('path')
        .data(pie(maxLimitedPieChartData))
        .enter()
        .append('path')
        .attr('d', arc)
        .on("mouseover", function(d) {
          return tooltip.style("visibility", "visible").text(d.data.val);
        })
        .on("click", function(d) {
          that.navigateToSubsystemsSubTab(d);
        })
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
        .attr('fill', function(d) {
          return color(d.data.val + " (" + d.data.count + ")");
      });

      var margin = {left: 60};

      var legendHolder = svg.append('g')
        .attr('transform', "translate(" + (margin.left + radius) + ",0)")

      var subsystemslegend = legendHolder.selectAll('.subsystemslegend')
          .data(color.domain())
          .enter()
          .append('g')
          .attr('class', 'subsystemslegend')
          .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var horz = -2 * legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

      subsystemslegend.append('rect')
          .attr("x", 0)
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)                                   
          .style('fill', color)
          .style('stroke', color);
        
      subsystemslegend.append('text')
          .attr('x', legendRectSize + legendSpacing)
          .attr('y', legendRectSize - legendSpacing)
          .text(function(d) { return d; });

      var tooltip = d3.select("body")
          .append("div")
          .style("position", "absolute")
          .style("z-index", "10")
          .style("visibility", "hidden")

      this.setSubsystemPieGraph();
    },

    navigateToSubsystemsSubTab: function(d) {

        switch (d.data.val) {
          case "Other":
            //do nothing
            break;
          default:
            Topic.publish("navigateToSubsystemsSubTab", d.data);
            break;
        }
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
