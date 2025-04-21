'use client'
import { createContext,useReducer,useContext } from 'react'

const userContext = createContext()

const userReducer = (state,action)=>{
    
    switch (action.type) {

        case "collect_user_info":
            return {
                
                user: {...state.user,...action.payload}
            }
        
        default:
            return state
    }
}

export const UserContextProvider = ({children}) => {
    
    const [state,dispatch] = useReducer(userReducer,{
        user:null
    })

  return (
    <userContext.Provider value={{...state,dispatch}}>
        {children}
    </userContext.Provider>
  )
}

export const userHook = ()=>useContext(userContext)