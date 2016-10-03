import { ConfigService, ConfigPipe } from '@nglib/config';
import { PipeResolver } from '@angular/compiler';

export function main() {
    describe('ConfigPipe', () => {
        var config = {
            a: 'b',
            c: {
                d: 'e',
                f: { g: 'h' }
            }
        };
        var pipe: ConfigPipe;
        var service: ConfigService;

        beforeEach(() => { 
            service = new ConfigService(config);
            pipe = new ConfigPipe(service); 
        });

        it('should be marked as pure', () => { 
            expect(new PipeResolver().resolve(ConfigPipe).pure).toEqual(true); 
        });

        describe('transform', () => {
            it('should return correct value', () => {
                expect(pipe.transform(null)).toEqual(config);
                expect(pipe.transform(undefined)).toEqual(config);
                expect(pipe.transform('')).toEqual(config);
                expect(pipe.transform('a')).toEqual('b');
                expect(pipe.transform('c')).toEqual(config.c);
                expect(pipe.transform('c.d')).toEqual('e');
                expect(pipe.transform('c.f')).toEqual(config.c.f);
                expect(pipe.transform('c.f.g')).toEqual('h');
            });

            it('should return default value', () => {
                expect(pipe.transform('x')).toEqual(null);
                expect(pipe.transform('x', 'y')).toEqual('y');
                expect(pipe.transform('a.x', 'y')).toEqual('y');
            });
        });

        describe('supports', () => {
            it('should support string', () => { 
                expect(() => pipe.transform('key')).not.toThrow(); 
            });

            it('should support null, undefined or empty string', () => { 
                expect(() => pipe.transform(null)).not.toThrow(); 
                expect(() => pipe.transform(undefined)).not.toThrow(); 
                expect(() => pipe.transform('')).not.toThrow(); 
            });

            it('should not support other objects', () => {
                expect(() => pipe.transform({})).toThrow();
                expect(() => pipe.transform(function(){})).toThrow();
                expect(() => pipe.transform(0)).toThrow();
                expect(() => pipe.transform(1)).toThrow();
                expect(() => pipe.transform(true)).toThrow();
                expect(() => pipe.transform(false)).toThrow();
            });
        });
    });
}