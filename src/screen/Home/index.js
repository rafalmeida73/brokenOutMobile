import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import Header from '../../components/Header';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import Benefits from '../../components/Benefits';
import { vw, vh, vmax } from 'react-native-expo-viewport-units';

import quadradoA from '../../../assets/quadradoA.png';
import quadradoB from '../../../assets/quadradoB.png';
import quadradoC from '../../../assets/quadradoC.png';
import team from '../../../assets/team.png';
import line from '../../../assets/line.png';


import styles from './styles';

const Home = () => {
 const { colors } = useTheme();
 const navigation = useNavigation();

 return (
  <>
   <Header title="Broken Out" subtitle="Bem-vindo!" style={{ height: vmax(10) }} />

   <ScrollView>
    <View style={{ backgroundColor: colors.background, flex: 1 }}>

     <View style={{ height: vh(80), width: vw(100), padding: 5 }}>
      <LottieView
       style={styles.lottie}
       autoPlay loop
       source={require('../../../assets/robo.json')}
      />

      <Text style={[styles.text, { color: colors.text }]}>
       O Broken Out visa facilitar o acesso a informações de jogos. Disponibilizamos uma imensa variedade de jogos cadastrados. Contudo, você pode adicionar qualquer jogo que não esteja cadastrado. Ajudando assim, outros usuários a encontrar o jogo desejado.
      </Text>

      <Button
       icon="cards"
       mode="contained"
       style={{ backgroundColor: colors.accent }}
       onPress={() => { navigation.navigate("Games"); }}
      >
       VER OS JOGOS
      </Button>
     </View>

     <View>
      <Benefits
       img={quadradoA}
       title="Jogos"
       desc="O Broken Out fornece centenas de jogos no seu app, uma vasta coleção, jogos de todas as plataformas: mobile, tablet, desktop ou console que podem ser online ou offline, produtos de diversos gostos!"
      />
      <Benefits
       img={quadradoB}
       title="Avaliação"
       desc="O nosso projeto terá uma seção onde usuário poder avaliar os jogos. Assim, outros um usuário com dúvida de algum jogo pode saber se o jogo vale ou não a pena."
      />
      <Benefits
       img={quadradoC}
       title="Comentários"
       desc="Os comentários possibilitam a troca de informações entre os usuários para facilitar naquele jogo difícil, contendo dicas, explicações do jogo que você está com dificuldade."
      />
     </View>

     <Image source={line} style={styles.line} />

     <View style={styles.team}>
      <Image source={team} style={styles.teamImg} />

      <Text style={styles.teamText}>
       Nossa equipe que desenvolveu esse fórum foi feito devido ao projeto da faculdade, com 4 alunos do grupo criamos esse projeto que visa em um fórum de ajuda aos jogadores. O grupo vem criando outros tipos de projetos a 3 semestres. O nosso projeto Broken Out tem o objetivo de ficar um bom tempo online devido a quantidade de jogadores que buscam, tem dúvidas ou dificuldade em alguns tipos de jogos com dificuldade avançada, e que tenham dúvidas no qual escolher ou que apenas deseja se informar melhor sobre determinado jogo.
      </Text>

      <Button
       icon="cards"
       mode="contained"
       style={{ backgroundColor: colors.accent }}
       onPress={() => { navigation.navigate("Games"); }}
      >
       VER OS JOGOS
      </Button>

     </View>

    </View>
   </ScrollView>

  </>
 );
}

export default Home;