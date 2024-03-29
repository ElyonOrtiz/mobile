import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'
import { styled } from 'nativewind'
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import { useRouter }from 'expo-router'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import * as SecureStore from 'expo-secure-store';

import BlurBg from '../src/assets/bg-blur.png'
import Stripes from '../src/assets/stripes.svg'
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg' 
import { api } from '../src/lib/api';

const StyledStripes = styled(Stripes)

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/0194de8c62f74fafab8b',
}

export default function App() {
  const router = useRouter()
 
  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold
  })
  const [, response, promptAsync] = useAuthRequest(
    {
      clientId: '0194de8c62f74fafab8b',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime'
      }),
    },
    discovery
  );

  async function handleGithubOauthCode(code:string) {
    const response = await api.post('/register', {
      code,
    })
    const { token } = response.data
      
    await SecureStore.setItemAsync('token', token)

    router.push('/memories')
  }

  useEffect(() => {
    "pegar Url da minha api para metch com github"
   // console.log(response)
   // console.log(makeRedirectUri({
   //   scheme: 'nlwspacetime'
   // }))
    if (response?.type === 'success') {
      const { code } = response.params;
      handleGithubOauthCode(code)
    }
  }, [response]);

  if(!hasLoadedFonts){
    return null
  }
  return (
    <ImageBackground
     source={BlurBg}
     className='relative flex-1 items-center bg-gray-900 px-8 py-10'
     imageStyle={{ position: 'absolute', left:'-100%' }}
    > 
      <StyledStripes className='absolute left-2'/>
      <View className='flex-1 items-center justify-center gap-6'>
        <NLWLogo/>
        <View className='space-y-2'>
          <Text className='text-center font-title text-2xl leading-tight text-gray-50'>
            Sua cáopsula do tempo
          </Text>
          <Text className='text-center font-body text-base leading-relaxed text-gray-100'>
            Colecione momentos marcantes da sua jornada e compartilhe (se quiser) com o mundo
          </Text>
          <TouchableOpacity onPress={() => promptAsync()} className='rounded-full bg-green-500 px-5 py-2' activeOpacity={0.6}>
            <Text className='font-alt text-sm uppercase text-black'>Cadastrar lembrança</Text>
          </TouchableOpacity>
        </View >
      </View>
      <Text className='text-center font-body text-sm leading-relaxed text-gray-200'>Feito com 💜 no NLW da Rocketseat</Text>
      <StatusBar style='light' translucent/>
    </ImageBackground>
  );
}



