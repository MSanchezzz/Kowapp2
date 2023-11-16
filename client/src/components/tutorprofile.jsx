import { styles } from '../app/style/styles.css';
import React, { useEffect, useState } from 'react';
import { Text, View, TouchableHighlight, Alert, Modal, Image  } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Header, createStackNavigator } from 'react-navigation-stack';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import MapView, {Marker} from 'react-native-maps';


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
  {/*Funcion para confirmar envio de mensaje */}
  const validarNotificacion = () =>{
    Alert.alert('¿ Desea enviar la notificación al conductor ?','',[
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancelado'),
        style: 'cancel',
      },
      {text: 'Aceptar', onPress: () => console.log('Mensaje enviado')},
    ]);
  }

  return (
    <View style={styles.TutorContainer}>
      <MapView style={styles.TutorMap}>
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
        transparent={false}
        visible={modalListaVisible} 
      >
        <View style={styles.TutorViewModalCenter}>
          <View style={styles.TutorViewModalContent} >

            <View style={styles.TutorViewTitulo}>
              <Text style={styles.TutorTextTitulo}>Notificaciónes rápidas</Text>
            </View>

            <View style={styles.TutorViewNotificaciones}>
              <TouchableHighlight 
                style={styles.TutorNotificacionBoton}
                onPress={validarNotificacion} 
              >
                <Text>¡ Hola ! Ya estamos listos y esperando </Text>

              </TouchableHighlight>
              <TouchableHighlight
                style={styles.TutorNotificacionBoton}
                onPress={validarNotificacion}
              >
                <Text> Perdón, surgio algo... danos 1 minuto porfavor </Text>

              </TouchableHighlight>
              <TouchableHighlight 
                style={styles.TutorNotificacionBoton}
                onPress={validarNotificacion}
              >
                <Text> Ten cuidado, hay un accidente cercano al punto </Text>

              </TouchableHighlight>
            </View>

            <View style={styles.TutorViewBotonCancelar}>
              <TouchableHighlight
                onPress={() => setModalListaVisible(!modalListaVisible)}
                style={styles.TutorAsistenciaBoton}
              >
                <Text style={styles.TutorTextoAsistencia}> Cancelar</Text>
              </TouchableHighlight>
            </View>

          </View>
        </View>
      </Modal>

      {/* Modal para editar la ruta */}


      <Modal
        animationType='slide'
        transparent={true}
        visible={modalEditarVisible} 
      >
        <View style={styles.TutorViewModalCenter}>
          <View style={styles.TutorViewModalContent}>
            <Text style={styles.TutorTextTitulo}>Confirmar asistencia</Text>

            <Text style={styles.TutorTextInfo} >Confirmar asistencia Confirma asistencia del pupilo para el día</Text>
          
          </View>
          <View style={styles.TutorViewModalContentPupilo}>
            <Image style={styles.TutorCircularImagePupilo} source={require('./assets/rojo.jpg')} />
          </View>
          <View style={styles.TutorViewModalContentBoton}>
            <TouchableHighlight style={styles.TutorAsistenciaBoton} onPress={() => setModalEditarVisible(!modalEditarVisible)}>
              <Text style={styles.TutorTextoAsistencia}>Guardar </Text>
            </TouchableHighlight>

          </View>
        </View>
      </Modal>
      
      {/* Modal temporal, este modal estará hasta que se genere la funcion de comenzar ruta, (despliege de opciones de navegador) */}

      <Modal
        animationType='slide'
        transparent={false}
        visible={modalComenzarVisible} 
      >
        <View style={styles.TutorViewModalCenter}>
          <View style={styles.TutorViewModalContent} >

          </View>

          <View style={styles.TutorViewModalContentBoton2}>
            <TouchableHighlight style={styles.TutorAsistenciaBoton} onPress={() => setModalComenzarVisible(!modalComenzarVisible)}>
              <Text style={styles.TutorTextoAsistencia}>Guardar </Text>
            </TouchableHighlight>

          </View>
        </View>
          
      </Modal>
      
      {/* modal de opciones conductor */}

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalBoton} 
      >
        <View style={styles.TutorModalViewButton1}>
        </View>
        <View style={styles.TutorModalViewButton2}>
          
          <TouchableHighlight onPress={() => setModalBoton(!modalBoton)}>
            <Image style={styles.TutorImagenBotonModal} source={require('./assets/angulo-hacia-abajo.png')} />
          </TouchableHighlight>
          <View style={styles.TutorContenidoModalViewButton}>
            <Text style={styles.TutorTextContenidoModalViewButtonInfo}> nombre de usuario </Text>
          </View>
          
          <View style={styles.TutorContenidoModalViewButton}>
            <Image style={styles.TutorCircularImage} source={require('./assets/rojo.jpg')} />
          </View>

          <View style={styles.TutorContenidoModalViewButtonInfo}>
            <Text style={styles.TutorTextContenidoModalViewButtonInfo}> texto 1 </Text>
            <Text style={styles.TutorTextContenidoModalViewButtonInfo}> texto 2 </Text>
            <Text style={styles.TutorTextContenidoModalViewButtonInfo}> texto 3 </Text>
          </View>


          <View style={styles.TutorContenidoModalViewButton}>
            <Text style={styles.TutorTextoModalOpciones}>Seguimiento</Text>
            <Text style={styles.TutorTextoModalOpciones}>Asistencia</Text>
            <Text style={styles.TutorTextoModalOpciones}>Notificaciones</Text>
          </View>

          <View style={styles.TutorContenidoModalViewButton}>
            <TouchableHighlight style={styles.TutorBotonImagen} onPress={() => setModalComenzarVisible(!modalComenzarVisible)}>
              <Image source={require('./assets/busqueda.png')} />
            </TouchableHighlight>
            
            <TouchableHighlight style={styles.TutorBotonImagen} onPress={() => setModalEditarVisible(!modalEditarVisible)}>
              <Image  source={require('./assets/mochila.png')} />
            </TouchableHighlight>

            <TouchableHighlight style={styles.TutorBotonImagen} onPress={() => setModalListaVisible(!modalListaVisible)}>
              <Image source={require('./assets/puntos-de-comentario.png')} />
            </TouchableHighlight>
          </View>

        </View>
      </Modal>

      <View style={styles.TutorViewOpciones}>
        <TouchableHighlight onPress={() => setModalBoton(!modalBoton)}>
          <Image style={styles.TutorImagenBoton} source={require('./assets/angulo-hacia-arriba.png')} />
        </TouchableHighlight>
      </View>
      
    </View>
  );
}

HomeScreen.navigationOptions = ({ navigation }) => {
  return {
    headerRight: (
      <TouchableHighlight onPress={() => navigation.push('Option')} >
        <Image source={require('./assets/ajustes.png')} />
      </TouchableHighlight>
    ),
  }
}

{/* pantalla de detalle */}
const OptionScreen = ({ navigation }) => {
  return(
    <View style={styles.TutorContainer}>
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
        
        <TouchableHighlight style={styles.TutorBoton} onPress={() => navigation.push('Disponibles')}>
          <Text style={styles.TutorTextoBoton}>Enlace a conductor</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.TutorBoton} onPress={() => navigation.push('Registros')}>
          <Text style={styles.TutorTextoBoton}>Registro de viajes</Text>
        </TouchableHighlight>

      </View>
    </View>
  );
}

{/* opciones para cargar el titulo, se pueden pasar distintos tipos de datos */}
OptionScreen.navigationOptions = () => {
  return{
    title: 'Perfil'
  }
}

{/* Pantalla de Conductores disponibles */}
const ConductoresDisponibles = () => {
  {/* Funcion para confirmar envio de solicitud*/}

  const validarConductor = () =>{
    Alert.alert('¿ Desea añadir conductor a contactos ?','',[
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancelado'),
        style: 'cancel',
      },
      {text: 'Aceptar', onPress: () => console.log('Mensaje enviado')},
    ]);
  }

  return(
    <View style={styles.TutorViewModalCenter} >
      <View style={styles.TutorViewModalContent} >
        <View style={styles.TutorViewConductoresDisponibles}>
              {/* <Image style={styles.TutorCircularImage} source={require('./assets/rojo.jpg')} /> */}
          <TouchableHighlight 
            style={styles.TutorCondutorBoton}
            onPress={validarConductor}
          >
            <Text> Conductor numero 1 </Text>
          
          </TouchableHighlight>
          <TouchableHighlight 
            style={styles.TutorCondutorBoton}
            onPress={validarConductor}
          >
            <Text> Conductor numero 2 </Text>

          </TouchableHighlight>
          <TouchableHighlight 
            style={styles.TutorCondutorBoton}
            onPress={validarConductor}
          >
            <Text> Conductor numero 3 </Text>

          </TouchableHighlight>
        </View>
      </View>
    </View>

  );
}

{/*Opciones de titulo para conductores disponibles */}
ConductoresDisponibles.navigationOptions = () => {
  return{
    title:'Conductores disponibles'
  }
}


{/* Pantalla de Conductores disponibles */}
const RegistroConductores = () => {
  return(
    <View style={styles.TutorContainer}>
      <Text>Registro conductores</Text>

    </View>
  );
}

{/*Opciones de titulo para conductores disponibles */}
RegistroConductores.navigationOptions = () => {
  return{
    title:'Registro conductores'
  }
}

{/* definición de navigator para la navegación se definen las paginas para navegar */}
const AppNavigator = createStackNavigator({
  Home: {
    screen :HomeScreen,
  },
  Option: {
    screen: OptionScreen,
  },
  Disponibles: {
    screen: ConductoresDisponibles,
  },
  Registros: {
    screen: RegistroConductores,
  },


}, { initialRouteName: "Home",
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor:'#25356D' //color del fondo
    },
  }
})

export default createAppContainer(AppNavigator)
