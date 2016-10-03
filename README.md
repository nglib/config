# @nglib/config
Angular 2 module for store and provide a configuration

[![dep][dep-image]][dep-url]
[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][downloads-url]

[travis-image]: https://img.shields.io/travis/stenin-nikita/module-promise.svg?style=flat
[travis-url]: https://travis-ci.org/stenin-nikita/@nglib/config
[dep-image]: https://david-dm.org/nglib/config.svg?style=flat
[dep-url]: https://david-dm.org/nglib/config
[npm-image]: https://img.shields.io/npm/v/@nglib/config.svg?style=flat
[npm-url]: https://npmjs.org/package/@nglib/config
[downloads-image]: https://img.shields.io/npm/dm/@nglib/config.svg?style=flat
[downloads-url]: https://npmjs.org/package/@nglib/config

[Live Example](http://plnkr.co/edit/EmqtxN5EHOFPIjrdD6km?p=preview)

## Installation

`npm install @nglib/config --save`

## Usage

#### Setup App Module

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ConfigPipe, provideConfig } from '@nglib/config';
import { AppComponent } from './app.component';
import * as myconfig from './myconfig';

@NgModule({
    imports: [BrowserModule],
    declarations: [
        AppComponent, ConfigPipe
    ],
    providers: [
        provideConfig(myconfig)
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
```
#### Inject ConfigService

```typescript
import { Component } from '@angular/core';
import { ConfigService } from '@nglib/config';

@Component({
    selector: 'app',
    template: `
        <div>{{ 'my.key' | config: 'default value' }}</div>
    `
})
export class AppComponent {
    private config: ConfigService;

    constructor(config: ConfigService) {
        this.config = config;

        this.config.set('a.b.c', 'some value');
        console.log(this.config.get('my.key', 'default value'));
        console.log(this.config.has('a.b'));
        console.log(this.config.all());
    }
}
```

### systemjs.config.js

```javascript
System.config({
    paths: {
        "npm:": "node_modules/",
    },

    map: {
        // application folder
        app: "app/",

        // angular bundles
        "@angular/core": "npm:@angular/core/bundles/core.umd.min.js",
        "@angular/common": "npm:@angular/common/bundles/common.umd.min.js",
        "@angular/compiler": "npm:@angular/compiler/bundles/compiler.umd.min.js",
        "@angular/platform-browser": "npm:@angular/platform-browser/bundles/platform-browser.umd.min.js",
        "@angular/platform-browser-dynamic": "npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.min.js",
        "@angular/http": "npm:@angular/http/bundles/http.umd.min.js",
        "@angular/router": "npm:@angular/router/bundles/router.umd.min.js",
        "@angular/forms": "npm:@angular/forms/bundles/forms.umd.min.js",

        // other libraries
        "rxjs": "npm:rxjs",

        // @nglib/config
        "@nglib/config": "npm:@nglib/config/bundles/config.umd.min.js",
    },

    packages: {
        app: {
            main: "./main.js",
            defaultExtension: "js"
        },

        rxjs: {
            defaultExtension: "js"
        }
    }
});
```

## License
MIT @ Nikita Stenin
