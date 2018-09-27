# How to use it

- Clone the project
- Build it using : `mvn clean package`
- Run the following jwe-cli with the jwks-url of your OpenID provider (i.e keycloak
) and the password to encrypt

`./jwe-cli.sh https://datev-custom-keycloak-dev.cloud.adorsys.de/auth/realms/master/protocol/openid-connect/certs date`

- Example


`./jwe-cli.sh https://datev-custom-keycloak-dev.cloud.adorsys.de/auth/realms/master/protocol/openid-connect/certs date./jwe-cli.sh https://datev-custom-keycloak-dev.cloud.adorsys.de/auth/realms/master/protocol/openid-connect/certs pass12345`