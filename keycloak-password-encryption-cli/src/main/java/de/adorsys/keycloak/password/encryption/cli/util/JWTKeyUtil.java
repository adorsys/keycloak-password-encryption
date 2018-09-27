package de.adorsys.keycloak.password.encryption.cli.util;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

import com.nimbusds.jose.RemoteKeySourceException;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKMatcher;
import com.nimbusds.jose.jwk.JWKSelector;
import com.nimbusds.jose.jwk.source.RemoteJWKSet;
import com.nimbusds.jose.proc.SecurityContext;

public class JWTKeyUtil {
	
	
	public static List<JWK> getKeys(String jwksUrl) throws MalformedURLException, RemoteKeySourceException {
		RemoteJWKSet<SecurityContext> remoteJWKSet = new RemoteJWKSet<>(new URL(jwksUrl));
		SecurityContext context = null;
		JWKMatcher matcher = new JWKMatcher.Builder().publicOnly(true).build();
		JWKSelector jwkSelector = new JWKSelector(matcher);
		List<JWK> jwks = remoteJWKSet.get(jwkSelector, context);
		return jwks;
	}
	
}
