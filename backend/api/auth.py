from enacit4r_auth.services.auth import KeycloakService, User

from api.config import config

kc_service = KeycloakService(
    url=config.KEYCLOAK_URL,
    realm=config.KEYCLOAK_REALM,
    client_id=config.KEYCLOAK_API_ID,
    client_secret=config.KEYCLOAK_API_SECRET,
    admin_role="icebreaker-admin",
    # roles are client roles of the API client, in the realm shared with other apps
    client_roles=True,
)

__all__ = ["User", "kc_service"]
