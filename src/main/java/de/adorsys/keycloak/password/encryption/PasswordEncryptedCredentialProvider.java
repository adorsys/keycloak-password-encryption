package de.adorsys.keycloak.password.encryption;

import java.text.ParseException;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

import org.keycloak.credential.CredentialInput;
import org.keycloak.credential.PasswordCredentialProvider;
import org.keycloak.models.KeyManager.ActiveRsaKey;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.credential.PasswordUserCredentialModel;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWEObject;
import com.nimbusds.jose.crypto.RSADecrypter;

import net.minidev.json.JSONObject;

public class PasswordEncryptedCredentialProvider extends PasswordCredentialProvider {
	public PasswordEncryptedCredentialProvider(KeycloakSession session) {
		super(session);
	}

	@Override
	public boolean updateCredential(RealmModel realm, UserModel user, CredentialInput input) {
		transformPassword(session, realm, (PasswordUserCredentialModel) input);
		return super.updateCredential(realm, user, input);
		
	}

	@Override
	public boolean isValid(RealmModel realm, UserModel user, CredentialInput input) {
		transformPassword(session, realm, (PasswordUserCredentialModel) input);
		return super.isValid(realm, user, input);
	}
	
	private static final void transformPassword(KeycloakSession session, RealmModel realm, final PasswordUserCredentialModel input){
        ActiveRsaKey rsaKey = session.keys().getActiveRsaKey(realm);
        // read Password from input data
        String passwordJWE = input.getValue();

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
        
        // Validate timestap
        // - Parse timestamp
        // - make sure time is not far in the pass.
        ZonedDateTime dateTime = ZonedDateTime.parse(timestamp);
        ZonedDateTime now = ZonedDateTime.now();
        if(ChronoUnit.MINUTES.between(dateTime, now) > 2) {
        	throw new IllegalStateException("Timestamp is to far in the past.");
        }
        
        String password = (String)jsonObject.get("pwd");
        
        // Set clreartext password in inputData
        input.setValue(password);
	}
	

}
