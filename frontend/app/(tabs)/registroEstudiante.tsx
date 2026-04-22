import { ContextoPokemon } from "@/components/ContextoPokemon";
import Tarjeta from "@/components/Tarjeta";
import { useContext, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";



export default function segundaPantalla() {
const {dataPokemon}=useContext(ContextoPokemon) //aqui se llama el json, anteriormente pasado en index con el set
                                                //se llama dataPokemon a travez de la caja del provider 
                                                //Para usarse se llama dataPokemon como si fuera data 

const [cedula, setCedula] = useState("")
const [nombre, setNombre] = useState("")
const [correo, setCorreo] = useState("")
const [celular, setCelular] = useState("")
const [materia, setMateria] = useState("")

async function consultar() {
  // let url = ("http://localhost:3000/pokemon/"+ Texto )
  let url = ("http://localhost:3000/estudiante")
    const estudiante = {
    cedula: cedula,
    nombre: nombre,
    correo: correo,
    celular: celular,
    materia: materia
  };


  fetch(url, {
    method: "POST",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify(estudiante)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    setCedula(data.cedula)
    setNombre(data.nombre)
    setCorreo(data.correo)
    setCelular(data.celular)
    setMateria(data.materia)
    // setAltura(data.height)//cargar altura
    // setImagenFrontal(data.sprites.front_default);//cargar imagen
    // setImagenFrontal(data.front_image);
    // setDataPokemon(data) //aqui se envia todo dataPokemon del provider, se envia todo el json
    // setTypes(data.types[0].type.name) // cargar el tipo con array
  })
  .catch(error => console.error("error"))

  
}



  return (
    <Tarjeta>
    <View style={styles.container}>
            <Text style={styles.title}>Registro estudiantes</Text>
            <TextInput style={styles.input} placeholder="Cedula" onChangeText={setCedula} value={cedula}></TextInput>
            <TextInput style={styles.input} placeholder="Nombre" onChangeText={setNombre} value={nombre}></TextInput>
            <TextInput style={styles.input} placeholder="Correo" onChangeText={setCorreo} value={correo}></TextInput>
            <TextInput style={styles.input} placeholder="Celular" onChangeText={setCelular} value={celular}></TextInput>
            <TextInput style={styles.input} placeholder="Materia" onChangeText={setMateria} value={materia}></TextInput>
            <Button title={"Registro"} onPress={consultar}></Button>
          
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
    input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
});