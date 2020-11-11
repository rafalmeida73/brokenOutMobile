import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
 container: {
  padding: 10,
  flex: 1,
 },

 fab: {
  position: 'absolute',
  margin: 16,
  right: 0,
  bottom: 0,
},

 img: {
  aspectRatio: 16 / 9,
  width: '100%',
  height: 'auto',
  borderRadius: 10,
  resizeMode: "stretch"
 },

 desc: {
  fontSize: 16,
  textAlign: 'center',
  color: '#fff',
  fontWeight: 'bold',
  marginTop: 20,
  marginBottom: 20,
 },

 store: {
  justifyContent: 'space-around',
  flexDirection: 'row',
  marginBottom: 50
 },

 imgBuy: {
  width: 48,
  height: 48
 },

 newsTitle: {
  fontSize: 25,
  fontWeight: 'bold',
  color: '#fff'
 },

 news: {
  aspectRatio: 1,
  width: '100%',
  height: '100%',
 },

 iframe: {
  aspectRatio: 1,
  width: '100%',
  height: '100%',
  marginBottom: 50,
  marginTop: 50,
 },

 commentTitle: {
  fontSize: 25,
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: 30,
  marginTop: 30,
 },

 comments: {
  backgroundColor: '#fff',
  padding: 10,
  marginBottom: 10,
 },

 commentContainer: {
  flexDirection: 'row'
 },

 autor: {
  fontSize: 25,
  fontWeight: 'bold'
 },

 note: {
  marginLeft: 10,
  color: '#fff',
  fontSize: 25,
  fontWeight: 'bold',
  width: 30,
  textAlign: 'center',
  borderRadius: 5
 },

 modal: {
  flexGrow: 1,
  alignItems: 'flex-end'
 },

 date: {
  fontSize: 10,
  marginBottom: 20
 },

 comment: {
  textAlign: 'center',
  fontSize: 20
 },

 form:{
  marginBottom: 50,
 },

 lottie:{
  width: '100%',
  height: 'auto',
 },

 options:{
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 50
 },

 textDelete:{
  fontSize: 20,
  textAlign: 'center'
 },

 confirm:{
  color: '#96c93d',
  fontWeight: 'bold'
 }
});

export default styles;