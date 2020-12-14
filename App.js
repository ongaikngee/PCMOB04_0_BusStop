import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
	const [ loading, setLoading ] = useState(true);
	const [ arrival, setArrival ] = useState('');
	const [ duration, setDuration ] = useState('');

	const BUS_NO = '138';
	const BUSSTOP_CODE = '48131';
	const BUSSTOP_URL = 'https://arrivelah2.busrouter.sg/?id=' + BUSSTOP_CODE;

	const loadBusStop = () => {
		setLoading(true);
		console.log('loading....');

		fetch(BUSSTOP_URL)
			.then((response) => response.json())
			//filter declarative method. is [0] necessary?
			.then((responseData) => {
				//Return the array that matched the BUS_NO
				const MY_BUS = responseData.services.filter((item) => item.no === BUS_NO)[0];

				// console.log('My Bus' + JSON.stringify(MY_BUS));

				//to abstract time and duration
				// setArrival(MY_BUS.next.time);
				const MY_BUS_NEXTTIME = new Date(MY_BUS.next.time);
				let [ H, M, S ] = MY_BUS_NEXTTIME.toLocaleTimeString('en-US').split(':');
				setArrival(`${H}:${M}:${S}`);

				//set Duration
				// console.log(MY_BUS.next.duration_ms);
				const MY_BUS_NEXTDUR = Math.round(MY_BUS.next.duration_ms / 60000);
        setDuration(MY_BUS_NEXTDUR + ' min');

				//Jon: To find out all the bus from the busstop
				const BUS_AVAILABLE = responseData.services[0].no;
				console.log('Phase II');
				console.log(BUS_AVAILABLE);
				for (let x = 0; x < responseData.services.length; x++) {
					console.log(responseData.services[x].no);
				}

				const BUSES = responseData.services.map((x) => x.no);
				console.log(BUSES);

				BUSES.map((item) => {
					console.log(item);
					let myBusNo = item;

					const BUS_ENQ = responseData.services.filter((item) => item.no === myBusNo)[0];

					const BUS_ENQ_NEXTTIME = new Date(BUS_ENQ.next.time);
					let [ H, M, S ] = BUS_ENQ_NEXTTIME.toLocaleTimeString('en-US').split(':');
					console.log('PHASE II BUSES INFORMATION');
					console.log(BUS_ENQ);
					console.log(`Bus No: ${BUS_ENQ.no} will arrived at ${H}:${M}:${S}`);
				});

				setLoading(false);
			});
	};

	useEffect(() => {
		loadBusStop();
		const interval = setInterval(loadBusStop, 15000);
		return () => clearInterval(interval);
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Bus arrival time:</Text>
			<Text style={styles.loading}>{loading ? <ActivityIndicator size="large" color="green" /> : arrival}</Text>
			<Text style={styles.duration}>{loading ? <ActivityIndicator size="large" color="green" /> : duration}</Text>
			<TouchableOpacity onPress={loadBusStop}>
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
		justifyContent: 'center'
	},
	button: {
		borderRadius: 25,
		backgroundColor: 'green',
		padding: 20,
		paddingLeft: 40,
		paddingRight: 40,
		fontWeight: 'bold',
		color: 'white',
		margin: 30,
		fontSize: 30
	},
	loading: {
		fontSize: 40
		// margin: 30
	},
	title: {
		fontSize: 30
		// margin: 30
	},
	duration: {
		fontSize: 25,
		color: '#888'
	}
});
