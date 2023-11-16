import React, {useState} from 'react';
import { Text, View, TouchableHighlight, ImageBackground, Image, Modal} from 'react-native';
import { styles } from './css/styles.js';

export default function App() {
  const [modalRolVisible, setModalRolVisible] = useState(false);
  return (
    <View style={styles.Rolescontainer}>
      <ImageBackground style={styles.RolesImagenFondo} source={require('./assets/fondoLogin.jpg')}>
        
{/*Seccion visualización de los titulos y logo */}

        <View style={styles.RolesViewInformacion}>
          <Text style={styles.RolesTituloContainer1}>
            ¡Gracias!
          </Text>
          <Text style={styles.RolesTituloContainer2}>
            Ya eres parte de
          </Text>
          <Text style={styles.RolesTituloContainer2}>
            KoWapp
          </Text>
          <View>
            <Image style={styles.RolesImagenLogo} source={require('./assets/kowappLogo.png')}/>
          </View>
          <Text style={styles.RolesInfoContainer}>
            Cuentanos
            ¿Cual es tu rol?
          </Text>
        </View>
        
        
{/*Seccion de modal, donde se visualiza la inofrmación de los roles */}

        <Modal
          animationType='slide'
          transparent={false}
          visible={modalRolVisible}
          >
          <ImageBackground style={styles.RolesImagenFondo} source={require('./assets/fondoLogin.jpg')}>
            <View style={styles.RolesViewModal1}>
              <Image style={styles.RolesLogo}  source={require('./assets/kowappLogo.png')}/>
              <Text style={styles.RolesTitulo}>Información</Text>
              <Image source={require('./assets/mano-sosteniendo-corazon.png')}/>  
            </View>
            <View style={styles.RolesViewModal2}>
              <Image source={require('./assets/volante.png')}/>
              <Text style={styles.RolesInformacion}>
                  Conductor es el encargado de la seguridad del trayecto de nuestros hijos/as de la casa a la escuela y a su regreso. 
                  Por lo anterior, es necesario tener en cuenta una serie de normas y recomendaciones vigentes a fin de tener un viaje 
                  seguro y sin riesgos.
              </Text>
            </View>
            <View style={styles.RolesViewModal3}>
              <Image source={require('./assets/siguiendo.png')}/>
              <Text style={styles.RolesInformacion}>
                Se denomina Apoderado titular al padre, madre o tutor legal del estudiante que vive en la misma vivienda que su pupilo 
                y/o que tiene un contacto diario o sistemático con el mismo.
              </Text>
            </View>
            <TouchableHighlight style={styles.RolesBotonCerrar} onPress={() => setModalRolVisible(!modalRolVisible)}>
              <Image style={styles.RolesImagenCerrar} source={require('./assets/iconoCerrar.png')}/>
            </TouchableHighlight>
          </ImageBackground>
        </Modal>

{/*Seccion de botones conductor y apoderado */}

        <View style={styles.RolesViewBotones}>
          <TouchableHighlight style={styles.RolesBotton} onPress={() => setModalRolVisible(!modalRolVisible)}>
            <Text style={styles.RolesLetraBoton}>Conductor </Text>
            {/* <Image source={require('C:/Users/patri/OneDrive/Escritorio/Proyectos/KoWapp/assets/volante.png')}/> */}
          </TouchableHighlight>
          <TouchableHighlight style={styles.RolesBotton} onPress={() => setModalRolVisible(!modalRolVisible)}>
            <Text style={styles.RolesLetraBoton}>Apoderado </Text>
          </TouchableHighlight>
        </View>

{/*Seccion consulta roles, boton que abre el modal inofrmativo */}

        <View style={styles.RolesViewRoles}>
          <Text> Roles </Text>
          <TouchableHighlight onPress={() => setModalRolVisible(!modalRolVisible)}>
            <Image source={require('./assets/interrogatorio.png')}/>
          </TouchableHighlight>
        </View>
      </ImageBackground>
    </View>
  );
}