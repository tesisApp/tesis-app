import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { FormControl, Input, Box, Center, Heading, VStack, Button } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { validateEmail } from '../../utils/validations'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { FIRESTORE_AUTH, FIRESTORE_DB } from '../../utils/firebase.config'
import { addDoc, collection } from 'firebase/firestore'

const Register = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] =  useState('')
    const [passwordError, setPasswordError] = useState('')
    const [firstNameError, setFirstNameError] = useState('')
    const [lastNameError, setLastNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordRepeatError, setPasswordRepeatError] =  useState('')
    const navigation = useNavigation()

    const onSubmit = () => {
        validate()
    }

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
    const validatePassword = () => {
        setPasswordError('')
        if (password === undefined || password === '') {
            setPasswordError('Campo obligatorio')
            return false
        }

        if (password?.length < 6 && password !== '') {
            setPasswordError('Minimo 6 caracteres')
            return false
        }
        return true
    }
    const validatePasswordRepeat = () => {
        setPasswordRepeatError('')
        if (passwordRepeat === undefined || passwordRepeat === '') {
            setPasswordRepeatError('Campo obligatorio')
            return false
        }

        if (passwordRepeat?.length < 6 && passwordRepeat !== '') {
            setPasswordRepeatError('Minimo 6 caracteres')
            return false
        }

        if (passwordRepeat?.length >= 6 && passwordRepeat !== password) {
            setPasswordRepeatError('Contraseña incorrecta')
        }
        return true
    }
    
    const validate = async() => {
        const validFirstName = validateFirstName()
        const validLastName = validateLastName()
        const validEmail = validateEmails()
        const validPassword = validatePassword()
        const validPasswordRepeat = validatePasswordRepeat()

        if ( validFirstName && validLastName && validEmail && validPassword && validPasswordRepeat) {
            await createUserWithEmailAndPassword(FIRESTORE_AUTH, email, password)
            .then((result) => {
                saveNewUser(result.user)
                navigation.navigate('Login')
            })
        }
    }

    const saveNewUser = async(user) => {
        const docRef = collection(FIRESTORE_DB, 'usuario')
        await addDoc(docRef, {
            firstName: firstName,
            lastName: lastName,
            email: user.email,
            uid: user.uid,
            latitude: '',
            longitude: '',
            createdAt: new Date(),
        })
    }
    return(
        <View style={styles.contenedor}>
            <ScrollView style={styles.contenedorLogin}>
                <Center w="100%">
                    <Box safeArea p="2" py="2" w="90%" maxW="290">
                        <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{ color: "warmGray.50" }}>
                            Registro
                        </Heading>
                        <VStack space={3} mt="5">
                            <FormControl isRequired isInvalid={firstNameError}>
                                <FormControl.Label>Nombre</FormControl.Label>
                                <Input onChangeText={value => setFirstName(value)}/>
                                {firstNameError ? 
                                    <FormControl.ErrorMessage>{ firstNameError }</FormControl.ErrorMessage> : ''
                                }
                            </FormControl>
                            <FormControl isRequired isInvalid={lastNameError}>
                                <FormControl.Label>Apellido</FormControl.Label>
                                <Input onChangeText={value => setLastName(value)}/>
                                {lastNameError ? 
                                    <FormControl.ErrorMessage>{ lastNameError }</FormControl.ErrorMessage> : ''
                                }
                            </FormControl>
                            <FormControl isRequired isInvalid={emailError}>
                                <FormControl.Label>Correo Electrónico</FormControl.Label>
                                <Input onChangeText={value => setEmail(value)}/>
                                {emailError ? 
                                    <FormControl.ErrorMessage>{ emailError }</FormControl.ErrorMessage> : ''
                                }
                            </FormControl>
                            <FormControl isRequired isInvalid={passwordError}>
                                <FormControl.Label>Contraseña</FormControl.Label>
                                <Input type="password" onChangeText={value => setPassword(value)}/>
                                {passwordError ? 
                                    <FormControl.ErrorMessage>{ passwordError }</FormControl.ErrorMessage> : ''
                                }
                            </FormControl>
                            <FormControl isRequired isInvalid={passwordRepeatError}>
                                <FormControl.Label>Repetir contraseña</FormControl.Label>
                                <Input type="password" onChangeText={value => setPasswordRepeat(value)}/>
                                {passwordRepeatError ? 
                                    <FormControl.ErrorMessage>{ passwordRepeatError }</FormControl.ErrorMessage> : ''
                                }
                            </FormControl>
                            <Button mt="2" backgroundColor={'#8854d0'} onPress={onSubmit}>
                                Crear cuenta
                            </Button>
                        </VStack>
                    </Box>
                </Center>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: "#8854d0",
    },
  
    contenedorLogin: {
        flex: 1,
        height: "70%",
        marginHorizontal: "5%",
        backgroundColor: "white",
        //borderRadius: 15,
        paddingBottom: 40,
        marginVertical: 50
    },
  })
  export default Register