import vue from 'rollup-plugin-vue';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'JsonExcel.vue',
    output: [ 
        {
            format: 'cjs',
            file: 'dist/vue-json-excel.cjs.js'
        },
        {
            format: 'esm',
            file: 'dist/vue-json-excel.esm.js'
        },
        {
            name: 'JsonExcel',
            format: 'umd',
            file: 'dist/vue-json-excel.umd.js'
        }
    ],
    plugins: [
        vue(),
        commonjs(),
        resolve()
    ]
}
