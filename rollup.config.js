export default {
    entry: 'dist/config/index.js',
    dest: 'dist/config/bundles/config.umd.js',
    format: 'umd',
    moduleName: 'nglib.config',
    globals: {
        '@angular/core': 'ng.core'
    }
}
