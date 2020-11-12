import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, useTheme, List, Modal, Portal, TextInput, Drawer, FAB } from 'react-native-paper';
import styles from './styles';
import firebase from '../../fireConnection';
import api from '../../Services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { useForm, Controller } from "react-hook-form";
import LottieView from 'lottie-react-native';

//components
import Header from '../../components/Header';

//Images
import Steam from '../../../assets/steam.png';
import Epic from '../../../assets/epic.png';
import Play from '../../../assets/play.png';
import App from '../../../assets/apple.png';
import Microsoft from '../../../assets/microsoft.png';
import Playstation from '../../../assets/ps4.png';

const GameDetail = (props) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { id } = props.route.params;
  const [appInfo, setAppInfo] = useState([]);
  const [appID, setAppId] = useState(null);
  const [news, setNews] = useState([]);
  const [comment, setComment] = useState([]);
  const [makeLogin, setMakeLogin] = useState(false);
  const [title, setTitle] = useState(null);
  const [autor, setAutor] = useState(firebase.getCurrentUid());
  const [note, setNote] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const handlePress = () => setExpanded(!expanded);
  const [visible, setVisible] = useState(false);
  const [visibleFab, setVisibleFab] = useState(true);
  const [delGame, setDelGame] = useState(false);
  const [loading, setLoading] = useState(false);



  const { control, handleSubmit, errors } = useForm({
    defaultValues: {
      comment: "",
      note: "",
    }
  });

  const showModalDelGame = () => setDelGame(true);
  const hideModalDelGame = () => setDelGame(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [state, setState] = useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;
  const containerStyle = { backgroundColor: 'white', padding: 20 };
  var date = new Date();


  useEffect(() => {
    const reload = navigation.addListener("focus", () => {
      setVisibleFab(true);

      firebase.getGame(id, (info) => {
        let data = [];
        let {
          appStore,
          descricao,
          epic,
          imagem,
          microsoft,
          nome,
          playStore,
          steam,
          playstation,
          autor
        } = info.val();

        setAutor(autor);

        setAppId(steam);

        setTitle(nome);

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
        });
        setAppInfo(data);
      })
    });

    // Get user name
    firebase.getUserName((info) => {
      AsyncStorage.setItem('name', info.val().nome);
    });

    //Get game
    firebase.getGame(id, (info) => {
      let data = [];
      let {
        appStore,
        descricao,
        epic,
        imagem,
        microsoft,
        nome,
        playStore,
        steam,
        playstation,
        autor
      } = info.val();

      setAutor(autor);

      setAppId(steam);

      setTitle(nome);

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
      });

      // News API
      api.get("/steam/game/" + steam + "/news")
        .then(res => {
          setNews(res.data.appnews.newsitems);
        });


      setAppInfo(data);
    });

    //comentarios
    firebase.app.ref('comentarios').child(id).on('value', (snapshot) => {
      let comments = [];
      snapshot.forEach((childItem) => {

        comments.push({
          key: childItem.key,
          comment: childItem.val().comentario,
          date: childItem.val().data,
          name: childItem.val().nome,
          note: childItem.val().nota,
          autor: childItem.val().autor,
        })
      });

      setComment(comments);
    });

  }, [navigation]);

  //Comment delete
  function deleteComments(commentId) {
    firebase.deleteComment(id, commentId);
  };

  //Game delete
  function deleteGame() {
    firebase.deleteGame(id);
    navigation.navigate("Games");
  }

  // Form comments submit
  const onSubmit = async (data) => {
    setLoading(true);
    let { comment, note } = data;
    let fullDate = `${date.toLocaleDateString()} às ${date.getHours()}:${date.getMinutes()}`;
    let autor = '';
    autor = await AsyncStorage.getItem('name') || 'none';

    if (firebase.getCurrentUid() === null) {
      setMakeLogin(true);
      return null;
    }

    if (note <= 0 || note > 5) {
      setNote(true);
      return null;
    }

    const currentUid = firebase.getCurrentUid();

    let comments = firebase.app.ref('comentarios');
    let key = comments.push().key;
    let idKey = id;
    await comments.child(idKey).child(key).set({
      nome: autor,
      comentario: comment,
      nota: note,
      data: fullDate,
      autor: currentUid
    });
    setLoading(false);
  }

  const ref_input2 = useRef();

  return (
    <>
      <Header title={title} goBack={true} />
      <View style={{ backgroundColor: colors.background, flex: 1, paddingTop: 20, }}>
        {/* Modal delete game */}
        <Portal>
          <Modal visible={delGame} onDismiss={hideModalDelGame} contentContainerStyle={containerStyle}>
            <LottieView
              style={styles.lottie}
              autoPlay loop
              source={require('../../../assets/delete.json')}
            />

            <View>
              <Text style={styles.textDelete}>
                 Ao clicar em <Text style={styles.confirm}>confirmar</Text> o jogo será deletado!
              </Text>
            </View>

            <View style={styles.options}>

              <Button
                onPress={hideModalDelGame}
                style={{ backgroundColor: colors.bad }}
              >
                Cancelar
              </Button>

              <Button
                onPress={() => { deleteGame(id); hideModalDelGame() }}
                style={{ backgroundColor: colors.good }}
              >
                Confirmar
            </Button>
            </View>
          </Modal>
        </Portal>

        {/* FAB */}
        {autor === firebase.getCurrentUid() && (
          <Portal>
            <FAB.Group
              open={open}
              visible={visibleFab}
              theme={{ colors: { text: '#000' } }}
              icon={open ? 'plus' : 'plus'}
              actions={[
                {
                  icon: 'delete',
                  label: 'Deletar',
                  onPress: () => showModalDelGame(),
                },
                {
                  icon: 'file-document-edit-outline',
                  label: 'Editar',
                  onPress: () => { navigation.navigate("EditGame", { id }); setVisibleFab(false); },
                },
              ]}
              onStateChange={onStateChange}
              onPress={() => {
                if (open) {
                  // do something if the speed dial is open
                }
              }}
            />
          </Portal>
        )}

        {appInfo.map(info => {
          return (
            <ScrollView key={id} style={styles.container}>
              <Image source={{ uri: info.img }} style={styles.img} />
              <Text style={styles.desc}>{info.desc}</Text>

              <View style={styles.store} onPress={() => { Linking.openURL() }}>
                {info.steam !== "" && (
                  <TouchableOpacity
                    onPress={() => { Linking.openURL(`https://store.steampowered.com/app/${info.steam}`) }}
                  >
                    <Image source={Steam} style={styles.imgBuy} />
                  </TouchableOpacity>
                )}

                {info.microsoft !== "" && (
                  <TouchableOpacity onPress={() => { Linking.openURL(info.microsoft) }}>
                    <Image source={Microsoft} style={styles.imgBuy} />
                  </TouchableOpacity>
                )}

                {info.epic !== "" && (
                  <TouchableOpacity onPress={() => { Linking.openURL(info.epic) }}>
                    <Image source={Epic} style={styles.imgBuy} />
                  </TouchableOpacity>
                )}

                {info.playStore !== "" && (
                  <TouchableOpacity onPress={() => { Linking.openURL(info.playStore) }}>
                    <Image source={Play} style={styles.imgBuy} />
                  </TouchableOpacity>
                )}

                {info.appStore !== "" && (
                  <TouchableOpacity onPress={() => { Linking.openURL(info.appStore) }}>
                    <Image source={App} style={styles.imgBuy} />
                  </TouchableOpacity>
                )}

                {info.playstation !== "" && (
                  <TouchableOpacity onPress={() => { Linking.openURL(info.playstation) }}>
                    <Image source={Playstation} style={styles.imgBuy} />
                  </TouchableOpacity>
                )}
              </View>

              {news.length === 0 ? null :
                <View>
                  <Text style={styles.newsTitle}>Notícias</Text>
                  {news.map((n) => {
                    return (
                      <List.Section key={n.gid}>
                        <List.Accordion
                          title={n.title}
                          left={props => <List.Icon {...props} icon="book-open" />}>
                          <WebView
                            source={{
                              html: `
                            <html>
                                <head>
                                  <style>
                                    a {
                                      font-weight: bold;
                                      color: #e10f4c;
                                      text-transform: uppercase;
                                    }

                                    p {
                                      font-size: 25px;
                                      text-align: center;
                                    }

                                    img {
                                      width: 100%;
                                      max-width: 100%;
                                    }
                                  </style>
                                </head>
                                <body>
                                  ${n.contents}
                                </body>
                            </html>
                            ` }}
                            style={styles.news}
                          />
                          <Button icon="plus"
                            mode="contained"
                            style={[{ backgroundColor: colors.accent, }, styles.btnNews]}>
                            Ver a matéria completa
                          </Button>
                        </List.Accordion>
                      </List.Section>
                    )
                  })}
                </View>
              }

              {/* Iframe */}

              {appID === '' ? null :
                <WebView source={{ uri: `https://steamdb.info/embed/?appid=${appID}` }} style={styles.iframe} />
              }

              {/* Comments */}

              <View style={{ marginBottom: 20 }}>
                {comment.length === 0 ?
                  <Text style={styles.commentTitle}>Adicione um comentário</Text>
                  :
                  <Text style={styles.commentTitle}>Comentários</Text>
                }
                {comment.map((c) => {
                  return (
                    <View key={c.key} style={styles.comments}>
                      <View style={styles.commentContainer}>
                        <Text style={[styles.autor, { color: colors.accent }]}>{c.name}</Text>
                        <Text
                          style={
                            [
                              styles.note,
                              c.note === '1' ? { backgroundColor: colors.bad } :
                                c.note === '2' ? { backgroundColor: colors.reasonable } :
                                  c.note === '3' ? { backgroundColor: colors.reasonable } :
                                    c.note === '4' ? { backgroundColor: colors.reasonable } :
                                      c.note === '5' ? { backgroundColor: colors.good } :
                                        null
                            ]
                          }
                        >
                          {c.note}
                        </Text>

                        {/* Delete comment */}
                        {c.autor === firebase.getCurrentUid() && (
                          <>
                            <Portal >
                              <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                                <LottieView
                                  style={styles.lottie}
                                  autoPlay loop
                                  source={require('../../../assets/delete.json')}
                                />

                                <View>
                                  <Text style={styles.textDelete}>Ao clicar em <Text style={styles.confirm}>confirmar</Text> o comentário será deletado!</Text>
                                </View>

                                <View style={styles.options}>
                                  <Button
                                    onPress={hideModal}
                                    style={{ backgroundColor: colors.bad }}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    onPress={() => { deleteComments(c.key); hideModal() }}
                                    style={{ backgroundColor: colors.good }}
                                  >
                                    Confirmar
                                    </Button>
                                </View>
                              </Modal>
                            </Portal>

                            {c.autor === firebase.getCurrentUid() && (
                              <Button style={styles.modal} icon="dots-horizontal" onPress={showModal}></Button>
                            )}

                          </>
                        )}


                      </View>
                      <Text style={styles.date}>{c.date}</Text>
                      <Text style={styles.comment}>{c.comment}</Text>
                    </View>
                  )
                })}
              </View>


              {/* Form comments */}

              <View style={styles.form}>
                <View>
                  {errors.comment || errors.note ? (
                    <Drawer.Item
                      style={{ backgroundColor: '#ff9800' }}
                      icon="information"
                      label="Por favor, preencha todos os campos!"
                    />
                  ) : null}

                  {makeLogin && (
                    <Drawer.Item
                      style={{ backgroundColor: '#ff9800' }}
                      icon="information"
                      label="Para comentar é necessário fazer login"
                    />
                  )}

                  {note && (
                    <Drawer.Item
                      style={{ backgroundColor: '#ff9800' }}
                      icon="information"
                      label="Por favor, insira uma nota de 1 a 5"
                    />
                  )}
                </View>

                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <TextInput
                      label="Comentário"
                      onBlur={onBlur}
                      onChangeText={value => onChange(value)}
                      value={value}
                      theme={{ colors: { primary: colors.accent } }}
                      returnKeyType="next"
                      onSubmitEditing={() => ref_input2.current.focus()}
                    />
                  )}
                  name="comment"
                  rules={{ required: true }}
                  defaultValue=""
                />

                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <TextInput
                      label="Nota"
                      onBlur={onBlur}
                      onChangeText={value => onChange(value)}
                      value={value}
                      theme={{ colors: { primary: colors.accent } }}
                      maxLength={1}
                      keyboardType={'numeric'}
                      placeholder="Nota de 1 a 5"
                      returnKeyType="next"
                      ref={ref_input2}
                    />
                  )}
                  name="note"
                  rules={{ required: true }}
                  defaultValue=""
                />

                <Button
                  loading={loading}
                  icon="chat"
                  mode="contained"
                  style={{ backgroundColor: colors.accent }}
                  title="Submit"
                  onPress={handleSubmit(onSubmit)}>
                  Comentar
                </Button>

              </View>
            </ScrollView>
          )
        })}

      </View>
    </>
  );
}

export default GameDetail;