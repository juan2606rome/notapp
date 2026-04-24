import Tarjeta from "@/components/Tarjeta";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

export default function Consulta() {
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [materia, setMateria] = useState("");
  const [nota1, setNota1] = useState("");
  const [nota2, setNota2] = useState("");
  const [nota3, setNota3] = useState("");
  const [nota4, setNota4] = useState("");
  const [definitiva, setDefinitiva] = useState("");
  const [cargando, setCargando] = useState(false);
  const [consultado, setConsultado] = useState(false);

  function validar(): string | null {
    if (!cedula.trim()) return "Debes ingresar una cédula para consultar.";
    if (isNaN(Number(cedula)) || Number(cedula) <= 0)
      return "La cédula debe ser un número positivo.";
    return null;
  }

  async function consultar() {
    const error = validar();
    if (error) {
      Alert.alert("Campos inválidos", error);
      return;
    }
    setCargando(true);
    setConsultado(false);
    const url = `https://notapp-jekr.onrender.com/estudiante/${cedula}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Estudiante no encontrado");
        return response.json();
      })
      .then((data) => {
        setNombre(data.nombre || "");
        setMateria(data.materia || "");
        setNota1(data.nota1?.toString() || "");
        setNota2(data.nota2?.toString() || "");
        setNota3(data.nota3?.toString() || "");
        setNota4(data.nota4?.toString() || "");
        setDefinitiva(data.definitiva?.toString() || "");
        setConsultado(true);
      })
      .catch(() => {
        Alert.alert("Error", "No se encontró un estudiante con esa cédula.");
      })
      .finally(() => setCargando(false));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consulta de Notas</Text>
      <Text style={styles.subtitle}>Buscar por cédula</Text>

      <TextInput
        style={styles.input}
        placeholder="Cédula del estudiante"
        placeholderTextColor="#999"
        onChangeText={setCedula}
        value={cedula}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.boton} onPress={consultar}>
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botonTexto}>Consultar</Text>
        )}
      </TouchableOpacity>

      
        <Tarjeta>
          <Text style={styles.cardTitle}>{nombre}</Text>
          <View style={styles.fila}>
            <Text style={styles.etiqueta}>Materia:</Text>
            <Text style={styles.valor}>{materia}</Text>
          </View>
          <View style={styles.separador} />
          <View style={styles.fila}>
            <Text style={styles.etiqueta}>Nota 1:</Text>
            <Text style={styles.valor}>{nota1}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.etiqueta}>Nota 2:</Text>
            <Text style={styles.valor}>{nota2}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.etiqueta}>Nota 3:</Text>
            <Text style={styles.valor}>{nota3}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.etiqueta}>Nota 4:</Text>
            <Text style={styles.valor}>{nota4}</Text>
          </View>
          <View style={styles.separador} />
          <View style={styles.fila}>
            <Text style={[styles.etiqueta, { fontWeight: "bold" }]}>Definitiva:</Text>
            <Text style={[styles.valor, styles.definitiva]}>{definitiva || "—"}</Text>
          </View>
        </Tarjeta>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#f5f7fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a2e",
    marginTop: 20,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d0d7e2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    backgroundColor: "#fff",
    fontSize: 15,
    color: "#222",
  },
  boton: {
    width: "100%",
    backgroundColor: "#4361ee",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginBottom: 8,
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 10,
    textAlign: "center",
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 4,
  },
  etiqueta: {
    fontSize: 14,
    color: "#555",
  },
  valor: {
    fontSize: 14,
    color: "#222",
    fontWeight: "500",
  },
  definitiva: {
    color: "#4361ee",
    fontSize: 16,
    fontWeight: "bold",
  },
  separador: {
    height: 1,
    backgroundColor: "#eee",
    width: "100%",
    marginVertical: 6,
  },
});
