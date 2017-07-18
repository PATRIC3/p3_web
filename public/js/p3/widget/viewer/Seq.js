define([
	"dojo/_base/declare", "./JobResult",
], function(declare, JobResult){
	return declare([JobResult], {
		containerType: "Seq",
    getGenomeId: function(){
			var id = this.data.autoMeta.parameters.reference_genome_id;
			if(id){
				return id;
			}
			throw Error("Missing ID");
		},
    getStreamableFiles: function(){
      var streamableTypes = ["bam", "gff", "vcf", "bigwig"];
      var streamables = [];
			this._resultObjects.some(function(o){
        if (streamableTypes.indexOf(o.type) >= 0) {

          var jBrowseTrackType;
          var jBrowseStoreType;
          switch(o.type){
            case "bam":
              jBrowseTrackType = "JBrowse/Store/SeqFeature/BAM";
              jBrowseStoreType = "JBrowse/View/Track/Alignments2";
              break;
            case "bigwig":
              jBrowseTrackType = "JBrowse/View/Track/Wiggle/XYPlot";
              jBrowseStoreType = "JBrowse/Store/BigWig";
              break;
            case "gff":
              jBrowseTrackType = "JBrowse/View/Track/CanvasFeatures";
              jBrowseStoreType = "JBrowse/Store/SeqFeature/GFF3";
              break;
          }
          // XXX this is picking up bai files as well, we need to add that as a proper type
  				if(o.type == "bam"){
            var record = {'path':o.path+o.name, 'keyAndLabel':o.name, 'store':o.id, 'trackType':jBrowseTrackType, 'storeType':jBrowseStoreType};
  		      streamables.push(record);
  				}
        }

			});
			if(streamables.length > 0){
				return streamables;
			}
			throw Error("No streamable files found");
		},
    getJBrowseURLQueryParams: function(){
      var streamables = this.getStreamableFiles();
      console.log("[RNASeq] streamables: ", this.getStreamableFiles());

      var tracks = [];
      var stores = new Object;
      streamables.forEach(function(t){

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
            'label': t.keyAndLabel,
            'key': t.keyAndLabel,
            'type': t.trackType,
            'store': t.store
          };
        }
        tracks.push(track);

        var store = new Object;
        store.type = t.storeType;
        store.urlTemplate = t.path;
        if(t.baiPath){
          store.baiUrlTemplate = t.baiPath;
        }
        stores[t.store] = store;
      }, this);

      console.log("[RNASeq] tracks: ", tracks);
      console.log("[RNASeq] stores: ", stores);

      var url =
        'view_tab=browser&addTracks=' + encodeURIComponent(JSON.stringify(tracks))
        + '&addStores=' + encodeURIComponent(JSON.stringify(stores))
        + '&tracks=PATRICGenes,RefSeqGenes';

      console.log("[RNASeq] url params: ", url);
      return url;

      /*
      ==========================================================================

      // Encoded
      http://www.patric.local:3000/view/Genome/83332.12#view_tab=browser&addTracks=%5B%7B%22style%22%3A%7B%22height%22%3A200%7D%2C%22scale%22%3A%22log%22%2C%22variance_band%22%3A%22true%22%2C%22label%22%3A%22SG2AT5.bigwig%22%2C%22key%22%3A%22SG2AT5.bigwig%22%2C%22type%22%3A%22JBrowse%2FView%2FTrack%2FWiggle%2FXYPlot%22%2C%22store%22%3A%22bwSG2AT5%22%7D%5D&addStores=%7B%22bwSG2AT5%22%3A%7B%22type%22%3A%22JBrowse%2FStore%2FBigWig%22%2C%22urlTemplate%22%3A%22%2Fp%2Fbrcdownloads%2FBRC_Mirrors%2FTBSysBio%2FRNA-Seq_patric%2FSG2AT5.bigwig%22%7D%7D&loc=NC_000962%3A1..5000&tracks=PATRICGenes%2CSG2AT5.bigwig&highlight=

      // Decoded
      http://www.patric.local:3000/view/Genome/83332.12#view_tab=browser&addTracks=[{"style":{"height":200},"scale":"log","variance_band":"true","label":"SG2AT5.bigwig","key":"SG2AT5.bigwig","type":"JBrowse/View/Track/Wiggle/XYPlot","store":"bwSG2AT5"}]&addStores={"bwSG2AT5":{"type":"JBrowse/Store/BigWig","urlTemplate":"/p/brcdownloads/BRC_Mirrors/TBSysBio/RNA-Seq_patric/SG2AT5.bigwig"}}&loc=NC_000962:1..5000&tracks=PATRICGenes,SG2AT5.bigwig&highlight=

      ==========================================================================

      view/Genome/<genome_id|83332.12>#
      view_tab=browser
      addTracks=[
        {
          "style":{"height":200},
          "scale":"log",
          "variance_band":"true",
          "label":"<name_of_track|SG2AT5.bigwig>",
          "key":"<name_of_track|SG2AT5.bigwig>",
          "type":"JBrowse/View/Track/Wiggle/XYPlot",
          "store":"<unique_store_id|bwSG2AT5>"
        }
      ]
      addStores={
        "<unique_store_id|bwSG2AT5>":{
          "type":"JBrowse/Store/BigWig",
          "urlTemplate":"<url_to_bam_or_bigwig_or_gtf_or_gff_or_vcfgz|/p/brcdownloads/BRC_Mirrors/TBSysBio/RNA-Seq_patric/SG2AT5.bigwig>"
          "baiUrlTemplate":<url_to_bai_or_tbi|>"
        }
      }
      [OPTIONAL] loc=<location_replication_base|NC_000962:1..5000>
      tracks=PATRICGenes,<name_of_track|SG2AT5.bigwig>
      [OPTIONAL] highlight=

      ==========================================================================

      addTracks=[
        {
          "style":{"height":100},
          "scale":"log",
          "variance_band":"true",
          "label":"Density+Align+with+Bowtie2+on+data+18+and+data+19:+aligned+reads+(++BigWig)",
          "key":"BigWig+Align+with+Bowtie2+on+data+18+and+data+19:+aligned+reads+(++BigWig)",
          "type":"JBrowse/View/Track/Wiggle/XYPlot",
          "store":"ff63e0fe6a7c91c7"
        },{
          "type":"JBrowse/View/Track/Alignments2",
          "key":"Align with R46-L3-P02",
          "store":"8d1e69b1f40ce332",
          "label":"Align with R46-L3-P02"
        },{
          "type":"JBrowse/View/Track/CanvasFeatures",
          "key":"Features+testout.gff",
          "store":"f2b5471cc7540ca6",
          "label":"Features+testout.gff"
        }
      ]
      addStores={
        "ff63e0fe6a7c91c7":{
          "type":"JBrowse/Store/BigWig",
          "urlTemplate":"/rnaseq/display_application/ff63e0fe6a7c91c7/jbrowse_bigwig/PATRIC/6f28167024c3809a/data/galaxy_ff63e0fe6a7c91c7.bigwig"
        },
        "8d1e69b1f40ce332":{
          "type":"JBrowse/Store/SeqFeature/BAM",
          "urlTemplate":"/rnaseq/display_application/8d1e69b1f40ce332/jbrowse_bam/PATRIC/83633ddb6c5476f9/data/galaxy_8d1e69b1f40ce332.bam",
          "baiUrlTemplate":"/rnaseq/display_application/8d1e69b1f40ce332/jbrowse_bam/PATRIC/83633ddb6c5476f9/data/galaxy_8d1e69b1f40ce332.bam.bai"
        },
        "f2b5471cc7540ca6":{
          "type":"JBrowse/Store/SeqFeature/GFF3",
          "urlTemplate":"/rnaseq/display_application/f2b5471cc7540ca6/jbrowse_gff/PATRIC/2d2fb931d89ae61a/data/galaxy_f2b5471cc7540ca6.gff3"
        }
      }
      loc=sid|212508|accn|CP001362:33218..50198
      tracks=RefSeqGenes,Features+testout.gff,Density+Align+with+Bowtie2+on+data+18+and+data+19:+aligned+reads+(++BigWig),Align with R46-L3-P02
      highlight=

      ==========================================================================
      */

		}
	});
});
