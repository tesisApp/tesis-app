import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Image} from 'react-native'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import { Icon, Button } from 'native-base'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { signOut } from 'firebase/auth'
import { FIRESTORE_AUTH, FIRESTORE_DB } from '../../utils/firebase.config'
import { collection, query, getDocs, where } from 'firebase/firestore'

const DrawerContent=(props)=>{
 
  //console.log(props)
    const {navigation} = props
    const [user, setUser] = useState('')
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [radius, setRadius] = useState(null)

    const isFocused = useIsFocused()

    //const navigation=useNavigation()
  //context
  //const {usuario,guardarUsuario}=useContext(PedidoContext)
  //const {email}=usuario.email
  //STATE USER
  //const [user,guardarUser]=useState(null)
  //autenticacion
  // useEffect(()=>{
  //     guardarUser(usuario)
  // //     // firebase.auth().onAuthStateChanged((response)=>{
  // //     // //guardarUser(response)
  // //     // //guardarUser(response)
  // //     // //console.log(user.email)
  // //     // })
      
  // },[usuario])
  //if (user ===  undefined) return null
  //console.log(user.email)


  //cerrar sesion del usuario y volver a screen de login

    useEffect(() => {
        const userCurrent = FIRESTORE_AUTH.currentUser
        setUser(userCurrent)
        const docRef = collection(FIRESTORE_DB, 'usuario')
        const q = query(docRef, where('uid', '==', userCurrent.uid))
        const loadData = async () => {
            (await getDocs(q)).
                forEach( async(doc) => {
                    setLatitude(doc.data().latitude)
                    setLongitude(doc.data().longitude)
                    setRadius(doc.data().radius)
                })
        }
        loadData()
    },[])

    const salirApp = () => {
        signOut(FIRESTORE_AUTH).then(() => {
            navigation.navigate('Login')
        })
    }

    return(
        <View style={{flex:1, backgroundColor:'#8854d0'}}>
            <View style={styles.contenedorImage}>
                <Text style={styles.textImage}>ALZHEIMER APP</Text>
                <Image resizeMode='contain' source={require('../../utils/images/logo2.png')} style={{width:200,height:100}}/>
                <Text style={styles.textEmail}>{user?.email}</Text>
            </View>
            <View style={styles.contenedorDrawer}>
                <DrawerContentScrollView style={{marginHorizontal:'5%',marginTop:7}}>
                <View style={styles.opcionDrawer}>
                    <Icon name='person-outline' style={styles.icon} />
                    <Text style={styles.textDrawer} onPress={()=> navigation.navigate('Profile')}>Perfil</Text>
                </View>
                <View style={styles.opcionDrawer}>
                    <Icon name='location' style={styles.icon} />
                    <Text style={styles.textDrawer} onPress={()=> navigation.navigate('Maps', { lat: latitude, lng: longitude, radius: radius })}>
                        Mapa
                    </Text>
                </View>
                </DrawerContentScrollView>
                <View style={{marginLeft:200}}>
                    <Button
                        variant="unstyled"
                        onPress={()=>salirApp()}
                    >
                        <Text style={{color:'#000',fontSize:15,fontWeight:'bold'}}>Salir</Text>
                    </Button>  
                </View>
            </View>
        </View>
    )
}
const styles=StyleSheet.create({
    contenedorDrawer:{
        width: '100%',
        flex:1,
        justifyContent:'space-between',
        backgroundColor:'#fff',
        borderBottomColor:'#000',
        borderBottomWidth:4   
    },
    contenedorImage:{
        //justifyContent:'center',
        paddingTop:20,
        alignItems:'center',
        width:'100%',
        height:'30%',
        backgroundColor:'#8854d0',
        borderBottomColor:'black',
        borderBottomWidth:4.,
        marginTop: 35
    },
    textImage:{
        color:'#fff',
        fontWeight:'bold',
        //marginTop:10,
        fontSize:18,
        marginBottom:10
    },
    textEmail:{
        color:'#fff',
        fontSize:15,
        marginTop:5,
        fontWeight:'bold'
    },
    textDrawer:{
        color:'#000',
        //fontWeight:'bold',
        marginLeft:10,
        fontSize:16
    },
    opcionDrawer:{
        flexDirection:'row',
        alignItems:'center',
        marginVertical:5
    },
    icon:{
        color:'#000',
        fontSize:22
    }

})
export default DrawerContent