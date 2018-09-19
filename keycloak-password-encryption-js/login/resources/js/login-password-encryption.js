
// Load openids configs and  jwks when the browser load the javascript file.
jwksDownloader.downloadOpenIdConfigs();

// On window load
window.onload = function() {
    const submitBtnElt = this.document.getElementById('kc-login');
    const passwordElt = this.document.getElementById('password');
    const authFormElt = this.document.getElementById("kc-form-login");
    // browserFormPwdEncrypt come from the keycloak-password-encryption-js.js build file.
    browserFormPwdEncrypt.registerPasswordSubmitEvent(passwordElt, null, null, submitBtnElt, authFormElt);
}