"use strict";

const jose = require('node-jose');

function encryptPwd(pwd, encKey) {
    return jose.JWE.createEncrypt({ format: 'compact' }, encKey).
        update(JSON.stringify(pwd)).
        final();
}

function removeUseFromKeys(jwks) {
    return { keys: jwks.keys.map(key => {
        key.use = 'enc';
        key.alg = 'RSA-OAEP';
        return key;
    })};
}

function getServerUrl() {
	const location_host = window.location.hostname;
	const location_port = window.location.port;
	const location_pathname = window.location.pathname;
	const location_protocol = window.location.protocol;
	const realmConst= 'realms';
	
	const realm_name_start_position = location_pathname.indexOf('realms') + realmConst.length + 1;
	const realm_name_end_position = location_pathname.indexOf('/', realm_name_start_position);
	const realm_name = location_pathname.substring(realm_name_start_position, realm_name_end_position);

	return location_protocol.concat('//', location_host, ':', location_port, '/auth/realms/', realm_name, '/.well-known/openid-configuration');
}

function keyPromise() {
    return fetch(getServerUrl())
        .then(response => response.json())
        .then(json => {
            return fetch(json.jwks_uri);
        })
        .then(response => response.json())
        .then(jwks => {
            return jose.JWK.asKeyStore(removeUseFromKeys(jwks));
        })
        .then(keystore => {
            return keystore.get({use: 'enc'});
        })
        .catch(error => {
            //some error handling
            throw error;
        });
}

module.exports = {
	keyPromise,
    encryptPwd
}
