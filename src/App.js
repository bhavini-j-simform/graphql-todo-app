import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks'
import {GET_TODOS  } from './queries';
import { ADD_TODO ,DELETE_TODO } from './mutations';

// List Todos
// Add Todos
// Delete Todos

function App() {

  const [todotext, setTodotext] = React.useState('')
  const { loading, data, error } = useQuery(GET_TODOS)
  
  const [addTodo] = useMutation(ADD_TODO, {
    onCompleted: () => setTodotext('')
  })
  const [deleteTodo] = useMutation(DELETE_TODO)

  async function handleAddTodo(event) {
    event.preventDefault()
    //Checking blank todo's
    if(!todotext.trim()) return;

    //refetch queries adding such that todos will get load up asa we create todo!
    const  data = await addTodo({variables: { text: todotext }, refetchQueries: [{ query:GET_TODOS }]})
    console.log('Added todo', data)
    // setTodotext('')
  }

  async function handleDeleteTodo({ id }) {
    const isConfirmed = window.confirm('Do you want to delete this todo 📝')
    if(isConfirmed) {
    await deleteTodo({ variables: { id }, update: cache => {
        //Read from cache
        const  prevData = cache.readQuery({ query: GET_TODOS })
        //Manually updates the todo
        const newTodos = prevData.todos.filter( todo => todo.id !== id )
        // Then write back to the cache
        cache.writeQuery( { query: GET_TODOS , data: { todos: newTodos}})
      }}) 
    }
  }

  if(loading) return <div>Loading...</div>
  if(error) return <div>500 error happend</div>

  return (
    <div >
      <h1 >GraphQL Checklist </h1>
      <form onSubmit={handleAddTodo} >
        <input 
        type="text"
        placeholder="Write your todo"
        onChange={ event => setTodotext(event.target.value)}
        value={todotext} //for context
        />
        {/* Adding () => because of each unique key is passing */}
        <button  type="submt"> 
        Create 
        </button>
      </form>
      <div >
      {data.todos.map(todo => (
        // () => ensures that we get the particular todo only
        <p  key={todo.id}>
          <span >
            {todo.text}
          </span>
          <button onClick={ () => handleDeleteTodo(todo)} >
            <span>
              &times;
            </span> 
          </button>
        </p>
      ))}
      </div>
    </div>
  );
}

export default App;
