<a name="0.1.49"></a>
## 0.1.49 (2015-08-21)


### feat

* feat(pwreset): Implement password reset ([184c559](https://github.com/anvilresearch/connect/commit/184c559))



<a name="0.1.47"></a>
## 0.1.47 (2015-08-18)


### chore

* chore(README): update getting started info ([dd77f61](https://github.com/anvilresearch/connect/commit/dd77f61))

* fix(test/idToken): Convert exp to ms before passing to Date constructor ([c65a7bd](https://github.com/anvilresearch/connect/commit/c65a7bd))
* Merge pull request #178 from anvilresearch/vsimonian-fix-tests ([23e2b66](https://github.com/anvilresearch/connect/commit/23e2b66))
* Merge pull request #179 from anvilresearch/christiansmith-view-override ([e4a4696](https://github.com/anvilresearch/connect/commit/e4a4696))

### feat

* feat(public): allow static assets to be overridden individually. ([d44b9cf](https://github.com/anvilresearch/connect/commit/d44b9cf))
* feat(views): allow views to be overridden individually. ([9d13791](https://github.com/anvilresearch/connect/commit/9d13791))

### fix

* fix(test): Stub registration scopes in scoped client registration test ([d6ddd09](https://github.com/anvilresearch/connect/commit/d6ddd09))



<a name="0.1.46"></a>
## 0.1.46 (2015-08-18)


### feat

* feat(OneTimeToken): Support expiring, single-use tokens ([0bf03f2](https://github.com/anvilresearch/connect/commit/0bf03f2))
* feat(password): set default daysToCrack property on password provider ([7a20b1e](https://github.com/anvilresearch/connect/commit/7a20b1e))

### fix

* fix(emailVerification): Fix tests, merge changes ([9c90e06](https://github.com/anvilresearch/connect/commit/9c90e06))
* fix(jwks): add "use" and "alg" properties to signature JWK ([ccd2cb7](https://github.com/anvilresearch/connect/commit/ccd2cb7))
* fix(OneTimeToken): Add missing key parameter to EXPIREAT call ([34c0e2f](https://github.com/anvilresearch/connect/commit/34c0e2f))
* fix(OneTimeToken): Use seconds for expiration/TTL ([64ff426](https://github.com/anvilresearch/connect/commit/64ff426))

### refactor

* refactor(emailVerification): Move decision to send email upstream ([da00595](https://github.com/anvilresearch/connect/commit/da00595))
* refactor(emailVerification): use OneTimeToken for email verification ([982905d](https://github.com/anvilresearch/connect/commit/982905d))
* refactor(emailVerification): use OneTimeToken for email verification ([6c04fea](https://github.com/anvilresearch/connect/commit/6c04fea))

### test

* test(OneTimeToken): fix OneTimeToken.consume() test ([d9c6106](https://github.com/anvilresearch/connect/commit/d9c6106))

* fix(boot/database): Ensure database always has default entries ([f78ae9b](https://github.com/anvilresearch/connect/commit/f78ae9b))
* Merge pull request #171 from anvilresearch/vsimonian-expiring-tokens ([c2719c9](https://github.com/anvilresearch/connect/commit/c2719c9))
* Merge pull request #172 from anvilresearch/vsimonian-boot-db-fix ([0b4faf6](https://github.com/anvilresearch/connect/commit/0b4faf6))
* Merge pull request #173 from anvilresearch/vsimonian-fix-one-time-token ([aa639dd](https://github.com/anvilresearch/connect/commit/aa639dd))
* Merge pull request #174 from anvilresearch/christiansmith-email-verification-refactoring ([af8c437](https://github.com/anvilresearch/connect/commit/af8c437))



<a name="0.1.43"></a>
## 0.1.43 (2015-08-12)


### chore

* chore(cli): remove .modulusignore file from init ([39a896a](https://github.com/anvilresearch/connect/commit/39a896a))
* chore(gitignore): Ignore Redis data files ([84dcf62](https://github.com/anvilresearch/connect/commit/84dcf62))
* chore(npm): add LDAP keyword to package ([8075464](https://github.com/anvilresearch/connect/commit/8075464))
* chore(npm): update anvil-connect-jwt dependency ([932dd19](https://github.com/anvilresearch/connect/commit/932dd19))
* chore(npm): update dependencies ([770a9c7](https://github.com/anvilresearch/connect/commit/770a9c7))
* chore(npm): update fs-extra and faker dependencies ([0e3a5fe](https://github.com/anvilresearch/connect/commit/0e3a5fe))
* chore(npm): update fs-extra and qs dependencies ([3c2100e](https://github.com/anvilresearch/connect/commit/3c2100e))
* chore(npm): update inquirer dependency ([ae6f634](https://github.com/anvilresearch/connect/commit/ae6f634))
* chore(npm): update modinha and modinha-redis dependencies ([4cb8035](https://github.com/anvilresearch/connect/commit/4cb8035))
* chore(npm): Update modinha and modinha-redis dependencies ([dd666bc](https://github.com/anvilresearch/connect/commit/dd666bc))
* chore(npm): update modinha/modinha-redis dependencies ([b346a33](https://github.com/anvilresearch/connect/commit/b346a33))

### docs

* docs(README): note build in LDAP support ([860dbbe](https://github.com/anvilresearch/connect/commit/860dbbe))
* docs(resendEmail): Explain logic behind messages ([1f1297e](https://github.com/anvilresearch/connect/commit/1f1297e))

### feat

* feat(boot/database): allow overriding foreign data check ([cef8ae4](https://github.com/anvilresearch/connect/commit/cef8ae4))
* feat(boot/database): deprecate nv migrate ([3b94c76](https://github.com/anvilresearch/connect/commit/3b94c76))
* feat(boot/database): Display error if unable to set data in Redis ([a6380fd](https://github.com/anvilresearch/connect/commit/a6380fd))
* feat(signin & signup): Reject auth requests with mismatching referrer ([466fc01](https://github.com/anvilresearch/connect/commit/466fc01))
* feat(boot): initialize database on first boot ([904d744](https://github.com/anvilresearch/connect/commit/904d744))
* feat(cli): nv init generates containerized deployment scheme for Connect, Redis, and nginx ([18eb3d8](https://github.com/anvilresearch/connect/commit/18eb3d8))
* feat(email): Initial e-mail verification support ([1d66d55](https://github.com/anvilresearch/connect/commit/1d66d55))
* feat(emailVerify): Initial feature-complete email verification support ([e7e51cc](https://github.com/anvilresearch/connect/commit/e7e51cc))
* feat(IDToken): add `amr` claim ([4b94a55](https://github.com/anvilresearch/connect/commit/4b94a55))
* feat(IDToken): add `amr` to permitted claims ([b09638b](https://github.com/anvilresearch/connect/commit/b09638b))
* feat(init): replace nv init with instructions for new CLI ([99fa55d](https://github.com/anvilresearch/connect/commit/99fa55d))
* feat(middleware): Load provider object onto req ([0e468fc](https://github.com/anvilresearch/connect/commit/0e468fc))
* feat(oidc): add `amr` claim to id_token at token endpoint ([8e4dedb](https://github.com/anvilresearch/connect/commit/8e4dedb))
* feat(oidc): add amr claim to id_token payload for password signin ([9bcdcd0](https://github.com/anvilresearch/connect/commit/9bcdcd0))
* feat(oidc): config overrides default `amr` value for provider ([5360834](https://github.com/anvilresearch/connect/commit/5360834))
* feat(package): add Vartan Simonian to contributors ([cc6622f](https://github.com/anvilresearch/connect/commit/cc6622f))
* feat(protocols): Add LDAP support ([94eedb9](https://github.com/anvilresearch/connect/commit/94eedb9))
* feat(session): enable secure cookies in production environment ([039a4ec](https://github.com/anvilresearch/connect/commit/039a4ec))
* feat(user): Add user.sendVerificationEmail method ([091b34b](https://github.com/anvilresearch/connect/commit/091b34b))

### fix

* fix(boot/database): display error when Redis is unreachable ([faa5942](https://github.com/anvilresearch/connect/commit/faa5942))
* fix(boot): remove unused dependencies ([b52bd3c](https://github.com/anvilresearch/connect/commit/b52bd3c))
* fix(error): Remove debug logging code ([32d9fe5](https://github.com/anvilresearch/connect/commit/32d9fe5))
* fix(logout): Revert req.logout refactor ([553f9d5](https://github.com/anvilresearch/connect/commit/553f9d5))
* fix(npm): move faker to dev dependencies ([9e5d5b6](https://github.com/anvilresearch/connect/commit/9e5d5b6))
* fix(password): Remove dated configuration property check ([0e0c48c](https://github.com/anvilresearch/connect/commit/0e0c48c))
* fix(protocols): Respect id mapping set on LDAP provider/config ([50064a9](https://github.com/anvilresearch/connect/commit/50064a9))
* fix(signin): Add error message for invalid providers ([d3ea3ca](https://github.com/anvilresearch/connect/commit/d3ea3ca))
* fix(verifyEmail): Use correct property for email verified claim ([c691fa9](https://github.com/anvilresearch/connect/commit/c691fa9))
* fix(views): Make view titles match content ([2e9d744](https://github.com/anvilresearch/connect/commit/2e9d744))

### refactor

* refactor(boot/database): deprecate "version" key, renaming as "anvil:connect:version" ([a9f571f](https://github.com/anvilresearch/connect/commit/a9f571f))
* refactor(boot/database): rename "tag" function to "version" ([c30f816](https://github.com/anvilresearch/connect/commit/c30f816))
* refactor(protocols): Remove AD protocol, AD provider uses LDAP protocol now ([e22e1e5](https://github.com/anvilresearch/connect/commit/e22e1e5))
* refactor(signup): Use user.sendVerificationEmail ([ac55b90](https://github.com/anvilresearch/connect/commit/ac55b90))

### style

* style(email): Add EOF newline ([33c2ede](https://github.com/anvilresearch/connect/commit/33c2ede))

### test

* test(User): add spies for req.flash ([f58577e](https://github.com/anvilresearch/connect/commit/f58577e))




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

