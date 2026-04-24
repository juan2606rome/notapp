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
  ScrollView,
} from "react-native";

export default function RegistroNota() {
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [materia, setMateria] = useState("");
  const [nota1, setNota1] = useState("");
  const [nota2, setNota2] = useState("");
  const [nota3, setNota3] = useState("");
  const [nota4, setNota4] = useState("");
  const [definitiva, setDefinitiva] = useState("");
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [consultado, setConsultado] = useState(false);
  const [definitivaGenerada, setDefinitivaGenerada] = useState(false);

  // Validaciones de búsqueda en una sola función
  function validarConsulta(): string | null {
    if (!cedula.trim()) return "Debes ingresar una cédula.";
    if (isNaN(Number(cedula)) || Number(cedula) <= 0)
      return "La cédula debe ser un número positivo.";
    return null;
  }

  // Validaciones de notas en una sola función
  function validarNotas(): string | null {
    if (!nota1.trim() || !nota2.trim() || !nota3.trim() || !nota4.trim())
      return "Debes ingresar las 4 notas antes de continuar.";
    const notas = [parseFloat(nota1), parseFloat(nota2), parseFloat(nota3), parseFloat(nota4)];
    if (notas.some(isNaN)) return "Las notas deben ser valores numéricos.";
    if (notas.some((n) => n < 0 || n > 50))
      return "Cada nota debe estar entre 0 y 50.";
    return null;
  }

  async function consultar() {
    const error = validarConsulta();
    if (error) {
      Alert.alert("Datos inválidos", error);
      return;
    }
    setCargando(true);
    setConsultado(false);
    setDefinitivaGenerada(false);
    setDefinitiva("");

    const url = `https://notapp-jekr.onrender.com/estudiante/${cedula}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("No encontrado");
        return res.json();
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
        Alert.alert("Error", "No se encontró ningún estudiante con esa cédula.");
      })
      .finally(() => setCargando(false));
  }

  function generarDefinitiva() {
    const error = validarNotas();
    if (error) {
      Alert.alert("No se puede generar", error);
      return;
    }
    const resultado =
      (parseFloat(nota1) + parseFloat(nota2) + parseFloat(nota3) + parseFloat(nota4)) / 4;
    setDefinitiva(resultado.toFixed(2));
    setDefinitivaGenerada(true);
  }

  async function guardar() {
    const errorNotas = validarNotas();
    if (errorNotas) {
      Alert.alert("Datos inválidos", errorNotas);
      return;
    }
    setGuardando(true);
    const url = "https://notapp-jekr.onrender.com/notas";
    const payload = { cedula, nota1, nota2, nota3, nota4, definitiva };

    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar");
        return res.json();
      })
      .then(() => {
        Alert.alert("¡Guardado!", "Las notas fueron actualizadas correctamente.");
      })
      .catch(() => {
        Alert.alert("Error", "No se pudieron guardar las notas.");
      })
      .finally(() => setGuardando(false));
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de Notas</Text>
      <Text style={styles.subtitle}>Consulta un estudiante por cédula</Text>

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

      {consultado && (
        <Tarjeta>
          <Text style={styles.cardTitle}>{nombre}</Text>
          <Text style={styles.cardSubtitle}>Materia: {materia}</Text>

          <View style={styles.separador} />

          <Text style={styles.etiqueta}>Nota 1 (0–50)</Text>
          <TextInput
            style={styles.inputNota}
            placeholder="0"
            placeholderTextColor="#bbb"
            onChangeText={(val) => { setNota1(val); setDefinitivaGenerada(false); }}
            value={nota1}
            keyboardType="numeric"
          />

          <Text style={styles.etiqueta}>Nota 2 (0–50)</Text>
          <TextInput
            style={styles.inputNota}
            placeholder="0"
            placeholderTextColor="#bbb"
            onChangeText={(val) => { setNota2(val); setDefinitivaGenerada(false); }}
            value={nota2}
            keyboardType="numeric"
          />

          <Text style={styles.etiqueta}>Nota 3 (0–50)</Text>
          <TextInput
            style={styles.inputNota}
            placeholder="0"
            placeholderTextColor="#bbb"
            onChangeText={(val) => { setNota3(val); setDefinitivaGenerada(false); }}
            value={nota3}
            keyboardType="numeric"
          />

          <Text style={styles.etiqueta}>Nota 4 (0–50)</Text>
          <TextInput
            style={styles.inputNota}
            placeholder="0"
            placeholderTextColor="#bbb"
            onChangeText={(val) => { setNota4(val); setDefinitivaGenerada(false); }}
            value={nota4}
            keyboardType="numeric"
          />

          <View style={styles.separador} />

          {definitivaGenerada && (
            <View style={styles.definitivaBox}>
              <Text style={styles.definitivaLabel}>Definitiva:</Text>
              <Text style={styles.definitivaValor}>{definitiva}</Text>
            </View>
          )}

          <View style={styles.botones}>
            <TouchableOpacity style={styles.botonSecundario} onPress={generarDefinitiva}>
              <Text style={styles.botonSecundarioTexto}>Generar definitiva</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botonGuardar} onPress={guardar}>
              {guardando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.botonTexto}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        </Tarjeta>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#f5f7fa",
    flexGrow: 1,
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
  inputNota: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d0d7e2",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    fontSize: 15,
    color: "#222",
  },
  etiqueta: {
    fontSize: 13,
    color: "#555",
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  boton: {
    width: "100%",
    backgroundColor: "#4361ee",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginBottom: 16,
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
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  separador: {
    height: 1,
    backgroundColor: "#eee",
    width: "100%",
    marginVertical: 10,
  },
  definitivaBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eef2ff",
    borderRadius: 10,
    padding: 12,
    width: "100%",
    marginBottom: 12,
  },
  definitivaLabel: {
    fontSize: 15,
    color: "#555",
    marginRight: 8,
  },
  definitivaValor: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4361ee",
  },
  botones: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginTop: 4,
  },
  botonSecundario: {
    flex: 1,
    backgroundColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  botonSecundarioTexto: {
    color: "#334155",
    fontWeight: "bold",
    fontSize: 13,
  },
  botonGuardar: {
    flex: 1,
    backgroundColor: "#22c55e",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
});
