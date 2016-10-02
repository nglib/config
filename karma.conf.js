module.exports = function(config) {
    var configuration = {
        basePath: '.',

        preprocessors: {
            'dist/test/**/*.js': ['typescript']
        },

        typescriptPreprocessor: {
            options: {
                sourceMap: false,
                target: 'ES5',
                module: 'amd',
                noImplicitAny: true,
                noResolve: true,
                removeComments: true,
                concatenateOutput: false
            },
            
            transformPath: function(path) {
                return path.replace(/\.ts$/, '.js');
            }
        },

        frameworks: ['jasmine'],
        files: [
            'node_modules/core-js/client/shim.min.js',

            'node_modules/zone.js/dist/zone.js',
            'node_modules/zone.js/dist/long-stack-trace-zone.js',
            'node_modules/zone.js/dist/proxy.js',
            'node_modules/zone.js/dist/sync-test.js',
            'node_modules/zone.js/dist/jasmine-patch.js',
            'node_modules/zone.js/dist/async-test.js',
            'node_modules/zone.js/dist/fake-async-test.js',

            'node_modules/reflect-metadata/Reflect.js',
            'node_modules/systemjs/dist/system.src.js',

            // RxJs
            { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
            { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },

            // Angular 2 itself and the testing library
            { pattern: 'node_modules/@angular/**/*.js', included: false, watched: false },
            { pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: false },

            // paths loaded via module imports
            { pattern: 'dist/**/*.js', included: false, watched: true },

            // paths to support debugging with source maps in dev tools
            //{ pattern: 'src/**/*.ts', included: false, watched: false },
            //{ pattern: 'dist/**/*.js.map', included: false, watched: false },
            'karma-test-shim.js'
        ],
        // proxied base paths
        proxies: {
            // required for component assests fetched by Angular's compiler
            '/src/': '/base/src/'
        },
        port: 9876,
        logLevel: config.LOG_INFO,
        colors: true,
        autoWatch: true,
        browsers: ['Chrome'],
        // Karma plugins loaded
        plugins: [
            'karma-typescript-preprocessor',
            'karma-jasmine',
            //'karma-coverage',
            'karma-chrome-launcher'
        ],

        // Coverage reporter generates the coverage
        reporters: ['progress'],

        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        singleRun: true
    };

    if (process.env.TRAVIS) {
        configuration.browsers = ['Chrome_travis_ci'];
    }
    config.set(configuration);
};