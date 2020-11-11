import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, TextInput, Button } from 'react-native-paper';
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from 'expo-image-picker';
import firebase from '../../fireConnection';
import { Picker } from '@react-native-picker/picker';
import styles from './styles';

//components
import Header from '../../components/Header';

const EditGame = (props) => {
  const { id } = props.route.params;
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { control, handleSubmit, errors } = useForm();
  const [image, setImage] = useState(null);
  const [name, setName] = useState(null);
  const [appInfo, setAppInfo] = useState([]);
  const [choice, setChoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Precisamos de permissões da câmera para fazer isso funcionar!');
        }
      }
    })();

    firebase.getGame(id, (info) => {

      let { appStore,
        descricao,
        epic,
        imagem,
        microsoft,
        nome,
        playStore,
        steam,
        playstation,
        categoria
      } = info.val();
      setImage(imagem);
      setName(nome);
      setSelectedCategory(categoria);
      let data = [];
      data.push({
        name: nome,
        img: imagem,
        desc: descricao,
        steam,
        microsoft,
        playStore,
        appStore,
        epic,
        playstation,
        categoria,
      });

      setAppInfo(data);

    });
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

  uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const currentUid = firebase.getCurrentUid();
    const uploadTaks = firebase.storage
      .ref(`images/${currentUid}/${id}`)
      .put(blob);

    await uploadTaks.on('state_changed',
      (snapshot) => {
        //progress
        console.log("progress")
      },
      (error) => {
        //error
        console.log('Error imagem: ' + error);
      },
      () => {
        //sucessO!
        firebase.storage.ref(`images/${currentUid}`)
          .child(id).getDownloadURL()
          .then(url => {
            setImage(url);
          })
      })
  }


  const onSubmit = async (data) => {
    setLoading(true);
    let { name, desc, steam, microsoft, epic, play, app, playstation } = data;
    const currentUid = firebase.getCurrentUid();

    let info = {
      imagem: image,
      nome: name,
      descricao: desc,
      steam,
      microsoft,
      epic,
      playStore: play,
      appStore: app,
      categoria: choice,
      playstation,
      autor: currentUid
    };

    await firebase.editGame(id, info);

    navigation.goBack();
  }

  return (
    <>
      <Header title={name} goBack={true} />
      <View style={{ backgroundColor: colors.background, flex: 1, padding: 10 }}>
        <ScrollView>

          {appInfo.map((app) => {
            return (
              <>
                <TouchableOpacity onPress={pickImage}>
                  {image && <Image source={{ uri: image }} style={styles.img} />}
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
                      label="Nome"
                      onBlur={onBlur}
                      onChangeText={value => onChange(value)}
                      value={value}
                      theme={{ colors: { primary: colors.accent } }}
                    />
                  )}
                  name="name"
                  rules={{ required: true }}
                  defaultValue={app.name}
                />

                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <TextInput
                      label="Descrição"
                      onBlur={onBlur}
                      onChangeText={value => onChange(value)}
                      value={value}
                      theme={{ colors: { primary: colors.accent } }}
                    />
                  )}
                  name="desc"
                  rules={{ required: true }}
                  defaultValue={app.desc}
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
                  defaultValue={app.steam}
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
                  defaultValue={app.microsoft}
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
                  defaultValue={app.playstation}
                />

                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <TextInput
                      label="Link do jogo na Epic games"
                      onBlur={onBlur}
                      onChangeText={value => onChange(value)}
                      value={value}
                      defaultValue={app.epic}
                    />
                  )}
                  name="epic"
                  defaultValue={app.epic}
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
                  defaultValue={app.playStore}
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
                  defaultValue={app.appStore}
                />

                <Picker
                  selectedValue={selectedCategory}
                  style={{ height: 50, width: '100%', color: '#fff' }}
                  onValueChange={(itemValue, itemIndex) => {
                    setChoice(itemValue);
                    setSelectedCategory(itemValue);
                    console.log(choice)
                  }
                  }>
                  <Picker.Item label="Acão" value="action" enable />
                  <Picker.Item label="Estratégia" value="strategy" />
                  <Picker.Item label="Luta" value="fight" />
                  <Picker.Item label="Corrida" value="running" />
                  <Picker.Item label="RPG" value="rpg" />
                  <Picker.Item label="Construção" value="construction" />
                  <Picker.Item label="VR" value="vr" />
                  <Picker.Item label="Música" value="music" />
                  <Picker.Item label="Esportes" value="sports" />
                </Picker>

              </>
            )
          })}

          <Button
            loading={loading}
            icon="file-document-edit-outline"
            mode="contained"
            style={[{ backgroundColor: colors.accent }, styles.btn]}
            title="Submit"
            onPress={handleSubmit(onSubmit)}
          >
            Editar
     </Button>

        </ScrollView>
      </View>
    </>
  );
}

export default EditGame;