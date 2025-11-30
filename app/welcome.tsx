import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect } from 'react';
import { Redirect,Link } from 'expo-router';

const source = require('../assets/images/background.mp4');

export default function Welcome() {
  const player = useVideoPlayer(source, (player) => {
    player.loop = true;
    player.muted = true;
    player.play(); 
  });

  return (
    <View style={styles.container}>
      {/* Background Video */}
      <VideoView
        player={player}
        nativeControls={false}
        allowsPictureInPicture={false}
        fullscreenOptions={{ enable: true }}
        style={StyleSheet.absoluteFill}  
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        <Text style={styles.title}>Pairly</Text>
        <Text style={styles.subtitle}>Find your person, not just a profile.</Text>

        <View style={{ marginTop: 150 }}>
          <Text style={styles.policyText}>
            By signing up for Pairly, you agree to our Terms of Service. Learn how we
            process your data in our Privacy Policy and Cookies Policy.
          </Text>

          <Link href='/sign-up' asChild>
  <TouchableOpacity style={styles.button}>
    <Text style={styles.buttonText}>Create account</Text>
  </TouchableOpacity>
</Link>


          <TouchableOpacity style={{ marginTop: 20 }}>
           
            <Link href='/sign-in'> <Text style={styles.signInText}>Sign in</Text></Link>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  policyText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 12,
    marginBottom: 30,
    opacity: 0.8,
    lineHeight: 16,
  },
  button: {
    backgroundColor: '#7D2E76',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  signInText: {
    color: 'white',
    fontSize: 16,
    marginTop: 8,
  },
});


