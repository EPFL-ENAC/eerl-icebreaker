from api.config import config
from enacit4r_auth.services.auth import KeycloakService, User


kc_service = KeycloakService(url=config.KEYCLOAK_URL, realm=config.KEYCLOAK_REALM,
                             client_id=config.KEYCLOAK_API_ID, client_secret=config.KEYCLOAK_API_SECRET,
                             admin_role="icebreaker-admin")
