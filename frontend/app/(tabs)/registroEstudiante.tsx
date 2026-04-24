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

export default function RegistroEstudiante() {
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [celular, setCelular] = useState("");
  const materia = "Python"; // Materia fija por el momento
  const [cargando, setCargando] = useState(false);
  const [registrado, setRegistrado] = useState(false);

  // Todas las validaciones en una sola función
  function validar(): string | null {
    if (!cedula.trim() || !nombre.trim() || !correo.trim() || !celular.trim())
      return "Todos los campos son obligatorios.";
    if (isNaN(Number(cedula)) || Number(cedula) <= 0 || cedula.includes("."))
      return "La cédula debe ser un número entero positivo, sin letras.";
    if (isNaN(Number(celular)) || Number(celular) <= 0 || celular.includes("."))
      return "El celular debe ser un número válido, sin letras.";
    if (!correo.includes("@") || !correo.includes("."))
      return "El correo electrónico no es válido.";
    return null;
  }

  async function registrar() {
    const error = validar();
    if (error) {
      Alert.alert("Campos inválidos", error);
      return;
    }
    setCargando(true);
    setRegistrado(false);
    const url = "https://notapp-jekr.onrender.com/estudiante";
    const estudiante = { cedula, nombre, correo, celular, materia };

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(estudiante),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al registrar");
        return response.json();
      })
      .then(() => {
        setRegistrado(true);
        Alert.alert("¡Listo!", `Estudiante "${nombre}" registrado correctamente.`);
        setCedula("");
        setNombre("");
        setCorreo("");
        setCelular("");
      })
      .catch(() => {
        Alert.alert("Error", "No se pudo registrar el estudiante. Verifica que la cédula no esté ya registrada.");
      })
      .finally(() => setCargando(false));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Estudiantes</Text>
      <Text style={styles.subtitle}>Completa todos los campos</Text>

      <Tarjeta>
        <TextInput
          style={styles.input}
          placeholder="Cédula (solo números)"
          placeholderTextColor="#999"
          onChangeText={setCedula}
          value={cedula}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          placeholderTextColor="#999"
          onChangeText={setNombre}
          value={nombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#999"
          onChangeText={setCorreo}
          value={correo}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Celular (solo números)"
          placeholderTextColor="#999"
          onChangeText={setCelular}
          value={celular}
          keyboardType="numeric"
        />

        <View style={styles.materiaContainer}>
          <Text style={styles.materiaEtiqueta}>Materia:</Text>
          <Text style={styles.materiaValor}>{materia}</Text>
        </View>

        <TouchableOpacity style={styles.boton} onPress={registrar}>
          {cargando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botonTexto}>Registrar Estudiante</Text>
          )}
        </TouchableOpacity>
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
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    fontSize: 15,
    color: "#222",
  },
  materiaContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#eef2ff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#c7d2fe",
  },
  materiaEtiqueta: {
    fontSize: 14,
    color: "#555",
    marginRight: 8,
  },
  materiaValor: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4361ee",
  },
  boton: {
    width: "100%",
    backgroundColor: "#4361ee",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
