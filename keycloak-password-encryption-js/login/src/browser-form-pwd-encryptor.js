"use strict";

const jwksDownloader = require('./jwks-downloader')

function registerPasswordSubmitEvent (passwordElt, confirmPwdElt1, confirmPwdElt2, submitBtnElt, authFormElt) {
    if(!passwordElt) throw Error("No password elt provided")
    submitBtnElt.onclick = function(e) {
        // enhancedPwd with a 'timestamp' value (to prevent a replay attact)
        const enhancedPwd = {
            timestamp: new Date(),
            pwd: passwordElt.value
        }

        jwksDownloader.KeyPromise
            .then(encKey => {
                return jwksDownloader.encryptPwd(JSON.stringify(enhancedPwd), encKey)
            })
            .then(encryptedPwd => {
                passwordElt.value = encryptedPwd;
                // Submit the form when the password encryption is completed.
                authFormElt.submit();
            })
            .catch(error => {
                throw error;
            })

        return false;
    }
}
module.exports = {
    registerPasswordSubmitEvent
}