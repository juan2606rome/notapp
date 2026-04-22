import { ContextoPokemon } from "@/components/ContextoPokemon";
import ImagenVisual from "@/components/ImagenVisual";
import { useContext, useState } from "react";
import { Button, Text, View } from "react-native";

export default function TerceraPantalla() {
  const { dataPokemon } = useContext(ContextoPokemon);
  const [mensaje, setMensaje] = useState("");
  const [imagen, setImagen] = useState<string | null>(null);

  async function enviarPokemon() {
    if (!dataPokemon) {
      alert("Primero busca un pokemon");
      return;
    }

    const response = await fetch("http://192.168.1.4:3000/pokemon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataPokemon),
    });

    const data = await response.json();

    setMensaje(data.mensaje);
    setImagen(data.imagen); // 🔥 guardas la imagen
  }

  return (
    <View>
      <Button title="Generar texto" onPress={enviarPokemon} />

      <Text>{mensaje}</Text>

      <ImagenVisual urlIMAGEN={imagen} size={120}/>
    </View>
  );
}