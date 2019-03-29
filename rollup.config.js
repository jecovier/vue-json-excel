import vue from 'rollup-plugin-vue';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'JsonExcel.vue',
    output: {
        format: 'esm',
        file: 'dist/JsonExcel.js'
    },
    plugins: [
        vue(),
        commonjs(),
        resolve()
    ]
}
