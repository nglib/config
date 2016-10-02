if (!Object.hasOwnProperty('name')) {
    Object.defineProperty(Function.prototype, 'name', {
        get: function() {
            var matches = this.toString().match(/^\s*function\s*(\S*)\s*\(/);
            var name = matches && matches.length > 1 ? matches[1] : "";
            Object.defineProperty(this, 'name', {value: name});
            return name;
        }
    });
}

// Tun on full stack traces in errors to help debugging
Error.stackTraceLimit=Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100;

// Cancel Karma's synchronous start,
// we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function() {};

var packages = {};
var packageNames = [
    'common',
    'compiler',
    'core',
    'http',
    'platform-browser-dynamic',
    'platform-browser',
    'platform-server'
];

// add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
packageNames.forEach(function(pkgName) {
    packages['@angular/'+pkgName] = { main: 'bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
    packages['@angular/'+pkgName+'/testing'] = { main: '../bundles/' + pkgName + '-testing.umd.js', defaultExtension: 'js' };
});

System.config({
    baseURL: '/base',
    defaultJSExtensions: true,
    map: {
        'rxjs': 'node_modules/rxjs',
        '@angular': 'node_modules/@angular',
        '@nglib/config' : 'dist/bundles/config.umd'
    },
    packages: packages
});

Promise.all([
    System.import('@angular/core/testing'),
    System.import('@angular/platform-browser-dynamic/testing')
])
.then(function (providers) {
    var testing = providers[0];
    var testingBrowser = providers[1];

    testing.TestBed.initTestEnvironment(
        testingBrowser.BrowserDynamicTestingModule,
        testingBrowser.platformBrowserDynamicTesting()
    );
})
.then(function() {
    return Promise.all(
        Object.keys(window.__karma__.files) // All files served by Karma.
            .filter(onlySpecFiles)
            .map(file2moduleName)        // Normalize paths to module names.
            .map(function(path) {
                return System.import(path).then(function(module) {
                    if (module.hasOwnProperty('main')) {
                        module.main();
                    }
                    else {
                        throw new Error('Module ' + path + ' does not implement main() method.');
                    }
                });
            }));
})
.then(function() {
    __karma__.start();
}, function(error) {
    __karma__.error(error.stack || error);
});

// Normalize paths to module names.
function file2moduleName(filePath) {
    return filePath.replace(/\\/g, '/')
        .replace(/^\/base\//, '')
        .replace(/\.js$/, '');
}

function onlySpecFiles(path) {
    return /\.spec\.js$/.test(path);
}
