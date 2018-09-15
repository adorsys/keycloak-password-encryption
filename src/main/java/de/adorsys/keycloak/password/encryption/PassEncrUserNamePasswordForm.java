package de.adorsys.keycloak.password.encryption;

import java.text.ParseException;

import javax.ws.rs.core.MultivaluedMap;

import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.authenticators.broker.IdpUsernamePasswordForm;
import org.keycloak.models.KeyManager.ActiveRsaKey;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWEObject;
import com.nimbusds.jose.crypto.RSADecrypter;

import net.minidev.json.JSONObject;

public class PassEncrUserNamePasswordForm extends IdpUsernamePasswordForm {

	@Override
	public boolean validatePassword(AuthenticationFlowContext context, UserModel user,
			MultivaluedMap<String, String> inputData) {
		
		// Read private key of keycloack.
		KeycloakSession session = context.getSession();
		RealmModel realm = context.getRealm();
        ActiveRsaKey rsaKey = session.keys().getActiveRsaKey(realm);

        // read Password from input data
		String passwordJWE = (String) inputData.getFirst("password");

		// Parse JWE
        JWEObject jweObject;
        try {
			jweObject = JWEObject.parse(passwordJWE);
		} catch (ParseException e) {
			throw new IllegalStateException(e);
		}

		// decrypt password using keycloak private key
        // Decrypt with private key
        try {
			jweObject.decrypt(new RSADecrypter(rsaKey.getPrivateKey()));
		} catch (JOSEException e) {
			throw new IllegalStateException(e);
		}
        JSONObject jsonObject = jweObject.getPayload().toJSONObject();
        String timestamp = (String)jsonObject.get("timestamp");
        String password = (String)jsonObject.get("pwd");
        
        // Validate timestap
        // - Parse timestamp
        // - make sure time is not far in the pass.
        
        // Set clreartext password in inputData
        inputData.putSingle("password", password);
		// put baclk into input data
		return super.validatePassword(context, user, inputData);
	}

}
