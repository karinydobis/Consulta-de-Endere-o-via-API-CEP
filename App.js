import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import ConsultaCEP from './components/ConsultaCEP';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ConsultaCEP />
    </SafeAreaView>
  );
};

export default App;
