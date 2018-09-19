## How to generate the module

### Requirement

- Install npm
- Install browsify

### Generate Required Javascript files

- npm run build

### List of files to use for deployment of this theme in production
 
- resources/
- theme.properties

### The theme ouput should look like this in the keycloak directory


- keycloak-4.4.0.Final/
    - themes/
        - keycloak-password-encryption-js/ (this is our custom theme to put in keycloak)
            - login/
                - resources/
                    - keycloak-password-encryption.js
                    - login-password-encryption.js
                - theme.properties
