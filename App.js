import React from 'react'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NativeBaseProvider } from 'native-base'
import Login from './src/app/public/login'
import Register from './src/app/public/register'
import Welcome from './src/app/secured/welcome'
import Maps from './src/app/secured/maps'
import Profile from './src/app/secured/profile'
import FormCoordinates from './src/app/secured/formCoordinates'
import DrawerContent from './src/app/components/drawerContent'

const StackApp = createStackNavigator()
const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()

export default function App() {
    const navOptionHandler=()=>({
        headerShown: false
    })

    const StackMain=()=> {
        return(
            <Stack.Navigator initialRouteName='Welcome' 
                screenOptions={{
                headerTitleAlign:'center',
                headerStyle:{
                    backgroundColor:'#8854d0'
                },
                headerTitleStyle:{
                    fontWeight:'bold',
                    color:'#fff'
                },
                }}>
                <Stack.Screen name='Welcome' component={Welcome} options={{ title: 'Bienvenidos', headerTintColor:'#fff'}}></Stack.Screen>
                <Stack.Screen name='Maps' component={Maps} options={{ title: 'Mapa', headerTintColor:'#fff'}}></Stack.Screen>
                <Stack.Screen name='FormCoordinates' component={FormCoordinates} options={{ title: 'Dirección', headerTintColor:'#fff'}}></Stack.Screen>
                <Stack.Screen name='Profile' component={Profile} options={{ title: 'Perfil', headerTintColor:'#fff'}}></Stack.Screen>
            </Stack.Navigator>
        )
    }
    const DrawerApp=()=>{
        return(
            <Drawer.Navigator drawerContent={(props)=><DrawerContent {...props}></DrawerContent>}
            screenOptions={{ 
                headerShown:false
            }} 
            > 
                <Drawer.Screen name='Inital' component={StackMain}></Drawer.Screen>
            </Drawer.Navigator>
        )
    }
    return (
        <NativeBaseProvider>
            <NavigationContainer>
                <StackApp.Navigator initialRouteName='Login'>
                    <StackApp.Screen name='Login' component={Login} options={navOptionHandler}></StackApp.Screen>
                    <StackApp.Screen name='Register' component={Register} options={navOptionHandler}></StackApp.Screen>
                    <StackApp.Screen name='DrawerApp' component={DrawerApp} options={navOptionHandler}></StackApp.Screen>
                </StackApp.Navigator>
            </NavigationContainer>
        </NativeBaseProvider>
        
    )
}
