import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme, TextInput, Button, Menu, Divider, ActivityIndicator } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import firebase from '../../fireConnection';
import { useForm, Controller } from "react-hook-form";

import styles from './styles';

const Games = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { control, handleSubmit, errors } = useForm();
  const [games, setGames] = useState([]);
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  useEffect(() => {

    firebase.app.ref('games').on('value', (snapshot) => {
      let info = [];
      snapshot.forEach((childItem) => {

        info.push({
          key: childItem.key,
          category: childItem.val().categoria,
          img: childItem.val().imagem,
          name: childItem.val().nome,
        })
      });

      setGames(info);
      setLoading(false);
    })
  }, []);

  const onSubmit = async (data) => {
    let { game } = data;

    await firebase.app.ref('games').on('value', (snapshot) => {
      let info = [];
      snapshot.forEach((childItem) => {

        info.push({
          key: childItem.key,
          category: childItem.val().categoria,
          img: childItem.val().imagem,
          name: childItem.val().nome,
        })
      });

      let searchGame = info.filter((g) => {
        return g.name.toLowerCase().indexOf(game.toLowerCase()) > -1;
      })

      setGames(searchGame);
    });
  }

  //all games
  function allGames() {
    firebase.app.ref('games').on('value', (snapshot) => {
      let info = [];
      snapshot.forEach((childItem) => {

        info.push({
          key: childItem.key,
          category: childItem.val().categoria,
          img: childItem.val().imagem,
          name: childItem.val().nome,
        })
      });

      setGames(info);
    })
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    allGames();
    setRefreshing(false);
  }, []);

  //filter by category
  function filterItems(category) {
    firebase.app.ref('games').on('value', (snapshot) => {
      let info = [];
      snapshot.forEach((childItem) => {

        info.push({
          key: childItem.key,
          category: childItem.val().categoria,
          img: childItem.val().imagem,
          name: childItem.val().nome,
        })
      });

      let searchCategory = info.filter((g) => {
        return g.category.toLowerCase().indexOf(category.toLowerCase()) > -1;
      })

      setGames(searchCategory);
    })
  }


  return (
    <>
      <Header title="Jogos cadastrados" goBack={true} add={true} />

      <View style={{ backgroundColor: colors.background, flex: 1, padding: 10 }}>

        <View style={styles.searchContainer}>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                label="Procurar jogo desejado"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
                theme={{ colors: { primary: colors.accent } }}
                style={styles.inputSearch}
              />
            )}
            name="game"
            rules={{ required: true }}
            defaultValue=""
          />

          <Button mode="contained" style={[{ backgroundColor: colors.accent }, styles.btn]} title="Submit" onPress={handleSubmit(onSubmit)}>
            Pesquisar
          </Button>
        </View>

        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Button onPress={openMenu} mode="contained" style={{ backgroundColor: colors.accent }} >Filtrar</Button>}>
          <Menu.Item onPress={() => { allGames() }} title="TODOS" theme={{ colors: { text: '#000' } }} />
          <Divider />
          <Menu.Item onPress={() => { filterItems("action") }} title="AÇÃO" theme={{ colors: { text: colors.action } }} />
          <Divider />
          <Menu.Item onPress={() => { filterItems("strategy") }} title="ESTRATÉGIA" theme={{ colors: { text: colors.strategy } }} />
          <Divider />
          <Menu.Item onPress={() => { filterItems("fight") }} title="LUTA" theme={{ colors: { text: colors.fight } }} />
          <Divider />
          <Menu.Item onPress={() => { filterItems("running") }} title="CORRIDA" theme={{ colors: { text: colors.running } }} />
          <Divider />
          <Menu.Item onPress={() => { filterItems("rpg") }} title="RPG" theme={{ colors: { text: colors.rpg } }} />
          <Divider />
          <Menu.Item onPress={() => { filterItems("construction") }} title="CONSTRUÇÃO" theme={{ colors: { text: colors.construction } }} />
          <Divider />
          <Menu.Item onPress={() => { filterItems("vr") }} title="VR" theme={{ colors: { text: colors.realLife } }} />
          <Divider />
          <Menu.Item onPress={() => { filterItems("music") }} title="MÚSICA" theme={{ colors: { text: colors.music } }} />
          <Divider />
          <Menu.Item onPress={() => { filterItems("sports") }} title="ESPORTES" theme={{ colors: { text: colors.sports } }} />
        </Menu>

        {loading ?
          <View style={styles.loading}>
            <ActivityIndicator size="large" animating={true} color={colors.accent} />
          </View>
          :
          <FlatList
            data={games}
            refreshControl={
              <RefreshControl colors={["#e10f4c", "#b6063b"]} refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <>
                <TouchableOpacity onPress={() => { navigation.navigate("GameDetail", { id: item.key }) }}>

                  <View
                    style={
                      [
                        styles.games,
                        item.category === 'strategy' ? { backgroundColor: colors.strategy } :
                          item.category === "fight" ? { backgroundColor: colors.fight } :
                            item.category === "running" ? { backgroundColor: colors.running } :
                              item.category === "rpg" ? { backgroundColor: colors.rpg } :
                                item.category === "construction" ? { backgroundColor: colors.construction } :
                                  item.category === "music" ? { backgroundColor: colors.music } :
                                    item.category === "sports" ? { backgroundColor: colors.sports } :
                                      item.category === "vr" ? { backgroundColor: colors.realLife } :
                                        item.category === "action" ? { backgroundColor: colors.action } :
                                          null
                      ]
                    }
                  >
                    <View style={styles.container}>
                      <Image style={styles.imgGame} source={{ uri: item.img }} />
                      <Text style={styles.title}>
                        {`${item.name}`}
                      </Text>

                    </View>
                  </View>
                </TouchableOpacity>
              </>
            )}
            keyExtractor={item => item.key}
          />
        }

      </View>
    </>
  );
}

export default Games;