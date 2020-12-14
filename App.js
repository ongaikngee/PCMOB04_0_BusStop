import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {

  const [loading, setLoading] = useState(true);
  const [arrival, setArrival] = useState("");
  const BUSSTOP_URL = "https://arrivelah2.busrouter.sg/?id=48131";


const loadBusStop = () => {

  setLoading(true);
  console.log("loading....")

  fetch(BUSSTOP_URL)
    .then((response) => response.json())
    .then((responseData) =>{
      console.log(responseData);
      const MY_BUS = responseData.services.filter(
        (item) => item.no === "138"
      )[0];

      console.log("My Bus" + JSON.stringify(MY_BUS));
      console.log(MY_BUS.next.time);
      setArrival(MY_BUS.next.duration_ms);
      setLoading(false);
    });
}

useEffect(() => {
  const interval = setInterval((loadBusStop),5000);
  return () => clearInterval(interval);
}, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus arrival time:</Text>
      <Text style={styles.loading}>
        {loading ? <ActivityIndicator size="large" color="green"/> : arrival+"ms"}
        </Text>
      
      <TouchableOpacity>
        <Text style={styles.button}>Refresh</Text>
        </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button:{
    // width:300,
    // height:50,
    borderRadius:25,
    backgroundColor:'green',
    // justifyContent:'center',
    // alignItems:'center',
    padding:20,
    paddingLeft:40,
    paddingRight:40,
    fontWeight:'bold',
    color:'white',
    margin:30,
    fontSize:30,
  },
  loading:{
    fontSize:40,
    margin:30,
  },
  title:{
    fontSize:30,
    margin:30,
  }
});
