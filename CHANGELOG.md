<a name"0.1.42"></a>
### 0.1.42 (2015-06-30)


#### Bug Fixes

* **authorizations:** Use correct function to send only status code ([3a27f8fb](https://github.com/anvilresearch/connect/commit/3a27f8fb))
* **boot:** Define variables that are used but not defined ([9553367d](https://github.com/anvilresearch/connect/commit/9553367d))
* **client:**
  * Remove unused variable ([f89e8bd2](https://github.com/anvilresearch/connect/commit/f89e8bd2))
  * Fix callback function name ([756a1b5a](https://github.com/anvilresearch/connect/commit/756a1b5a))
* **oidc:**
  * Don't dereference indexOf if scope is falsy ([7b65497b](https://github.com/anvilresearch/connect/commit/7b65497b))
  * Fix callback function name ([69ac4623](https://github.com/anvilresearch/connect/commit/69ac4623))
* **openid:** Correct use of undefined variable ([269d5243](https://github.com/anvilresearch/connect/commit/269d5243))
* **register:** Fix missing NotFoundError require ([51e2796e](https://github.com/anvilresearch/connect/commit/51e2796e))
* **routes:**
  * Update to match express v4 API ([e4aa50a4](https://github.com/anvilresearch/connect/commit/e4aa50a4))
  * Update to match express v4 API ([3ecdfe7f](https://github.com/anvilresearch/connect/commit/3ecdfe7f))
  * Pass `next` to `passport.authenticate` ([29caf252](https://github.com/anvilresearch/connect/commit/29caf252))
* **signout:** Update deprecated express API call ([40ee238c](https://github.com/anvilresearch/connect/commit/40ee238c))
* **time-utils:** Fix variable double-definition ([38867105](https://github.com/anvilresearch/connect/commit/38867105))
* **userapplications:** Add missing semicolon ([abd38c5c](https://github.com/anvilresearch/connect/commit/abd38c5c))
* **userinfo:** Add missing NotFoundError require ([612f4e31](https://github.com/anvilresearch/connect/commit/612f4e31))


#### Features

* **fields:** Generate sign in form for providers with defined fields ([2769b1fe](https://github.com/anvilresearch/connect/commit/2769b1fe))
* **providers:** Add Active Directory support ([a25cae79](https://github.com/anvilresearch/connect/commit/a25cae79))
* **views:** use consolidate.js for configurable view engine ([e955ad2c](https://github.com/anvilresearch/connect/commit/e955ad2c))


<a name"0.1.41"></a>
### 0.1.41 (2015-06-29)


#### Bug Fixes

* **signin:** disable password signup and signin routes when password provider is not enabled ([2c819082](https://github.com/anvilresearch/connect/commit/2c819082))


#### Features

* **migrate:** remove default clients ([fab5a13b](https://github.com/anvilresearch/connect/commit/fab5a13b))
* **routes:** add status endpoint ([58eb5e87](https://github.com/anvilresearch/connect/commit/58eb5e87))
* **settings:** print readable message when configuration file is malformed ([4a399ee2](https://github.com/anvilresearch/connect/commit/4a399ee2))


<a name"0.1.40"></a>
### 0.1.40 (2015-06-20)


#### Features

* **redis:** check REDIS_PORT environment variable ([4e4ba747](https://github.com/anvil-research/connect/commit/4e4ba747))


<a name"0.1.39"></a>
### 0.1.39 (2015-06-09)


#### Bug Fixes

* **deployment:** update default Docker config file to functional version ([9358fe55](https://github.com/anvil-research/connect/commit/9358fe55))
* **discovery:** include all registered scopes in server metadata ([6b8077c8](https://github.com/anvil-research/connect/commit/6b8077c8))
* **docker:** update node version installed in container to be 0.12.x ([757247f5](https://github.com/anvil-research/connect/commit/757247f5))
* **settings:** update default service documentation setting ([0ec49ba8](https://github.com/anvil-research/connect/commit/0ec49ba8))


#### Features

* **Client:** add "service" to allowed `application_type` values ([5ee0b5cb](https://github.com/anvil-research/connect/commit/5ee0b5cb))
* **cli:** `nv init` generates docker-compose.yml and nginx.conf ([20d7af62](https://github.com/anvil-research/connect/commit/20d7af62))
* **deployment:**
  * add example of Docker Compose config ([79dc3352](https://github.com/anvil-research/connect/commit/79dc3352))
  * add example of nginx config ([f005b985](https://github.com/anvil-research/connect/commit/f005b985))

