package de.adorsys.keycloak.password.encryption;

import org.keycloak.credential.CredentialProviderFactory;
import org.keycloak.models.KeycloakSession;

public class PasswordEncryptedCredentialProviderFactory implements CredentialProviderFactory<PasswordEncryptedCredentialProvider> {

	public static final String PROVIDER_ID = "keycloak-encrypted-password";

	public PasswordEncryptedCredentialProvider create(KeycloakSession session) {
		return new PasswordEncryptedCredentialProvider(session);
	}

	public String getId() {
		return PROVIDER_ID;
	}
}
