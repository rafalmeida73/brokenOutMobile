import { StatusBar } from "expo-status-bar";
import React from "react";
import Routes from "./src/routes/index";
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00305A',
    accent: '#e10f4c',
    background: '#474445',
    backgroundDark: "#272526",
    primary: '#272526',
    primaryDark: '#b6063b',
    colorSecondary: '#c4c4c4',
    placeholder: '#fff',
    surface: '#fff',
    text: '#fff',
    action: '#ed213a',
    strategy: '#11998e',
    fight: '#f37335',
    running: '#63707b',
    rpg: '#FFC412',
    construction: '#3c1053',
    realLife: '#1295ea',
    music: '#ff957e',
    sports: '#0f9b0f',

    good: '#96c93d',
    reasonable: '#ffe000',
    bad: '#f44336',
  }
};

export default function App() {
  return (
    <>
      <PaperProvider theme={theme}>
        <Routes />
        <StatusBar style="inverted" />
      </PaperProvider>
    </>
  );
}