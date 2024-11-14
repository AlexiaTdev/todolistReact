import {useState, useEffect} from "react";

const getDeflautLocalStorageValue = (key) => {
  const storagedValue = localStorage.getItem(key);
  if(!storagedValue) {
    return null;
  }
  try{
    return JSON.parse(storagedValue)
  }catch{
    return null;
  }
}

const useStickyState = (localStorageKey, defaultValue) => {
  const [state, setState] = useState(
    getDeflautLocalStorageValue(localStorageKey) ?? defaultValue);
  useEffect(()=>{
    localStorage.setItem(localStorageKey, JSON.stringify(state))
  },[state])
  return [state, setState];
}

function App() {
  const [todos, setTodos] = useStickyState("todoListStorage",[]);
  const onSubmit = async (formData) => {
    const todo = formData.get("todo")
    setTodos([...todos, {id:Date.now(), value:todo, checked:false}])
  }
  const liTodos = todos.map((todo) => 
    <li key={todo.id} className="flex items-center gap-4">
      <input
        type="checkbox"
        checked={todo.checked}
        onChange={() => checkItem(todo.id, todo.checked)}/>
      <span className="flex-1">{todo.value}</span>
      <button onClick={()=>deleteTodo(todo.id)}>🗑️</button>
    </li>
  );

  const deleteTodo= (id)=>{
    setTodos(todos.filter((todo)=> todo.id !== id))
  }

  const checkItem = (id, itemCheckedValue) =>{
    setTodos(todos.map((todo) => {
      if (todo.id===id) {
        return {
          ...todo,
          checked: !itemCheckedValue
        }
      }
      return todo
      }
    ))
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <form
        action={onSubmit}
        className="flex item-center gap-4"
      >
        <input name="todo" className="border rounded-md px-4 py-3 flex-1"/>
        <button type="submit" className="border rounded-md px-4 py-3 bg-zinc-800 text-white">Add</button>
      </form>
      <ul  className="list-disc list-inside">
        {liTodos}
      </ul>
    </div>
  )
}

export default App
