import React, { Component } from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import { Alert, AlertTitle } from '@material-ui/lab';
import Environments from '../environments/environment';
import '../components/GeTodos.css';
import empty from '../assets/to_do_list.svg'

class GetTodos extends Component {
 
  constructor(props) {
    
    super(props)
  
    this.state = {
       todos:[],
       isShowingModal: false,
       isShowingModalUpdate:false,
       nametodo:"",
       alert:"alert",
       todoDone:"todoDone",
       updateTodoTxt:"",
       btState:true,
       updateId:"",
    }
  }

  /**
  * @function handleClick()
  * @state {isShowingModal} @type {Boolean}
  * @summary openModal Add Todo
  */

  handleClick = () => this.setState({isShowingModal: true})

  /**
  * @function handleClose()
  * @state {isShowingModal} @type {Boolean}
  * @summary closeModal Add Todo
  */

  handleClose = () => this.setState({isShowingModal: false})

  /**
  * @function handleClickUpdate()
  * @state {updateId} @type {number}
  * @state {updateTodoTxt} @type {string}
  * @state {isShowingModalUpdate} @type {Boolean}
  * @summary get name and id from todo to edit and opens Modal
  */

  handleClickUpdate = (id,nametodo) => {
    this.setState({isShowingModalUpdate: true});
    this.setState({updateTodoTxt: nametodo});
    this.setState({updateId: id});
  }

  /**
  * @function handleCloseUpdate()
  * @state {isShowingModalUpdate} @type {Boolean}
  * @summary closes Edit Modal
  */

  handleCloseUpdate = () => this.setState({isShowingModalUpdate: false})

  /**
  * @function changeHandler()
  * @state {btState} @type {Boolean}
  * @state {updateTodoTxt} @type {string}
  * @summary manage states of forms and inputs
  */

  changeHandler = (e) => {
    
    if(this.state.nametodo === ''){
      this.setState({btState: false})
    }

    this.setState({[e.target.name]: e.target.value});
    this.setState({updateTodoTxt : e.target.value});
  }

  /**
  * @function checkboxHandler()
  * @state {e} @type {any}
  * @state {idTodo} @type {number}
  * @state {isChecked} @type {Boolean}
  * @summary manage states of checkbox and call @function doneTodo() to update if todo is done or not
  */

  checkboxHandler(e,idTodo) {
    let isChecked = e.target.checked;
    this.doneTodo(idTodo,isChecked);
  }
  
 /**
  * @function componentDidMount()
  * @state {e} @type {any}
  * @state {todoDone} @type {string}
  * @summary get the list of todos 
  */

  componentDidMount(){

     axios.get(Environments.environment.url + "getTodos").then(res => {
         this.setState({todos:res.data});
         if (res.data.iscomplete === true) {
           this.setState({todoDone:"todoDone"});
         }

         else{
           this.setState({todoDone:"todonotDone"});
         }
     }, error => {
         console.log(error)
     })
  }

 /**
  * @function addTodo()
  * @state {isShowingModal} @type {boolean}
  * @state {alert} @type {string}
  * @state {nametodo} @type  {string}
  * @summary add a new todo
 */

  addTodo = (e) => {
    e.preventDefault();
    axios.post(Environments.environment.url + "addTodo",{nametodo:this.state.nametodo}).then(res => {
      if (res.data === "OK") {
        this.setState({isShowingModal: false});
        this.setState({alert: 'alertShow'});
        setTimeout(() => {
         this.setState({alert: 'alert'});
        }, 3000);
        this.componentDidMount()
      }
    }, error => {
        this.setState({isShowingModal: false});
        console.log(error)
    })
  }

  /**
  * @function deleteTodos()
  * @var {idTodo} @type {string}
  * @summary delete a todo
 */

  deleteTodos = (idTodo) => {

    axios.post(Environments.environment.url + "deleteTodo",{id:idTodo}).then(res => {
      if (res.data === "OK") {
        this.componentDidMount()
      }
    }, error => {

        console.log(error)
    })
  }

  /**
  * @function updateTodos()
  * @state {isShowingModalUpdate} @type {boolean}
  * @state {updateId} @type {number}
  * @state {updateTodoTxt} @type {string}
  * @summary update a todo
 */

  updateTodos = (e) => {
    e.preventDefault();
      axios.post(Environments.environment.url + "updateTodo", {"id":this.state.updateId, "nametodo":this.state.updateTodoTxt}).then(res => {
        if (res.data === "OK") {
          this.setState({isShowingModalUpdate: false});
          this.componentDidMount()
        }
      }, error => {

          console.log(error)
      })
  }

  /**
  * @function doneTodo()
  * @var {isChecked} @type {boolean}
  * @var {idTodo} @type {number}
  * @summary update a todo isComplete Status
 */

  doneTodo = (idTodo,isChecked) => {
   axios.post( Environments.environment.url + "updateTodoisComplete", {"id":idTodo, "iscomplete":isChecked}).then(res => {
     if (res.data === "OK") {
       this.componentDidMount()
     }
   }, error => {
       console.log(error)
   })
     
  }


  /**
  * @render doneTodo()
  * @summary UI Render
 */

  render() {

  const { todos , isShowingModal , isShowingModalUpdate, alert , btState , updateTodoTxt } = this.state;
  
  return (

  <div className="App">

      {  
      /**
       * @summary Show Alert if success
      */
      }

        <div className={alert}>
          <Alert  severity="success" >
                <AlertTitle>Success Todo item Added</AlertTitle> 
          </Alert>
        </div>

      {  
      /**
       * @summary get all todos
      */
      }        
      <Grid item xs={12} md={12} >
        <Typography variant="h6" className="title">
          <Fab variant="extended"  color="primary" onClick={this.handleClick}>
            <AddIcon size="small"  className="extendedIcon"  />  
          Add Todo    
        </Fab>
        </Typography>
        <List className="List">
            {
              todos.length?
              todos.map(todo => 
              <ListItem key={todo.id}>
                <Card className="card">
                <CardActionArea>
                <CardHeader action={ <Checkbox  onChange={this.changeHandler} color="primary"  
                checked={todo.iscomplete}  
                onChange={e => this.checkboxHandler(e,todo.id)}  />} title={"Todo Item " + todo.id} />
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" className={todo.iscomplete === true ? "todoDone" : "todonotDone" }>
                      {todo.nametodo}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="primary" onClick={() => this.handleClickUpdate(todo.id,todo.nametodo)}>
                        <EditIcon />
                    </Button>
                    <Button size="small" color="primary" onClick={() => this.deleteTodos(todo.id)}>
                      <DeleteIcon />
                    </Button>
                  </CardActions>
                </Card>
              </ListItem>
              ):
              <div>
                <h2 className="emptyTxt">No todo founds, add one !!!</h2>
                <img src={empty} className="imgEmpty"/> 
              </div>
            }
          </List>
      </Grid>  
      
      {  
      /**
       * @summary add new todo Dialog
      */
      }

      <Dialog open={isShowingModal} onClose={this.handleClose} >
        <form onSubmit={this.addTodo}>
        <DialogTitle > Add todo Item</DialogTitle>
          <DialogContent>
              <DialogContentText>
                Please add a todo item to your list
              </DialogContentText>
              <TextField
                margin="dense"
                id="nametodo"
                name="nametodo"
                label="Description"
                placeholder="for eg: Need to buy eggs "
                type="text"
                fullWidth
                onChange={this.changeHandler}
              />
          </DialogContent>
          <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={btState}>
                Add
              </Button>
          </DialogActions>
          </form>
      </Dialog>

      {  
      /**
       * @summary add new todo UpdateDialog
      */
      }
      
      <Dialog open={isShowingModalUpdate} onClose={this.handleCloseUpdate} >
        <form onSubmit={this.updateTodos}>
        <DialogTitle > Edit todo Item</DialogTitle>
          <DialogContent>
              <TextField
                margin="dense"
                id="updateTodo"
                name="updateTodo"
                label="Description"
                placeholder="for eg: Need to buy eggs "
                type="text"
                fullWidth
                value={updateTodoTxt}
                onChange={this.changeHandler}
              />
          </DialogContent>
          <DialogActions>
              <Button onClick={this.handleCloseUpdate} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary" >
                Update
              </Button>
          </DialogActions>
        </form>
      </Dialog>

  </div>   
  )}
}

export default GetTodos
