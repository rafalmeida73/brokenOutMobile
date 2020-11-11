import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { TextInput, Button, useTheme, Drawer } from 'react-native-paper';
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from '@react-navigation/native';
import firebase from '../../fireConnection';
import LottieView from 'lottie-react-native';
import styles from './styles';

import Header from '../../components/Header';
import FormRow from '../../components/FormRow';


const Login = () => {
   const { colors } = useTheme();
   const { control, handleSubmit, errors } = useForm();
   const navigation = useNavigation();

   const [wrongLogin, setWrongLogin] = useState(false);
   const [emailError, SetEmailError] = useState(false);
   const [loading, setLoading] = useState(false);
   const [currentUid, setCurrentUid] = useState(null);

   useEffect(() => {
      setCurrentUid(firebase.getCurrentUid());
      if(currentUid !== null){
         return (
            navigation.navigate("Games")
         )
      }
    }, []);


   const onSubmit = (data) => {
      setLoading(true);
      firebase.login(data.email, data.password)
         .then((authData) => {
            navigation.navigate("Home")
         }).catch((error) => {
            if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
               setWrongLogin(true)
            }
            if (error.code === 'auth/invalid-email') {
               SetEmailError(true);
            }
            else {
               Alert.alert('Erro' + error.code)
            }
         });
      setLoading(false);
   }

   return (
      <>
         <Header title="Entrar" subtitle="Faça o login" />
         <View style={styles.inputContainer}>

            {wrongLogin && (
               <Drawer.Item
                  style={{ backgroundColor: '#f44336' }}
                  icon="information"
                  label="E-mail ou senha incorretos!"
               />
            )}

            {emailError && (
               <Drawer.Item
                  style={{ backgroundColor: '#f44336' }}
                  icon="information"
                  label="E-mail inválido!"
               />
            )}

            {errors.password || errors.email ? (
               <Drawer.Item
                  style={{ backgroundColor: '#ff9800' }}
                  icon="information"
                  label="Por favor, preencha todos os campos!"
               />
            ) : null}

            <LottieView
               style={styles.lottie}
               autoPlay loop
               source={require('../../../assets/robo.json')}
            />

            <FormRow style={styles.form}>
               <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                     <TextInput
                        label="Email"
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        theme={{ colors: { primary: colors.accent } }}
                     />
                  )}
                  name="email"
                  rules={{ required: true }}
                  defaultValue=""
               />

               <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                     <TextInput
                        label="Senha"
                        secureTextEntry={true}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        theme={{ colors: { primary: colors.accent } }}
                     />
                  )}
                  name="password"
                  rules={{ required: true }}
                  defaultValue=""
               />

               <Button
                  loading={loading}
                  icon="account-circle"
                  mode="contained"
                  style={[{ backgroundColor: colors.accent }, styles.button]}
                  title="Submit"
                  onPress={handleSubmit(onSubmit)}
               >
                  Entrar
               </Button>

               <Text style={[styles.subscribe, { color: colors.text }]} onPress={() => { navigation.navigate("Subscribe"); }}>
                  Ainda não estou cadastrado
               </Text>



            </FormRow>

         </View>
      </>
   );
}

export default Login;