from fastapi import HTTPException, status, Security, Depends
from fastapi.security import OAuth2AuthorizationCodeBearer
from keycloak import KeycloakOpenID
from api.config import config
from api.models.auth import User


# This is used for fastapi docs authentification
oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=f"{config.KEYCLOAK_URL}",
    tokenUrl=(
        f"{config.KEYCLOAK_URL}/realms/{config.KEYCLOAK_REALM}"
        "/protocol/openid-connect/token"
    ),
)


keycloak_openid = KeycloakOpenID(
    server_url=config.KEYCLOAK_URL,
    client_id=config.KEYCLOAK_API_ID,
    client_secret_key=config.KEYCLOAK_API_SECRET,
    realm_name=config.KEYCLOAK_REALM,
    verify=True,
)

# Get the payload/token from keycloak


async def get_payload(token: str = Security(oauth2_scheme)) -> dict:
    try:
        return keycloak_openid.decode_token(
            token,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),  # "Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


# Get user infos from the payload
async def get_user_info(payload: dict = Depends(get_payload)) -> User:
    try:
        return User(
            id=payload.get("sub"),
            username=payload.get("preferred_username"),
            email=payload.get("email"),
            first_name=payload.get("given_name"),
            last_name=payload.get("family_name"),
            realm_roles=payload.get("realm_access", {}).get("roles", []),
            client_roles=payload.get("realm_access", {}).get("roles", []),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),  # "Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def require_admin(user: User = Depends(get_user_info)):
    if "icebreaker-admin" not in user.realm_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorised to perform this operation",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
