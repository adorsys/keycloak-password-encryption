# keycloak-password-encryption

This plugin provides functionality to encrypt (via javascript) and decrypt (via java provider) passwords for login, registration and password forgotten. 

When the following system variable is set, the admin can NOT change the password of users who belong to the listed realms: 

```
REALMS_WITH_ADMIN_RESTRICTION=timp,xyz
```