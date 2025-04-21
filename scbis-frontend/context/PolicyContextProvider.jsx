'use client'
import React, { createContext, useContext, useReducer } from 'react'


const policyContext = createContext() 

const policyReducer = (state,action)=>{

    switch(action.type){
      
      case "collect_policy_info":
        return {
          policy:{...state.policy,...action.payload}
        }
      case "private_vehicle_info":
        return {
          policy:{...state.policy,privateVehicle:{...state.policy.privateVehicle,...action.payload}}
        }
      case "commercial_vehicle_info":
        return {
          policy:{...state.policy,commercialVehicle:{...state.policy.commercialVehicle,...action.payload}}
        }

      default:
        return state
    }

}

export const PolicyContextProvider = ({children}) => {

    const [state,dispatch] = useReducer(policyReducer,{
        policy:{
          privateVehicle:null,
          commericalVehicle:null
        }
    })

  return (
    <policyContext.Provider value={{...state,dispatch}}>
        {children}
    </policyContext.Provider>
  )
}


export const policyHook = ()=>useContext(policyContext)
