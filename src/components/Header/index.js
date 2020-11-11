import * as React from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Heade = (props) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack();
  };

  const addGame = () =>{
    navigation.navigate("AddGame")
  }
  
  return (
    <Appbar.Header style={{ backgroundColor: colors.primary }} dark="true">
      {props.goBack && (
        <Appbar.BackAction onPress={_goBack} />
      )}
      <Appbar.Content title={props.title} subtitle={props.subtitle} />
      {props.add && (
        <Appbar.Action icon="plus" onPress={addGame} />
      )}
    </Appbar.Header>
  );
};

export default Heade;