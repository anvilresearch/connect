# Anvil Connect

**Anvil Connect** aims to be a scalable, full-featured, ready-to-run
[**OpenID Connect**](http://openid.net/connect/) + [**OAuth 2.0**](http://tools.ietf.org/html/rfc6749) **Provider**.

### Why OpenID Connect?

Having a separate password for every site you visit is inconvenient at best and unmanageable at worst. And for developers, storing passwords and managing authentication is time-consuming, error prone and risky. OpenID Connect solves these problems by allowing apps to rely on one or more third parties for securely identifying users. Google, Microsoft, and many other industry leaders have been involved in creating the protocol, and currently have OIDC in production. With the specification just finalized in 2014, this is truly the state of the art.

### Why OAuth 2.0?

Enabling other developers to create value for your users by building on your API is a good thing. But sharing user passwords with third-party applications is insecure. OAuth 2.0 solves this problem with authorization flows that let users securely grant third party apps limited access to their accounts. OpenID Connect builds on OAuth 2.0.


### Why run your own OpenID Connect Povider?

* You have many apps and APIs to protect and you need a shared identity and authorization service
* Your users want...
  * a seamless authentication experience across several apps
  * to grant third party apps limited access to their account
  * to be able to sign in via other providers like Google+
* Other developers want to rely on you for establishing a user's identity


### Why use **Anvil Connect**?

* Deploy to the cloud in minutes
* Quickly connect your apps and APIs
* It's free and open source

We're building Anvil Connect for small teams like us that want to build fast, grow exponentially and need Identity and Access Management to be a solved problem. Our implementation choices are deliberately forward thinking. We won't be supporting some features that may be required in a legacy enterprise environment. On the other hand, Anvil may be a perfect fit for greenfield projects and ventures that don't need the baggage.

### Get Started

* [Documentation](https://github.com/christiansmith/anvil-connect/wiki/Documentation)
* [References](https://github.com/christiansmith/anvil-connect/wiki/References)


## MIT License

Copyright (c) 2014 Christian Smith http://anvil.io

