# Product Marketplace MVP

backbone for a marketplace like project to be deployed to platformOS.com

# status

it is still in active development and some concepts are being validated and might change 

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
npm ci -S
npm build
```

- deploy

```sh
pos-cli deploy <YOUR_ENV_NAME>
```
- open web browser with your instance URL where you will be provided with post-install steps

# setup

- To access admin panel register user with email address: `admin@example.com`
- Enter `Admin` section from main menu and go to `Marketplace Setup` section


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

# road map

- installation wizard
- stripe integration

# development guidelines

## first changes

1. Run sync `pos-cli sync <YOUR_ENV_NAME>`
2. Edit your marketplace name in file `app/translations/en.yml`, key: `en.app.title`
3. See changes on your website

## seed 

    pos-cli data clean --auto-confirm
    pos-cli data import --path=data.zip --zip

## platformOS project

- assumed you are proficient in platformOS 
- otherwise we recommend https://documentation.platformos.com first

## general rules

business logic and presentation logic are separated and should not interfere with each other, meaning:

- no HTML tags in business logic
- no data queries in presentation layer

## business logic

- for business logic use commands [/app/views/partials/lib/commands]
- general command consists of 3 stages:
  - build
  - check
  - execute
- picture.jpg
  
- commands are designed to be easily executed as background job [heavy commands - external API call, expensive operations computations, reports]
- each command might produce an event

## presentation views - HTML / JSON 

- app/views/partials/theme 
- prepare / fetch external data in a page and pass it to partials as local variable
- no graphql queries are allowed within theme folder
- partials to be aware ONLY of local variables - no context.session OR context.exports are allowed

- if you do not agree - please raise an issue OR fork the project 

## data queries

TBD

## events

TBD

## categories

categories can be adjusted by:
- edit: https://github.com/mdyd-dev/marketplace-template-poc/blob/master/app/views/partials/lib/queries/raw_category_list.liquid
- adding a translation to the `app/translations/en_categies.liquid` file

## TESTS


### Use real US address like:

```
722 Laurel Ave
Burlingame, CA 94010
USA
```
