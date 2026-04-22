import { ContextoPokemon } from "@/components/ContextoPokemon";
import Tarjeta from "@/components/Tarjeta";
import { useContext } from "react";
import { Image, StyleSheet, Text, View } from "react-native";



export default function Index() {
const {dataPokemon}=useContext(ContextoPokemon) //aqui se llama el json, anteriormente pasado en index con el set
                                                //se llama dataPokemon a travez de la caja del provider 
                                                //Para usarse se llama dataPokemon como si fuera data 

  if (!dataPokemon) {
    return (
      <View style={styles.container}>
        <Text>Sin Datos</Text>
      </View>
    );
  }



  return (
    <Tarjeta>
    <View style={styles.container}>
            <Text style={styles.title}>POKEMON PARTE 2</Text>
            <Image source={{ uri: dataPokemon.back_image }} style={styles.image}/>
            <Image source={{ uri: dataPokemon.shiny_image }} style={styles.image}/>

            <Text style={styles.text}>Peso pokemon: {dataPokemon.weight}</Text>
            <Text style={styles.text}>Tipo de pokemon: {dataPokemon.type}</Text>
    </View>
    </Tarjeta>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e6f0ff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
  },
  text: {
    fontSize: 16,
    marginTop: 5,
  },
});