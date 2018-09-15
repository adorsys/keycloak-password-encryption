package de.adorsys.keycloak.password.encryption;

import java.util.List;

import org.keycloak.Config.Scope;
import org.keycloak.authentication.Authenticator;
import org.keycloak.authentication.authenticators.browser.UsernamePasswordFormFactory;
import org.keycloak.authentication.authenticators.console.ConsoleUsernamePasswordAuthenticator;
import org.keycloak.models.AuthenticationExecutionModel.Requirement;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.provider.ProviderConfigProperty;

public class PassEncrUserNamePasswordFormFactory extends UsernamePasswordFormFactory {

	private static final String PROVIDER_ID = "username--encrypted-password-form";
	public static final PassEncrUserNamePasswordForm SINGLETON = new PassEncrUserNamePasswordForm();
	public static final Requirement[] REQUIREMENT_CHOICES;

	public Authenticator create(KeycloakSession session) {
		return SINGLETON;
	}

	public Authenticator createDisplay(KeycloakSession session, String displayType) {
		return (Authenticator) (displayType == null ? SINGLETON
				: (!"console".equalsIgnoreCase(displayType) ? null : ConsoleUsernamePasswordAuthenticator.SINGLETON));
	}

	public void init(Scope config) {
	}

	public void postInit(KeycloakSessionFactory factory) {
	}

	public void close() {
	}

	public String getId() {
		return PROVIDER_ID;
	}

	public String getReferenceCategory() {
		return "password";
	}

	public boolean isConfigurable() {
		return false;
	}

	public Requirement[] getRequirementChoices() {
		return REQUIREMENT_CHOICES;
	}

	public String getDisplayType() {
		return "Username Encrypted Password Form";
	}

	public String getHelpText() {
		return "Validates a username and password from login form.";
	}

	public List<ProviderConfigProperty> getConfigProperties() {
		return null;
	}

	public boolean isUserSetupAllowed() {
		return false;
	}

	static {
		REQUIREMENT_CHOICES = new Requirement[] { Requirement.REQUIRED };
	}
}
