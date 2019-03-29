import vue from 'rollup-plugin-vue';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'JsonExcel.vue',
    output: {
        format: 'esm',
        file: 'dist/vue-json-excel.js'
    },
    plugins: [
        vue(),
        commonjs(),
        resolve()
    ]
}
