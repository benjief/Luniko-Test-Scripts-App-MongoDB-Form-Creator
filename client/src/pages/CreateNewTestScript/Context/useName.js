import { useContext } from "react"
import Context from "./context"

const useName = () => {
    const context = useContext(Context)


    if (!context) {
        throw new Error(
            'Context must be consumed inside the Provider'
        );
    }

    return context
}

export default useName
