const jose = require('node-jose')

// Configuration of authentication issuer
const keycloak = {
    realm: "master",
    authServerUrl: window.location.origin
}
// Initialise a jose keystore using node-jose keystore
let keystore = jose.JWK.createKeyStore();

/* Download openid well known configurations*/
function downloadConfigs(keycloak) {
    const request = new XMLHttpRequest();
    const wellKnowUrl = keycloak.authServerUrl + '/auth/realms/' + keycloak.realm + '/.well-known/openid-configuration';
    console.log(wellKnowUrl)
    request.open('GET', wellKnowUrl);
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            if (request.status == 200) {
                const uma2Config = JSON.parse(request.responseText);
                /* automatically download jwks after OP configurations download completed*/
                downloadJwks(uma2Config)
            } else {
                console.error('Could not obtain configuration from server.');
            }
        }
    }

    request.send(null);
}

/* Download the Issuer's jwks (Json Web Key Set)*/
function downloadJwks(configs) {

    // Normal browser fetch api
    const request = new XMLHttpRequest();
    request.open('GET', configs.jwks_uri);
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            if (request.status == 200) {
                // jwks download completed
                const jwksConfig = JSON.parse(request.responseText);
                console.log(jwksConfig);
                // Save the jwks in node-jose's keystore
                jose.JWK.asKeyStore(jwksConfig).then((result) => {
                    keystore = result; // update the global keystore
                }, (error) => {
                    throw error;
                });
            } else {
                console.error('Could not obtain configuration from server.');
            }
        }
    }

    request.send(null);
}

/* Get a stored key. @see https://github.com/cisco/node-jose */
function getKey(kid) {
    return keystore.get(kid);
}
/* Get a stored key. @see https://github.com/cisco/node-jose */
function getDefaultKey() {
    return getKey({use: 'sig'});
}
function downloadOpenIdConfigs() {
    return downloadConfigs(keycloak);
}

function encryptPwd (pwd, encKey, callback) {
    const promise = jose.JWE.createEncrypt({ format: 'compact' }, encKey).
        update(JSON.stringify(pwd)).
        final();
    
    promise.then(function(result){
        callback(result);
    });
    promise.catch(function(error){
        throw error;
    });
}
// downloadConfigs(keycloak);
module.exports = {
    downloadOpenIdConfigs,
    getDefaultKey,
    encryptPwd
}