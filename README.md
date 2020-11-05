# The User Interface

Author: Haoyu Xu (haoyu.xu@carleton.ca)

Current the User Interface is running under [http://10.1.0.1:8888](http://10.1.0.1:8888])

User accounts:

- root:root
- admin:password

## Run

### Direct host

Requirements:

- NodeJS and/or Yarn

``` bash
$ npm install
$ npm start
```

or

``` bash
$ yarn install
$ yarn start
```

The User Interface will be up and running at [http://localhost:8080](http://localhost:8080]) and listen to [http://0.0.0.0:8080](http://0.0.0.0:8080)


### Docker-compose

``` yaml
version: "3.8"
services:
  hss-frontend:
    build: ./hss/frontend
    container_name: hss_frontend_container
    environment:
      - TZ=America/Toronto
    volumes:
      - ./hss/frontend:/frontend:rw
      - /frontend/node_modules
    expose:
      - "8080"
    ports:
      - "8888:8080"
    restart: always
```

## Development

Requirements:

- NodeJS and/or Yarn

``` bash
$ npm install
$ npm run dev
```

or

``` bash
$ yarn install
$ yarn dev
```

The User Interface will be up and running at [http://localhost:8080](http://localhost:8080]) and listen to [http://0.0.0.0:8080](http://0.0.0.0:8080)

## Test

The test program is a modified version of the Central System. `lib` files are all changed to return successful status. `route` files are left unchanged.

Requirements:

- Python 3.0+

``` bash
$ pip install -r requirements.txt
```

Additonal System packages (tested under alpine):

- openssl-dev
- libffi-dev
- build-base
- openldap-dev
- zlib-dev
- jpeg-dev
