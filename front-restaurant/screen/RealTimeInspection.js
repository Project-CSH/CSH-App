// import React, { useState, useEffect, useRef } from 'react';
// import { StyleSheet, SafeAreaView, StatusBar, View, TouchableOpacity, Button, Image } from 'react-native';
// import { TextInput, Text } from 'react-native-paper';
// import { Camera, CameraType } from 'expo-camera';


// const question = ['주방 싱크대를 촬영해 주세요', '식기를 촬영해 주세요'];
// const RealTimeInspection = () => {
//     const [type, setType] = useState(CameraType.back);
//     const [permission, requestPermission] = Camera.useCameraPermissions();
//     const [camera, setCamera] = useState(null);
//     const [imagem,  setImage] = useState('');
//     if (!permission) {
//         // Camera permissions are still loading
//         return <View />;
//     }

//     if (!permission.granted) {
//         // Camera permissions are not granted yet
//         return (
//             <SafeAreaView style={styles.container}>
//                 <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//                     <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
//                     <Button onPress={requestPermission} title="grant permission" />
//                 </View>
//             </SafeAreaView>
//         );
//     }

//     const toggleCameraType = () => {
//         setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
//     }
//     const takePicture = async () => {
//         if (camera) {
//             try {
//                 const data = await camera.takePictureAsync(null)
//                 setImage(data.uri);
//                 console.log(data)
//             } catch (error) {
                
//             }
//         }
//     }
    
//     const recordAudio = async()=>{
//         try {
//             if(camera){
//                 console.log(camera)
//                 // let video = await camera.recordAsync({mute:true, maxDuration:5})
//                 // console.log('video', video)
//                 const options = { quality: '720p', maxDuration: 1 };
//                 const data = await camera.recordAsync(options);
//                 console.log(data)
//             }
//         } catch (error) {
            
//         }
//     }
    
//     const stopRecordAudio = ()=>{
//         try {
//             if(camera){
//                 console.log(data)
//                 // let video = await camera.stopRecording();
//                 // console.log('video', video);
//                 camera.stopRecording();
//                 console.log('stopped recording');
//             }
//         } catch (error) {
            
//         }
//     }



//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={{position:'absolute',zIndex:1}}>
//                 <Text style={styles.text}>가이드라인에 따라 촬영을 진행할 것.</Text>
//             </View>
//             <Camera style={styles.cam} type={type}  ref={ref => setCamera(ref)}>
//                 <View style={styles.buttonContainer}>
//                     {/* <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
//                         <Text style={styles.text}>전환</Text>
//                     </TouchableOpacity> */}
//                     <TouchableOpacity style={styles.button} onPress={takePicture}>
//                         <Text style={styles.text}>촬영</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.button} onPress={recordAudio}>
//                         <Text style={styles.text}>녹화</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.button} onPress={stopRecordAudio}>
//                         <Text style={styles.text}>중지</Text>
//                     </TouchableOpacity>
//                 </View>
//             </Camera>
//         </SafeAreaView>);
// }

// export default RealTimeInspection;


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         marginTop: StatusBar.currentHeight || 0,
//     },
//     cam: {
//         flex: 1,
//     },
//     buttonContainer: {
//         flex: 1,
//         flexDirection: 'row',
//         backgroundColor: 'transparent',
//         margin: 64,
//     },
//     button: {
//         flex: 1,
//         alignSelf: 'flex-end',
//         alignItems: 'center',
//     },
//     text: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: 'white',
//     },
// });

import { StyleSheet, Text, View, Button, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import React,{ useEffect, useState, useRef } from 'react';

import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';

const question = ['식기를 촬영해주세요!','주방 전체를 촬영해주세요!', '바닥을 촬영해주세요!'];
const RealTimeInspection = () => {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [count,setCount] = useState(0);
  const [video, setVideo] = useState();
  const navigation = useNavigation();
  useEffect(() => {
    permissionSet();
    navigation.addListener('blur', (e) => {
      console.log('종료');
      return()=>{}
    });
    return()=>{}
  }, []);

  useEffect(()=>{
    if (count > 2) {
      Alert.alert(
        "알림",
        `촬영이 완료되었습니다.`,
        [
            {
                text: "OK", onPress: () => {
                    
                }
            }
        ]
    );
      setCount(0);
    }
  },[count])
  const permissionSet =  async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    setHasCameraPermission(cameraPermission.status === "granted");
    setHasMicrophonePermission(microphonePermission.status === "granted");
    setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
  };

  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined) {
    return <><Text>Requestion permissions...</Text></>
  } else if (!hasCameraPermission) {
    return  <><Text>Permission for camera not granted.</Text></>
  }

  let recordVideo = () => {
    setIsRecording(true);
    let options = {
      quality: "1080p",
      maxDuration: 60,
      mute: true
    };

    cameraRef.current.recordAsync(options).then((recordedVideo) => {
      setVideo(recordedVideo);
      setIsRecording(false);
    });

    setTimeout(() => {
      stopRecording();
      setCount(prev=>prev+1);
    }, 3000);
  };

  let stopRecording = () => {
    console.log(cameraRef.current);
    setIsRecording(false);
    cameraRef.current.stopRecording();
  };

  if (video) {
    let saveVideo = () => {
      MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
        console.log(video)
        setVideo(undefined);
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <Video
          style={styles.video}
          source={{uri: video.uri}}
          useNativeControls
          resizeMode='contain'
          isLooping
        />
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-evenly', position:'absolute', width:'100%'}}>
          {/* <Button title="Share" onPress={shareVideo} /> */}
          {hasMediaLibraryPermission ? 
         <TouchableOpacity style={{backgroundColor:'#2ad3e7', borderRadius:8, padding:10}} onPress={saveVideo} ><Text style={{color:'#ffffff', fontWeight:'bold',fontSize:20}}>전송하기</Text></TouchableOpacity>: undefined}
          {/* <Button title="다시 촬영하기" onPress={() => setVideo(undefined)} /> */}
          <TouchableOpacity style={{backgroundColor:'#2ad3e7', borderRadius:8, padding:10}} onPress={() => setVideo(undefined)} ><Text style={{color:'#ffffff', fontWeight:'bold',fontSize:20}}>다시 촬영하기</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
    {!isRecording &&<View style={{position:'absolute',top:20,zIndex:1, width:'100%',alignItems:'center', backgroundColor:'#ffffff80' }}>
           <Text style={{fontWeight:'bold', fontSize:30}}>{question[count]}</Text>
        </View>}
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        {/* <Button title={isRecording ? "촬영종료" : "촬영시작"} onPress={isRecording ? stopRecording : recordVideo} /> */}
        {!isRecording && <TouchableOpacity style={{backgroundColor:'#2ad3e7', borderRadius:8, padding:10}} onPress={recordVideo} ><Text style={{color:'#ffffff', fontWeight:'bold',fontSize:20}}>촬영시작</Text></TouchableOpacity>}
      </View>
    </Camera>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: "#fff",
    borderRadius:8
    // alignSelf: "flex-end"
  },
  video: {
    flex: 1,
    alignSelf: "stretch"
  }
});


export default RealTimeInspection;