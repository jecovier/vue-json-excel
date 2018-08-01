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
			required: false
		},
		// this prop is used to fix the problem with other components that use the
		// variable fields, like vee-validate. exportFields works exactly like fields
		'exportFields':{
			type: Object,
			required: false
		},
		// Title(s) for the data, could be a string or an array of strings (multiple titles)
		'title':{
			default: null
		},
		// Footer(s) for the data, could be a string or an array of strings (multiple footers)
		'footer':{
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
		},

		downloadFields: function(){
			if(this.fields !== undefined)
				return this.fields
			
			if(this.exportFields !== undefined)
				return this.exportFields
		}
	},
	methods: {
		generate() {
			if(!this.data.length){
				return
			}
			let json = this.getProcessedJson(this.data, this.downloadFields)
			if(this.type == 'csv'){
				return this.export(this.jsonToCSV(json), this.name, "application/csv");
			}
			return this.export(this.jsonToXLS(json), this.name, "application/vnd.ms-excel");
		},
		/*
		Use downloadjs to generate the download link
		*/
		export (data, filename, mime) {
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
		jsonToXLS (data) {
			let xlsTemp = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta name=ProgId content=Excel.Sheet> <meta name=Generator content="Microsoft Excel 11"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>${table}</table></body></html>'
			let xlsData = '<thead><tr>'
			const colspan = Object.keys(data[0]).length

			//Header
			if( this.title != null ){
				xlsData += this.parseExtraData(this.title, '<th colspan="'+colspan+'">${data}<th></tr><tr>')
			}
			//Fields
			for (let key in data[0]) {
				xlsData += '<th>' + key + '</th>'
			}
			xlsData += '</tr></thead>'
			xlsData += '<tbody>'
			//Data
			data.map(function (item, index) {
				xlsData += '<tbody><tr>'
				for (let key in item) {
					xlsData += '<td>' + item[key] + '</td>'
				}
				xlsData += '</tr></tbody>'
			})
			//Footer
			if( this.footer != null ){
				xlsData += '<tfooter><tr>'
				xlsData += this.parseExtraData(this.footer, '<td colspan="'+colspan+'">${data}<td></tr><tr>')
				xlsData += '</tr></tfooter>'
			}
			return xlsTemp.replace('${table}', xlsData)
		},
		/*
		jsonToCSV
		---------------
		Transform json data into an CSV file.
		*/
		jsonToCSV (data) {
			var csvData = ''
			//Header
			if( this.title != null ){
				csvData += this.parseExtraData(this.title, '${data}\r\n')
			}
			//Fields
			for (let key in data[0]) {
				csvData +=  key + ','
			}
			csvData = csvData.slice(0, csvData.length - 1)
			csvData += '\r\n'
			//Data
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
			//Footer
			if( this.footer != null ){
				csvData += this.parseExtraData(this.footer, '${data}\r\n')
			}
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
		/*
		parseExtraData
		---------------
		Parse title and footer attribute to the csv format
		*/
		parseExtraData(extraData, format){
			let parseData = ''
			if( Array.isArray(extraData) ){
				for (var i = 0; i < extraData.length; i++) {
					parseData += format.replace('${data}', extraData[i])
				}
			}
			else{
				parseData += format.replace('${data}', extraData)
			}
			return parseData
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
		base64ToBlob (data, mime) {
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
