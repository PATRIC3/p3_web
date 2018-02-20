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
    subsystemReferenceData: [],
    expandedSubsystemData: [],
    firstLoad: true,
    establishProps: true,
    selectedClassDictionary: {},

    constructor: function(){
      //https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css
      $('head').append("<link rel=\"stylesheet\" href=\"//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css\">");
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
          that.drawSubsystemPieChartGraph(data);
        }
        
      });
    },

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

      var width = $( window ).width() * .85;
      var height = $( window ).height() * .6;

      if (height < 450) {
        height = 450;
      }

      if (width < 800) {
        width = 800;
      }

      var radius = Math.min(width, height) / 2 - 50;

      var color = d3.scale.category20();

      var svg = d3.select('#subsystemspiechart')
        .append('svg')
        .attr("id", "piechart")
        .attr("class", "summarychart")
        .attr('width', width * 2)
        .attr('height', height * 2)
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
          if (that.superClassColorCodes.hasOwnProperty(d.data.val.toUpperCase())) {
            return that.superClassColorCodes[d.data.val.toUpperCase()]
          } 
          else {
            return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
          }
          
      });

      this.drawSubsystemLegend(subsystemData, svg, radius, false, false);

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

    getArrayIndex: function(arr, value) {
      for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i].val === value) {
          return i;
        }
      }
    },

    drawSubsystemLegend: function(subsystemData, svg, radius, parentClassData, childClassData) {
      
      var that = this;

      var margin = {left: 60};
      var legendRectSize = 14;
      var legendSpacing = 5;

      subsystemData.forEach(function(data) {
        data.colorCodeKey = data.val.toUpperCase();
        data.chevronOpened = true;
      });

      var legendTitleOffset = 100;
      var legendHorizontalOffset = (radius + 50) * 2 + 200;

      if (that.firstLoad) {
        that.subsystemReferenceData = $.extend(true, [], subsystemData);
        that.firstLoad = false;

        //only render legend title once
        d3.select("#subsystemspiechart svg").append('text')
          .attr('x', legendHorizontalOffset)
          .attr('y', legendTitleOffset)
          .attr("text-anchor", "top") 
          .style("font-weight", "bold")
          .style("font-size", "14px")
          .text("Subsystem Counts");

        d3.select("#subsystemspiechart svg").append('text')
          .attr('x', legendHorizontalOffset + 135)
          .attr('y', legendTitleOffset)
          .attr("text-anchor", "top") 
          .style("font-weight", "bold")
          .style("font-size", "14px")
          .style('fill', '#76a72d')
          .text(" (Subsystems, ");

        d3.select("#subsystemspiechart svg").append('text')
          .attr('x', legendHorizontalOffset + 230)
          .attr('y', legendTitleOffset)
          .attr("text-anchor", "top") 
          .style("font-weight", "bold")
          .style("font-size", "14px")
          .style('fill', '#ffcb00')
          .text("Genes)");
      }
      
      //deep copy, not a reference
      var originalSubsystemData = $.extend(true, [], subsystemData);
      var newSubsystemData = $.extend(true, [], subsystemData);
      d3.select("#legendHolder").remove();

      if (childClassData && childClassData !== "closeSubclass") { 
        childClassData.forEach(function(classData) {
          classData.subclassScope = true;
          classData.colorCodeKey = parentClassData.colorCodeKey;
        });
      
        var classIndex = this.getArrayIndex(originalSubsystemData, parentClassData.val)
        for (var i = 0; i < parentClassData['subclass'].buckets.length; i++) {
          //place behind index
          var index = classIndex + i + 1;
          newSubsystemData.splice(index, 0, parentClassData['subclass'].buckets[i]);
        }
      }

      if (childClassData === "closeSubclass") {
        that.expandedSubsystemData = $.extend(true, [], newSubsystemData);
      }
      else if (parentClassData && !childClassData) { 
        parentClassData['class'].buckets.forEach(function(classData) {
          classData.chevronOpened = true;
          classData.classScope = true;
          classData.colorCodeKey = parentClassData.colorCodeKey;
          if (that.establishProps) {
            that.selectedClassDictionary[classData.val] = false;
          }
        })
        that.establishProps = false;
        var superClassIndex = newSubsystemData.map(function(e) { return e.val; }).indexOf(parentClassData.val);
        for (var i = 0; i < parentClassData['class'].buckets.length; i++) {
          //place behind index
          var index = superClassIndex + i + 1;
          newSubsystemData.splice(index, 0, parentClassData['class'].buckets[i]);
        }
        that.expandedSubsystemData = $.extend(true, [], newSubsystemData);
      }

      that.closeSubclass = false;
      if (!parentClassData && !childClassData && !that.firstLoad) { 
        that.closeSubclass = true;
      }

      var legendHolder = svg.append('g')
        .attr('transform', "translate(" + (margin.left + radius) + ",0)")
        .attr("id", "legendHolder");

      var subsystemslegend = legendHolder.selectAll('.subsystemslegend')
        .data(newSubsystemData)
        .enter()
        .append('g')
        .attr('class', 'subsystemslegend')
        .attr('transform', function(d, i) {
          var height = legendRectSize + legendSpacing;
          var offset = 160;
          var horz = -1 * legendRectSize;
          var vert = i * height - offset;
          return 'translate(' + horz + ',' + vert + ')';
      });

      subsystemslegend.append("rect")
        .attr("width", "60px")
        .attr("height", "20px")
        .attr('fill', 'white')
        .attr('class', 'dgrid-expando-icon ui-icon ui-icon-triangle-1-e')
        .attr('style', function(d) { 
          if (d.hasOwnProperty("subclassScope")) {
            return "margin-left: 40px";
          } else if (d.hasOwnProperty("classScope")) {
            return "margin-left: 20px";
          } else {
            return 0;
          }
        })

      subsystemslegend.append("text")
        .attr('font-family', 'FontAwesome')
        .attr('y', 12)
        .attr('font-size', function(d) { return d.size+'em'} )
        .on("click", function(d){

          if (d.subclassScope) {
            return;
          }
          //class based level - start from scratch with reference data
          else if (!d.classScope) {
            if (that.selectedSuperclass === d.colorCodeKey) {
              d = false;
            }
            that.selectedSuperclass = d.colorCodeKey;
            if (d.chevronOpened) {
              //down
              d3.select(this).text(function(d) { return '\uf107' });
              d.chevronOpened = false;
            } else {
              //right
              d3.select(this).text(function(d) { return '\uf105' });
              d.chevronOpened = true;
            }
            that.drawSubsystemLegend(that.subsystemReferenceData, svg, radius, d, false);
          } 
          else if (d.classScope) {

            //that.selectedClassDictionary
            if (that.selectedClass === d.val) {
               that.drawSubsystemLegend(that.expandedSubsystemData, svg, radius, false, false);           
            }

            that.subclasses = d.subclass.buckets;
            that.selectedClass = d.val;
            if (that.selectedClassDictionary[d.val] === false) {
              that.selectedClassDictionary[d.val] = true;
              that.drawSubsystemLegend(that.expandedSubsystemData, svg, radius, d, that.subclasses);
            } else {
              that.selectedClassDictionary[d.val] = false;
              that.drawSubsystemLegend(that.expandedSubsystemData, svg, radius, d, "closeSubclass");
            }
          } 
        })
        .attr('x', function(d) { 
          if (d.hasOwnProperty("subclassScope")) {
            return 40;
          } else if (d.hasOwnProperty("classScope")) {
            return 20;
          } else {
            return 0;
          }
        })
        //fa-angle-down
        //.text(function(d) { return '\uf107' });
        //fa-angle-right
        .text(function(d) { return '\uf105' });
         
      subsystemslegend.append('rect')
        .attr('x', function(d) { 
          if (d.hasOwnProperty("subclassScope")) {
            return 40 + legendRectSize;
          } else if (d.hasOwnProperty("classScope")) {
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
          if (d.hasOwnProperty("classScope")) {
            that.navigateToSubsystemsSubTabClass(d);
          } else {
            that.navigateToSubsystemsSubTabSuperclass(d);
          }
        });

       subsystemslegend.append('text')
        .attr('x', function(d) { 
          if (d.hasOwnProperty("subclassScope")) {
            return legendRectSize + legendRectSize + legendSpacing + 40;
          } else if (d.hasOwnProperty("classScope")) {
            return legendRectSize + legendRectSize + legendSpacing + 20;
          } else {
            return legendRectSize + legendRectSize + legendSpacing;
          }
        })
        .attr('y', legendRectSize - legendSpacing + 2)
        .text(function(d) { 
          return d.val; 
        })
        .on("click", function(d) {
          if (d.hasOwnProperty("subclassScope")) {
            that.navigateToSubsystemsSubTabSubclass(d);
          } else if (d.hasOwnProperty("classScope")) {
            that.navigateToSubsystemsSubTabClass(d);
          } else {
            that.navigateToSubsystemsSubTabSuperclass(d);
          }
        });

        subsystemslegend.append('text')
          .attr('x', function(d) { 
            if (d.hasOwnProperty("subclassScope")) {
              return legendRectSize + legendRectSize + legendSpacing + 40 + this.parentElement.children[3].getComputedTextLength() + 10;
            } else if (d.hasOwnProperty("classScope")) {
              return legendRectSize + legendRectSize + legendSpacing + 20 + this.parentElement.children[3].getComputedTextLength() + 10;
            } else {
              return legendRectSize + legendRectSize + legendSpacing + this.parentElement.children[3].getComputedTextLength() + 10;
            }
          })
          .attr('y', legendRectSize - legendSpacing + 2)
          .text(function(d) { 
            return " (" + d.subsystem_count + ", "; 
          })
          .style('fill', '#76a72d')
          .on("click", function(d) {
            if (d.hasOwnProperty("subclassScope")) {
              that.navigateToSubsystemsSubTabSubclass(d);
            } else if (d.hasOwnProperty("classScope")) {
              that.navigateToSubsystemsSubTabClass(d);
            } else {
              that.navigateToSubsystemsSubTabSuperclass(d);
            }
          });

        subsystemslegend.append('text')
          .attr('x', function(d) { 
            if (d.hasOwnProperty("subclassScope")) {
              return legendRectSize + legendRectSize + legendSpacing + 40 + this.parentElement.children[3].getComputedTextLength() + this.parentElement.children[4].getComputedTextLength() + 15;
            } else if (d.hasOwnProperty("classScope")) {
              return legendRectSize + legendRectSize + legendSpacing + 20 + this.parentElement.children[3].getComputedTextLength() + this.parentElement.children[4].getComputedTextLength() + 15; 
            } else {
              return legendRectSize + legendRectSize + legendSpacing + this.parentElement.children[3].getComputedTextLength() + this.parentElement.children[4].getComputedTextLength() + 15;
            }
          })
          .attr('y', legendRectSize - legendSpacing + 2)
          .text(function(d) { 
            return d.count + ")"; 
          })
          .style('fill', '#ffcb00')
          .on("click", function(d) {
            if (d.hasOwnProperty("subclassScope")) {
              that.navigateToSubsystemsSubTabSubclass(d);
            } else if (d.hasOwnProperty("classScope")) {
              that.navigateToSubsystemsSubTabClass(d);
            } else {
              that.navigateToSubsystemsSubTabSuperclass(d);
            }
          });

      this.setSubsystemPieGraph();
    },

    getTotalSubsystems: function() {
      var def = new Deferred();
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

      var marginAdjustedTotalbarHeight = height * .9;
      var marginTop = 100;
      //var marginTop = height - marginAdjustedTotalbarHeight - 200;

      var marginTopWithBuffer = marginTop + 30;

      var divHeightCovered = proportionCovered * height - marginTop;
      var divHeightNotCovered = proportionNotCovered * height - marginTop;

      var percentCovered = proportionCovered * 100;
      var percentNotCovered = proportionNotCovered * 100;

      var totalHeight = divHeightCovered + divHeightNotCovered;

      var svg = d3.select("#subsystemspiechart svg"),
          margin = {top: 0, right: 20, bottom: 30, left: 100},
          // width = +svg.attr("width") - margin.left - margin.right,
          // height = +svg.attr("height") - margin.top - margin.bottom,
          g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var coveredRect = svg.append("rect")
                          .attr("x", 120)
                          .attr("y", marginTopWithBuffer)
                          .attr("width", 50)
                          .style("fill", "#399F56")
                          .attr("id", "subsystemsCovered")
                          .attr("height", divHeightCovered)
                          .on("click", function() {
                            that.navigateToSubsystemsSubTabFromCoverageBar();
                          });

      var notCoveredRect = svg.append("rect")
                            .attr("x", 120)
                            .attr("y", divHeightCovered + marginTopWithBuffer)
                            .attr("width", 50)
                            .style("fill", "#3F6993")
                            .attr("id", "subsystemsNotCovered")
                            .attr("height", divHeightNotCovered)

      svg.append("text")
        .attr("x", 150)             
        .attr("y", 100)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", "14px")
        .text("Subsystem Coverage");

      var divHeightCoveredPercentageOffset = divHeightCovered / 2 + marginTopWithBuffer;
      var divHeightNotCoveredPercentageOffset = divHeightNotCovered / 2 + divHeightCovered + marginTopWithBuffer;

      svg.append("text")
        .attr("x", 145)             
        .attr("y", divHeightCoveredPercentageOffset)
        .attr("text-anchor", "middle")
        .style("fill", "#ffffff")
        .text(percentCovered + "%");

      svg.append("text")
        .attr("x", 145)             
        .attr("y", divHeightNotCoveredPercentageOffset)
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

    navigateToSubsystemsSubTabSubclass: function(d) {
      switch (d.val) {
        case "Other":
          //do nothing
          break;
        default:
          Topic.publish("navigateToSubsystemsSubTabSubclass", d.val);
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
