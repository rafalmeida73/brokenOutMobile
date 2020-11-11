import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useTheme, TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from '@react-navigation/native';
import firebase from '../../fireConnection';
import styles from './styles';

//components
import Header from '../../components/Header';

//Images
import imgGame from '../../../assets/imgGame.png';


const AddGame = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { control, handleSubmit, errors } = useForm();
  const [loading, setLoading] = useState(false);
  const [choice, setChoice] = useState(null);
  const [image, setImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('action');
  const [key, setKey] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Precisamos de permissões da câmera para fazer isso funcionar!');
        }
      }
    })();

    let games = firebase.app.ref('games');
    setKey(games.push().key);
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      if (result.type === 'video') {
        Alert.alert(
          'Formato inválido',
          'Insira um arquivo do tipo imagem!',
          [
            { text: 'OK' },
          ]
        );
        return null
      }
      uploadImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const currentUid = firebase.getCurrentUid();
    const uploadTaks = firebase.storage
      .ref(`images/${currentUid}/${key}`)
      .put(blob);

    await uploadTaks.on('state_changed',
      (snapshot) => {
        //progress
        console.log("progress")
      },
      (error) => {
        //error
        console.log('Error')
        console.log('Error imagem: ' + error);
      },
      () => {
        //sucessO!
        console.log('Sucess')
        firebase.storage.ref(`images/${currentUid}`)
          .child(key).getDownloadURL()
          .then(url => {
            setImage(url);
          })
      })
  }

  const onSubmit = async (data) => {
    setLoading(true);
    let { name, desc, steam, microsoft, epic, play, app, playstation } = data;
    const currentUid = firebase.getCurrentUid();

    let games = firebase.app.ref('games');
    await games.child(key).set({
      imagem: image,
      nome: name,
      descricao: desc,
      steam: steam,
      microsoft: microsoft,
      epic: epic,
      playStore: play,
      appStore: app,
      categoria: choice,
      playstation,
      autor: currentUid
    });

    navigation.navigate("GameDetail", { id: key })

    setLoading(false);
  };

  return (
    <>
      <Header title="Adicionar novo jogo" goBack={true} />
      <View style={{ backgroundColor: colors.background, flex: 1, padding: 10 }}>
        <ScrollView>

          <TouchableOpacity onPress={pickImage}>
            {image ?
              <Image source={{ uri: image }} style={styles.img} />
              :
              <Image source={imgGame} style={styles.img} />
            }
          </TouchableOpacity>

          {errors.name || errors.desc ? (
            Alert.alert(
              'Campos não preenchidos',
              'Preencha todos os campos com *',
              [
                { text: 'OK' },
              ]
            )
          ) : null}

          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                label="Nome * "
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
                theme={{ colors: { primary: colors.accent } }}
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
                label="Descrição *"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
                theme={{ colors: { primary: colors.accent } }}
              />
            )}
            name="desc"
            rules={{ required: true }}
            defaultValue=""
          />

          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                label="Id da steam"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
                keyboardType={'numeric'}
                theme={{ colors: { primary: colors.accent } }}
              />
            )}
            name="steam"
            defaultValue=""
          />

          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                label="Link do jogo na Microsoft Store"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
                theme={{ colors: { primary: colors.accent } }}
              />
            )}
            name="microsoft"
            defaultValue=""
          />

          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                label="Link do jogo na Playstation Store"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
                theme={{ colors: { primary: colors.accent } }}
              />
            )}
            name="playstation"
            defaultValue=""
          />

          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                label="Link do jogo na Epic games"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
              />
            )}
            name="epic"
            defaultValue=""
          />

          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                label="Link do jogo na Play Store"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
                theme={{ colors: { primary: colors.accent } }}
              />
            )}
            name="play"
            defaultValue=""
          />

          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                label="Link do jogo na App Store"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
                theme={{ colors: { primary: colors.accent } }}
              />
            )}
            name="app"
            defaultValue=""
          />

          <Picker
            selectedValue={selectedCategory}
            style={{ height: 50, width: '100%', color: '#fff' }}
            onValueChange={(itemValue, itemIndex) => {
              setChoice(itemValue);
              console.log(choice);
              setSelectedCategory(itemValue);
            }
            }>
            <Picker.Item label="Acão" value="action" />
            <Picker.Item label="Estratégia" value="strategy" />
            <Picker.Item label="Luta" value="fight" />
            <Picker.Item label="Corrida" value="running" />
            <Picker.Item label="RPG" value="rpg" />
            <Picker.Item label="Construção" value="construction" />
            <Picker.Item label="VR" value="vr" />
            <Picker.Item label="Música" value="music" />
            <Picker.Item label="Esportes" value="sports" />
          </Picker>

          <Button
            loading={loading}
            icon="plus"
            mode="contained"
            style={[{ backgroundColor: colors.accent }, styles.btn]}
            title="Submit"
            onPress={handleSubmit(onSubmit)}
          >
            Adicionar
          </Button>

        </ScrollView>
      </View>
    </>
  );
}

export default AddGame;