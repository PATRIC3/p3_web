define([
  'dojo/_base/declare', 'dijit/_WidgetBase', 'dijit/_Templated', 'dojo/dom-construct', 'dojo/query',

  'dojo/NodeList-traverse'
], function (
  declare, WidgetBase, Templated, dom, query
) {
  return declare([WidgetBase, Templated], {
    templateString: '<div style="position: absolute; top: 200px; left: 0; width: 200px; height: 500px; background-color: #000">BLAH</div>',
    colNames: [],     // names of columns
    colKeys: [],      // names of keys for each column
    label: null,      // labels items. example: {rowIndex: 1, colKey: 'name', format: function(rowObj) {}}
    _rows: [],        // data model for rows in table

    _tableHTML:
      '<table class="p3basic striped-light" style="font-size: .8em; margin-bottom: 10px;">' +
        '<thead>' +
        '</thead>' +
        '<tbody>' +
        '</tbody>' +
      '</table>',

    _emptyHtML:
      '<tr class="none-selected">' +
        '<td colspan="3"><i class="pull-left">None Selected</i></td>' +
      '</tr>',

    _emptyEle: null,   // dom element for empty table

    constructor: function () {
      console.log('constructor');
      this._rows = [];
    },

    postCreate: function () {
      var self = this;
      self.inherited(arguments);


    },

    startup: function () {
      // startup
    }

  });
});
