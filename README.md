# EERL-ICEBREAKER

A map of polar campaigns.

## backend

Management of polar campaigns.

Connects to S3 (at EPFL) to store polar campaigns description and data files.

Connects to Keycloak (at ENAC IT) to validate users authentication.

## frontend

A web interface to visualize the map of polar campaigns.

Connects to the backend to retrieve polar campaigns description and data files.

Connects to Keycloak to authenticate users.