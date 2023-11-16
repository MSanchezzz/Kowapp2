import React, { useEffect, useState } from 'react';
import { Text, View, TouchableHighlight, Alert, Modal, ScrollView, Image  } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Header, createStackNavigator } from 'react-navigation-stack';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import MapView, {Marker} from 'react-native-maps';
import { styles } from './css/styles.js';

/* pantalla de home*/
const HomeScreen = () => {
  const [modalListaVisible, setModalListaVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [modalComenzarVisible, setModalComenzarVisible] = useState(false);
  const [modalBoton, setModalBoton ] = useState(false);
  const [locacion, setLocation] = useState({})
    const buscaLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
            return Alert.alert('Debe de conceder los permisos para la localización')
        }
        const location = await Location.getCurrentPositionAsync({})
        setLocation(location)
    }
    useEffect(() =>{
        buscaLocation()
    })
  return (
    <View style={styles.Drivercontainer}>
      <MapView style={styles.Drivermap}>
        {locacion.coords
          ? <Marker
              coordinate={locacion.coords}
              title="punto1"
              description="Descripcion del punto"/>
              :null
        }
      </MapView>

      {/* Modal para pasar lista */} 
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalListaVisible} 
      >
        <View style={styles.DriverviewModalCenterConductor}>
          <View style={styles.DriverviewModalContentConductor} >
            <ScrollView style={styles.DriverscrollViewConductor}>

              <View>
                <Text style={styles.DriverTituloText} >Orden de ruta</Text>
              </View>

              <View style={styles.DriverListaPasajeros}>
                <Image style={styles.DriverCircularImage} source={require('./assets/rojo.jpg')} />
                <View style={styles.DriverListaPasajerosText}>
                  <Text> Nombre:  </Text>
                  <Text> Dirección:  </Text>
                </View>
              </View>

              <View style={styles.DriverListaPasajeros}>
                <Image style={styles.DriverCircularImage} source={require('./assets/rojo.jpg')} />
                <View style={styles.DriverListaPasajerosText}>
                  <Text> Nombre:  </Text>
                  <Text> Dirección:  </Text>
                </View>
              </View>

              <View style={styles.DriverListaPasajeros}>
                <Image style={styles.DriverCircularImage} source={require('./assets/rojo.jpg')} />
                <View style={styles.DriverListaPasajerosText}>
                  <Text> Nombre:  </Text>
                  <Text> Dirección:  </Text>
                </View>
              </View>

              <View style={styles.DriverListaPasajeros}>
                <Image style={styles.DriverCircularImage} source={require('./assets/rojo.jpg')} />
                <View style={styles.DriverListaPasajerosText}>
                  <Text> Nombre:  </Text>
                  <Text> Dirección:  </Text>
                </View>
              </View>

              <View style={styles.DriverListaPasajeros}>
                <Image style={styles.DriverCircularImage} source={require('./assets/rojo.jpg')} />
                <View style={styles.DriverListaPasajerosText}>
                  <Text> Nombre:  </Text>
                  <Text> Dirección:  </Text>
                </View>
              </View>

              <View style={styles.DriverListaPasajeros}>
                <Image style={styles.DriverCircularImage} source={require('./assets/rojo.jpg')} />
                <View style={styles.DriverListaPasajerosText}>
                  <Text> Nombre:  </Text>
                  <Text> Dirección:  </Text>
                </View>
              </View>

              <TouchableHighlight style={styles.DriverAsistenciaBoton} onPress={() => setModalListaVisible(!modalListaVisible)}>
                <Text style={styles.TutorTextoAsistencia}>Guardar </Text>
              </TouchableHighlight>

            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal para editar la ruta */}


      <Modal
        animationType='slide'
        transparent={false}
        visible={modalEditarVisible} 
      >
        <View style={styles.DriverviewModalCenterConductor}>
          <View style={styles.DriverviewModalContentConductor}>
            <ScrollView style={styles.DriverviewModalScrollConductor}>
              <View>
                <Text style={styles.DriverTituloText}>Orden de ruta</Text>
              </View>

              <View style={styles.DriverListaPasajeros}>
                <Image style={styles.DriverCircularImage} source={require('./assets/rojo.jpg')} />
                <View style={styles.DriverListaPasajerosText}>
                  <Text> Nombre:  </Text>
                  <Text> Dirección:  </Text>
                </View>
              </View>

              <View style={styles.DriverListaPasajeros}>
                <Image style={styles.DriverCircularImage} source={require('./assets/rojo.jpg')} />
                <View style={styles.DriverListaPasajerosText}>
                  <Text> Nombre:  </Text>
                  <Text> Dirección:  </Text>
                </View>
              </View>

              <View style={styles.DriverListaPasajeros}>
                <Image style={styles.DriverCircularImage} source={require('./assets/rojo.jpg')} />
                <View style={styles.DriverListaPasajerosText}>
                  <Text> Nombre:  </Text>
                  <Text> Dirección:  </Text>
                </View>
              </View>

              <View style={styles.DriverListaPasajeros}>
                <Image style={styles.DriverCircularImage} source={require('./assets/rojo.jpg')} />
                <View style={styles.DriverListaPasajerosText}>
                  <Text> Nombre:  </Text>
                  <Text> Dirección:  </Text>
                </View>
              </View>

              <TouchableHighlight style={styles.DriverAsistenciaBoton} onPress={() => setModalEditarVisible(!modalEditarVisible)}>
                <Text style={styles.TutorTextoAsistencia}>Guardar </Text>
              </TouchableHighlight>
            </ScrollView>  
          </View>
        </View>
      </Modal>
      
      {/* Modal temporal, este modal estará hasta que se genere la funcion de comenzar ruta, (despliege de opciones de navegador) */}

      <Modal
        animationType='slide'
        transparent={false}
        visible={modalComenzarVisible} 
      >
        <View style={styles.Drivercontainer}>

          <TouchableHighlight style={styles.DriverAsistenciaBoton} onPress={() => setModalComenzarVisible(!modalComenzarVisible)}>
            <Text style={styles.TutorTextoAsistencia}>Guardar </Text>
          </TouchableHighlight>
        </View>
      </Modal>
      
      {/* modal de opciones conductor */}

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalBoton} 
      >
        <View style={styles.DriverModalViewButton1}>
        </View>
        <View style={styles.DriverModalViewButton2}>
          
          <TouchableHighlight onPress={() => setModalBoton(!modalBoton)}>
            <Image style={styles.DriverimagenBotonModal} source={require('./assets/angulo-hacia-abajo.png')} />
          </TouchableHighlight>

          <View style={styles.DriverContenidoModalViewInfo}>
            <Text style={styles.TutorTextContenidoModalViewInfo}>Confirmados</Text>
            <Text style={styles.TutorTextContenidoModalViewInfo}>Prioridad</Text>
            <Text style={styles.TutorTextContenidoModalViewInfo}>Abordo</Text>
          </View>
          
          <View style={styles.DriverContenidoModalViewButtonInfo}>
            <Text style={styles.TutorTextContenidoModalViewButtonInfo}> texto 1 </Text>
            <Text style={styles.TutorTextContenidoModalViewButtonInfo}> texto 2 </Text>
            <Text style={styles.TutorTextContenidoModalViewButtonInfo}> texto 3 </Text>
          </View>

          <View style={styles.DriverContenidoModalViewButton}>
            <TouchableHighlight style={styles.DriverbotonImagen} onPress={() => setModalComenzarVisible(!modalComenzarVisible)}>
              <Image source={require('./assets/neumatico.png')} />
            </TouchableHighlight>
            
            <TouchableHighlight style={styles.DriverbotonImagen} onPress={() => setModalEditarVisible(!modalEditarVisible)}>
              <Image  source={require('./assets/editar.png')} />
            </TouchableHighlight>

            <TouchableHighlight style={styles.DriverbotonImagen} onPress={() => setModalListaVisible(!modalListaVisible)}>
              <Image source={require('./assets/lista.png')} />
            </TouchableHighlight>
          </View>

          <View style={styles.DriverContenidoModalViewButton}>
            <Text style={styles.DrivertextoModalOpciones}>Comenzar Ruta</Text>
            <Text style={styles.DrivertextoModalOpciones}>Editar Ruta</Text>
            <Text style={styles.DrivertextoModalOpciones}>Pasar Lista</Text>
          </View>
        </View>
      </Modal>

      <View style={styles.DriverviewOpciones}>
        <TouchableHighlight onPress={() => setModalBoton(!modalBoton)}>
          <Image style={styles.DriverimagenBoton} source={require('./assets/angulo-hacia-arriba.png')} />
        </TouchableHighlight>
      </View>
      
    </View>
  );
}

HomeScreen.navigationOptions = ({ navigation }) => {
  return {
    headerRight: (
      <TouchableHighlight onPress={() => navigation.push('Detalle')} >
        <Image source={require('./assets/ajustes.png')} />
      </TouchableHighlight>
    ),
  }
}

{/* pantalla de detalle */}
const DetalleOpciones = ({navigation}) => {
  return(
    <View style={styles.DriverContainer}>

      <View style={styles.TutorPerfil}>
        <Image style={styles.TutorCircularImage} source={require('./assets/rojo.jpg')} />
      </View>

      <View style={styles.TutorInfoCuenta}>
        <Text style={styles.TutorTextoInfoCuenta}>Pupilos</Text>
        <Text style={styles.TutorTextoInfoCuenta}>Calificación</Text>
        <Text style={styles.TutorTextoInfoCuenta}>Cuenta</Text>
      </View>

      <View style={styles.TutorInfoContacto}>
        <Text style={styles.TutorInfoContacto}>Recidencia: </Text>
        <Text style={styles.TutorInfoContacto}>Escuela: </Text>
        <Text style={styles.TutorInfoContacto}>Contacto: </Text>
        <Text style={styles.TutorInfoContacto}>Numero de emergencia: </Text>
      </View>

      <View style={styles.TutorInfoBonton}>
        
        <TouchableHighlight style={styles.TutorBoton} onPress={() => navigation.push('Tutor')}>
          <Text style={styles.TutorTextoBoton}>Enlace a tutor</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.TutorBoton} onPress={() => navigation.push('Escuela')}>
          <Text style={styles.TutorTextoBoton}>Enlace a escuelas </Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.TutorBoton} onPress={() => navigation.push('Registro')}>
          <Text style={styles.TutorTextoBoton}>Registro de viajes </Text>
        </TouchableHighlight>

      </View>
    </View>
  );
}

{/* opciones para cargar el titulo, se pueden pasar distintos tipos de datos */}
DetalleOpciones.navigationOptions = () => {
  return{
    title: 'Opciones'
  }
}

const Enlacetutor = ({navigation}) => {
  return(
    <View style={styles.Drivercontainer}>
      <Text> pantalla de conductores </Text>
    </View>
  );
}

{/* opciones para cargar el titulo, se pueden pasar distintos tipos de datos */}
Enlacetutor.navigationOptions = () => {
  return{
    title: 'Conductores'
  }
}

{/* pantalla de registro de escuelas */}

const EnlaceEscuela = ({navigation}) => {
  return(
    <View style={styles.Drivercontainer}>
      <Text> pantalla de enlace escuela </Text>
    </View>
  );
}

{/* opciones para cargar el titulo, se pueden pasar distintos tipos de datos */}
EnlaceEscuela.navigationOptions = () => {
  return{
    title: 'Escuelas'
  }
}

{/* pantalla de Registro de viaje */}

const EnlaceRegistro = ({navigation}) => {
  return(
    <View style={styles.Drivercontainer}>
      <Text> pantalla de registro de viajes </Text>
    </View>
  );
}

{/* opciones para cargar el titulo, se pueden pasar distintos tipos de datos */}
EnlaceRegistro.navigationOptions = () => {
  return{
    title: 'Registro de viajes'
  }
}

{/* definición de navigator para la navegación se definen las paginas para navegar */}
const AppNavigator = createStackNavigator({
  Home: {
    screen :HomeScreen,
  },
  Detalle: {
    screen: DetalleOpciones,
  },
  Tutor: {
    screen: Enlacetutor,
  },
  Escuela: {
    screen: EnlaceEscuela,
  },
  Registro: {
    screen: EnlaceRegistro,
  }
}, { initialRouteName: "Home",
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor:'#FFA300' //color del fondo
    },
  }
})

export default createAppContainer(AppNavigator)