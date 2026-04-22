import { Tabs } from 'expo-router'

export default function TabsLayout(){
    return(
        <Tabs>
            <Tabs.Screen name="index" options={{title: 'Consultar'}} />
            <Tabs.Screen name="registroEstudiante" options={{title: 'Registro Estudiantes'}}/>
            <Tabs.Screen name="registroNota" options={{title: 'Registro Nota'}}/>
        </Tabs>
    )
}