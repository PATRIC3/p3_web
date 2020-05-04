define([
  'dojo/_base/declare', 'dojo/on', 'dojo/_base/Deferred', 'dijit/_Templated',
  'dojo/dom-class', 'dojo/dom-construct', 'dijit/_WidgetBase',
  'dojo/_base/xhr', 'dojo/_base/lang', 'dojo/dom-attr', 'dojo/query',
  'dojo/dom-geometry', 'dojo/dom-style', 'dojo/when', 'dijit/form/TextBox', 'dijit/focus',
  'dojo/dom', '../util/PathJoin'
], function (
  declare, on, Deferred, Templated,
  domClass, domConstruct, WidgetBase,
  xhr, lang, domAttr, Query,
  domGeometry, domStyle, when, TextBox, focusUtil,
  dom, PathJoin
) {

  return declare([WidgetBase, Templated], {
    templateString: '<div class="${baseClass}">' +
      '<div data-dojo-attach-point="categoryNode" class="facetCategory"></div>' +
      '<div style="" class="dataList" data-dojo-attach-point="containerNode"></div>' +
    '</div>',
    apiServer: window.App.dataAPI,
    baseClass: 'SidebarFacet',
    category: 'NAME',
    data: null,
    selected: null,
    expanded: true,
    isUnique: false,
    disableSearch: false,
    type: null, // 'text', 'number', 'date'
    onExpand: function () {},
    onSearchChange: function () {},

    onSearch: function () {},

    constructor: function () {
      this._selected = {};
    },

    _setCategoryAttr: function (category) {
      var cat = category.replace(/_/g, ' ');
      this._set('category', category);

      if (this._started && this.categoryNode) {
        this.categoryNode.innerHTML = cat.replace(/_/g, ' ');
      }
    },

    _setDataAttr: function (data, selected) {
      if (selected) {
        this.selected = selected;
      }
      if (!data) {
        return;
      }

      if (this.data && this.data instanceof Deferred) {
        var promise = this.data;
      }

      this.data = data;
      console.log(this.origData);

      domConstruct.empty(this.containerNode);

      /*
      if (data.length < 1) {
        domClass.add(this.domNode, 'dijitHidden');
      } else {
        domClass.remove(this.domNode, 'dijitHidden');
      }
      */

      if (!('forEach' in data) || !this.expanded) return;

      var showTopCount = 5;

      data.slice(0, showTopCount).forEach(function (obj, i) {
        var name = decodeURIComponent(obj.label || obj.val);
        var l = name + ((typeof obj.count != 'undefined') ? ('&nbsp;(' + obj.count + ')') : '');

        var sel;
        if (
          this._selected[name] ||
            (this.selected.indexOf(name) >= 0)
        ) {
          sel = 'selected';
        } else {
          sel = '';
        }

        // todo(nc): add checkbox
        var n = this['_value_' + name] = domConstruct.create('div', {
          rel: name,
          'class': 'FacetValue ' + sel,
          innerHTML: l // '<input type="checkbox" /> ' + l
        });

        domConstruct.place(n, this.containerNode, sel ? 'first' : 'last');
        this.containerNode.scrollTop = 0;

        // add show more if needed
        if (data.length > showTopCount && (i == showTopCount - 1)) {
          domConstruct.place(
            `<a class="pull-right">${data.length - showTopCount} more...</a>`, this.containerNode
          );
        }

      }, this);
      // this._refreshFilter();


      if (promise) {
        if (!this.origData) {
          this.origData = lang.clone(this.data);  // keep copy for filtering
        }
        promise.resolve(true);
      }
    },

    toggle: function (name, value) {
      name = name.replace(/"/g, '');

      when(this.data, lang.hitch(this, function () {
        var node = this['_value_' + name];

        if (node) {
          if (typeof value == 'undefined') {
            var isSelected = domClass.contains(node, 'selected');

            domClass.toggle(node, 'selected');
            this._set('selected', this.selected.filter(function (i) {
              return (i != name) || ((i == name) && !isSelected);
            }));
          } else {
            if (value) {
              domClass.add(node, 'selected');
              if (this.selected.indexOf(name) < 0) {
                this.selected.push(name);
                this._set('selected', this.selected);
              }
            } else {
              domClass.remove(node, 'selected');
              this._set('selected', this.selected.filter(function (i) {
                return i != name;
              }));
            }
          }
        }

        if (this.selected && this.selected.length > 0) {
          domClass.add(this.categoryNode, 'selected');
        } else {
          domClass.remove(this.categoryNode, 'selected');
        }
        // this.resize();
      }));
      // this._refreshFilter();
    },

    startup: function () {
      if (this._started) {
        return;
      }
      this._started = true;
      this.inherited(arguments);

      this._refreshFilter();
    },
    _refreshFilter: function (selected) {
      // console.log('FacetFilter _refreshFilter()  started: ', this._started);
      var selected = selected || [];

      Query('.selected', this.containerNode).forEach(function (node) {
        selected.push(domAttr.get(node, 'rel'));
      });

      if (selected.length < 1) {
        this.filter = '';
      } else if (selected.length == 1) {
        var isFreeText = selected[0].includes('*');
        var val = isFreeText ? selected[0] : '"' + selected[0] + '"';
        this.filter = 'eq(' + this.category + ',' + encodeURIComponent(val) + ')';
      } else {
        this.filter = 'or(' + selected.map(function (s) {
          var isFreeText = s.includes('*');
          var val = isFreeText ? s : '"' + s + '"';
          return 'eq(' + this.category + ',' + encodeURIComponent(val) + ')';
        }, this).join(',') + ')';
      }

      console.log('*******', this.filter);


      if (selected.length > 0) {
        domClass.add(this.categoryNode, 'selected');
      } else {
        domClass.remove(this.categoryNode, 'selected');
      }

      this._set('selected', selected);

      on.emit(this.domNode, 'UpdateFilterCategory', {
        category: this.category,
        filter: this.filter,
        selected: selected,
        bubbles: true,
        cancelable: true
      });
    },

    toggleItem: function (evt) {
      // var rel = domAttr.get(evt.target, 'rel');
      // console.log("onToggle: ", rel)
      domClass.toggle(evt.target, 'selected');
      this._refreshFilter();
    },

    clearSelection: function () {
      this.set('data', this.data, []);
      domClass.remove(this.categoryNode, 'selected');
    },

    postCreate: function () {
      this.inherited(arguments);
      var self = this;

      on(this.domNode, '.FacetValue:click', lang.hitch(this, 'toggleItem'));
      if (this.categoryNode && this.category) {

        var name = this.category.replace(/_/g, ' ');

        var title = domConstruct.place(
          '<span class="filter-category"></span>',
          this.categoryNode
        );

        var expandBtn = this.expandBtn = domConstruct.create('a', {
          innerHTML: self.isUnique ? name :
            `<i class="${this.expanded ? 'icon-angle-down' : 'icon-angle-right'}" style="font-size: 1.2em;"></i> ` +
            name
        }, title);

        on(expandBtn, 'click', function () {
          self.expanded = !self.expanded;

          var icon = Query('i', expandBtn);
          icon.toggleClass('icon-angle-down');
          icon.toggleClass('icon-angle-right');

          self.onExpand(self.expanded);
        });

        if (!this.disableSearch) {
          var searchBtn = domConstruct.create('a', {
            class: 'pull-right',
            innerHTML: '<i class="icon-search pull-right" style="font-size: 1.2em;"></i>'
          }, title);

          var boxId = this.dataModel + '-filter-' + name;
          var searchBox = new TextBox({
            placeHolder: 'search ' + name,
            style: 'display: block;',
            id: boxId
          });
          on(searchBox, 'keyup', function () {
            var val = searchBox.get('value');
            console.log('on keyup:', val, event);

            if (event.key == 'Enter' && val == '') {
              self._refreshFilter();
            }

            if (event.key == 'Enter' && val != '') {
              self.selected.push(self.type == 'number' ? val : '*' + val + '*');
              console.log('selected', self.selected);
              self._refreshFilter(self.selected);
              // self.onSearch(val);
            } else {
              // self.onSearchChange(val);
              console.log('data', self.origData);
              var matches = self.origData.filter(o => o.value.toLowerCase().includes(val.toLowerCase()));
              console.log('matches', matches);
              self.set('data', matches, self.selected);
            }
          });

          domClass.toggle(searchBox.domNode, 'dijitHidden');

          domConstruct.place(searchBox.domNode, this.categoryNode);

          on(searchBtn, 'click', function () {
            domClass.toggle(searchBox.domNode, 'dijitHidden');
            if (!domClass.contains(searchBox.domNode, 'dijitHidden')) {
              focusUtil.focus(dom.byId(boxId));
            }
          });
        }

        // add numeric searches if number field
        if (this.type == 'number') {
          domConstruct.place('<br>', this.categoryNode);

          var numFilterContainer = domConstruct.create('div', {
            style: 'margin-top: 5px;'
          }, this.categoryNode);

          var lowerBound = new TextBox({
            placeHolder: 'min',
            style: 'display: inline-block; width: 50px;'
          });
          domConstruct.place(lowerBound.domNode, numFilterContainer);

          domConstruct.place('<span style="text-transform: none;"> to </span>', numFilterContainer);

          var upperBound = new TextBox({
            placeHolder: 'max',
            style: 'display: inline-block; width: 50px;'
          });

          on(lowerBound, 'keyup', function () {
            var val = lowerBound.get('value');
            if (event.key == 'Enter' && val == '') self._refreshFilter();

            if (event.key == 'Enter' && val != '') {
              self.selected.push(val);
              self._refreshFilter(self.selected);
            } else {
              // todo(nc): implement
            }
          });

          on(upperBound, 'keyup', function () {
            var val = upperBound.get('value');
            console.log('val"' + val + '"');
            if (event.key == 'Enter' && val == '') self._refreshFilter();

            if (event.key == 'Enter' && val != '') {
              self.selected.push(val);
              self._refreshFilter(self.selected);
            } else {
              // todo(nc): implement
            }
          });

          domConstruct.place(upperBound.domNode, numFilterContainer);
        }


      }
      if (!this.data) {
        this.data = new Deferred();
      }

    },

    // Todo(nc): remove
    /*
    getPossibleFacets: function (field) {
      var f = '&facet(field,' + field + '),(mincount,1))';
      var q =  '?keyword(*)';

      // var url = this.apiServer + '/' + this.dataModel + '/' + q + '&limit(1)' + f;
      var q = ((q && q.charAt && (q.charAt(0) == '?')) ? q.substr(1) : q) + '&limit(1)' + f;


      var fr = xhr(PathJoin(this.apiServer, this.dataModel) + '/', {
        method: 'POST',
        handleAs: 'json',
        data: f,
        headers: {
          accept: 'application/solr+json',
          'content-type': 'application/rqlquery+x-www-form-urlencoded',
          'X-Requested-With': null,
          Authorization: (window.App.authorizationToken || '')
        }
      });

      return fr.then(function (response, res) {
        // console.log("RESPONSE: ",response,  res, res.facet_counts)
        if (res && res.facet_counts && res.facet_counts.facet_fields) {
          return parseFacetCounts(res.facet_counts.facet_fields);
        }
      }, function (err) {

        return err;
      });
    },

    updateExpanded: function (val) {
      this.expanded = val;
      var icon = Query('i', this.expandBtn);

      if (this.expanded) {
        icon.addClass('icon-angle-down');
        icon.removeClass('icon-angle-right');
      } else {
        icon.removeClass('icon-angle-down');
        icon.addClass('icon-angle-right');
      }
    },
    */

    resize: function (changeSize, resultSize) {
      var node = this.domNode;

      // set margin box size, unless it wasn't specified, in which case use current size
      if (changeSize) {

        domGeometry.setMarginBox(node, changeSize);
      }

      // If either height or width wasn't specified by the user, then query node for it.
      // But note that setting the margin box and then immediately querying dimensions may return
      // inaccurate results, so try not to depend on it.

      var mb = resultSize || {};
      lang.mixin(mb, changeSize || {});       // changeSize overrides resultSize
      if (!('h' in mb) || !('w' in mb)) {

        mb = lang.mixin(domGeometry.getMarginBox(node), mb);    // just use domGeometry.marginBox() to fill in missing values
      }

      // Compute and save the size of my border box and content box
      // (w/out calling domGeometry.getContentBox() since that may fail if size was recently set)
      var cs = domStyle.getComputedStyle(node);
      var me = domGeometry.getMarginExtents(node, cs);
      var be = domGeometry.getBorderExtents(node, cs);
      var bb = (this._borderBox = {
        w: mb.w - (me.w + be.w),
        h: mb.h - (me.h + be.h)
      });
      var pe = domGeometry.getPadExtents(node, cs);
      this._contentBox = {
        l: domStyle.toPixelValue(node, cs.paddingLeft),
        t: domStyle.toPixelValue(node, cs.paddingTop),
        w: bb.w - pe.w,
        h: bb.h - pe.h
      };

      var hmb = domGeometry.getMarginBox(this.categoryNode);

      // console.log("FacetFilter _contentBox: ", this._contentBox, " Header MB: ", hmb);

      domGeometry.setMarginBox(this.containerNode, { h: this._contentBox.h - hmb.h });

    }

  });
});
