import 'react-native-gesture-handler'
import React, { useState } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { FormControl, Input, Box, Center, Heading, VStack, Link, Button, HStack, Text } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { validateEmail } from '../../utils/validations'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { FIRESTORE_AUTH }  from '../../utils/firebase.config'

const Login = () =>  {

    const navigation = useNavigation()
    const [userError, setUserError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [email, setEmail] = useState('')
    const [password,setPassword] = useState('')

    const validate = async () => {
        
        const validEmail = validateEmails()
        const validPassword =  validatePassword()

        if (validEmail && validPassword) {
            await signInWithEmailAndPassword(FIRESTORE_AUTH, email, password)
            .then((result) => {
                navigation.navigate('DrawerApp')
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }

    const validateEmails = () => {
        setUserError('')
        if (email === undefined || email === '') {
            setUserError('Campo obligatorio')
            return false
        }
        if (!validateEmail(email) && email !== '') {
            setUserError('Formato de correo inválido')
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
    const onSubmit = () => {
        validate()
    }
  
    return(
        <View style={styles.contenedor}>
            <View style={styles.contenedorImagen}>
                <Image style={styles.imagen} resizeMode='contain' size='sm'
                    source={{uri:'https://cdn.pixabay.com/photo/2017/05/15/00/35/mental-health-2313428_960_720.png'}}
                ></Image>
            </View>
            <View style={styles.contenedorLogin}>
                <Center w='100%'>
                    <Box safeArea p='2' py='2' w='90%' maxW='290'>
                        <Heading size='lg' fontWeight='600' color='coolGray.800' _dark={{ color: 'warmGray.50' }}>
                            Alzheimer App
                        </Heading>
                        <VStack space={3} mt='5'>
                            <FormControl isRequired isInvalid={userError}>
                                <FormControl.Label>Correo Electrónico</FormControl.Label>
                                <Input onChangeText={value => setEmail(value)}/>
                                {userError ? 
                                    <FormControl.ErrorMessage>{ userError }</FormControl.ErrorMessage> : ''
                                }
                            </FormControl>
                            <FormControl isRequired isInvalid={passwordError}>
                                <FormControl.Label>Contraseña</FormControl.Label>
                                <Input type='password' onChangeText={value => setPassword(value)}/>
                                {passwordError ? 
                                    <FormControl.ErrorMessage>{ passwordError }</FormControl.ErrorMessage> : 
                                    <FormControl.HelperText>Contraseña de al menos 6 caracteres.</FormControl.HelperText>}
                            </FormControl>
                            <Button mt='2' backgroundColor={'#8854d0'} onPress={onSubmit}>
                                Ingresar
                            </Button>
                            <HStack mt='6' justifyContent='center'>
                                <Text 
                                    fontSize='sm' 
                                    color='coolGray.600' _dark={{
                                    color: 'warmGray.200'}}>¿No tenés cuenta?
                                </Text>
                                <Link _text={{ color: '#8854d0', fontWeight: 'medium', fontSize: 'sm' }} onPress={()=>navigation.navigate('Register')}>
                                    Regístrate
                                </Link>
                            </HStack>
                        </VStack>
                    </Box>
                </Center>
            </View>
        </View>
    )
}

const styles=StyleSheet.create({
    contenedor:{
        flex:1,
        backgroundColor:'#8854d0',
    },
    contenedorImagen:{
        height:'40%',
        marginBottom: 23
    },
    imagen:{
        height:282,
        width:'100%'
    },
    contenedorLogin:{
        //height:'60%',
        margintop: 5,
        marginHorizontal:'3%',
        backgroundColor:'white',
        //borderRadius: 15,
    },
    boton:{
        //marginTop:1,
        alignItems:'center',
        backgroundColor:'black',
        marginHorizontal: '5%',
    },
    botonTexto:{
        textTransform:'uppercase',
        fontWeight:'bold',
        color:'#fff',
        fontSize:15,
    },
    login:{
        marginTop:10
    },
    titulo:{
        textAlign:'center',
        marginTop:10,
        fontSize:30,
        fontWeight:'bold'
    },
    register:{
        textAlign:'center',
        color:'#fff',
        marginTop:10,
        fontSize:16
    },
    inputLogin:{
        marginHorizontal: '5%',
        backgroundColor:'#ffff'
    }
})

export default Login
