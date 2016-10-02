export default {
    entry: 'dist/index.js',
    dest: 'dist/bundles/config.umd.js',
    format: 'umd',
    moduleName: 'nglib.config',
    globals: {
    	'@angular/core': 'ng.core'
    }
}