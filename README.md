# Product Marketplace MVP

Backbone for a marketplace-like project to be deployed on platformOS.com

# Demo

You can preview the marketplace template at our demo site here: 

[https://getmarketplace.co](https://getmarketplace.co)

# Status

## Still in active development and some concepts are being validated and might change.

# Installation

This is a cheat sheet for installing the Product Marketplace Template. For complete installation instructions visit [Get Started: pOS Marketplace Template](https://documentation.platformos.com/get-started/marketplace-template/marketplace-template). 

1. [Install the pos-cli](https://documentation.platformos.com/get-started/marketplace-template/marketplace-template#step-1-install-the-pos-cli)

```sh
npm install -g @platformos/pos-cli
```

2. [Create Instance](https://documentation.platformos.com/get-started/marketplace-template/marketplace-template#step-2-create-instance) 

Go to https://partners.platformos.com/instances/new

3. [Add Instance to pos-cli](https://documentation.platformos.com/get-started/marketplace-template/marketplace-template#step-3-add-instance-to-pos-cli)

``` sh
mkdir marketplace
cd marketplace
pos-cli env add <YOUR_ENV_NAME> --email <YOUR_EMAIL> --url <YOUR_INSTANCE_URL>
```

4. [Clone the repository](https://documentation.platformos.com/get-started/marketplace-template/marketplace-template#step-4-clone-the-repository)

``` sh
pos-cli init --url https://github.com/mdyd-dev/product-marketplace-template.git
```

5. [Build assets](https://documentation.platformos.com/get-started/marketplace-template/marketplace-template#step-5-build-assets)

```sh
npm install
npm run build
```

6. [Deploy](https://documentation.platformos.com/get-started/marketplace-template/marketplace-template#step-6-deploy)

```sh
pos-cli deploy <YOUR_ENV_NAME>
```

Open your web browser with your Instance URL where you will be provided with post-install steps.


## Seed sample data

``` sh
pos-cli data import <YOUR_ENV_NAME> --path=seed/data.zip --zip
```

# Setup

- To access the admin panel of your marketplace register a user with this email address: `admin@example.com`
- Enter the `Admin` section from main menu and go to the `Marketplace Setup` section. 
- Admins are identified based on email addresses defined in the Constant `superadmins` - see `app/migrations/20200811133711_set_superadmins.liquid`

See our [Get Started documentation for Setting Up Stripe Connect](https://documentation.platformos.com/get-started/marketplace-template/marketplace-template#step-7-set-up-your-marketplace). 

# Benefits and features

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

## First changes

1. Run sync `pos-cli sync <YOUR_ENV_NAME>`
2. Edit your marketplace name in file `app/translations/en.yml`, key: `en.app.title`
3. See changes on your website

## platformOS project

- We assume you have basic understanding of platformOS
- Otherwise we recommend starting with our [Get Started: pOS Marketplace Template](https://documentation.platformos.com/get-started/marketplace-template/marketplace-template) tutorial

## General rules

Business logic and presentation logic are separated and should not interfere with each other, meaning:

- no HTML tags in business logic
- no data queries in presentation layer

## Commands / business logic

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

## Data queries

- location: `app/views/partials/lib/data/queries`
- generaly these are wrappers on graphql queries

## Presentation views - HTML / JSON

To ensure frontend is maintanable and easy to change, we follow couple of important rules. First of all, all our frontend code is inside `theme` directory. Those file should not know about existence of any other file outside of theme. All data that are needed for the frontend should be explicitly provided to them - there shouldn't be any GraphQL queries inside theme. If you need extra data that are not provided by default, we suggest to make all GraphQL queries inside a page (which you can treat as a Controller in MVC architecture) and explicitly provide the result of this query to the partial.

- location: app/views/partials/theme
- partials to be aware ONLY of local variables - no context.session OR context.exports are allowed
- prepare / fetch external data in a page and pass it to partials as local variable
- also no graphql queries are allowed within theme folder

## events

### general

- each command produces an event
- example: when users logs in the system produces `user_session_created` event ` { actor: { id: LOGGED_USER_ID } }`
- then the event can be asynchronously consumed by a consumer

### consumers

- location: `app/views/partials/lib/consumers`

## Custom validation error messages

See [commit/c4c046](https://github.com/mdyd-dev/product-marketplace-template/commit/c4c046d34d5cd031d69dc02e2c1b6c03b3f54967) if you want to add custom message to any existing form field. 

## Social Media / Community

### following 

- user can follow user 
- TDB user can follow anything, category [topic] / item

### activity feeds

- activity record after creation can be published to the following feeds:

  - user-public

    stream of activities accesible to everyone
  
  - user-private

    private activities stream visible only to related user
    
  - user-audience

    private streams of users which follows the user
  
  - custom-audit [1]

    all activities - visible 

  - custom-items [2]

    created items
    
### activities

- user_followed_user 

  actor = follower, target = followed

  - target:private
  - actor:public
  - actor:audience

- user_created_item

  actor = owner, audience = followers

  - actor:private
  - actor:public
  - actor:audience
  
- user_created_order

  actor = customer, audience = item's owner

  - actor:private
  - target:audience

## Categories

categories can be adjusted by:
- /admin/categories
- adding a translation to the `app/translations/en_categories.liquid` file

## Generators

To imporve workflow with creating new resource you can use generator that will create boilerplate files for your.
Generators follow development guidelines.

### CRUD

CRUD generator will create all files needed to create, update, delete.

```
  ./scaffold/bin/generate resource --help

    Usage: generate <model_name> <attribute_name:type_attribute...> ex. generate car car_model:string year:integer 

    Generate model files for basic operations create, read, update, delete
```

Resource generator is expecting model name, list of fields with names and their types.
```
  ./scaffold/bin/generate resource car model:string color:string year:int
    create scaffold/generators/crud/templates/translations/cars.yml
    create app/model_schemas/car.yml
    create app/graphql/cars/create.graphql
    create app/graphql/cars/delete.graphql
    create app/graphql/cars/search.graphql
    create app/graphql/cars/update.graphql
    create app/views/partials/lib/data/queries/cars/find.liquid
    create app/views/partials/lib/data/queries/cars/search.liquid
    create app/views/partials/lib/commands/cars/create.liquid
    create app/views/partials/lib/commands/cars/create/build.liquid
    create app/views/partials/lib/commands/cars/create/check.liquid
    create app/views/partials/lib/commands/cars/delete.liquid
    create app/views/partials/lib/commands/cars/delete/check.liquid
    create app/views/partials/lib/commands/cars/update/build.liquid
    create app/views/partials/lib/commands/cars/update/check.liquid
    create app/views/pages/cars/create.liquid
    create app/views/pages/cars/delete.liquid
    create app/views/pages/cars/edit.liquid
    create app/views/pages/cars/index.liquid
    create app/views/pages/cars/new.liquid
    create app/views/pages/cars/show.liquid
    create app/views/pages/cars/update.liquid
    create app/views/partials/theme/simple/cars/edit.liquid
    create app/views/partials/theme/simple/cars/empty_state.liquid
    create app/views/partials/theme/simple/cars/form.liquid
    create app/views/partials/theme/simple/cars/index.liquid
    create app/views/partials/theme/simple/cars/new.liquid
    create app/views/partials/theme/simple/cars/show.liquid
```

After deploy you can access page when you can list, create, update and delete objects: https://your-instance-domain.com/cars

Now you have good place to start in customizing it to your needs.



### REST API

REST API generator will create json endpoints

```
  ./scaffold/bin/generate rest-api --help

    Usage: generate <model_name>
    
    Example:

    generate rest-api car

```

REST api generator is expecting model name.

```
./scaffold/bin/generate rest-api car
   create app/views/pages/api/cars/create.json.liquid
   create app/views/pages/api/cars/delete.json.liquid
   create app/views/pages/api/cars/show.json.liquid
   create app/views/pages/api/cars/update.json.liquid
REST api endpoints generated

```


### For automation / CI/CD purposes:

    docker run -u $(id -u ${USER}):$(id -g ${USER}) -it --rm -v $(pwd):/app -w /app node:12-alpine npm install
    docker run -u $(id -u ${USER}):$(id -g ${USER}) -it --rm -v $(pwd):/app -w /app node:12-alpine ./scaffold/bin/generate resource RESOURCENAME PROPERTY:TYPE ...


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
