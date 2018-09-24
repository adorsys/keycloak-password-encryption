"use strict";

const jwksDownloader = require('./jwks-downloader')

function registerPasswordSubmitEvent(passwordElt, passwordConfirmElt, submitBtnElt, authFormElt) {
    if(!passwordElt) {
        throw "No password elt provided"
    }

    submitBtnElt.onclick = function(e) {
        // check if the passwords match 
        if(validatePasswordConfirm(passwordElt, passwordConfirmElt)) {

            // enhancedPwd with a 'timestamp' value (to prevent a replay attack)
            const enhancedPwd = {
                timestamp: new Date(),
                pwd: passwordElt.value
            }

            jwksDownloader.keyPromise
                .then(encKey => {
                    return jwksDownloader.encryptPwd(enhancedPwd, encKey)
                })
                .then(encryptedPwd => {
                    passwordElt.value = encryptedPwd;
                    if(passwordConfirmElt != null)
                    	passwordConfirmElt.value = encryptedPwd;
                    // Submit the form when the password encryption is completed.
                    authFormElt.submit();
                })
                .catch(error => {
                    throw error;
                })
            ;

            return false;
        } else {
            return false;
        }
    }
}

function validatePasswordConfirm(passwordElt, passwordConfirmElt) {
    if(passwordConfirmElt == null)
        return true;
    if(passwordElt.value == passwordConfirmElt.value)
        return true; 
    
    // display error 
    var mismatchError = document.getElementById('mismatchError');
    if(mismatchError == null) {
        var divAlert = document.createElement('div');
        divAlert.id = 'mismatchError';
        divAlert.className = 'alert alert-error';
        var spanAlert = document.createElement('span');
        spanAlert.className = 'pficon pficon-error-circle-o';
        divAlert.appendChild(spanAlert);
        var spanText = document.createElement('span');
        spanText.className = 'kc-feedback-text';
        spanText.textContent = 'Password confirmation doesn\'t match.';
        divAlert.appendChild(spanText);
        
        var contentWrapper = document.getElementById('kc-content-wrapper');
        contentWrapper.parentElement.insertBefore(divAlert, contentWrapper);
    }

    return false;
}

module.exports = {
    registerPasswordSubmitEvent
}