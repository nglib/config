import { ConfigService } from '@nglib/config';

export function main() {
    describe('ConfigService', () => {

        let createService = function(initialConfig) {
            return new ConfigService(initialConfig);
        };

        describe('#get', function() {
            it('should gives back the property for the given key', function() {
                let service = createService({ key: 'value' });
                expect(service.get('key')).toEqual('value');
            });

            it('should gives back the property for the given nested key', function() {
                let service = createService({ nested: { key: 'value' } });
                expect(service.get('nested.key')).toEqual('value');
            });
        });

    });
}