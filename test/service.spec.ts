import { Injector } from '@angular/core';
import { TestBed, getTestBed } from '@angular/core/testing';
import { ConfigService, CONFIG, provideConfig } from '@nglib/config';

export function main() {
    describe('ConfigService', () => {
        var configObject = {
            a: 'b',
            c: {
                d: {
                    e: 'f'
                }
            }
        };

        describe('#construcor', function() {
            it('should return an empty object', function() {
                var service: ConfigService;
                
                service = new ConfigService(null);
                expect(service.all()).toEqual({});

                service = new ConfigService(undefined);
                expect(service.all()).toEqual({});
            });

            describe('#error value for CONFIG provider', () => {
                function provideBadValue(value) {
                    TestBed.configureTestingModule({
                        providers: [
                            provideConfig(value)
                        ]
                    });
                    return getTestBed().get(ConfigService);
                }

                it('should throw an exception for string', function() {
                    expect(() => provideBadValue('string')).toThrow();
                });

                it('should throw an exception for number', function() {
                    expect(() => provideBadValue(0)).toThrow();
                    expect(() => provideBadValue(1)).toThrow();
                });

                it('should throw an exception for function', function() {
                    expect(() => provideBadValue(function(){})).toThrow();
                });
            });
        });

        describe('#injectables', () => {
            describe('#injection via CONFIG provider', () => {
                var service: ConfigService;
                var injector: Injector;

                beforeEach(() => {
                    TestBed.configureTestingModule({
                        providers: [
                            ConfigService,
                            { provide: CONFIG, useValue: configObject }
                        ]
                    });
                    injector = getTestBed();
                });

                it('should be an instanceof ConfigService', function() {
                    service = injector.get(ConfigService);
                    expect(service instanceof ConfigService).toEqual(true);
                });
            });

            describe('#injection via provideConfig', () => {
                var service: ConfigService;
                var injector: Injector;

                beforeEach(() => {
                    TestBed.configureTestingModule({
                        providers: [
                            provideConfig(configObject)
                        ]
                    });
                    injector = getTestBed();
                });

                it('should be an instanceof ConfigService', function() {
                    service = injector.get(ConfigService);
                    expect(service instanceof ConfigService).toEqual(true);
                });
            });

            describe('#provideConfig', () => {
                var service: ConfigService;
                var injector: Injector;

                beforeEach(() => {
                    TestBed.configureTestingModule({
                        providers: [
                            provideConfig()
                        ]
                    });
                    injector = getTestBed();
                });

                it('should return an empty object', function() {
                    service = injector.get(ConfigService);
                    expect(service.all()).toEqual({});
                });
            });
        });

        describe('#get', function() {
            var service: ConfigService;
            var injector: Injector;

            beforeEach(() => {
                TestBed.configureTestingModule({
                    providers: [
                        provideConfig(configObject)
                    ]
                });
                injector = getTestBed();
            });

            it('should return the object IConfigIterface for null, undefined, or an empty value', function() {
                service = injector.get(ConfigService);
                expect(service.get(null)).toBe(configObject);
                expect(service.get(undefined)).toBe(configObject);
                expect(service.get('')).toBe(configObject);
            });

            it('should gives back the property for the given key', function() {
                service = injector.get(ConfigService);
                expect(service.get('a')).toEqual('b');
            });

            it('should gives back the property for the given nested key', function() {
                service = injector.get(ConfigService);
                expect(service.get('c.d')).toEqual(configObject.c.d);
                expect(service.get('c.d.e')).toEqual('f');
            });

            it('should return the default value', function() {
                service = injector.get(ConfigService);
                expect(service.get('x')).toEqual(null);
                expect(service.get('x', null)).toEqual(null);
                expect(service.get('x', undefined)).toEqual(undefined);
                expect(service.get('x', NaN)).toEqual(NaN);
                expect(service.get('x', Infinity)).toEqual(Infinity);
                expect(service.get('x', false)).toEqual(false);
                expect(service.get('x', true)).toEqual(true);
                expect(service.get('x', 0)).toEqual(0);
                expect(service.get('x', 1)).toEqual(1);
                expect(service.get('x', 1.1)).toEqual(1.1);

                expect(service.get('x.y')).toEqual(null);
                expect(service.get('x.y', null)).toEqual(null);
                expect(service.get('x.y', undefined)).toEqual(undefined);
                expect(service.get('x.y', NaN)).toEqual(NaN);
                expect(service.get('x.y', Infinity)).toEqual(Infinity);
                expect(service.get('x.y', false)).toEqual(false);
                expect(service.get('x.y', true)).toEqual(true);
                expect(service.get('x.y', 0)).toEqual(0);
                expect(service.get('x.y', 1)).toEqual(1);
                expect(service.get('x.y', 1.1)).toEqual(1.1);

                expect(service.get('c.y')).toEqual(null);
                expect(service.get('c.y', null)).toEqual(null);
                expect(service.get('c.y', undefined)).toEqual(undefined);
                expect(service.get('c.y', NaN)).toEqual(NaN);
                expect(service.get('c.y', Infinity)).toEqual(Infinity);
                expect(service.get('c.y', false)).toEqual(false);
                expect(service.get('c.y', true)).toEqual(true);
                expect(service.get('c.y', 0)).toEqual(0);
                expect(service.get('c.y', 1)).toEqual(1);
                expect(service.get('c.y', 1.1)).toEqual(1.1);
            });

            it('should support null, undefined or string', function() {
                service = injector.get(ConfigService);
                expect(() => service.get(null)).not.toThrow(); 
                expect(() => service.get(undefined)).not.toThrow(); 
                expect(() => service.get('')).not.toThrow();
                expect(() => service.get('y')).not.toThrow();
            });
        });

        describe('#set', function() {
            var service: ConfigService;
            var injector: Injector;

            beforeEach(() => {
                TestBed.configureTestingModule({
                    providers: [
                        ConfigService,
                        { provide: CONFIG, useValue: configObject }
                    ]
                });
                injector = getTestBed();
            });

            it('should gives back the property for set key', function() {
                service = injector.get(ConfigService);
                service.set('x', 'y');
                expect(service.get('x')).toEqual('y');

                service.set('x.y', 'z');
                expect(service.get('x')).toEqual({y:'z'});
                expect(service.get('x.y')).toEqual('z');

                service.set('a', 'b');
                expect(service.get('a')).toEqual('b');

                service.set('c.d.e', 'h');
                expect(service.get('c.d.e')).toEqual('h');

                service.set('null', null);
                expect(service.get('null')).toEqual(null);

                service.set('null.null', null);
                expect(service.get('null')).toEqual({ 'null': null });
                expect(service.get('null.null')).toEqual(null);

                service.set('undefined', undefined);
                expect(service.get('undefined')).toEqual(undefined);

                service.set('undefined.undefined', undefined);
                expect(service.get('undefined')).toEqual({ 'undefined': undefined });
                expect(service.get('undefined.undefined')).toEqual(undefined);
            });
        });

        describe('#has', function() {
            var service: ConfigService;
            var injector: Injector;

            beforeEach(() => {
                TestBed.configureTestingModule({
                    providers: [
                        provideConfig(configObject)
                    ]
                });
                injector = getTestBed();
            });

            it('should return true if the key exists', function() {
                service = injector.get(ConfigService);
                expect(service.has('a')).toEqual(true);
                expect(service.has('c.d')).toEqual(true);
                expect(service.has('c.d.e')).toEqual(true);
                expect(service.has(null)).toEqual(false);
                expect(service.has(undefined)).toEqual(false);
                expect(service.has('')).toEqual(false);
                expect(service.has('x')).toEqual(false);
                expect(service.has('x.y')).toEqual(false);
            });

        });

        describe('#all', function() {
            var service: ConfigService;
            var injector: Injector;

            beforeEach(() => {
                TestBed.configureTestingModule({
                    providers: [
                        provideConfig(configObject)
                    ]
                });
                injector = getTestBed();
            });

            it('should return the object IConfigIterface', function() {
                service = injector.get(ConfigService);
                expect(service.all()).toBe(configObject);
            });
        });
    });
}