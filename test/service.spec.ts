import { ConfigService } from '@nglib/config';

export function main() {
    describe('ConfigService', () => {

        let createService = function(initialConfig = {}) {
            return new ConfigService(initialConfig);
        };

        describe('#interface', () => {
            it('instanceof', function() {
                let service = createService();
                expect(service instanceof ConfigService).toEqual(true);
            });
        });

        describe('#get', function() {
            it('should gives back the property for the given key', function() {
                let service = createService({ key: 'value' });
                expect(service.get('key')).toEqual('value');
            });

            it('should gives back the property for the given nested key', function() {
                let service = createService({ nested: { key: 'value' } });
                expect(service.get('nested.key')).toEqual('value');
            });

            it('should gives back the property for the given nested key', function() {
                let service = createService({ nested1: { nested2: { key: 'value' } } });
                expect(service.get('nested1.nested2.key')).toEqual('value');
            });
        });

        describe('#has', function() {
            it('should gives back the property for the given key', function() {
                let service = createService({ key: 'value' });
                expect(service.has('key')).toEqual(true);
            });

            it('should gives back the property for the given nested key', function() {
                let service = createService({ nested: { key: 'value' } });
                expect(service.has('nested.key')).toEqual(true);
            });

            it('should gives back the property for the given nested key', function() {
                let service = createService({ nested1: { nested2: { key: 'value' } } });
                expect(service.has('nested1.nested2.key')).toEqual(true);
            });
        });
    });
}