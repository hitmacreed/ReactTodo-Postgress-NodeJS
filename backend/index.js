/**
 * Copyright (c) 2020 Kevin Dias
 *
 * This source code is a simple connection to the DB to PostGres and Webserver 
 * Using Node-postgres and Express Js
*/

const { Client } = require('pg');
const  Express  = require('express');
const cors = require('cors')

/**
 * @let result @type {Array}
 * @summary get the data from DB and shows it
*/

let result = [];

/**
 * @constructor client
 * @type {Client}
 * @summary make and object to create the DB connect
*/

const client = new Client({
    user: "xxxx", // repalce with your username
    password: "xxx", // repalce with your password if u have one
    host: "xxx",// repalce with your host 
    port: 5432,
    database: "todoList"
});


/**
 * @function boot()
 * @summary open the connection to DB
*/

async function boot() {

    await client.connect().then(() => {
        console.log("DB IS CONNECTED");
    }).catch(err => {
        console.log(err)
    });
}


/**
 * @constructor app
 * @type {Express}
 * @summary here below we can config the webserver to host our api and run 
*/

const app = Express();
const PORT = process.env.PORT || 5000;
app.use(cors()) 
app.use(Express.json());
app.use(Express.urlencoded({
    extended: false
}));
app.listen(PORT, () => { boot(), console.log('SERVER IS RUNNING') });

/**
 * @type {get}
 * @summary api endpoint to get all Todos
*/

app.get('/api/getTodos', async (req, res) => {
    const resTodo = await getTodos();
    res.json(resTodo);
})


/**
 * @type {post}
 * @summary api endpoint to update Todos by @type {id:number, nametodo:string} 
*/

app.post('/api/updateTodo', async (req, res) => {

    const updateTodos = {
        id: req.body.id,
        nametodo: req.body.nametodo
    }

    const resTodo = await updateTodo(updateTodos);

    if (resTodo === 1) {
        res.json("OK");
    } else {
        res.json("NOT OK");
    }

})


/**
 * @type {post}
 * @summary api endpoint to updat the done Todos by @type {id:number, isComplete:boolean} 
*/

app.post('/api/updateTodoisComplete', async (req, res) => {

    const updateTodosisComplete = {
        id: req.body.id,
        iscomplete: req.body.iscomplete
    }

    const resTodo = await updateIsComplete(updateTodosisComplete);

    if (resTodo === 1) {
        res.json("OK");
    } else {
        res.json("NOT OK");
    }

})


/**
 * @type {post}
 * @summary api endpoint to add Todos by @type {nametodo:string}
*/

app.post('/api/addTodo', async (req, res) => {

    const addTodos = {
        nametodo: req.body.nametodo,
        iscomplete:false
    }

    const resTodo = await addTodo(addTodos);

    if (resTodo === 1) {
        res.json("OK");
    } else {
        res.json("NOT OK");
    }

})


/**
 * @type {delete}
 * @summary api endpoint to update Todos by @type {id:number} 
*/

app.post('/api/deleteTodo', async (req, res) => {

    const deleteTodos = {
        id: req.body.id
    }

    const resTodo = await deleteTodo(deleteTodos);

    if (resTodo === 1) {
        res.json("OK");
    } else {
        res.json("NOT OK");
    }

})


/**
 * @function getTodos()
 * @summary list all todo
 * @summary create a query to the DB and @returns {result} @type {Array} 
*/

async function getTodos() {

    try {
        const results = await client.query('SELECT * FROM todo ORDER BY id');
        return results.rows;
    } catch (error) {
        return [];
    }

}


/**
 * @function addTodo()
 * @param {addParams}
 * @summary add a todo
 * @summary create a query to the DB and @returns {result} @type {string}
*/

async function addTodo(addParams) {

    try {
        const results = await client.query(`INSERT INTO todo (nametodo, iscomplete) values ('${addParams.nametodo}', ${addParams.iscomplete})`);
        return results.rowCount;
    } catch (error) {
        return [];
    }

}


/**
 * @function updateTodo()
 * @param {updateParams}
 * @summary add a updateTodo
 * @summary create a query to the DB and @update the {nametodo} @type {string}
*/


async function updateTodo(updateParams) {

    try {
        const results = await client.query(`UPDATE todo SET nametodo = '${updateParams.nametodo}' WHERE ID = ${updateParams.id}`);
        return results.rowCount;
    } catch (error) {
        return [];
    }

}


/**
 * @function updateIsComplete()
 * @param {updateIscompleteParams}
 * @summary add a state to the todo item
 * @summary create a query to the DB and @update the  {iscomplete} @type {boolean}
*/

async function updateIsComplete(updateIscompleteParams) {

    try {
        const results = await client.query(`UPDATE todo SET iscomplete = '${updateIscompleteParams.iscomplete}' WHERE ID = ${updateIscompleteParams.id}`);
        return results.rowCount;
    } catch (error) {
        return [];
    }

}


/**
 * @function deleteTodo()
 * @param {deleteParams}
 * @summary delete a updateTodo
 * @summary create a query to the DB and @returns {result} @type {string}
*/

async function deleteTodo(deleteParams) {

    try {
        const results = await client.query(`DELETE FROM todo WHERE id = ${deleteParams.id}`);
        return results.rowCount;
    } catch (error) {
        return [];
    }
}