# keycloak-password-encryption

This project provide an :
- Encryption plugin for keycloak that : Read encrypted password and decrypt them.
    - There is in this project a keycloak-password-encryption-js/ which provide a custom keycloak them for encrypting user passwords in the login, registration and forgotten passwords pages.
- A command line tool, for encrypting passwords that may be sent to keycloak using the public key. This cli tool can be used for automations.