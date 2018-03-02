<template>
	<div
		:id="idName"
		@click="generate">
		<slot>
			Download {{name}}
		</slot>
	</div>
</template>

<script>
import download from 'downloadjs'

export default {
	props: {
		// mime type [xls, csv], default: xls
		'type' : {
			type: String,
			default: "xls"
		},
		// Json to download
		'data':{
			type: Array,
			required: true
		},
		// fields inside the Json Object that you want to export
		// if no given, all the properties in the Json are exported
		'fields':{
			type: Object,
			required: true
		},
		// Title for the data
		'title':{
			default: null
		},
		// filename to export, deault: data.xls
		'name':{
			type: String,
			default: "data.xls"
		},
		'meta':{
			type: Array,
			default: () => []
		}
	},
	computed:{
		// unique identifier
		idName : function(){
			var now = new Date().getTime();
			return 'export_'+now;
		}
	},
	methods: {
		generate() {
			if(!this.data.length){
				return
			}
			let json = this.getProcessedJson(this.data, this.fields)
			if(this.type == 'csv'){
				return this.export(this.jsonToCSV(json), this.name, "application/csv");
			}
			return this.export(this.jsonToXLS(json), this.name, "application/vnd.ms-excel");
		},
		/*
		Use downloadjs to generate the download link
		*/
		export: function (data, filename, mime) {
			let blob = this.base64ToBlob(data, mime)
			download(blob, filename, mime)
		},
		/*
		jsonToXLS
		---------------
		Transform json data into an xml document with MS Excel format, sadly
		this format show a prompt when open due to a default behavior
		on Microsoft office. It's recommended to use CSV format instead.
		*/
		jsonToXLS: function (data) {
			let xlsTemp = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta name=ProgId content=Excel.Sheet> <meta name=Generator content="Microsoft Excel 11"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>${table}</table></body></html>'
			let xlsData = '<thead><tr>'

			if( this.title != null ){
				if( Array.isArray(this.title) ){
					for (var i = 0; i < this.title.length; i++) {
						xlsData += '<th colspan="'+Object.keys(data[0]).length+'">'+this.title[i]+'<th></tr><tr>'
					}
				}
				else{
					xlsData += '<th colspan="'+Object.keys(data[0]).length+'">'+this.title+'<th></tr><tr>'
				}
			}

			for (let key in data[0]) {
				xlsData += '<th>' + key + '</th>'
			}
			xlsData += '</tr></thead>'
			xlsData += '<tbody>'

			data.map(function (item, index) {
				xlsData += '<tbody><tr>'
				for (let key in item) {
					xlsData += '<td>' + item[key] + '</td>'
				}
				xlsData += '</tr></tbody>'
			})
			return xlsTemp.replace('${table}', xlsData)
		},
		/*
		jsonToCSV
		---------------
		Transform json data into an CSV file.
		*/
		jsonToCSV: function (data) {
			var csvData = ''

			if( this.title != null ){
				if( Array.isArray(this.title) ){
					for (var i = 0; i < this.title.length; i++) {
						csvData += this.title[i]+'\r\n'
					}
				}
				else{
					csvData += this.title+'\r\n'
				}
			}

			for (let key in data[0]) {
				csvData +=  key + ','
			}
			csvData = csvData.slice(0, csvData.length - 1)
			csvData += '\r\n'

			data.map(function (item) {
				for (let key in item) {
					let escapedCSV = item[key] + '' // cast Numbers to string
					if (escapedCSV.match(/[,"\n]/)) {
						escapedCSV = '"' + escapedCSV.replace(/\"/g, "\"\"") + '"'
					}
					csvData += escapedCSV + ','
				}
				csvData = csvData.slice(0, csvData.length - 1)
				csvData += '\r\n'
			})
			return csvData
		},
		/*
		getProcessedJson
		---------------
		Get only the data to export, if no fields are set return all the data
		*/
		getProcessedJson: function(data, header){
			let keys = this.getKeys(data, header)
			let newData = []
			let _self = this
			data.map(function (item, index) {
				let newItem = {}
				for( let label in keys){
					var iii= item;
					let property = keys[label]
					newItem[label] = _self.getNestedData(property, item)
				}
				newData.push(newItem)
			})

			return newData
		},
		getKeys: function(data, header){
			if( header ){
				return header
			}

			let keys = {}
			for (let key in data[0]) {
				keys[key] = key
			}
			return keys
		},
		callItemCallback: function(field, itemValue) {
			if (typeof field === 'object' && typeof field.callback === 'function') {
				return field.callback(itemValue);
			}

			return itemValue;
		},
		getNestedData: function(key, item) {
			const field = (typeof key === 'object') ? key.field : key;

			let valueFromNestedKey = null
			let keyNestedSplit = field.split(".")

			valueFromNestedKey = item[keyNestedSplit[0]]
			for (let j = 1; j < keyNestedSplit.length; j++) {
				valueFromNestedKey = valueFromNestedKey[keyNestedSplit[j]]
			}

			valueFromNestedKey = this.callItemCallback(key, valueFromNestedKey);

			return valueFromNestedKey;
		},
		base64ToBlob: function (data, mime) {
			let base64 = window.btoa(window.unescape(encodeURIComponent(data)))
			let bstr   = atob(base64)
			let n      = bstr.length
			let u8arr  = new Uint8ClampedArray(n)
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n)
			}
			return new Blob([u8arr], { type: mime })
		},
	} // end methods
}
</script>
