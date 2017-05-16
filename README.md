# JSON to Excel for VUE 2
Download your JSON data as an excel file directly from the browser. This component it's based on the solution proposed on this thread http://stackoverflow.com/questions/29230518/how-to-export-json-data-to-excel-file-using-javascript

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
```

In your HTML call it like

```html
<download-excel
	class   = "btn btn-default"
	:data   = "json_data"
	:fields = "json_fields"
	name    = "filename.xls">

	Download Excel

</download-excel>
```
json_data contains the data you want to export, json_fields is a type mapping
for the fields in the json, name is the file name.



## License
MIT



#### Status
This project is in an early stage of development. Any contribution is welcome :D
