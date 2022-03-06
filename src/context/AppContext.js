import { useEffect } from "react";
import { createContext, useState } from "react";
import cratersData from "../database/cratersData";

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {
  const [ references, setReferences ] = useState([])

  useEffect(() => {
    if(references.length === 0) {
      const currentReferences = []
      for (const item in cratersData) {
        const element = document.getElementById(`PlanetItem-${cratersData[item].id}`)
        if(element) {
          currentReferences.push(element)
        }
      }

      setReferences(currentReferences)
      console.log(currentReferences)
    }
  }, [references])

  return(
    <AppContext.Provider value={{ references, setReferences }}>
      { children }
    </AppContext.Provider>
  )
}

export default AppContextProvider