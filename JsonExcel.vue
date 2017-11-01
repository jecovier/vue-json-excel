<template>
	<a
		href="#"
		:id="id_name"
		@click="generate_excel">
		<slot>
			{{button_text}}
		</slot>
	</a>
</template>

<script>
export default {
	data: function(){
		return {
			animate   : true,
			animation : '',
		}
	},
	props: {
		'button_text': {
			type: String,
			default: "Download Excel"
		},
		'data':{
			type: Array,
			required: true
		},
		'fields':{
			type: Object,
			required: true
		},
		'name':{
			type: String,
			default: "data.xls"
		}
	},
	created: function () {
	},
	computed:{
		id_name : function(){
			var now = new Date().getTime();
			return 'export_'+now;
		}
	},
	methods: {
		generate_excel: function (){
	    this.exportXLS(this.data, this.name, this.fields)
		},

		jsonToXLS: function (data, header) {
			var xlsTemp = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta name=ProgId content=Excel.Sheet> <meta name=Generator content="Microsoft Excel 11"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>${table}</table></body></html>'

			var xlsData = '', keys = []
			if (header) {
				xlsData += '<thead>'
				for (var key in header) {
					keys.push(key)
					xlsData += '<th>' + header[key] + '</th>'
				}
				xlsData += '</thead>'
				xlsData += '<tbody>'
				data.map(function (item, index) {
					xlsData += '<tr>'
					for (var i = 0; i < keys.length; i++) {
						xlsData += '<td>' + item[keys[i]] + '</td>'
					}
					xlsData += '</tr>'
				})
				xlsData += '</tbody>'
				return xlsTemp.replace('${table}', xlsData)
			}
			data.map(function (item, index) {
				xlsData += '<tbody><tr>'
				for (var key in item) {
					xlsData += '<td>' + item[key] + '</td>'
				}
				xlsData += '</tr></tbody>'
			})
			return xlsTemp.replace('${table}', xlsData)
	  },

		jsonToCSV: function (data, keys) {
			var csvData = ''
			if (keys) {
				data.map(function (item) {
					for (var i = 0; i < keys.length; i++) {
						csvData += item[keys[i]] + ','
					}
					csvData = csvData.slice(0, csvData.length - 1)
					csvData += '\r\n'
				})
				return csvData
			}
			data.map(function (item) {
				for (var k in item) {
					csvData += item[k] + ','
				}
				csvData = csvData.slice(0, csvData.length - 1)
				csvData += '\r\n'
			})
			return csvData
	  },

    base64: function (s) {
	    return window.btoa(window.unescape(encodeURIComponent(s)))
    },

    exportXLS: function (data, fileName, header) {
			var XLSData = 'data:application/vnd.ms-excel;base64,' + this.base64(this.jsonToXLS(data, header))
			this.download(XLSData, fileName)
		},

    exportCSV: function (data, fileName, keys) {
			var CSVData = 'data:application/csv;base64,' + this.base64(this.jsonToCSV(data, keys))
			this.download(CSVData, fileName)
		},

		base64ToBlob: function (base64Data) {
			var arr   = base64Data.split(',')
			var mime  = arr[0].match(/:(.*?);/)[1]
			var bstr  = atob(arr[1])
			var n     = bstr.length
			var u8arr = new Uint8ClampedArray(n)

			while (n--) {
				u8arr[n] = bstr.charCodeAt(n)
			}
			return new Blob([u8arr], { type: mime })
		},

		download: function (base64data, fileName) {
			if (window.navigator.msSaveBlob) {
				var blob = this.base64ToBlob(base64data)
				window.navigator.msSaveBlob(blob, filename)
				return false;
			}

			var a = document.getElementById(this.id_name);

			if (window.URL.createObjectURL) {
				var blob       = this.base64ToBlob(base64data)
				var blobUrl    = window.URL.createObjectURL(blob)

				a.href     = blobUrl;
				a.download = fileName;
				return
			}
			if (alink.download === '') {
				a.href     = base64data
				a.download = fileName;
				return
			}
		}//end download
	}
}
</script>
