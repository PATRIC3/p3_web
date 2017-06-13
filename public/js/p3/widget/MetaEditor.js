define([
    "dojo", "dojo/_base/declare", "dijit/_WidgetBase", "dojo/dom-construct",
    "dijit/form/Form", "dijit/form/TextBox", "./Confirmation",
     "dijit/form/SimpleTextarea", "dijit/form/DateTextBox", "./InputList"
],function(
    dojo, declare, WidgetBase, dom,
    Form, TextBox, Confirmation,
    TextArea, DateTextBox, InputList
){
	return declare([WidgetBase], {
        tableNames: [],
        spec: {},
        data: {},
 		constructor: function(){

		},
		postCreate: function(){

		},
		startup: function(){

		},
		open: function(){
            var self = this
            var tableNames = self.tableNames,
                spec = self.spec,
                data = self.data;

            /**
			 * Create form
			 */
			var content = dom.toDom('<div>');
			var form = new Form();

            // organize table specs according to tableNames list
			var tableSpecs = tableNames.map(function(name){ return spec[name] });

            // for each table spec, add appropriate inputs
			tableSpecs.forEach(function(tableSpec, i) {
				var tableName = tableNames[i];

				dom.place('<h5 class="DataItemSectionHead" style="margin: 10px 0 0 0;">'+tableName+'</h5>', form.domNode)

				var table = dom.toDom('<table>'),
					tbody = dom.place('<tbody>', table);
				tableSpec.forEach(function(item){

					var input;
					if(item.type == "date"){
						input = new DateTextBox({
							value: data[item.text],
							name: item.text,
							style: {width: '275px'},
							onChange: function(v){ setTimeout(showServerValue, 0)}
						})
					}else if(item.multiValued){
						input = new InputList({
							type: item.type,
							values:  data[item.text] || [],
							placeHolder: item.editable ? "Enter " + item.name + "..." : '-',
						})
					}else if(item.type == 'textarea'){
						input = new TextArea({
							name: item.text,
							value: data[item.text] || '',
							style: {width: '275px'},
							placeHolder: item.editable ? "Enter " + item.name : '-',
							disabled: item.editable ? false : true
						});
					}else{
						input = new TextBox({
							id: item.text,
							name: item.text,
							value: data[item.text],
							style: {width: '275px'},
							placeHolder: item.editable ? "Enter " + item.name : '-',
							disabled: item.editable ? false : true
						});
					}

					var tr = dom.place('<tr>', tbody);
					dom.place('<td style="width: 50%; vertical-align: top;">'+item.name, tr);
					dom.place(input.domNode, tr);
				})

				dom.place(table, form.domNode)
			})

			dom.place('<br><br>', form.domNode)


			/**
			 * put form in dialog
			 */
			var dlg = new Confirmation({
				title: "Edit Metadata",
				okLabel: "Save",
				style: {width: '800px', height: '80%', overflow: 'scroll'},
				content: form,
				onConfirm: function(){
					console.log('valid?', form.validate());
				},
				onCancel: function(){
					this.hideAndDestroy();
				}
			});

			dlg.show();
		}

	});

});
