# Change Log

## [0.1.56](https://github.com/anvilresearch/connect/tree/0.1.56) (2015-09-17)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.55...0.1.56)

**Implemented enhancements:**

- SSL and secure cookies in production [\#90](https://github.com/anvilresearch/connect/issues/90)

**Merged pull requests:**

- Use anvil-connect-keys package [\#229](https://github.com/anvilresearch/connect/pull/229) ([christiansmith](https://github.com/christiansmith))
- Change type of client "trusted" property to boolean  [\#228](https://github.com/anvilresearch/connect/pull/228) ([christiansmith](https://github.com/christiansmith))

## [0.1.55](https://github.com/anvilresearch/connect/tree/0.1.55) (2015-09-10)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.54...0.1.55)

**Implemented enhancements:**

- Improve error-handling and display [\#224](https://github.com/anvilresearch/connect/pull/224) ([vsimonian](https://github.com/vsimonian))
- Create first time setup endpoint [\#223](https://github.com/anvilresearch/connect/pull/223) ([vsimonian](https://github.com/vsimonian))

**Fixed bugs:**

- Fix tests for error-handling middleware [\#226](https://github.com/anvilresearch/connect/pull/226) ([vsimonian](https://github.com/vsimonian))

**Closed issues:**

- Strip leading/trailing whitespace from JSON inputs. [\#220](https://github.com/anvilresearch/connect/issues/220)

**Merged pull requests:**

- Namespace user-by-provider index  [\#227](https://github.com/anvilresearch/connect/pull/227) ([vsimonian](https://github.com/vsimonian))
- Use Modinha trim property for client redirect\_uris [\#225](https://github.com/anvilresearch/connect/pull/225) ([vsimonian](https://github.com/vsimonian))
- Trim whitespace around redirect URIs [\#221](https://github.com/anvilresearch/connect/pull/221) ([vsimonian](https://github.com/vsimonian))
- Use GitHub Changelog Generator [\#219](https://github.com/anvilresearch/connect/pull/219) ([vsimonian](https://github.com/vsimonian))

## [0.1.54](https://github.com/anvilresearch/connect/tree/0.1.54) (2015-09-04)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.53...0.1.54)

**Implemented enhancements:**

- Enforce client grant\_types [\#96](https://github.com/anvilresearch/connect/issues/96)
- Enforce client response\_types [\#95](https://github.com/anvilresearch/connect/issues/95)

**Fixed bugs:**

- Fix handling of optional `options` parameter in Passport shim [\#218](https://github.com/anvilresearch/connect/pull/218) ([vsimonian](https://github.com/vsimonian))

**Merged pull requests:**

- Enforce client grant\_types and response\_types [\#217](https://github.com/anvilresearch/connect/pull/217) ([vsimonian](https://github.com/vsimonian))

## [0.1.53](https://github.com/anvilresearch/connect/tree/0.1.53) (2015-09-03)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.52...0.1.53)

**Implemented enhancements:**

- Validate client does not use both `jwks` and `jwks\_uri` [\#98](https://github.com/anvilresearch/connect/issues/98)
- Validate client application\_type [\#97](https://github.com/anvilresearch/connect/issues/97)
- Support response\_type "none" [\#55](https://github.com/anvilresearch/connect/issues/55)
- Validate client application\_type [\#214](https://github.com/anvilresearch/connect/pull/214) ([vsimonian](https://github.com/vsimonian))
- Validate that jwks and jwks\_uri are not used together [\#212](https://github.com/anvilresearch/connect/pull/212) ([vsimonian](https://github.com/vsimonian))
- Support `none` response\_type and fix response\_type handling [\#211](https://github.com/anvilresearch/connect/pull/211) ([vsimonian](https://github.com/vsimonian))

**Fixed bugs:**

- Always verify redirect\_uri before issuing redirect [\#216](https://github.com/anvilresearch/connect/pull/216) ([vsimonian](https://github.com/vsimonian))
- Validate new redirect\_uris instead of original values [\#215](https://github.com/anvilresearch/connect/pull/215) ([vsimonian](https://github.com/vsimonian))
- Support `none` response\\_type and fix response\\_type handling [\#211](https://github.com/anvilresearch/connect/pull/211) ([vsimonian](https://github.com/vsimonian))

**Merged pull requests:**

- Use lx-valid validation hooks for jwks and jwks\_uri [\#213](https://github.com/anvilresearch/connect/pull/213) ([vsimonian](https://github.com/vsimonian))

## [0.1.52](https://github.com/anvilresearch/connect/tree/0.1.52) (2015-09-01)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.51...0.1.52)

**Fixed bugs:**

- Guard against undefined sessions [\#209](https://github.com/anvilresearch/connect/pull/209) ([vsimonian](https://github.com/vsimonian))

## [0.1.51](https://github.com/anvilresearch/connect/tree/0.1.51) (2015-08-31)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.50...0.1.51)

**Implemented enhancements:**

- Rename key pair files [\#200](https://github.com/anvilresearch/connect/issues/200)
- Make "daysToCrack" password strength property configurable from password provider [\#189](https://github.com/anvilresearch/connect/issues/189)
- Key pair generation [\#187](https://github.com/anvilresearch/connect/issues/187)
- E-mail verification token TTL should be configurable [\#175](https://github.com/anvilresearch/connect/issues/175)
- OIDC Sessions [\#138](https://github.com/anvilresearch/connect/issues/138)
- Separate key pairs for signing and encryption [\#5](https://github.com/anvilresearch/connect/issues/5)
- feat\(email\): configurable email verification token ttl [\#206](https://github.com/anvilresearch/connect/pull/206) ([christiansmith](https://github.com/christiansmith))
- feat\(boot\): generate token-signing keypair if missing on boot [\#197](https://github.com/anvilresearch/connect/pull/197) ([christiansmith](https://github.com/christiansmith))

**Fixed bugs:**

- Allow overriding provider-specific amr and refresh\_userinfo options with falsy values [\#191](https://github.com/anvilresearch/connect/issues/191)
- Enable email templates to be overridden [\#190](https://github.com/anvilresearch/connect/issues/190)
- Stub client reg type setting for client reg tests [\#201](https://github.com/anvilresearch/connect/pull/201) ([vsimonian](https://github.com/vsimonian))
- fix\(oidc\): set amr values consistently [\#195](https://github.com/anvilresearch/connect/pull/195) ([christiansmith](https://github.com/christiansmith))
- Allow overriding amr and refresh\_userinfo values with falsy values  [\#194](https://github.com/anvilresearch/connect/pull/194) ([vsimonian](https://github.com/vsimonian))
- Allow e-mail templates to be overridden [\#193](https://github.com/anvilresearch/connect/pull/193) ([vsimonian](https://github.com/vsimonian))

**Closed issues:**

- De-nest config/keys directory [\#198](https://github.com/anvilresearch/connect/issues/198)
- Eliminate repetitive code in signin, signup, and signout [\#143](https://github.com/anvilresearch/connect/issues/143)

**Merged pull requests:**

- Remove passport dependency [\#205](https://github.com/anvilresearch/connect/pull/205) ([vsimonian](https://github.com/vsimonian))
- Rename RSA key pair files and add separate encryption key pair [\#204](https://github.com/anvilresearch/connect/pull/204) ([christiansmith](https://github.com/christiansmith))
- refactor\(keys\): de-nest config/keys directory [\#199](https://github.com/anvilresearch/connect/pull/199) ([christiansmith](https://github.com/christiansmith))
- feat\(settings\): configurable "daysToCrack" for password provider [\#196](https://github.com/anvilresearch/connect/pull/196) ([christiansmith](https://github.com/christiansmith))

## [0.1.50](https://github.com/anvilresearch/connect/tree/0.1.50) (2015-08-23)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.49...0.1.50)

**Implemented enhancements:**

- sentinel support and ioredis [\#125](https://github.com/anvilresearch/connect/issues/125)
- Code Conventions, Formatters, and Linting [\#116](https://github.com/anvilresearch/connect/issues/116)
- Use ioredis [\#188](https://github.com/anvilresearch/connect/pull/188) ([vsimonian](https://github.com/vsimonian))

**Merged pull requests:**

- Use Javascript Standard Style [\#184](https://github.com/anvilresearch/connect/pull/184) ([vsimonian](https://github.com/vsimonian))

## [0.1.49](https://github.com/anvilresearch/connect/tree/0.1.49) (2015-08-21)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.48...0.1.49)

**Implemented enhancements:**

- Configurable refresh of user claims upon call to userinfo [\#181](https://github.com/anvilresearch/connect/issues/181)
- Support `amr` claim. [\#136](https://github.com/anvilresearch/connect/issues/136)
- Password reset [\#20](https://github.com/anvilresearch/connect/issues/20)

## [0.1.48](https://github.com/anvilresearch/connect/tree/0.1.48) (2015-08-20)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.47...0.1.48)

## [0.1.47](https://github.com/anvilresearch/connect/tree/0.1.47) (2015-08-18)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.46...0.1.47)

**Implemented enhancements:**

- Use built in views unless project directory contains custom views [\#165](https://github.com/anvilresearch/connect/issues/165)
- Allow views to be overridden individually. [\#179](https://github.com/anvilresearch/connect/pull/179) ([christiansmith](https://github.com/christiansmith))

**Fixed bugs:**

- Fix intermittently failing tests [\#178](https://github.com/anvilresearch/connect/pull/178) ([vsimonian](https://github.com/vsimonian))

## [0.1.46](https://github.com/anvilresearch/connect/tree/0.1.46) (2015-08-18)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.45...0.1.46)

**Implemented enhancements:**

- Create mechanism for generic expiring tokens [\#168](https://github.com/anvilresearch/connect/issues/168)
- E-mail verification tokens should expire [\#167](https://github.com/anvilresearch/connect/issues/167)
- Support expiring, single-use tokens [\#171](https://github.com/anvilresearch/connect/pull/171) ([vsimonian](https://github.com/vsimonian))

**Fixed bugs:**

- Ensure database always has default entries [\#172](https://github.com/anvilresearch/connect/pull/172) ([vsimonian](https://github.com/vsimonian))

**Merged pull requests:**

- Refactor email verification to use new OneTimeToken model [\#174](https://github.com/anvilresearch/connect/pull/174) ([christiansmith](https://github.com/christiansmith))
- Fix one time token [\#173](https://github.com/anvilresearch/connect/pull/173) ([vsimonian](https://github.com/vsimonian))

## [0.1.45](https://github.com/anvilresearch/connect/tree/0.1.45) (2015-08-14)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.44...0.1.45)

**Fixed bugs:**

- Set jwks to array of keys instead of single object [\#161](https://github.com/anvilresearch/connect/pull/161) ([vsimonian](https://github.com/vsimonian))

## [0.1.44](https://github.com/anvilresearch/connect/tree/0.1.44) (2015-08-14)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.43...0.1.44)

**Merged pull requests:**

- Use pem-jwk instead of ursa to convert public key to JWK [\#156](https://github.com/anvilresearch/connect/pull/156) ([vsimonian](https://github.com/vsimonian))

## [0.1.43](https://github.com/anvilresearch/connect/tree/0.1.43) (2015-08-12)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.42...0.1.43)

**Implemented enhancements:**

- Boot time database init to deprecate `nv migrate` [\#128](https://github.com/anvilresearch/connect/issues/128)
- Containerized Deployment [\#121](https://github.com/anvilresearch/connect/issues/121)
- LDAP protocol [\#120](https://github.com/anvilresearch/connect/issues/120)
- Throw error for unreachable Redis instance [\#39](https://github.com/anvilresearch/connect/issues/39)
- E-mail verification [\#21](https://github.com/anvilresearch/connect/issues/21)
- Add LDAP support [\#144](https://github.com/anvilresearch/connect/pull/144) ([vsimonian](https://github.com/vsimonian))
- Initialize database during boot. [\#142](https://github.com/anvilresearch/connect/pull/142) ([christiansmith](https://github.com/christiansmith))
- E-mail verification support [\#123](https://github.com/anvilresearch/connect/pull/123) ([vsimonian](https://github.com/vsimonian))

**Closed issues:**

- Slack vs. Gitter [\#122](https://github.com/anvilresearch/connect/issues/122)
- Standard OAuth2 protocol require error [\#74](https://github.com/anvilresearch/connect/issues/74)
- cli help [\#34](https://github.com/anvilresearch/connect/issues/34)

**Merged pull requests:**

- Support OIDC `amr` claim in id\_tokens [\#141](https://github.com/anvilresearch/connect/pull/141) ([christiansmith](https://github.com/christiansmith))
- Reject auth requests with mismatching referrer [\#135](https://github.com/anvilresearch/connect/pull/135) ([vsimonian](https://github.com/vsimonian))
- Clarified setup instructions [\#134](https://github.com/anvilresearch/connect/pull/134) ([Cynfusion](https://github.com/Cynfusion))
- style and content revisions [\#133](https://github.com/anvilresearch/connect/pull/133) ([Cynfusion](https://github.com/Cynfusion))
- Updates to content and style of ReadMe [\#132](https://github.com/anvilresearch/connect/pull/132) ([Cynfusion](https://github.com/Cynfusion))
- Add error message for invalid providers during sign-in [\#117](https://github.com/anvilresearch/connect/pull/117) ([vsimonian](https://github.com/vsimonian))

## [0.1.42](https://github.com/anvilresearch/connect/tree/0.1.42) (2015-07-01)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.41...0.1.42)

**Merged pull requests:**

- Various bugfixes and style adjustments [\#110](https://github.com/anvilresearch/connect/pull/110) ([vsimonian](https://github.com/vsimonian))
- Fix callback function name [\#109](https://github.com/anvilresearch/connect/pull/109) ([vsimonian](https://github.com/vsimonian))
- Update to match express v4 API [\#108](https://github.com/anvilresearch/connect/pull/108) ([vsimonian](https://github.com/vsimonian))
- Add Active Directory support [\#107](https://github.com/anvilresearch/connect/pull/107) ([vsimonian](https://github.com/vsimonian))
- fix\(routes\): Pass `next` to `passport.authenticate` [\#106](https://github.com/anvilresearch/connect/pull/106) ([vsimonian](https://github.com/vsimonian))
- feat\(fields\): Generate sign in form for providers with defined fields [\#105](https://github.com/anvilresearch/connect/pull/105) ([vsimonian](https://github.com/vsimonian))
- Add provider templating for boot-time inheritance [\#104](https://github.com/anvilresearch/connect/pull/104) ([vsimonian](https://github.com/vsimonian))

## [0.1.41](https://github.com/anvilresearch/connect/tree/0.1.41) (2015-06-29)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.40...0.1.41)

**Implemented enhancements:**

- Error display for `nv init deployment` and other commands [\#31](https://github.com/anvilresearch/connect/issues/31)
- Make password signin optional [\#25](https://github.com/anvilresearch/connect/issues/25)

**Closed issues:**

- Reduce/minimize size of dependencies [\#72](https://github.com/anvilresearch/connect/issues/72)
- Throw error for malformed JSON in config file [\#38](https://github.com/anvilresearch/connect/issues/38)

**Merged pull requests:**

- Update to match express v4 API [\#103](https://github.com/anvilresearch/connect/pull/103) ([vsimonian](https://github.com/vsimonian))
- Fix broken git URL [\#101](https://github.com/anvilresearch/connect/pull/101) ([vsimonian](https://github.com/vsimonian))

## [0.1.40](https://github.com/anvilresearch/connect/tree/0.1.40) (2015-06-20)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.39...0.1.40)

## [0.1.39](https://github.com/anvilresearch/connect/tree/0.1.39) (2015-06-09)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.38...0.1.39)

**Implemented enhancements:**

- Generating a CHANGELOG [\#66](https://github.com/anvilresearch/connect/issues/66)

**Closed issues:**

- anvil.io 'docs' link in footer points to anvil.io, docs aren't on the site [\#94](https://github.com/anvilresearch/connect/issues/94)
- Cannot GET / - what to do after installation [\#93](https://github.com/anvilresearch/connect/issues/93)

**Merged pull requests:**

- Deployment [\#92](https://github.com/anvilresearch/connect/pull/92) ([tomkersten](https://github.com/tomkersten))

## [0.1.38](https://github.com/anvilresearch/connect/tree/0.1.38) (2015-05-19)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.37...0.1.38)

## [0.1.37](https://github.com/anvilresearch/connect/tree/0.1.37) (2015-05-18)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.36...0.1.37)

**Closed issues:**

- Anvil incompatible with Node 0.12.x [\#91](https://github.com/anvilresearch/connect/issues/91)
- Empty user name after normal registration. [\#87](https://github.com/anvilresearch/connect/issues/87)

**Merged pull requests:**

- Change the names for form fields "first name" and "last name", to match the mapping in User model. [\#88](https://github.com/anvilresearch/connect/pull/88) ([ovi-tamasan-3pg](https://github.com/ovi-tamasan-3pg))
- dev dependencies update [\#86](https://github.com/anvilresearch/connect/pull/86) ([adi-ads](https://github.com/adi-ads))
- don't add password as a icon in views [\#84](https://github.com/anvilresearch/connect/pull/84) ([adi-ads](https://github.com/adi-ads))
- update faker [\#83](https://github.com/anvilresearch/connect/pull/83) ([adi-ads](https://github.com/adi-ads))

## [0.1.36](https://github.com/anvilresearch/connect/tree/0.1.36) (2015-04-20)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.35...0.1.36)

## [0.1.35](https://github.com/anvilresearch/connect/tree/0.1.35) (2015-04-08)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.34...0.1.35)

**Merged pull requests:**

- Support optional nonce for auth code flow [\#82](https://github.com/anvilresearch/connect/pull/82) ([adi-ads](https://github.com/adi-ads))
- update faker package name to lowercase [\#81](https://github.com/anvilresearch/connect/pull/81) ([adi-ads](https://github.com/adi-ads))

## [0.1.34](https://github.com/anvilresearch/connect/tree/0.1.34) (2015-04-08)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.33...0.1.34)

## [0.1.33](https://github.com/anvilresearch/connect/tree/0.1.33) (2015-04-07)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.32...0.1.33)

## [0.1.32](https://github.com/anvilresearch/connect/tree/0.1.32) (2015-04-07)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.31...0.1.32)

**Closed issues:**

- Cannot run nv init [\#77](https://github.com/anvilresearch/connect/issues/77)
- Does anvil-connect server work via https? [\#76](https://github.com/anvilresearch/connect/issues/76)

**Merged pull requests:**

- update modinha version [\#79](https://github.com/anvilresearch/connect/pull/79) ([adi-ads](https://github.com/adi-ads))
- app default config update [\#78](https://github.com/anvilresearch/connect/pull/78) ([adi-ads](https://github.com/adi-ads))

## [0.1.31](https://github.com/anvilresearch/connect/tree/0.1.31) (2015-04-05)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.30...0.1.31)

## [0.1.30](https://github.com/anvilresearch/connect/tree/0.1.30) (2015-04-05)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.29...0.1.30)

## [0.1.29](https://github.com/anvilresearch/connect/tree/0.1.29) (2015-04-02)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.28...0.1.29)

**Closed issues:**

- nv migrate fails [\#73](https://github.com/anvilresearch/connect/issues/73)

## [0.1.28](https://github.com/anvilresearch/connect/tree/0.1.28) (2015-03-14)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.27...0.1.28)

## [0.1.27](https://github.com/anvilresearch/connect/tree/0.1.27) (2015-03-10)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.26...0.1.27)

**Implemented enhancements:**

- Authorization flow [\#1](https://github.com/anvilresearch/connect/issues/1)

**Fixed bugs:**

- Authorization flow [\#1](https://github.com/anvilresearch/connect/issues/1)

**Closed issues:**

- mongodb support [\#69](https://github.com/anvilresearch/connect/issues/69)
- Storing Provider Auth + UserInfo Responses with Anvil user object [\#63](https://github.com/anvilresearch/connect/issues/63)

**Merged pull requests:**

- protocol/OpenID.js works against master [\#71](https://github.com/anvilresearch/connect/pull/71) ([nrhope](https://github.com/nrhope))
- Add a Gitter chat badge to README.md [\#70](https://github.com/anvilresearch/connect/pull/70) ([gitter-badger](https://github.com/gitter-badger))
- fix ID Token expiry delta \(was undefined so token expired immediately\) [\#60](https://github.com/anvilresearch/connect/pull/60) ([nrhope](https://github.com/nrhope))
- tweaks to get server talking to external Java \(mitreid\) and passport-openid clients [\#59](https://github.com/anvilresearch/connect/pull/59) ([nrhope](https://github.com/nrhope))
- Renamed function [\#58](https://github.com/anvilresearch/connect/pull/58) ([tomkersten](https://github.com/tomkersten))

## [0.1.26](https://github.com/anvilresearch/connect/tree/0.1.26) (2014-10-28)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.25...0.1.26)

**Implemented enhancements:**

- JWK set URI [\#19](https://github.com/anvilresearch/connect/issues/19)

## [0.1.25](https://github.com/anvilresearch/connect/tree/0.1.25) (2014-10-22)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.24...0.1.25)

## [0.1.24](https://github.com/anvilresearch/connect/tree/0.1.24) (2014-10-20)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.23...0.1.24)

**Implemented enhancements:**

- JWT Access Tokens [\#15](https://github.com/anvilresearch/connect/issues/15)
- Hybrid Authorization Flow [\#8](https://github.com/anvilresearch/connect/issues/8)
- Multiple response types [\#6](https://github.com/anvilresearch/connect/issues/6)

**Merged pull requests:**

- Fixed `revoke` argument parsing indice mistake [\#56](https://github.com/anvilresearch/connect/pull/56) ([tomkersten](https://github.com/tomkersten))

## [0.1.23](https://github.com/anvilresearch/connect/tree/0.1.23) (2014-08-04)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.22...0.1.23)

## [0.1.22](https://github.com/anvilresearch/connect/tree/0.1.22) (2014-07-25)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.21...0.1.22)

**Closed issues:**

- Configurable token expiration [\#50](https://github.com/anvilresearch/connect/issues/50)
- "Requires login" prompt? [\#45](https://github.com/anvilresearch/connect/issues/45)

## [0.1.21](https://github.com/anvilresearch/connect/tree/0.1.21) (2014-06-27)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.20...0.1.21)

## [0.1.20](https://github.com/anvilresearch/connect/tree/0.1.20) (2014-06-27)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.19...0.1.20)

## [0.1.19](https://github.com/anvilresearch/connect/tree/0.1.19) (2014-06-26)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.18...0.1.19)

**Merged pull requests:**

- Added some basic styling to views [\#43](https://github.com/anvilresearch/connect/pull/43) ([petebot](https://github.com/petebot))

## [0.1.18](https://github.com/anvilresearch/connect/tree/0.1.18) (2014-06-19)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.17...0.1.18)

**Fixed bugs:**

- nv-commands fail without env variables set [\#41](https://github.com/anvilresearch/connect/issues/41)

**Closed issues:**

- Rewrite `nv init db` [\#42](https://github.com/anvilresearch/connect/issues/42)

## [0.1.17](https://github.com/anvilresearch/connect/tree/0.1.17) (2014-06-16)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.16...0.1.17)

## [0.1.16](https://github.com/anvilresearch/connect/tree/0.1.16) (2014-06-16)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.15...0.1.16)

## [0.1.15](https://github.com/anvilresearch/connect/tree/0.1.15) (2014-06-12)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.14...0.1.15)

## [0.1.14](https://github.com/anvilresearch/connect/tree/0.1.14) (2014-06-12)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.13...0.1.14)

## [0.1.13](https://github.com/anvilresearch/connect/tree/0.1.13) (2014-06-12)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.12...0.1.13)

## [0.1.12](https://github.com/anvilresearch/connect/tree/0.1.12) (2014-06-12)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.11...0.1.12)

**Implemented enhancements:**

- Keyfiles [\#2](https://github.com/anvilresearch/connect/issues/2)

## [0.1.11](https://github.com/anvilresearch/connect/tree/0.1.11) (2014-06-10)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.10...0.1.11)

## [0.1.10](https://github.com/anvilresearch/connect/tree/0.1.10) (2014-06-10)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.9...0.1.10)

## [0.1.9](https://github.com/anvilresearch/connect/tree/0.1.9) (2014-06-09)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.8...0.1.9)

## [0.1.8](https://github.com/anvilresearch/connect/tree/0.1.8) (2014-06-09)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.7...0.1.8)

**Implemented enhancements:**

- Logging [\#27](https://github.com/anvilresearch/connect/issues/27)

**Fixed bugs:**

- .gitignore on `nv init deployment` [\#29](https://github.com/anvilresearch/connect/issues/29)

**Closed issues:**

- cli usage [\#33](https://github.com/anvilresearch/connect/issues/33)
- cli version [\#32](https://github.com/anvilresearch/connect/issues/32)

## [0.1.7](https://github.com/anvilresearch/connect/tree/0.1.7) (2014-06-04)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.6...0.1.7)

**Implemented enhancements:**

- Support global install for `nv` cli [\#30](https://github.com/anvilresearch/connect/issues/30)

## [0.1.6](https://github.com/anvilresearch/connect/tree/0.1.6) (2014-06-04)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.5...0.1.6)

**Merged pull requests:**

- Add public/.gitkeep so 'public' dir is in repo [\#28](https://github.com/anvilresearch/connect/pull/28) ([tomkersten](https://github.com/tomkersten))

## [0.1.5](https://github.com/anvilresearch/connect/tree/0.1.5) (2014-06-04)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.4...0.1.5)

## [0.1.4](https://github.com/anvilresearch/connect/tree/0.1.4) (2014-06-04)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.3...0.1.4)

## [0.1.3](https://github.com/anvilresearch/connect/tree/0.1.3) (2014-06-03)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.2...0.1.3)

## [0.1.2](https://github.com/anvilresearch/connect/tree/0.1.2) (2014-06-03)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.1...0.1.2)

## [0.1.1](https://github.com/anvilresearch/connect/tree/0.1.1) (2014-06-03)
[Full Changelog](https://github.com/anvilresearch/connect/compare/0.1.0...0.1.1)

**Implemented enhancements:**

- Node Cluster [\#17](https://github.com/anvilresearch/connect/issues/17)
- Static assets [\#4](https://github.com/anvilresearch/connect/issues/4)
- Project/deployment generator [\#3](https://github.com/anvilresearch/connect/issues/3)

## [0.1.0](https://github.com/anvilresearch/connect/tree/0.1.0) (2014-05-30)


\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*