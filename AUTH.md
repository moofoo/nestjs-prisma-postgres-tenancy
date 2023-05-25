# Authentication and Session Handling

The frontend is a [NextJS](https://nextjs.org/) app using [Mantine](https://mantine.dev) for the UI.

#

The app uses [Iron Session](https://github.com/vvo/iron-session) for the encrypted session store (cookie storage).

#

Since both the frontend and backend use the same [config](packages/session-opts/src/index.ts), both are able to read and modify the session.

#

Access control on the frontend is handled by [NextJS middleware](apps/frontend/src/middleware.ts). Here is the [backend login method](apps/backend/src/auth/auth.service.ts)
