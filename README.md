# Node JS REST API starter pack

This is a starter pack REST API NodeJS based for fast develop advanced API services with Enterprise architecture. 

![NestJS](https://docs.nestjs.com/assets/logo_text.svg  =200x) ![enter image description here](https://rynop.files.wordpress.com/2016/09/ts.png =100x) ![enter image description here](http://jwt.io/img/logo-asset.svg =200x) ![enter image description here](https://webassets.mongodb.com/_com_assets/cms/MongoDB-Logo-5c3a7405a85675366beb3a5ec4c032348c390b3f142f5e6dddf1d78e2df5cb5c.png =380x)

## Installation

    npm install

## Usage

Development mode

    npm run start
Production

    npm run start:prod
Run test

    npm run test


## Features:
 - Typescript 3+
 - NestJS 5 (Express powered)
 - JWT
 - Mongoose - typegoose
 - Automapper
 - Swagger
 - Jest
 - RxJS

All modules has last versions and regular updated

# Architecture

Inspired by Angular. Great thanks to [NESTJS](https://nestjs.com/)
Go to docs for more information about framework and best practices

 - **config** - contains `default.ts` with env parameters
 - **src**
	 - **shared** - complete features for any purposes
	 - **todo** - example implementation secure routes
	 - **user** - auth routes

## Create modules/services and folders

Nest provides an out-of-the-box application architecture which allows for effortless creation of highly testable, scalable, loosely coupled, and easily maintainable applications.
Use Nest [CLI](https://docs.nestjs.com/cli/usages) for correct creating new modules/services & controllers


## JWT Authorization

```mermaid
sequenceDiagram
User ->> Service: Login & Password

Note right of Service: if one of creadentials <br/> not valid
Service--x User: 404 Bad request 
Note right of Service: if all creadentials <br/> valid
Service ->> User: 200 Ok with token
```

## Secure routes
Get more about [Guards](https://docs.nestjs.com/guards)
Two protection schemes have been implemented:

 1. JWT Guard - protect access by validation token
 2. Role Guard - protect access by user role


## Stay in touch

[Alex Kotovsky](https://github.com/Kotovskyart)

*2.11.2018*

