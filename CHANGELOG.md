<a name="0.1.53"></a>
## 0.1.53 (2015-09-03)


### chore

* chore(npm): update modinha and modinha-redis dependencies ([57c670e](https://github.com/anvilresearch/connect/commit/57c670e))
* chore(npm): update modinha and modinha-redis dependencies ([6a91ee9](https://github.com/anvilresearch/connect/commit/6a91ee9))

### feat

* feat: Support `none` response_type (#55) ([85343cf](https://github.com/anvilresearch/connect/commit/85343cf))
* feat(Client): Validate client application_type (#97) ([c6c6ec1](https://github.com/anvilresearch/connect/commit/c6c6ec1))

### fix

* fix: Always verify redirect_uri before issuing redirect ([5cc0c62](https://github.com/anvilresearch/connect/commit/5cc0c62))
* fix(authorize): Use fragment encoding where required by spec ([e08b36c](https://github.com/anvilresearch/connect/commit/e08b36c))
* fix(cli): Clean up CLI output ([2046b7e](https://github.com/anvilresearch/connect/commit/2046b7e))
* fix(cli): Display more meaningful output on error ([a484403](https://github.com/anvilresearch/connect/commit/a484403))
* fix(Client): Add missing space in redirect_uris validation error message ([6bc6c07](https://github.com/anvilresearch/connect/commit/6bc6c07))
* fix(Client): Update comment to reflect logic ([c71dc0e](https://github.com/anvilresearch/connect/commit/c71dc0e))
* fix(Client): Validate new redirect_uris instead of original values ([bae4ffe](https://github.com/anvilresearch/connect/commit/bae4ffe))
* fix(Client): Validate that jwks and jwks_uri are not used together (#98) ([8fc8017](https://github.com/anvilresearch/connect/commit/8fc8017))
* fix(README.md): Minor grammatical fix ([9f363ae](https://github.com/anvilresearch/connect/commit/9f363ae))

### refactor

* refactor(Client): Remove redundant truthy check ([c561fff](https://github.com/anvilresearch/connect/commit/c561fff))
* refactor(Client): Use lx-valid validation hooks for jwks and jwks_uri ([7763504](https://github.com/anvilresearch/connect/commit/7763504))
* refactor(Client): Use lx-valid validation hooks for jwks and jwks_uri ([147c90e](https://github.com/anvilresearch/connect/commit/147c90e))

### test

* test(validateAuthorizationParams): Test for extraneous response types ([5f79b97](https://github.com/anvilresearch/connect/commit/5f79b97))

* Merge pull request #211 from anvilresearch/vsimonian-none-response-type ([6f74fa1](https://github.com/anvilresearch/connect/commit/6f74fa1))
* Merge pull request #212 from anvilresearch/vsimonian-validate-jwks-jwks_uri ([8b61322](https://github.com/anvilresearch/connect/commit/8b61322))
* Merge pull request #213 from anvilresearch/vsimonian-lx-valid ([d993492](https://github.com/anvilresearch/connect/commit/d993492))
* Merge pull request #214 from anvilresearch/vsimonian-validate-application_type ([5d2b8dd](https://github.com/anvilresearch/connect/commit/5d2b8dd))
* Merge pull request #215 from anvilresearch/vsimonian-fix-redirect_uris_validation ([be7c7d3](https://github.com/anvilresearch/connect/commit/be7c7d3))
* Merge pull request #216 from anvilresearch/vsimonian-fix-unverified-redirects ([a2f1d03](https://github.com/anvilresearch/connect/commit/a2f1d03))



<a name="0.1.52"></a>
## 0.1.52 (2015-09-01)


### fix

* fix(authenticator): Guard against undefined sessions ([81ef8ea](https://github.com/anvilresearch/connect/commit/81ef8ea))

* Merge pull request #209 from anvilresearch/vsimonian-fix-undefined-sessions ([8c06877](https://github.com/anvilresearch/connect/commit/8c06877))



<a name="0.1.51"></a>
## 0.1.51 (2015-08-31)


* Add Slack IRC Gateway link ([b5ac7d6](https://github.com/anvilresearch/connect/commit/b5ac7d6))
* Add Slack IRC Gateway link to badges ([e93032e](https://github.com/anvilresearch/connect/commit/e93032e))
* fix(oidc/sessionEvents): Infinity is not supported ([47b25b8](https://github.com/anvilresearch/connect/commit/47b25b8))
* fix(public/javascript/session): Avoid TypeError ([57dd37c](https://github.com/anvilresearch/connect/commit/57dd37c))
* fix(public/javascript/session): Improve cookie-handling regex ([6f71ab0](https://github.com/anvilresearch/connect/commit/6f71ab0))
* Merge pull request #193 from anvilresearch/vsimonian-email-template-override ([b178e9a](https://github.com/anvilresearch/connect/commit/b178e9a))
* Merge pull request #194 from anvilresearch/vsimonian-fix-amr-userinfo-config ([295e776](https://github.com/anvilresearch/connect/commit/295e776))
* Merge pull request #195 from anvilresearch/christiansmith-amr-fixes ([bcad6b8](https://github.com/anvilresearch/connect/commit/bcad6b8))
* Merge pull request #196 from anvilresearch/christiansmith-daystocrack ([d407b79](https://github.com/anvilresearch/connect/commit/d407b79))
* Merge pull request #197 from anvilresearch/christiansmith-genkeypair-187 ([05d4e35](https://github.com/anvilresearch/connect/commit/05d4e35))
* Merge pull request #199 from anvilresearch/christiansmith-keys-198 ([e57aaa8](https://github.com/anvilresearch/connect/commit/e57aaa8))
* Merge pull request #201 from anvilresearch/vsimonian-fix-client-reg-tests ([ecece10](https://github.com/anvilresearch/connect/commit/ecece10))
* Merge pull request #204 from anvilresearch/christiansmith-renamekeys-200 ([d55b578](https://github.com/anvilresearch/connect/commit/d55b578))
* Merge pull request #205 from anvilresearch/vsimonian-no-passport ([251e670](https://github.com/anvilresearch/connect/commit/251e670))
* Merge pull request #206 from anvilresearch/christiansmith-email-token-ttl-175 ([d4b9a8b](https://github.com/anvilresearch/connect/commit/d4b9a8b))

### chore

* chore(gitignore): Ignore IDE settings ([ee3ab78](https://github.com/anvilresearch/connect/commit/ee3ab78))
* chore(npm): update dependencies ([f079dee](https://github.com/anvilresearch/connect/commit/f079dee))
* chore(npm): update dependencies ([b450492](https://github.com/anvilresearch/connect/commit/b450492))

### feat

* feat(boot): generate token-signing keypair if missing on boot ([6326176](https://github.com/anvilresearch/connect/commit/6326176))
* feat(email): configurable email verification token ttl ([ea5f95e](https://github.com/anvilresearch/connect/commit/ea5f95e))
* feat(keys): add keypair for encryption and rename files ([d8dffe1](https://github.com/anvilresearch/connect/commit/d8dffe1))
* feat(settings): configurable "daysToCrack" for password provider ([2dea0c8](https://github.com/anvilresearch/connect/commit/2dea0c8))

### fix

* fix: Allow overriding amr and refresh_userinfo values with falsy values ([3410730](https://github.com/anvilresearch/connect/commit/3410730)), closes [#191](https://github.com/anvilresearch/connect/issues/191)
* fix: Move conditional logic for amr/refresh_userinfo set ([a9bb320](https://github.com/anvilresearch/connect/commit/a9bb320)), closes [#191](https://github.com/anvilresearch/connect/issues/191)
* fix(checkSession): Avoid unecessary throws ([d5de56b](https://github.com/anvilresearch/connect/commit/d5de56b))
* fix(checkSession): Execute inner logic ([e9a88e7](https://github.com/anvilresearch/connect/commit/e9a88e7))
* fix(checkSession): only issue event once per opbs change ([a901685](https://github.com/anvilresearch/connect/commit/a901685))
* fix(email): Allow e-mail templates to be overridden ([d150e24](https://github.com/anvilresearch/connect/commit/d150e24)), closes [#190](https://github.com/anvilresearch/connect/issues/190)
* fix(jwks): correct reference at jwks endpoint ([f3f22e0](https://github.com/anvilresearch/connect/commit/f3f22e0))
* fix(login): change OP Browser state on login only when user is unauthenticated ([8a8d8c1](https://github.com/anvilresearch/connect/commit/8a8d8c1))
* fix(login): Fix conditional logic for opbs ([c98dae7](https://github.com/anvilresearch/connect/commit/c98dae7))
* fix(oidc): set amr values consistently ([dfeb0eb](https://github.com/anvilresearch/connect/commit/dfeb0eb))
* fix(req.user): Always set req.user during authenticated sessions ([3f372d0](https://github.com/anvilresearch/connect/commit/3f372d0))
* fix(signout): Don't use unverified redirect URIs ([20f651d](https://github.com/anvilresearch/connect/commit/20f651d))
* fix(test): fix signout middleware tests ([112a3a3](https://github.com/anvilresearch/connect/commit/112a3a3))
* fix(tests): Stub client reg type setting for client reg tests ([1e3d10a](https://github.com/anvilresearch/connect/commit/1e3d10a))

### refactor

* refactor: Remove passport dependency ([aacc12d](https://github.com/anvilresearch/connect/commit/aacc12d)), closes [#143](https://github.com/anvilresearch/connect/issues/143)
* refactor(authenticator): rename passport shim to Authenticator ([f72cdf6](https://github.com/anvilresearch/connect/commit/f72cdf6))
* refactor(keys): de-nest config/keys directory ([3d8fdbc](https://github.com/anvilresearch/connect/commit/3d8fdbc))
* refactor(keys): reorganize keys on settings ([cc095c1](https://github.com/anvilresearch/connect/commit/cc095c1))
* refactor(providers): Merge duplicate conditional statement ([b9dd8f8](https://github.com/anvilresearch/connect/commit/b9dd8f8))

### style

* style: Remove unused InvalidTokenError import ([7ba3d07](https://github.com/anvilresearch/connect/commit/7ba3d07))



<a name="0.1.50"></a>
## 0.1.50 (2015-08-23)


### chore

* chore(npm): Remove unused mock-require dependency ([3c245a3](https://github.com/anvilresearch/connect/commit/3c245a3))
* chore(npm): Update modinha-redis dependency ([eabb980](https://github.com/anvilresearch/connect/commit/eabb980))
* chore(npm): update passport dependency ([3242095](https://github.com/anvilresearch/connect/commit/3242095))

### feat

* feat(public): add default favicon ([e55c20f](https://github.com/anvilresearch/connect/commit/e55c20f))

### fix

* fix(cli): correct date math for exp claim ([12f2109](https://github.com/anvilresearch/connect/commit/12f2109))

### refactor

* refactor: Use ioredis ([2fe2954](https://github.com/anvilresearch/connect/commit/2fe2954))

### style

* style: Use Javascript Standard Style ([4dfe09e](https://github.com/anvilresearch/connect/commit/4dfe09e))
* style(providers): Adjust iif expression indentation ([546fc55](https://github.com/anvilresearch/connect/commit/546fc55))

### test

* test(standard): Check style conformance as part of `npm test` ([c09eae1](https://github.com/anvilresearch/connect/commit/c09eae1))

* fix(lib/cli): Ensure error-handling stops function execution ([62db39c](https://github.com/anvilresearch/connect/commit/62db39c))
* fix(oidc/checkSession): Ensure error-handling stops function execution ([1e54302](https://github.com/anvilresearch/connect/commit/1e54302))
* fix(oidc/determineClientScope): Ensure error-handling stops function execution ([fe02eeb](https://github.com/anvilresearch/connect/commit/fe02eeb))
* fix(oidc/determineUserScope): Ensure error-handling stops function execution ([ec2c4ce](https://github.com/anvilresearch/connect/commit/ec2c4ce))
* Merge pull request #184 from anvilresearch/vsimonian-js-standard-style ([65a0a2e](https://github.com/anvilresearch/connect/commit/65a0a2e))
* Merge pull request #188 from anvilresearch/vsimonian-ioredis ([ee3e79c](https://github.com/anvilresearch/connect/commit/ee3e79c))
* style(routes/recovery): Adjust comment placement ([70134ba](https://github.com/anvilresearch/connect/commit/70134ba))



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

