import { PokemonProvider } from "@/components/ContextoPokemon";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <PokemonProvider>
    <Stack screenOptions={{headerShown: false}}/>;
  </PokemonProvider >
  )
}
 