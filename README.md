## BACKEND Scripts

To run the backend project first add the node modules

### `npm install`

Then to run the Webserver and Postgres DB (Im using Nodemon)

### `npm run serve`


## FRONTEND Scripts

To run the frontend project first add the node modules

### `npm install`

Then to run the website

### `npm start`

**Note: Dont forget to add the DB on the project to your Postgres , DB on root of project (todoList.sql) !**

**Note: Dont forget to configure the postgres DB access on backend/index.js , to your own DB configurations example below !**

```sh
const client = new Client({
    user: "xxx", // repalce with your username
    password: "xxx", // repalce with your password if u have one
    host: "xxx",// repalce with your host 
    port: 5432,
    database: "todoList"
});
```

