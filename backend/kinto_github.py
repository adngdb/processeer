import requests
from kinto.core import logger
from pyramid.authentication import CallbackAuthenticationPolicy
from pyramid.interfaces import IAuthenticationPolicy
from zope.interface import implementer

GITHUB_METHOD = 'Github+Bearer'


@implementer(IAuthenticationPolicy)
class GithubAuthenticationPolicy(CallbackAuthenticationPolicy):
    def __init__(self, realm='Realm'):
        self.realm = realm

    def unauthenticated_userid(self, request):
        user_id = self._get_credentials(request)
        return user_id

    def forget(self, request):
        return [('WWW-Authenticate', '{} realm="{}"'.format(GITHUB_METHOD, self.realm))]

    def _get_credentials(self, request):
        authorization = request.headers.get('Authorization', '')
        try:
            authmeth, token = authorization.split(' ', 1)
            authmeth = authmeth.lower()
        except ValueError:
            return None
        if authmeth != GITHUB_METHOD.lower():
            return None
        try:
            headers = {"Authorization": "token %s" % token}
            resp = requests.get("https://api.github.com/user", headers=headers)
            resp.raise_for_status()
            userinfo = resp.json()
            user_id = userinfo['login']
        except Exception as e:
            logger.warn(e)
            return None
