import { ContextoPokemon } from "@/components/ContextoPokemon";
import ImagenVisual from "@/components/ImagenVisual";
import Tarjeta from "@/components/Tarjeta";
import { useContext, useState } from "react";
import { Button, StyleSheet, Text, View,TextInput } from "react-native";


export default function Index() {
const {setDataPokemon} = useContext(ContextoPokemon) //en la caja ContextoPokemon se pide el setDataPokemon
                                                    //toca colocarlo igual a como se envio en el provider
const [Texto,setTexto] = useState("")
const [Altura,setAltura] = useState("")
const [ImagenFrontal, setImagenFrontal] = useState<string | null>(null); //STRING O NULL, null para valor inicial

const [cedula, setCedula] = useState("")
const [nombre, setNombre] = useState("")
const [correo, setCorreo] = useState("")
const [materia, setMateria] = useState("")
const [celular, setCelular] = useState("")
const [nota1, setNota1] = useState("")
const [nota2, setNota2] = useState("")
const [nota3, setNota3] = useState("")
const [nota4, setNota4] = useState("")
const [definitiva, setDefinitiva] = useState("")

async function consultar() {
  // let url = ("http://localhost:3000/pokemon/"+ Texto )
  let url = ("http://localhost:3000/estudiante/" + cedula)
  fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    setNombre(data.nombre)
    setCorreo(data.correo)
    setCelular(data.celular)
    setMateria(data.materia)
    setNota1(data.nota1)
    setNota2(data.nota2)
    setNota3(data.nota3)
    setNota4(data.nota4)
    setDefinitiva(data.definitiva)
  })
  .catch(error => console.error("error"))

  
}


  return (
    <View style={styles.container}>
        <Text style={styles.title}>Consulta Pokemon</Text>
        <TextInput style={styles.input} placeholder="Cedula" onChangeText={setCedula} value={cedula}></TextInput>
        <TextInput style={styles.input} placeholder="Nombre" onChangeText={setNombre} value={nombre}></TextInput>
        <Button title={"Consultar"} onPress={consultar}></Button>
        <Tarjeta>
        <Text style={styles.text}> Materia: {materia}</Text>
        <Text style={styles.text}> Nota1: {nota1}</Text>
        <Text style={styles.text}> Nota2: {nota2}</Text>
        <Text style={styles.text}> Nota3: {nota3}</Text>
        <Text style={styles.text}> Nota4: {nota4}</Text>
        <Text style={styles.text}> Definitiva: {definitiva}</Text>
        {/* <ImagenVisual urlIMAGEN={ImagenFrontal} size={150}/> */}
        </Tarjeta>
        {/* <Image source={{ uri: ImagenFrontal }} style={styles.image}/>  esta es otra forma de hacerlo sin el componente*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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