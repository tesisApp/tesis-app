import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { FormControl, Input, VStack, Button, Text } from "native-base"
import { useNavigation } from '@react-navigation/native'
import MapView from 'react-native-maps'
import { Marker } from 'react-native-maps'
import { FIRESTORE_AUTH,FIRESTORE_DB } from '../../utils/firebase.config'
import { collection, query, getDocs, where, updateDoc, doc } from 'firebase/firestore'
import * as Location from 'expo-location'

const FormCoordinates = () => {
    
    const [latitude, setLatitude]=useState(0)
    const [longitude, setLongitude]=useState(0)
    const [address, setAddress]=useState('')
    const [radius, setRadius]=useState('')
    const [disabled, setDisabled]=useState('')
    const [docId, setDocId]=useState('')
    const [coords, setCoords]=useState({
        latitude: 0,
        longitude: 0
    })

    const [isCoordinate, setIsCoordinate]= useState(false)
    const [newCoordinate, setNewCoordinate]=useState(false)
    const navigation=useNavigation()

    useEffect(() => {
        setDisabled(true)
        const userCurrent = FIRESTORE_AUTH.currentUser
        const docRef = collection(FIRESTORE_DB, 'usuario')
        const q = query(docRef, where('uid', '==', userCurrent.uid))
        const loadData = async () => {
            (await getDocs(q)).
                forEach( async(doc) => {
                    setDocId(doc.id)
                    setLatitude(doc.data().latitude)
                    setLongitude(doc.data().longitude)
                    setRadius(String(doc.data().radius))
                    let { status } = await Location.requestForegroundPermissionsAsync();
                    if (status !== 'granted') {
                        setErrorMsg('Permission to access location was denied')
                        return
                    }
                
                    if ( doc.data().latitude != '' && doc.data().longitude != '' ) {
                        setIsCoordinate(true)
                        const position = {
                            latitude: doc.data().latitude,
                            longitude: doc.data().longitude
                        }

                        const address = await Location.reverseGeocodeAsync(position)
                        
                        setCoords({
                            latitude: doc.data().latitude,
                            longitude: doc.data().longitude
                        })
                        setAddress(`${address[0].street} ${address[0].streetNumber}`)
                    } else {
                        setIsCoordinate(false)
                        setAddress('')
                    }
                })
            }
        
        loadData()
    },[address])

    const saveCoordinates=async (e) => {
        setNewCoordinate(true)
        setIsCoordinate(true)
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied')
            return
        }
        const latitude = e.latitude
        const longitude = e.longitude
       // await Geocoder.fallbackToGoogle('AIzaSyBh2Dr2Xa8GTer63zisBBs1k0rxjExhiDI')
 
        const position = {
            latitude: latitude,
            longitude: longitude
        }
        setCoords(position)

        const address = await Location.reverseGeocodeAsync(position)
        setAddress(`${address[0].street} ${address[0].streetNumber}`)

        const docRef = doc(FIRESTORE_DB, 'usuario', docId)
        await updateDoc(docRef, {
            latitude: latitude,
            longitude: longitude
        })
    }

    const save= async() => {
        const docRef = doc(FIRESTORE_DB, 'usuario', docId)
        await updateDoc(docRef, {
            latitude: latitude,
            longitude: longitude,
            radius: Number(radius)
        }).finally(() => {
            navigation.navigate('Welcome')
        })
    }
    return(
        <View style={styles.contenedor}>
            <View style={{ marginVertical: 40 }}>
                <VStack>
                    <View style={{ paddingHorizontal: 20 }}>
                        <FormControl style={{ marginTop: 0 }}>
                            <FormControl.Label>Radio de seguridad (metros)</FormControl.Label>
                            <Input onChangeText={value => setRadius(value)} value={radius}/>
                        </FormControl>
                        <FormControl style={{ marginTop: 20 }}>
                            <FormControl.Label>Dirección</FormControl.Label>
                            <Input value={address} isDisabled/>
                        </FormControl>
                    </View>
                    
                    
                    <View style={{height:250, marginTop: 10}}>
                        <MapView 
                            onPress={(e) => saveCoordinates(e.nativeEvent.coordinate)}
                            style={styles.map}>
                            {
                                isCoordinate === true ? <Marker  coordinate={coords}></Marker> : <></>
                            }
                            {/* <Marker coordinate={coords}></Marker> */}
                        </MapView>
                    </View>
                    <View  style={{marginBottom:20, padding: 10, marginTop: 70}}>
                        {
                            radius.length > 0 ? 
                            <Button 
                                
                                style={styles.boton}
                                onPress={() => save()}  
                            >
                                <Text style={styles.botonTexto}>Guardar</Text>
                            </Button>

                            :

                            <Button 
                                
                                style={styles.botonDisabled}
                                disabled
                            >
                                <Text style={styles.botonTexto}>Guardar</Text>
                            </Button>
                        }                     
                    </View>
                </VStack>
            </View>
        </View>
    )
}
const styles=StyleSheet.create({

    contenedor:{
        flex:1
    },
    boton:{
        backgroundColor:'#8854d0',
    },
    botonDisabled:{
        backgroundColor:'#8854d0',
        opacity: 1
    },
    botonTexto:{
        fontWeight:'bold',
        color:'#fff',
        fontSize:15,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        marginTop:15,
        flex: 1
      },
})
export default FormCoordinates