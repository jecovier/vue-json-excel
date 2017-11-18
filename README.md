# JSON to Excel for VUE 2
Download your JSON data as an excel file directly from the browser. This component it's based on the solution proposed on this thread https://stackoverflow.com/questions/17142427/javascript-to-export-html-table-to-excel

# FIX
[11-18-2017] Thanks to @msonowal now you can export to CSV, just add the prop: type="csv"
[03-08-2017] downloaded file works with Microsoft Office


## ✔ Getting started

Get the package:
```bash
npm install vue-json-excel
```

Register JsonExcel in your app entrypoint:
```js
import Vue from 'vue'
import JsonExcel from 'vue-json-excel';

Vue.component('downloadExcel', JsonExcel);

const app = new Vue({
	el: '#app',
	data: {
		json_fields : {
		    "name"      : "String",
		    "city"      : "String",
		    "country"   : "String",
		    "birthdate" : "String",
		    "amount"    : "Number"
		},
		json_data : [
		    {
		        "name"      : "Tony Peña",
		        "city"      : "New York",
		        "country"   : "United States",
		        "birthdate" : "1978-03-15",
		        "amount"    : 42
		    },
		    {
		        "name"      : "Thessaloniki",
		        "city"      : "Athens",
		        "country"   : "Greece",
		        "birthdate" : "1987-11-23",
		        "amount"    : 42
		    }
		],
		json_meta: [
			[{
				"key": "charset",
				"value": "utf-8"
			}]
		],
```

In your HTML call it like

```html
<download-excel
	class   = "btn btn-default"
	:data   = "json_data"
	:fields = "json_fields"
	type    = "xls"
	:meta   = "json_meta"
	name    = "filename.xls">

	Download Excel (you can customize this with html code!)

</download-excel>
```
json_data contains the data you want to export, json_fields is a type mapping
for the fields in the json, name is the file name.

##Export CSV
To export JSON to CSV file just add the prop type with value "csv":

```html
<download-excel
	class   = "btn btn-default"
	:data   = "json_data"
	:fields = "json_fields"
	type    = "csv"
	:meta   = "json_meta"
	name    = "filename.xls">

	Download Excel (you can customize this with html code!)

</download-excel>
```


## License
MIT



#### Status
This project is in an early stage of development. Any contribution is welcome :D
