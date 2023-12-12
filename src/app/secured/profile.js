import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { FormControl, Input, Box, Center, VStack, Button, Heading } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { FIRESTORE_AUTH,FIRESTORE_DB } from '../../utils/firebase.config'
import { collection, query, getDocs, where, updateDoc, doc } from 'firebase/firestore'
import { updateEmail } from 'firebase/auth'
import { validateEmail } from '../../utils/validations'

const Profile = () => {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [docId, setDocId] = useState('')
    const [firstNameError, setFirstNameError] = useState()
    const [lastNameError, setLastNameError] = useState()
    const [emailError, setEmailError] = useState()

    const navigation = useNavigation()

    useEffect(() => {
        const userCurrent = FIRESTORE_AUTH.currentUser
        const docRef = collection(FIRESTORE_DB, 'usuario')
        const q = query(docRef, where('uid', '==', userCurrent.uid))
        const loadData = async () => {
            (await getDocs(q)).
                forEach( async(doc) => {
                    setDocId(doc.id)
                    setFirstName(doc.data().firstName)
                    setLastName(doc.data().lastName)
                    setEmail(doc.data().email)
                })
        }
        loadData()
    },[])

    const validateFirstName = () => {
        setFirstNameError('')
        if (firstName === undefined || firstName === '') {
            setFirstNameError('Campo obligatorio')
            return false
        }

        return true
    }
    const validateLastName = () => {
        setLastNameError('')
        if (lastName === undefined || lastName === '') {
            setLastNameError('Campo obligatorio')
            return false
        }

        return true
    }
    const validateEmails = () => {
        setEmailError('')
        if (email === undefined || email === '') {
            setEmailError('Campo obligatorio')
            return false
        }
        if (!validateEmail(email) && email !== '') {
            setEmailError('Formato de correo inválido')
            return false
        }

        return true
    }

    const updateProfile = async() => {
        const validFirstName = validateFirstName()
        const validLastName = validateLastName()
        const validEmail = validateEmails()
        if ( validFirstName && validLastName && validEmail ) {
            const docRef = doc(FIRESTORE_DB, 'usuario', docId)
            
            await updateEmail(FIRESTORE_AUTH.currentUser, email).then(async() => {
                await updateDoc(docRef, {
                    firstName: firstName,
                    lastName: lastName,
                    email: email
                }).finally(() => {
                    navigation.navigate('Welcome')
                })
            }).catch((error) => console.log('error', error))
        }
    }

    return(
        <View style={styles.contenedor}>
            <View style={{marginTop:50}}>
                <Center w="100%">
                    <Box safeArea p="2" py="2" w="90%" maxW="290">
                            <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{ color: "warmGray.50" }}>
                                Datos de la cuenta
                            </Heading>
                        <VStack space={3} mt="5">
                            <FormControl isRequired isInvalid={firstNameError}>
                                <FormControl.Label>Nombre</FormControl.Label>
                                <Input value={firstName} onChangeText={(value) => setFirstName(value)} />
                                {firstNameError ? 
                                    <FormControl.ErrorMessage>{ firstNameError }</FormControl.ErrorMessage> : ''
                                }
                            </FormControl>
                            <FormControl isRequired isInvalid={lastNameError}>
                                <FormControl.Label>Apellido</FormControl.Label>
                                <Input value={lastName} onChangeText={(value) => setLastName(value)}/>
                                {lastNameError ? 
                                    <FormControl.ErrorMessage>{ lastNameError }</FormControl.ErrorMessage> : ''
                                }
                            </FormControl>
                            <FormControl isRequired isInvalid={emailError}>
                                <FormControl.Label>Correo Electrónico</FormControl.Label>
                                <Input value={email} onChangeText={(value) => setEmail(value)} keyboardType='email-address' />
                                {emailError ? 
                                    <FormControl.ErrorMessage>{ emailError }</FormControl.ErrorMessage> : ''
                                }
                            </FormControl>                       
                            <Button mt="10" backgroundColor={'#8854d0'} onPress={() => updateProfile()}>
                                Editar
                            </Button>
                        </VStack>
                    </Box>
                </Center>
            </View>
        </View>
    )
}

const styles=StyleSheet.create({

    contenedor:{
        flex:1
    },
    titulo:{
        marginTop:10,
        fontSize:10,
        fontWeight:'bold',
        color:'#fff'
    },
    texto:{
        fontSize:24,
        //fontWeight:'bold',
        color:'#fff',

    },
    boton: {
        marginTop: 15,
        alignItems: 'center',
        backgroundColor: '#8854d0',
    },
    botonTexto: {
        //textTransform: 'uppercase',
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 15,
    },
    title:{
        textAlign:'center',
        marginLeft: 5,
        marginTop:10,
        fontSize:15,
        fontWeight:'bold'
    }
})

export default Profile