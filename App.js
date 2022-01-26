import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View
} from 'react-native';

import Crashes from 'appcenter-crashes'

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
  };

  const throwError = async () => {
    const data = await Crashes.generateTestCrash();
    console.log(27, 'zxc' ,'data', data)
  }

  const checkIsCrashed = async () => {
    const isCrashed = await Crashes.hasCrashedInLastSession();
    console.log(31, 'zxc' ,'isCrashed', isCrashed)
    if (isCrashed) {
      const report = await Crashes.lastSessionCrashReport();
      console.log(34, 'zxc' ,'report', report)
    }
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'}/>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white
          }}>
          <Button title={'Crash'} onPress={throwError}/>
          <Button title={'Check'} onPress={checkIsCrashed}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600'
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400'
  },
  highlight: {
    fontWeight: '700'
  }
});

export default App;
