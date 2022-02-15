import React, {useState} from 'react';
import AppleHealthKit from 'react-native-health';
import {
  NativeAppEventEmitter,
  View,
  Text,
  Button,
  StyleSheet,
} from 'react-native';

const App = () => {
  const [heartBeat, setHeartBeat] = useState();

  const permissions = {
    permissions: {
      read: [
        AppleHealthKit.Constants.Permissions.HeartRate,
        AppleHealthKit.Constants.Permissions.Workout,
        AppleHealthKit.Constants.Permissions.DistanceCycling,
        AppleHealthKit.Constants.Permissions.RestingHeartRate,
      ],
      write: [AppleHealthKit.Constants.Permissions.Steps],
    },
  };

  AppleHealthKit.initHealthKit(permissions, error => {
    // AppleHealthKit.setObserver({type: 'Cycling'});

    NativeAppEventEmitter.addListener(
      'healthKit:RestingHeartRate:setup:success',
      () => console.log('SUCCESS'),
    );

    /* Register native listener that will be triggered on each update */
    NativeAppEventEmitter.addListener(
      'healthKit:RestingHeartRate:new',
      callback,
    );

    NativeAppEventEmitter.addListener(
      'healthKit:RestingHeartRate:setup:failure',
      () => console.log('failure'),
    );

    NativeAppEventEmitter.addListener(
      'healthKit:RestingHeartRate:failure',
      () => console.log('failure----!!!'),
    );
  });

  const getHeartBeat = () => {
    const options = {
      startDate: new Date(2022, 1, 1).toISOString(),
    };
    AppleHealthKit.getHeartRateSamples(options, (callbackError, results) => {
      setHeartBeat(results[0].value);
    });
  };

  const callback = () => {
    let options = {
      startDate: new Date(2021, 0, 0).toISOString(),
      endDate: new Date().toISOString(),
      // type: 'Cycling',
    };

    AppleHealthKit.getSamples(options, (err, results) => {
      if (err) {
        console.log('errr====>>>>>>', err);
      }
      console.log('results---->>>>>', results);
    });
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={{marginRight: 20}}>HealthKit latest HeartBeat -</Text>
          <Text>{heartBeat}</Text>
        </View>

        <Button title="getHeartBeat" onPress={getHeartBeat} />
      </View>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    borderColor: 'green',
    borderRadius: 10,
    borderWidth: 1,
    width: '100%',
    height: 180,
    justifyContent: 'space-around',
    marginBottom: 30,
    padding: 5,
    backgroundColor: 'white',
  },

  box: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
