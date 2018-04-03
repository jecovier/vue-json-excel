# JSON to Excel for VUE 2
Download your JSON data as an excel file directly from the browser. This component it's based on the solution proposed on this thread https://stackoverflow.com/questions/17142427/javascript-to-export-html-table-to-excel

# FIX
[20-30-2018] Thanks to @gucastiliao and @gusehr for json callback feature, now you can preproccess the data using a callback function. See the description on how to use it.

[02-01-2018] Thanks to @gucastiliao for json nested support, @ryatziv for the multiples fixes, @DrLongGhost for CSV data escaping, @davodaslanifakor for key header fix

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
import JsonExcel from 'vue-json-excel'

Vue.component('downloadExcel', JsonExcel)

const app = new Vue({
    el: '#app',
    data: {
        json_fields: {
            'Complete name': 'name',
            'City': 'city',
            'Telephone': 'phone.mobile',
            'Telephone 2' : {
                field: 'phone.landline',
                callback: (value) => {
                    return `Landline Phone - ${value}`;
                }
            },
        },
        json_data: [
            {
                'name': 'Tony Peña',
                'city': 'New York',
                'country': 'United States',
                'birthdate': '1978-03-15',
                'phone': {
                    'mobile': '1-541-754-3010',
                    'landline': '(541) 754-3010'
                }
            },
            {
                'name': 'Thessaloniki',
                'city': 'Athens',
                'country': 'Greece',
                'birthdate': '1987-11-23',
                'phone': {
                    'mobile': '+1 855 275 5071',
                    'landline': '(2741) 2621-244'
                }
            }
        ],
        json_meta: [
            [
                {
                    'key': 'charset',
                    'value': 'utf-8'
                }
            ]
        ],
    }
})
```

In your HTML call it like

```html
<download-excel
	class   = "btn btn-default"
	:data   = "json_data"
	:fields = "json_fields"
	name    = "filename.xls">

	Download Excel (you can customize this with html code!)

</download-excel>
```
REQUIRED
- json_data: Contains the data you want to export,
- json_fields: You can select what fields to export, especify nested data and assign labels to the fields
the key is the label, the value is the JSON field. This will export the field data 'as is'.
    If you need to customize the the exported data you can define a callback function. Thanks to @gucastiliao.
```js
let json_fields = {
    // regular field (exported data 'as is')
    fieldLabel: attributeName, // nested attribute supported
    // callback function for data formatting
    anotherFieldLabel: {
        field: anotherAttributeName, // nested attribute supported
        callback: (value) => {
            return `formatted value ${value}`
        }
    },
}
```
OPTIONAL
- type: xls o csv, xls is the default value.
- name: filename of the document you donwload.
- title: Add a title above the datagrid

## Export CSV
To export JSON to CSV file just add the prop type with value "csv":

```html
<download-excel
	class   = "btn btn-default"
	:data   = "json_data"
	:fields = "json_fields"
	type    = "csv"
	name    = "filename.xls">

	Download Excel (you can customize this with html code!)

</download-excel>
```


## License
MIT



#### Status
This project is in an early stage of development. Any contribution is welcome :D
