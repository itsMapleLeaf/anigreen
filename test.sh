export ANILIST_CLIENT_ID="123"
export ANILIST_CLIENT_SECRET="secret"
export ANILIST_REDIRECT_URI="http://localhost:3000/auth-callback"
export COOKIE_SECRET="seeeeeecret"
export NODE_ENV="test"
export NODE_OPTIONS="--no-warnings"
pnpx remix build
pnpx vitest
