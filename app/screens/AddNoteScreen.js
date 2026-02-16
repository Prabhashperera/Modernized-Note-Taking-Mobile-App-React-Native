import { Ionicons } from '@expo/vector-icons'; //
import * as Speech from 'expo-speech'; //
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { Alert, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../Authcontext";
import { db } from "../firebase";

export default function AddNoteScreen({ route, navigation }) {
  const existingNote = route.params?.existingNote;

  const [title, setTitle] = useState(existingNote?.title || "");
  const [text, setText] = useState(existingNote?.text || "");
  const [saving, setSaving] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // Track speech state
  const textInputRef = useRef(null); // Ref to focus input for dictation
  
  const { user } = useContext(AuthContext);

  // Stop speaking if user leaves the screen
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  // --- FEATURE 1: AI READ ALOUD (Text-to-Speech) ---
  const toggleSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      const contentToRead = `${title}. ${text}`;
      if (!contentToRead.trim()) return Alert.alert("Empty", "Nothing to read yet!");
      
      setIsSpeaking(true);
      Speech.speak(contentToRead, {
        pitch: 0.85, // Slightly lower pitch for "AI" feel
        rate: 0.9,   // Slightly slower
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
      });
    }
  };

  // --- FEATURE 2: DICTATION TRIGGER ---
  const startDictation = () => {
    // We focus the input so the keyboard opens
    textInputRef.current?.focus();
    // We give a small haptic/visual cue (Alert for now)
    Alert.alert(
      "Voice Dictation", 
      "Tap the 🎤 Microphone icon on your keyboard to start speaking.",
      [{ text: "OK", style: "default" }]
    );
  };

  const saveNote = async () => {
    if (text.trim() === "" && title.trim() === "") return navigation.goBack();

    setSaving(true);
    try {
      if (existingNote) {
        await updateDoc(doc(db, "notes", existingNote.id), {
          title, text, updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, "notes"), {
          title, text, userId: user.uid, createdAt: new Date()
        });
      }
      navigation.goBack();
    } catch (e) {
      setSaving(false);
      Alert.alert("Error", "Could not save note.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0f172a]">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-6 pb-4 border-b border-white/5">
        
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="h-10 w-10 rounded-full bg-white/10 items-center justify-center border border-white/20"
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        
        {/* ACTION BUTTONS ROW */}
        <View className="flex-row gap-3">
            {/* MIC BUTTON (Dictation) */}
            <TouchableOpacity 
              onPress={startDictation}
              className="h-10 w-10 rounded-full bg-purple-500/20 items-center justify-center border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            >
              <Ionicons name="mic" size={20} color="#d8b4fe" />
            </TouchableOpacity>

            {/* SPEAKER BUTTON (Read Aloud) */}
            <TouchableOpacity 
              onPress={toggleSpeech}
              className={`h-10 w-10 rounded-full items-center justify-center border ${isSpeaking ? 'bg-cyan-500 shadow-[0_0_20px_cyan] border-cyan-400' : 'bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]'}`}
            >
              <Ionicons name={isSpeaking ? "stop" : "volume-high"} size={20} color={isSpeaking ? "white" : "#22d3ee"} />
            </TouchableOpacity>
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity 
          onPress={saveNote}
          disabled={saving}
          className={`px-5 py-2 rounded-full border border-emerald-500/50 ${saving ? 'bg-emerald-900/50' : 'bg-emerald-500/20'}`}
        >
          <Text className="text-emerald-400 font-bold text-xs tracking-[2px] uppercase">
            {saving ? "..." : "SAVE"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <View className="flex-1 px-6 pt-6">
        <TextInput
          className="text-4xl font-thin text-white mb-6 tracking-tight"
          placeholder="Title"
          placeholderTextColor="#475569"
          value={title}
          onChangeText={setTitle}
          selectionColor="#22d3ee"
        />

        <TextInput
          ref={textInputRef} // Attached Ref here
          className="flex-1 text-lg text-slate-300 font-light leading-8"
          placeholder="Start typing or use the mic..."
          placeholderTextColor="#475569"
          multiline
          textAlignVertical="top"
          value={text}
          onChangeText={setText}
          selectionColor="#22d3ee"
        />
      </View>
    </SafeAreaView>
  );
}