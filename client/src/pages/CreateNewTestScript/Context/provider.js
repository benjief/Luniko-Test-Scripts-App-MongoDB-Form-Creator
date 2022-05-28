import React, { useState } from 'react'

import Context from './context'

function ContextProvider({ children }) {
    const [name, setName] = useState('raph')

    return (
        <Context.Provider value={{ name, setName }}>{children}</Context.Provider>
    )
}

export default ContextProvider