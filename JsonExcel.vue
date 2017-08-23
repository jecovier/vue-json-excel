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
		},
		'meta':{
			type: Array,
			default: []
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
		emitXmlHeader: function () {
		    var headerRow =  '<tr>\n';
		    for (var colName in this.fields) {
		        headerRow += '  <th>\n';
		        headerRow += colName + '\n';
		        headerRow += '  </th>\n';
		    }
			headerRow += '</tr>\n';
			var metatags = null;
			this.meta.forEach(function(element) {
				metatags += '<meta '
				element.forEach(function(m) {
					metatags += m.key+'="'+m.value+'" ';
				});
				metatags += '>';
			});
		    return '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head>'+metatags+'<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Data</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>\n' +
				   '<thead>\n\n' +
				   headerRow+
				   '</thead>\n\n'+
		           '</tbody>\n';
		},

		emitXmlFooter: function() {
		    return '\n</tbody>\n' +
					'</table>\n'+
					'</body>\n'+
		           '</html>\n';
		},

		jsonToHtml: function (jsonObject) {
		    var row;
		    var col;
		    var xml;
			// console.log(jsonObject);
		    var data = typeof jsonObject != "object"
		             ? JSON.parse(jsonObject)
		             : jsonObject;

		    xml = this.emitXmlHeader();

		    for (row = 0; row < data.length; row++) {
		        xml += '<tr>\n';

		        for (col in data[row]) {
		            xml += '  <td>\n';
		            xml += String(data[row][col])+ '\n';
		            xml += '  </td>\n';
		        }

		        xml += '</tr>\n';
		    }

		    xml += this.emitXmlFooter();
		    return xml;
		},

		generate_excel: function (){
	        var uri = 'data:application/vnd.ms-excel;base64,'
	        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }

			var a = document.getElementById(this.id_name);
			a.href = uri + base64(this.jsonToHtml(this.data));
	        a.download = this.name;
		}
	}
}
</script>
