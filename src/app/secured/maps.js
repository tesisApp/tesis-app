import React, { useEffect, useState, useRef } from 'react'
import MapView, { Circle } from 'react-native-maps'
import { Marker } from 'react-native-maps'
import {PROVIDER_GOOGLE} from 'react-native-maps'

import { StyleSheet, Text, View, Dimensions, Button, Image } from 'react-native'
import * as geolib from 'geolib'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import Device from 'expo-device'
import { getDatabase, ref, get, onValue } from 'firebase/database'
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  })
})

// const markerImg = require('../../utils/images/person.png')
const Maps =({route,navigation})=>{
    var insideRadius
    var token
    const [expoPushToken, setExpoPushToken] = useState('')
    const [latitude, setLatitude] = useState('-24.769655724033015')
    const [longitude, setLongitude] = useState('-65.42598817526446')
    const [coords, setCoords]=useState({
        latitude: 0,
        longitude: 0
    })

    //const[map, setMap] = useState()
    const [notification, setNotification] = useState(false)
    const notificationListener = useRef()
    const responseListener = useRef()

    // const getData= async (lat,lng)=> {
    //     const db = getDatabase()
    //     await get(ref(db, 'location/')).then((snapshot) => {
    //         console.log('SNAPSHOT', snapshot.val().latitude, '-', snapshot.val().longitude)
    //         setLatitude(snapshot.val().latitude)
    //         setLongitude(snapshot.val().longitude)
    //         const coordinates = {
    //             latitude: snapshot.val().latitude,
    //             longitude: snapshot.val().longitude
    //         }
           
    //         setCoords({
    //             latitude: lat,
    //             longitude: lng
    //         })

    //         const centerPoint = {
    //             latitude: lat,
    //             longitude: lng
    //         }
    //         insideRadius = geolib.isPointWithinRadius(coordinates, centerPoint, 200)

    //         // if ( !insideRadius) {
    //         //     sendMessage(expoPushToken)
    //         //     console.log('fuera de rango')
    //         // }    
    //     })
    // }

    useEffect(()=>{
        notificacion()
       
        const db = getDatabase()
        const query = ref(db, 'location')

        return onValue(query, (snapshot) => {
            setLatitude(snapshot.val().latitude)
            setLongitude(snapshot.val().longitude)
            console.log("snapshot", snapshot)
            const coordinates = {
                latitude: snapshot.val().latitude,
                longitude: snapshot.val().longitude
            }

            setCoords({
                latitude: route.params.lat,
                longitude: route.params.lng
            })

            const centerPoint = {
                latitude: route.params.lat,
                longitude: route.params.lng
            }
            insideRadius = geolib.isPointWithinRadius(coordinates, centerPoint, route.params.radius)
            if ( !insideRadius) {
                console.log("fuera de rango")
                sendMessage(expoPushToken)
            }    
        })
    },[expoPushToken])

    const notificacion = () => {
        //push notification
        registerForPushNotificationsAsync().then(token => {
            setExpoPushToken(token)
            console.log('token',token)
            token = token
        })

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification)
        })

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response)
        })

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current)
            Notifications.removeNotificationSubscription(responseListener.current)
        }
    }

    async function registerForPushNotificationsAsync() {
        let token
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync()
            let finalStatus = existingStatus
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync()
                finalStatus = status
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!')
                return
            }
            token = (await Notifications.getExpoPushTokenAsync()).data
        } else {
            alert('Must use physical device for Push Notifications')
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            })
        }

        return token
    }
    const sendMessage = (token) => {
        fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip,deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: token,
                title: 'Atención',
                body: 'El paciente ha salido de su zona segura',
                data: { data: 'goes here'},
                _displayInForeground: true,
            })
        })
    }

  return(
    <>
        <View style={styles.container}>
            <MapView 
                    provider={PROVIDER_GOOGLE}
                    onPress={(e) => console.log(e.nativeEvent.coordinate)}
                    style={styles.map}
                    region={{latitude: Number(route.params.lat), longitude: Number(route.params.lng), latitudeDelta: 0.0922, longitudeDelta: 0.0421}}
                    >
                <Marker
                    coordinate={coords}
                ></Marker>
                <Marker
                    coordinate={{latitude: Number(latitude), longitude: Number(longitude)}}
                    // icon={require('../../utils/images/person.png')}
                >

                    {/* <Image
                    source={markerImg}
                    style={{height: 35, width: 35}}
                    >

                    </Image> */}
                </Marker>
                <Circle
                    center={coords}
                    radius={route.params.radius}
                    fillColor={'rgba(100,100,200,0.3)'}
                ></Circle>
            </MapView>
        </View>
    </>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        //marginTop: 100
    }
})
export default Maps