import React, {useEffect, useState} from 'react';
import {
  Button,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import {Audio} from 'expo-av';

import {Colors} from 'react-native/Libraries/NewAppScreen';
const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;

//;

var timer;
let wgL;
let bgL;
const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [wTime, setWtime] = useState(10);
  const [bTime, setBtime] = useState(5);
  const [wG, setWg] = useState(10);
  const [bG, setBg] = useState(5);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [audio, setAudio] = useState();
  const [play, setPlay] = useState(false);
  useEffect(() => {
    Audio.Sound.createAsync(require('./assets/1.mp3'))
      .then(resp => {
        setAudio(resp.sound);
      })
      .catch(er => {
        console.log(er);
      });
  }, [setAudio]);

  const startHandler = () => {
    wgL = wG;
    bgL = bG;
    setPlay(true);
    setWorking(true);
  };

  const resetHandler = () => {
    timer && clearInterval(timer);
    setWg(wTime);
    setBg(bTime);
    setWorking(false);
    setResting(false);
    setPlay(false);
    //  audio && audio.stopAsync();
  };

  useEffect(() => {
    if (working) {
      timer && clearInterval(timer);

      timer = setInterval(() => {
        if (wgL < 0) {
          clearInterval(timer);
          setWorking(false);
          setResting(true);
          wgL = Number(wTime) + 1;
        } else {
          wgL--;
          if (wgL == 0) {
            audio && audio.replayAsync();

            setWg(0);
          } else setWg(wgL);
        }
      }, 1000);
    }
  }, [working, setWorking, setResting, setWg, wTime]);
  useEffect(() => {
    if (resting) {
      timer && clearInterval(timer);
      timer = setInterval(() => {
        if (bgL < 0) {
          clearInterval(timer);
          setResting(false);
          setWorking(true);
          bgL = Number(bTime) + 1;
        } else {
          bgL--;
          if (bgL == 0) {
            audio && audio.replayAsync();

            setBg(0);
          } else setBg(bgL);
        }
      }, 1000);
    }
  }, [resting, setWorking, setResting, setBg, bTime, audio]);

  return (
    <SafeAreaView
      style={{
        ...backgroundStyle,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:
          working && wG > 0
            ? '#ff6666'
            : resting && bG > 0
            ? '#79d2a6'
            : '#ccffff',
      }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={{height: h * 0.25, width: w, justifyContent: 'center'}}>
        <Text
          style={{
            fontSize: 40,
            textAlign: 'center',
            textAlignVertical: 'center',
          }}>
          {working && wG > 0
            ? 'Working'
            : resting && bG >= 0
            ? 'Resting'
            : 'Welcome'}
        </Text>
      </View>
      <View style={{height: h * 0.45}}>
        {working && wG > 0 && (
          <View>
            <Text
              style={{fontSize: 20, textAlign: 'center', paddingBottom: 20}}>
              Working
            </Text>
            <View style={styles.timerBorder}>
              <Text
                style={{
                  ...styles.timer,
                  fontSize:
                    wTime.toString().length <= 1
                      ? w / 4
                      : w / (2 * wTime.toString().length),
                }}>
                {wG}
              </Text>
            </View>
          </View>
        )}
        {resting && bG >= 0 && (
          <View>
            <Text
              style={{fontSize: 20, textAlign: 'center', paddingBottom: 20}}>
              Resting
            </Text>
            <View style={styles.timerBorder}>
              <Text
                style={{
                  ...styles.timer,
                  fontSize:
                    bTime.toString().length <= 1
                      ? w / 4
                      : w / (3 * bTime.toString().length),
                }}>
                {bG}
              </Text>
            </View>
          </View>
        )}
        {!play && (
          <View
            style={{
              paddingVertical: 10,
              flexDirection: 'row',
              width: w * 0.9,
              justifyContent: 'space-between',
            }}>
            <View style={{width: w * 0.4, alignItems: 'center'}}>
              <Text>Workout Duration</Text>
              <TextInput
                value={wTime.toString()}
                onChangeText={text => {
                  setWg(text);
                  setWtime(text);
                }}
                editable={!resting && !working}
                placeholder="Workout time in seconds"
                keyboardType="number-pad"
                style={{
                  width: w * 0.4,
                  height: 40,
                  borderWidth: 1,
                  borderRadius: 5,
                  textAlign: 'center',
                }}
              />
            </View>
            <View style={{width: w * 0.4, alignItems: 'center'}}>
              <Text>Rest Duration</Text>

              <TextInput
                editable={!resting && !working}
                placeholder="Break after each workout time in seconds"
                keyboardType="number-pad"
                value={bTime.toString()}
                onChangeText={text => {
                  setBg(text);
                  setBtime(text);
                }}
                style={{
                  width: w * 0.4,
                  height: 40,
                  borderWidth: 1,
                  borderRadius: 5,
                  textAlign: 'center',
                }}
              />
            </View>
          </View>
        )}
        <View style={{height: h / 20}} />
        {!play && <Button title="Start" onPress={startHandler} />}
        {play && <Button title="Reset" onPress={resetHandler} />}
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  timerBorder: {
    height: Platform.OS == 'android' ? w / 2 : w / 1.5,
    width: Platform.OS == 'android' ? w / 2 : w / 1.5,
    borderRadius: Platform.OS == 'android' ? w / 2 : w / 1.5,
    borderWidth: 6,
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: 'red',
  },
  timer: {
    fontSize: Platform.OS == 'android' ? w / 4 : w / 3.5,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'green',
  },
});
