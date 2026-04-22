import { ContextoPokemon } from "@/components/ContextoPokemon";
import ImagenVisual from "@/components/ImagenVisual";
import Tarjeta from "@/components/Tarjeta";
import { useContext, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";


export default function Index() {
const {setDataPokemon} = useContext(ContextoPokemon) //en la caja ContextoPokemon se pide el setDataPokemon
                                                    //toca colocarlo igual a como se envio en el provider
const [Texto,setTexto] = useState("")
const [Altura,setAltura] = useState("")
const [ImagenFrontal, setImagenFrontal] = useState<string | null>(null); //STRING O NULL, null para valor inicial



async function consultar() {
  // let url = ("http://localhost:3000/pokemon/"+ Texto )
  let url = ("https://microserviciopokemon.onrender.com/pokemon/"+ Texto )
  fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    setAltura(data.height)//cargar altura
    // setImagenFrontal(data.sprites.front_default);//cargar imagen
    setImagenFrontal(data.front_image);
    setDataPokemon(data) //aqui se envia todo dataPokemon del provider, se envia todo el json
    // setTypes(data.types[0].type.name) // cargar el tipo con array
  })
  .catch(error => console.error("error"))

  
}


  return (
    <View style={styles.container}>
        <Text style={styles.title}>Consulta Pokemon</Text>
        <TextInput style={styles.input} placeholder="Escribe un pokemon" onChangeText={setTexto} value={Texto}></TextInput>
        <Button title={"Consultar"} onPress={consultar}></Button>
        <Tarjeta>
        <Text style={styles.text}> Altura Pokemon: {Altura}</Text>
        <ImagenVisual urlIMAGEN={ImagenFrontal} size={150}/>
        </Tarjeta>
        {/* <Image source={{ uri: ImagenFrontal }} style={styles.image}/>  esta es otra forma de hacerlo sin el componente*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  text: {
    marginTop: 15,
    fontSize: 16,
  },
  image: {
    width: 120,
    height: 120,
    marginTop: 15,
  },
});



// bulbasaur
// charmander
// squirtle
// pikachu
// jigglypuff
// meowth
// gengar
// eevee
// snorlax
// ditto