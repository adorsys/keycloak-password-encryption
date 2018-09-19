const jwksDownloader = require('./jwks-downloader')

/* Function to encrypt the password using a key*/
function encryptPwd (pwd, encKey, callback) {
    jwksDownloader.encryptPwd(pwd, encKey, callback);
}

function registerPasswordSubmitEvent (passwordElt1, confirmPwdElt1, confirmPwdElt2, submitBtnElt, authFormElt) {
    if(!passwordElt1) throw Error("No password elt provided")
    submitBtnElt.onclick = function(e) {
        // enhancedPwd with a 'timestamp' value (to prevent a replay attact)
        const enhancedPwd = {
            timestamp: new Date(),
            pwd: passwordElt1.value
        }

        const encKey = jwksDownloader.getDefaultKey();
        encryptPwd(JSON.stringify(enhancedPwd), encKey, function(encryptedPwd) {
            passwordElt.value = encryptedPwd;
            // Submit the form when the password encryption is completed.
            authFormElt.submit()
        })

        return false;
    }
}
module.exports = {
    registerPasswordSubmitEvent
}