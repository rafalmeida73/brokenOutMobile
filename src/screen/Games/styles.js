import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

 loading: {
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1
 },

 searchContainer: {
  flexDirection: 'row',
  marginBottom: 10
 },

 inputSearch: {
  flex: 5
 },

 btn: {
  justifyContent: 'center',
 },

 games: {
  padding: 10,
  marginTop: 30,
  borderBottomLeftRadius: 40,
  borderTopRightRadius: 40
 },

 container: {
  padding: 10
 },

 imgGame: {
  aspectRatio: 16 / 9,
  width: '100%',
  height: 'auto',
  borderRadius: 10,
  resizeMode: "stretch"
 },

 title: {
  textAlign: 'center',
  color: '#fff',
  fontSize: 20,
  fontWeight: 'bold'
 }
});

export default styles;