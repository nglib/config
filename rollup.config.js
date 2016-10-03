export default {
    entry: 'dist/prod/index.js',
    dest: 'dist/prod/bundles/config.umd.js',
    format: 'umd',
    moduleName: 'nglib.config',
    globals: {
        '@angular/core': 'ng.core'
    }
}
