import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { ScrollView } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { request } from '../api/api'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import {
  GOOGLE_ANDROID_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
} from '../config/googleConfig';

WebBrowser.maybeCompleteAuthSession()
const LoginScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState('customer')

  const [googleRequest, googleResponse, promptAsync] = Google.useAuthRequest({
  androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  webClientId: GOOGLE_WEB_CLIENT_ID,
});
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password required')
      return
    }

    try {
      setLoading(true)

      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })

      await AsyncStorage.setItem('token', res.token)
      await AsyncStorage.setItem('user', JSON.stringify(res.user))

      navigation.replace('Dashboard')
    } catch (error) {
      Alert.alert('Login Failed', error.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    const handleGoogleLogin = async () => {
      if (googleResponse?.type !== 'success') return

      try {
        setGoogleLoading(true)

        const idToken = googleResponse.authentication?.idToken

        if (!idToken) {
          Alert.alert('Google Login Failed', 'Google token not received')
          return
        }

        const res = await request('/auth/google-login', {
          method: 'POST',
          body: JSON.stringify({
            idToken,
            role: selectedRole
          })
        })

        await AsyncStorage.setItem('token', res.token)
        await AsyncStorage.setItem('user', JSON.stringify(res.user))

        navigation.replace('Dashboard')
      } catch (error) {
        Alert.alert('Google Login Failed', error.message)
      } finally {
        setGoogleLoading(false)
      }
    }

    handleGoogleLogin()
  }, [googleResponse])
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.guestBtn}>
        <Text style={styles.guestText}>Continue as Guest</Text>
        <Ionicons name='chevron-forward' size={20} color='#222' />
      </TouchableOpacity>

      <View style={styles.logoBox}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode='contain'
        />
        <Text style={styles.title}>Welcome Grocery Store</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputBox}>
          <MaterialIcons name='email' size={28} color='#555' />
          <TextInput
            placeholder='Email'
            placeholderTextColor='#666'
            style={styles.input}
            keyboardType='email-address'
            value={email}
            onChangeText={setEmail}
            autoCapitalize='none'
          />
        </View>

        <View style={styles.inputBox}>
          <Ionicons name='lock-closed-outline' size={28} color='#555' />
          <TextInput
            placeholder='Password'
            placeholderTextColor='#666'
            style={styles.input}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name='eye-outline' size={27} color='#aaa' />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInBtn} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <Text style={styles.signInText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.orText}>or</Text>
        <View style={styles.roleBox}>
          <TouchableOpacity
            style={[
              styles.roleBtn,
              selectedRole === 'customer' && styles.activeRoleBtn
            ]}
            onPress={() => setSelectedRole('customer')}
          >
            <Text
              style={[
                styles.roleText,
                selectedRole === 'customer' && styles.activeRoleText
              ]}
            >
              Customer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleBtn,
              selectedRole === 'seller' && styles.activeRoleBtn
            ]}
            onPress={() => setSelectedRole('seller')}
          >
            <Text
              style={[
                styles.roleText,
                selectedRole === 'seller' && styles.activeRoleText
              ]}
            >
              Seller
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.googleBtn}
          disabled={!googleRequest || googleLoading}
          onPress={() => promptAsync()}
        >
          {googleLoading ? (
            <ActivityIndicator color='#333' />
          ) : (
            <>
              <Image
                source={{
                  uri: 'https://png.pngtree.com/png-vector/20230817/ourmid/pngtree-google-internet-icon-vector-png-image_9183287.png'
                }}
                style={styles.googleIcon}
              />
              <Text style={styles.googleText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 28
  },
  guestBtn: {
    marginTop: 38,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center'
  },
  guestText: {
    fontSize: 18,
    color: '#222',
    fontWeight: '400'
  },
  logoBox: {
    alignItems: 'center',
    marginTop: 75
  },
  logo: {
    width: 500,
    height: 500,
    marginVertical: -150
  },
  title: {
    fontSize: 21,
    color: '#222',
    marginTop: 8,
    fontWeight: '400'
  },
  form: {
    marginTop: 48
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
    backgroundColor: '#fff'
  },
  input: {
    flex: 1,
    fontSize: 15,
    marginLeft: 16,
    color: '#222'
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 14
  },
  forgotText: {
    color: '#888',
    fontSize: 18
  },
  signInBtn: {
    height: 58,
    backgroundColor: '#000',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4
  },
  signInText: {
    color: '#fff',
    fontSize: 18
  },
  orText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    marginVertical: 10
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
    justifyContent: 'center'
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 14
  },
  googleText: {
    fontSize: 18,
    color: '#333'
  },
  roleBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 14,
    gap: 10
  },
  roleBtn: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  activeRoleBtn: {
    backgroundColor: '#000',
    borderColor: '#000'
  },
  roleText: {
    color: '#333',
    fontSize: 16
  },
  activeRoleText: {
    color: '#fff'
  }
})
