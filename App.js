import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet, Text, TextInput,
  useColorScheme,
  View
} from 'react-native';

import Crashes from 'appcenter-crashes'

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import * as Analytics from 'appcenter-analytics';

const App: () => Node = () => {
  const [amount, setAmount] = useState('10000');
  const [inflationRate, setInflationRate] = useState('10');
  const [timeInYears, setTimeInYears] = useState('6');
  const [riskFreeRate, setRiskFreeRate] = useState('10');
  const [afterInflation, setAfterInflation] = useState();
  const [atRiskFree, setAtRiskFree] = useState();
  const [atRiskFreeAfterInflation, setAtRiskFreeAfterInflation] = useState();
  const [difference, setDifference] = useState();
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
  };

  const throwError = async () => {
    const data = await Crashes.generateTestCrash();
  }

  const checkIsCrashed = async () => {
    const isCrashed = await Crashes.hasCrashedInLastSession();
    if (isCrashed) {
      const report = await Crashes.lastSessionCrashReport();
    }
  }

  const calculateInflationImpact = (value, inflationRate, time) => {
    return value / Math.pow(1 + inflationRate, time);
  }

  const calculate = async () => {
    const afterInflationVal = calculateInflationImpact(amount, inflationRate / 100, timeInYears);
    const atRiskFreeVal = amount * Math.pow(1 + riskFreeRate / 100, timeInYears);
    const atRiskFreeAfterInflationVal = calculateInflationImpact(atRiskFreeVal, inflationRate / 100, timeInYears);
    const differenceVal = Math.round(atRiskFreeAfterInflationVal - afterInflationVal);

    setAfterInflation(Math.round(afterInflationVal))
    setAtRiskFree(Math.round(atRiskFreeVal))
    setAtRiskFreeAfterInflation(atRiskFreeAfterInflationVal)
    setAfterInflation(Math.round(afterInflationVal))
    setDifference(Math.round(differenceVal))

    await Analytics.trackEvent('calculate_inflation', { Internet: 'WiFi', GPS: 'Off' });
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white
          }}>
          <View style={styles.sectionContainer}>
            <TextInput
              value={inflationRate}
              placeholder="Current inflation rate"
              style={styles.textBox} keyboardType="decimal-pad"
              onChangeText={setInflationRate}
            />
            <TextInput
              value={riskFreeRate}
              placeholder="Current risk free rate"
              style={styles.textBox} keyboardType="decimal-pad"
              onChangeText={setRiskFreeRate}
            />
            <TextInput
              value={amount}
              placeholder="Amount you want to save"
              style={styles.textBox} keyboardType="decimal-pad"
              onChangeText={setAmount}
            />
            <TextInput
              value={timeInYears}
              placeholder="For how long (in years) will you save?"
              style={styles.textBox} keyboardType="decimal-pad"
              onChangeText={setTimeInYears}
            />
            <Button title="Calculate inflation"
                    onPress={calculate}
            />
            <Text style={styles.label}>{timeInYears} years from now you will still have ${amount} but it will only be
              worth ${afterInflation}.</Text>
            <Text style={styles.label}>But if you invest it at a risk free rate you will have ${atRiskFree}.</Text>
            <Text style={styles.label}>Which will be worth ${atRiskFreeAfterInflation} after inflation.</Text>
            <Text style={styles.label}>A difference of: ${difference}.</Text>
          </View>
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
  },
  label: {
    marginTop: 10
  },
  textBox: {
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10
  }
});

export default App;
