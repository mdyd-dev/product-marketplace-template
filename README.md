# Product Marketplace MVP

Backbone for a marketplace like project to be deployed on platformOS.com

# status

It is still in active development and some concepts are being validated and might change

# installation

- install [pos-cli](https://documentation.platformos.com/get-started/hello-world/install-pos-cli)

```sh
npm install -g @platformos/pos-cli
```

- create instance https://partners.platformos.com/instances/new

- add instance to pos-cli

``` sh
mkdir marketplace; cd marketplace/
pos-cli env add <YOUR_ENV_NAME> --email <YOUR_EMAIL> --url <YOUR_INSTANCE_URL>
```

- clone the repository

``` sh
pos-cli init --url https://github.com/mdyd-dev/marketplace-template-poc.git
```

- build assets

```sh
npm ci
npm build
```

- deploy

```sh
pos-cli deploy <YOUR_ENV_NAME>
```
- open web browser with your instance URL where you will be provided with post-install steps


## Seed sample data

``` sh
pos-cli data import <YOUR_ENV_NAME> --path=seed/data.zip --zip
```

# setup

- To access the admin panel, register with email address: `admin@example.com`
- Enter `Admin` section from main menu and go to `Marketplace Setup` section
- Admins are identified based on email addresses defined in Constant `superadmins` - see `app/migrations/20200811133711_set_superadmins.liquid`


# benefits and features

- as a customer I can search for an item by name, description
- as a customer I can search for an item by tag
- as a customer I can search for an item by category
- as a customer I can order an item

- as an entrepreneur I can list an item
- as an entrepreneur I can mark an order as paid
- as an entrepreneur I can mark an order as shipped
- as an entrepreneur I can cancel an order

- as an admin I can browse all items
- as an admin I can browse all orders
- as an admin I can browse all users

- as an admin I can browse all events

- stripe integration

# Roadmap

- installation wizard

# Development guidelines

## first changes

1. Run sync `pos-cli sync <YOUR_ENV_NAME>`
2. Edit your marketplace name in file `app/translations/en.yml`, key: `en.app.title`
3. See changes on your website

## platformOS project

- We assume you have basic understanding of platformOS
- Otherwise we recommend https://documentation.platformos.com first

## general rules

Business logic and presentation logic are separated and should not interfere with each other, meaning:

- no HTML tags in business logic
- no data queries in presentation layer

## commands / business logic

Command is our concept to encapsulate business rules. By following our recommendation, you will improve the consistency of your code, so it will be easy to onboard new developers to the project and easier to take over existing projects. We are using the same pattern for all of our templates. The advantage of using this architecture is that it will be easy to re-use the command - you will be able to execute it both in a live web request, as well as a background job. It will also be easy to copy it across different projects.

![CommandWorkFlow](https://trello-attachments.s3.amazonaws.com/5f2abc6a5aa3bc157e8cee0c/871x721/4b5846b5d0080662351977819dfcc02f/pos-command%282%29.png)

- location: /app/views/partials/lib/commands
- for business logic use commands
- general command consists of 3 stages:
  - build - This is the place where you build input for the command; if you are proficient with platformOS - equivalent of `Form`'s `default_payload`)
  - validate - This is the place where you validate the input - for example, you ensure all required fields are provided, you check uniqueness, check the format of the input (numbers are really a numbers and not letters) etc. This always returns hash with two keys - `valid` being either `true` or `false`, and if `false` - `errors` with details why validation has failed.
  - execute - If validation succeeds, proceed with executing the command. Any error raised here should be considered 500 server error. If you allow errors here, it means there is something wrong with the code organisation, as all checks to prevent errors should be done in `validate` step.

- commands are designed to be easily executed as background job [heavy commands - external API call, expensive operations computations, reports]
- each command might produce an event

## data queries

- location: /app/views/partials/lib/data/queries
- generaly these are wrappers on graphql queries

## presentation views - HTML / JSON

To ensure frontend is maintanable and easy to change, we follow couple of important rules. First of all, all our frontend code is inside `theme` directory. Those file should not know about existence of any other file outside of theme. All data that are needed for the frontend should be explicitly provided to them - there shouldn't be any GraphQL queries inside theme. If you need extra data that are not provided by default, we suggest to make all GraphQL queries inside a page (which you can treat as a Controller in MVC architecture) and explicitly provide the result of this query to the partial.

- location: app/views/partials/theme
- partials to be aware ONLY of local variables - no context.session OR context.exports are allowed
- prepare / fetch external data in a page and pass it to partials as local variable
- also no graphql queries are allowed within theme folder

## events

- each command produces an event
- example: when users logs in the system produces `user_session_created` event ` { actor: { id: LOGGED_USER_ID } }`
- then the event can be asynchronously consumed by a consumer

### consumers

- location: app/views/partials/lib/consumers

## categories

categories can be adjusted by:
- edit: https://github.com/mdyd-dev/marketplace-template-poc/blob/master/app/views/partials/lib/queries/raw_category_list.liquid
- adding a translation to the `app/translations/en_categies.liquid` file

## TESTS

### e2e tests

Testcafe tests are located in `test/` directory.

```
  testcafe "chromium:headless" test --skip-js-errors
```

### unit tests

## Stripe

Use real US address like:

```
722 Laurel Ave
Burlingame
CA
94010
USA
```
