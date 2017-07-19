define([
	"dojo/_base/declare", "./JobResult", "../../WorkspaceManager", "dojo/_base/Deferred"
], function(declare, JobResult, WS, Deferred){
	return declare([JobResult], {
		containerType: "Seq",
    streamables: null,
    setupResultType: function(){
			if(this.data.autoMeta.app.id){
				this._resultType = this.data.autoMeta.app.id;
			}
			this._appLabel = this._resultType;
      this.getStreamableFiles();
		},
    getGenomeId: function(){
			var id = this.data.autoMeta.parameters.reference_genome_id;
			if(id){
				return id;
			}
			throw Error("Missing ID");
		},
    getStreamableFiles: function(){
      if (this.streamables) {
        return this.streamables;
      }

      /*

      return WorkspaceManager.getDownloadUrls(paths)
        .then(function(urls){
          for(var i = 0; i < downloads.length; i++)
            downloads[i].url = urls[i];
          return downloads;
        })

      */

      this.streamables = [];
      var streamableTypes = ["bam", "gff", "vcf", "bigwig"];
			this._resultObjects.some(function(o){
        if (streamableTypes.indexOf(o.type) >= 0 && !o.name.endsWith(".bai")) {
          var jBrowseTrackType;
          var jBrowseStoreType;
          var record;
          switch(o.type){
            case "bam":
              jBrowseTrackType = "JBrowse/View/Track/Alignments2";
              jBrowseStoreType = "JBrowse/Store/SeqFeature/BAM";
              record = {'path':o.path+o.name, 'keyAndLabel':o.name, 'store':o.id, 'trackType':jBrowseTrackType, 'storeType':jBrowseStoreType, 'baiPath':o.path+o.name+'.bai'};
              break;
            case "bigwig":
              jBrowseTrackType = "JBrowse/Store/BigWig";
              jBrowseStoreType = "JBrowse/View/Track/Wiggle/XYPlot";
              record = {'path':o.path+o.name, 'keyAndLabel':o.name, 'store':o.id, 'trackType':jBrowseTrackType, 'storeType':jBrowseStoreType};
              break;
            case "gff":
              jBrowseTrackType = "JBrowse/Store/SeqFeature/GFF3";
              jBrowseStoreType = "JBrowse/View/Track/CanvasFeatures";
              record = {'path':o.path+o.name, 'keyAndLabel':o.name, 'store':o.id, 'trackType':jBrowseTrackType, 'storeType':jBrowseStoreType};
              break;
          }
          this.streamables.push(record);
        }
			}, this);

			return this.streamables;
		},
    getJBrowseURLQueryParams: function(){
      //console.log("[Seq] streamables: ", this.streamables);

      var tracks = [];
      var stores = new Object;
      var labels = [];
      this.streamables.forEach(function(t){

        var track;
        // the first track gets some extra fields
        if (tracks.length < 1) {
          track = {
            'style': {'height':200},
            'scale':'log',
            'variance_band': 'true',
            'label': t.keyAndLabel,
            'key': t.keyAndLabel,
            'type': t.trackType,
            'store': t.store
          };
        } else {
          track = {
            'type': t.trackType,
            'key': t.keyAndLabel,
            'store': t.store,
            'label': t.keyAndLabel
          };
        }
        tracks.push(track);
        labels.push(t.keyAndLabel);

        var store = new Object;
        store.type = t.storeType;
        store.urlTemplate = t.path;
        if(t.baiPath){
          store.baiUrlTemplate = t.baiPath;
        }
        stores[t.store] = store;
      }, this);

      //console.log("[Seq] tracks: ", tracks);
      //console.log("[Seq] stores: ", stores);

      var url =
        'view_tab=browser&addTracks=' + encodeURIComponent(JSON.stringify(tracks))
        + '&addStores=' + encodeURIComponent(JSON.stringify(stores))
        + '&tracks=PATRICGenes,RefSeqGenes,' + labels.join(",");

      console.log("[Seq] url params: ", url);
      return url;
		}
	});
});
