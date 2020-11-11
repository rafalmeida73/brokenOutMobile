import React from 'react';
import { View, Image, Text } from 'react-native';

import styles from './styles';

const Benefits = (props) => {
  return (
    <View style={styles.benefitsContainer}>
      <Image source={props.img} style={styles.img}/>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.desc}>{props.desc} </Text>
    </View>
  );
}

export default Benefits;