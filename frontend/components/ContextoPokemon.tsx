import { createContext, useState } from "react";

export const ContextoPokemon = createContext<any>(null);

export function PokemonProvider({children}: any){
    const [dataPokemon, setDataPokemon] = useState(null)

    return (
    <ContextoPokemon.Provider value={{dataPokemon,setDataPokemon}}>
        {children} 
    </ContextoPokemon.Provider>
    )
}

