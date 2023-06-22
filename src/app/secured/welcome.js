import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from 'native-base'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { FIRESTORE_AUTH,FIRESTORE_DB } from '../../utils/firebase.config'
import { collection, query, getDocs, where } from 'firebase/firestore'

const Welcome=()=>{
    const navigation = useNavigation()
    const [isCoordinate, setIsCoordinate]= useState(false)
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const isFocused = useIsFocused()

    useEffect(() => {
        console.log('welcome')
        const userCurrent = FIRESTORE_AUTH.currentUser
        if (userCurrent) {
            const docRef = collection(FIRESTORE_DB, 'usuario')
            const q = query(docRef, where('uid', '==', userCurrent?.uid))
            const loadData = async () => {
                (await getDocs(q)).forEach((doc) => {
                    setLatitude(doc.data().latitude)
                    setLongitude(doc.data().longitude)
                    setIsCoordinate( doc.data().latitude != '' && doc.data().longitude != '' ? true : false)
                })
            }
            loadData()
        }
        console.log(userCurrent)
        
    },[isFocused])

    const goMaps = () => {
        console.log('gomaps')
        navigation.navigate('Maps', {
            lat: latitude,
            lng: longitude
        })
    }

    const goAddress = () => {
        navigation.navigate('FormCoordinates')
    }
    return(
        <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
            <View style={{width:'70%'}}>
                <Button 
                    block
                    style={styles.button}
                    onPress={() => goMaps()}
                    disabled={!isCoordinate}
                >
                    <Text style={styles.textButton}>Ver Mapa</Text>
                </Button>
            </View>
            <View style={{marginTop: 10, width: '70%'}}>
                <Button 
                    block
                    style={styles.button}
                    onPress={() => goAddress()}
                >
                    <Text style={styles.textButton}>Establecer dirección</Text>
                </Button>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    button: {
        marginTop: 15,
        alignItems: 'center',
        backgroundColor: 'black',
    },
    textButton: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 15,
    },
  })
export default Welcome