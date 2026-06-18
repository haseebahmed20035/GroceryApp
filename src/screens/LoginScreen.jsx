import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

const LoginScreen = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.guestBtn}>
        <Text style={styles.guestText}>Continue as Guest</Text>
        <Ionicons name="chevron-forward" size={20} color="#222" />
      </TouchableOpacity>

      <View style={styles.logoBox}>
        <Image
          source={require('./assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome Grocery Store</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputBox}>
          <MaterialIcons name="email" size={28} color="#555" />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#666"
            style={styles.input}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={28} color="#555" />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#666"
            style={styles.input}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name="eye-outline" size={27} color="#aaa" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInBtn}
        onPress={()=>{navigation.navigate('Dashboard')}}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or</Text>

        <TouchableOpacity style={styles.googleBtn}>
          <Image
            source={{
              uri: 'https://png.pngtree.com/png-vector/20230817/ourmid/pngtree-google-internet-icon-vector-png-image_9183287.png',
            }}
            style={styles.googleIcon}
          />
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 28,
  },
  guestBtn: {
    marginTop: 38,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  guestText: {
    fontSize: 18,
    color: '#222',
    fontWeight: '400',
  },
  logoBox: {
    alignItems: 'center',
    marginTop: 75,
  },
  logo: {
    width: 500,
    height: 500,
    marginVertical:-150
  },
  title: {
    fontSize: 21,
    color: '#222',
    marginTop: 8,
    fontWeight: '400',
  },
  form: {
    marginTop: 48,
  },
  inputBox: {
    height: 53,
    borderWidth: 1.2,
    borderColor: '#555',
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 18,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 15,
    marginLeft: 16,
    color: '#222',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 14,
  },
  forgotText: {
    color: '#888',
    fontSize: 18,
  },
  signInBtn: {
    height: 58,
    backgroundColor: '#000',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  signInText: {
    color: '#fff',
    fontSize: 18,
  },
  orText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    marginVertical: 10,
  },
  googleBtn: {
    height: 57,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    width: '72%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 14,
  },
  googleText: {
    fontSize: 18,
    color: '#333',
  },
});