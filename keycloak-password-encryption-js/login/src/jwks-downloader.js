"use strict";

const jose = require('node-jose')

// Configuration of authentication issuer
const keycloak = {
    realm: "master",
    authServerUrl: window.location.origin
}

function encryptPwd (pwd, encKey) {
    return jose.JWE.createEncrypt({ format: 'compact' }, encKey).
        update(JSON.stringify(pwd)).
        final();
}

function removeUseFromKeys(jwks) {
    return { keys: jwks.keys.map(key => {
        key.use = 'enc'
        key.alg = 'RSA-OAEP'
        return key
    })}
}

function getKeyPromise() {
    return fetch('http://localhost:8080/auth/realms/master/.well-known/openid-configuration')
        .then(response => response.json())
        .then(json => {
            return fetch(json.jwks_uri)
        })
        .then(response => response.json())
        .then(jwks => {
            return jose.JWK.asKeyStore(removeUseFromKeys(jwks))
        })
        .then(keystore => {
            return keystore.get({use: 'enc'})
        })
        .catch(error => {
            //some error handling
            throw error
        })
}

const keyPromise = getKeyPromise();
// downloadConfigs(keycloak);
module.exports = {
    keyPromise,
    encryptPwd
}