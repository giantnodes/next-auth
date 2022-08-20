<div id="top"></div>
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/giantnodes">
    <img src="https://i.imgur.com/A7o5VUv.png" alt="giantnodes logo" width="350">
  </a>

  <h3 align="center">@giantnodes/next-auth</h3>

  <p align="center">
    A OAuth2 and OpenID connect compliant authentication solution for Next.js
    <br />
    <a href="https://github.com/giantnodes/next-auth"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/giantnodes/next-auth/issues">Bug Report</a>
    ·
    <a href="https://github.com/giantnodes/next-auth/issues">Feature Request</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul></ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul></ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

Let's face it authentication is Next.js can be a pain. @giantnodes/next-auth aims to be a plug and play solution with minimal setup, so you can get authentication up and running in under a few minutes.

There's are no additional peer dependencies, no adapters and no predefined pages you need to configure, @giantnodes/next-auth intends to be minimal yet fully extensible solution so it just works without all the hassle.

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started

@giantnodes/next-auth is not intended to be your oauth / openid connect server, it will be the utility you use to obtain access to these providers with. So before setting up @giantnodes/next-auth you will need to have an existing oauth2 server ready, or a 3rd party provider configured (eg; Google, Facebook etc).

### Installation

```sh
yarn add @giantnodes/next-auth
```

or

```sh
npm install --save @giantnodes/next-auth
```

## Usage

You will first need to create a Api route which is where you will configure all your providers in, this is so @giantnodes/next-auth know who to authenticate with and all the parameters it needs in order to obtain tokens from.

```ts
// pages/api/auth/[...auth].js
import { OAuth, PasswordProvider } from '@giantnodes/next-auth'

export default OAuth({
  providers: [
    PasswordProvider({
      client_id: 'giantnodes',
      scope: 'offline_access profile',
      endpoints: {
        logout: 'http://localhost:5001/logout',
        token: 'http://localhost:5001/connect/token',
        userinfo: 'http://localhost:5001/userinfo',
      },
    }),
  ],
})
```

Once you have your providers setup, you can already start authenticating against from them. In our case we are using the password provider which uses the password grant under the hood.

To use the password flow you need to make a post request to `/api/auth/signin/password` including a username and password field, you can also optionally include a redirect url to redirect the user after a successful login. Once the user has been logged in a few cookies will be created, these will be to store the pid (the provider id, in this case it will be password), the access_token and the refresh_token if it is returned.

```tsx
const LoginForm: React.FC = () => {
  return (
    <form action="/api/auth/signin/password?redirect_url=http://localhost:3000/protected" method="POST">
      <input name="username" type="text" />
      <input name="password" type="password" />

      <button type="submit" className="button">
        Sign in
      </button>
    </form>
  )
}

export default LoginForm
```

In order to gain access to the user info, we will need to wrap the application with a SessionContext. This will hold all the users information received via the userinfo endpoint configured in the provider that was used to login.

```ts
import type { AppProps } from 'next/app'
import { SessionProvider } from '@giantnodes/next-auth'

const Application = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default Application
```

Now for the important part! To authenticate your routes all you need to do is export a getServerSideProps function on the pages you wish to be authenticated and that's it! It will automatically update the users session state and pass that down into the SessionContext for you.

```ts
import type { NextPage } from 'next'
import { getSessionServerSideProps, SessionContext } from '@giantnodes/next-auth'
import React from 'react'

const HomePage: NextPage = () => {
  const { session, isAuthenticated } = React.useContext(SessionContext)

  return (
    <div>
      {session?.sub}
      {isAuthenticated.toString()}
    </div>
  )
}

export const getServerSideProps = getSessionServerSideProps
export default HomePage

// if you wish to provide a custom redirect for a page when unauthenticated
// export const getServerSideProps: GetServerSideProps = (context) =>
//   getSessionServerSideProps(context, {
//     pages: {
//       login: '/special-login-page',
//     },
//   })
```

If you're already utilizing getServerSideProps and need the route authenticated still, you can use the `getServerSession` function to retrieve the session information. Ensure you don't forget to pass the session back as a prop, otherwise the session context will not update!

```ts
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = getServerSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}
```

## Roadmap

- [ ] add more providers (Google, Facebook, Discord ect)!
- [ ] add tab / window syncing
- [ ] add tests and automated workflows

<p align="right">(<a href="#top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

## Acknowledgments

This project was inspired by next-auth, an existing package that although very useful it included a lot of the things we did not want, or need. That does not mean it won't fit all your requirements though!

- [NextAuth.js](https://github.com/nextauthjs/next-auth)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
