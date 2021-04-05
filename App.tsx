import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import uploadToAnonymousFilesAsync from "anonymous-files";

// import ImageDimond from "./assets/Red_Diamond.png";

export interface AppProps {}

export interface DataImageStateProps {
  localUri: string | undefined;
  remoteUri: string | undefined;
}

const App: React.FunctionComponent<AppProps> = () => {
  const [dataImage, setDataimage] = React.useState<DataImageStateProps>({
    localUri: undefined,
    remoteUri: undefined,
  });

  let openImagePickerAsync = async () => {
    // permisos de lectura de imagenes
    let permisionResult = await ImagePicker.requestCameraPermissionsAsync();
    // if (permisionResult.granted === true) {
    //   alert("Permission to access to the camera are required");
    //   return;
    // }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }
    setDataimage({ ...dataImage, localUri: pickerResult.uri });
  };

  let openShareDialog = async () => {
    if (!(await Sharing.isAvailableAsync()))
      return alert("Sharing is not available on you plataform");

    if (!dataImage.localUri) return alert("Please select an image to share");

    if (Platform.OS === "web") {
      const remoteUri = await uploadToAnonymousFilesAsync(dataImage.localUri);
      setDataimage({ ...dataImage, remoteUri });
    } else {
      await Sharing.shareAsync(dataImage.localUri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title__center}>Pick an Image!</Text>
      <TouchableOpacity onPress={openImagePickerAsync}>
        <Image
          source={{
            uri:
              dataImage.localUri !== undefined
                ? dataImage.localUri
                : "https://picsum.photos/id/237/200/200",
          }}
          style={styles.image}
        />
      </TouchableOpacity>

      {dataImage.localUri && (
        <TouchableOpacity style={styles.button} onPress={openShareDialog}>
          <Text style={styles.button__text}>Share this image</Text>
        </TouchableOpacity>
      )}

      {dataImage.remoteUri && (
        <Text style={styles.text__link}>{dataImage.remoteUri}</Text>
      )}

      {/* <Image source={ImageDimond} style={styles.image} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#292929",
  },

  title__center: {
    fontSize: 30,
    color: "white",
  },

  image: {
    height: 200,
    width: 200,
    borderRadius: 100,
    resizeMode: "contain",
  },

  button: {
    backgroundColor: "black",
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginTop: 20,
    borderRadius: 20,
  },

  button__text: {
    color: "white",
    fontSize: 20,
  },

  text__link: {
    color: "blue",
    marginTop: 10,
    fontSize: 20,
    textDecorationLine: "underline",
  },
});

export default App;
