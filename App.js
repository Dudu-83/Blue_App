import React, { useState, useEffect, useRef } from 'react';
import { Alert, Modal, View, ImageBackground, TouchableOpacity, StyleSheet, Text, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useVideoPlayer, VideoView } from 'expo-video';

export default function App() {
  const videoSource = require('./assets/video-icon.mp4');
  const player = useVideoPlayer(videoSource, player => {
      player.loop = true; // Exemplo: define looping
      player.play(); // Exemplo: play automático
    });

  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    requestPermission();
  }, []);

  const onChangePhoto = (newPhoto) => {
    setPhoto(newPhoto);
    setIsCameraVisible(false);
  };

  const onCloseCamera = () => {
    setIsCameraVisible(false);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Sem acesso à câmera</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Permitir câmera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.photo}>
        {photo && (
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={{ uri: photo }}
          />
        )}
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsCameraVisible(true)}
        >
          <MaterialIcons name="camera-alt" size={40} color="#0059ff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setPhoto(null)}
        >
          <MaterialIcons name="delete" size={40} color="#0059ff" />
        </TouchableOpacity>
      </View>

      <CameraModal 
        isVisible={isCameraVisible} 
        onChangePhoto={onChangePhoto}
        onCloseCamera={onCloseCamera}
      />

      <View>
        <Text style={styles.titulo}>
          💙Bem-vindo ao Blue--App💙
        </Text>

        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          nativeControls // Mostra play/pause/slider nativo 
          />

        <Text style={styles.text}>
          😁🤩 !! Estamos muito felizes em ter você aqui !! 🥳😉
        </Text>

        <Text style={styles.text}>
          Atualmente, o aplicativo foi desenvolvido com um foco simples e prático: permitir que você tire fotos de forma rápida e também visualize suas imagens com facilidade.
        </Text>

        <Text style={styles.text}>
          Essa é apenas a primeira versão, e ainda estamos trabalhando para trazer novas funcionalidades e melhorias em breve. 🚀
        </Text>

        <Text style={styles.text}>
          Fique à vontade para explorar o app e aproveitar ao máximo o que ele já oferece!
        </Text>

        <Text style={styles.text}>
          💙 Obrigado por fazer parte do Blue--App 💙
        </Text>

      </View>

    </ScrollView>
  );
}

// 📸 CAMERA MODAL
const CameraModal = ({ isVisible, onChangePhoto, onCloseCamera }) => {
  const cameraRef = useRef(null);

  const onTakePicture = async () => {
    try {
      const photo = await cameraRef.current.takePictureAsync();
      onChangePhoto(photo.uri);
    } catch (error) {
      Alert.alert("Erro", "Erro ao tirar foto.");
    }
  };

  return (
    <Modal animationType="slide" visible={isVisible}>
      <CameraView
        style={{ flex: 1 }}
        ref={cameraRef}
        facing="back"
      >
        <MaterialIcons
          name="photo-camera"
          size={40}
          color="#0059ff"
          onPress={onTakePicture}
          style={styles.buttonTakePicture}
        />

        <MaterialIcons
          name="close"
          size={50}
          color="#0059ff"
          onPress={onCloseCamera}
          style={styles.buttonCloseCamera}
        />
      </CameraView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2668e4" },

  photo: {
    width: 300,
    height: 200,
    backgroundColor: "#ffffff",
    alignSelf: "center",
    marginTop: 80,
  },

  buttons: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },

  button: {
    backgroundColor: "#ffffff",
    margin: 20,
    borderRadius: 150,
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonTakePicture: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
  },

  buttonCloseCamera: {
    position: "absolute",
    top: 40,
    right: 20,
  },

   text: {
    margin: 10,
    marginTop: 10,
    flex: 0,
    color: '#000000',
    backgroundColor: "#5da8ff",
    alignSelf: "center",
    textAlign: "justify",
    justifyContent: "center",
  },

  titulo: {
    backgroundColor: "#00ffff",
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderLeftColor: "#00ffff",
    borderRightColor: "#00ffff",
    borderRadius: 70,
    margin: 12,
    marginTop: 1,
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    height: 100,
    padding: 32,
  },

  contentContainer: {
    flex: 1,
    paddingTop: 50,
  },

  video: {
    width: '100%',
    height: 300,
  },
});