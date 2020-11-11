import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { TextInput, Button, useTheme, Drawer } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from "react-hook-form";
import firebase from '../../fireConnection';
import LottieView from 'lottie-react-native';
import styles from './styles';

import Header from '../../components/Header';
import FormRow from '../../components/FormRow';


const Subscribe = () => {
  const { colors } = useTheme();
  const { control, handleSubmit, errors } = useForm();
  const navigation = useNavigation();

  const [weakPass, setWeakPass] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [emailError, SetEmailError] = useState(false);
  const [loading, setLoading] = useState(false);


  const onSubmit = data => {
    setLoading(true);

    firebase.register(data.name, data.email, data.password)
      .then((authData) => {
        navigation.navigate("Home")
      }).catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          setInvalidEmail(true);
        }
        if (error.code === 'auth/weak-password') {
          setWeakPass(true);
        }
        if (error.code === 'auth/invalid-email') {
          SetEmailError(true);
        }
        else {
          Alert.alert('Erro' + error.code)
        }
      });
    setLoading(false);
  };

  return (
    <>
      <Header title="Cadastrar" subtitle="Faça o seu cadastro" goBack={true} />
      <View style={styles.inputContainer}>

        {invalidEmail && (
          <Drawer.Item
            style={{ backgroundColor: '#f44336' }}
            icon="information"
            label="Esse e-mail já está em uso!"
          />
        )}

        {emailError && (
          <Drawer.Item
            style={{ backgroundColor: '#f44336' }}
            icon="information"
            label="E-mail inválido!"
          />
        )}

        {weakPass && (
          <Drawer.Item
            style={{ backgroundColor: '#ff9800' }}
            icon="information"
            label="Senha fraca!"
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
          source={require('../../../assets/controle.json')}
        />

        <FormRow style={styles.form}>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                label="Nome"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
                theme={{ colors: { text: '#000', primary: colors.accent } }}
              />
            )}
            name="name"
            rules={{ required: true }}
            defaultValue=""
          />

          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                label="Email"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
                theme={{ colors: { text: '#000', primary: colors.accent } }}
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
                theme={{ colors: { text: '#000', primary: colors.accent } }}
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

          <Text style={[styles.subscribe, { color: colors.text }]} onPress={() => { navigation.navigate("Login"); }}>
            Já sou cadastrado
     </Text>

        </FormRow>

      </View>
    </>
  );
}

export default Subscribe;