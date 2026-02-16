import { Ionicons } from '@expo/vector-icons'; //
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { Alert, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../Authcontext";
import { db } from "../firebase";

export default function AddNoteScreen({ route, navigation }) {
  // Check if we are editing or creating new
  const existingNote = route.params?.existingNote;

  const [title, setTitle] = useState(existingNote?.title || "");
  const [text, setText] = useState(existingNote?.text || "");
  const [saving, setSaving] = useState(false);
  const { user } = useContext(AuthContext);

  const saveNote = async () => {
    if (text.trim() === "" && title.trim() === "") return navigation.goBack();

    setSaving(true);
    try {
      if (existingNote) {
        // UPDATE MODE
        const noteRef = doc(db, "notes", existingNote.id);
        await updateDoc(noteRef, {
          title: title,
          text: text,
          updatedAt: new Date()
        });
      } else {
        // CREATE MODE
        await addDoc(collection(db, "notes"), {
          title: title,
          text: text,
          userId: user.uid,
          createdAt: new Date()
        });
      }
      navigation.goBack();
    } catch (e) {
      setSaving(false);
      Alert.alert("Error", "Could not save note.");
    }
  };

  return (
    // VISION PRO BACKGROUND: Deep Dark Blue/Black
    <SafeAreaView className="flex-1 bg-[#0f172a]">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-6 pb-4 border-b border-white/5">
        
        {/* Back Button - Glass Circle */}
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="h-10 w-10 rounded-full bg-white/10 items-center justify-center border border-white/20"
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        
        {/* Title with Neon Accent */}
        <Text className="text-xl font-bold text-white tracking-wider">
          {existingNote ? "Edit" : "New"} <Text className="text-cyan-400">Entry</Text>
        </Text>

        {/* Save Button - Neon Pill */}
        <TouchableOpacity 
          onPress={saveNote}
          disabled={saving}
          // Dynamic styling: glowing cyan border, changes opacity when saving
          className={`px-5 py-2 rounded-full border border-cyan-500/50 ${saving ? 'bg-cyan-900/50' : 'bg-cyan-500/20'}`}
        >
          <Text className="text-cyan-400 font-bold text-xs tracking-[2px] uppercase">
            {saving ? "..." : (existingNote ? "UPDATE" : "SAVE")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Inputs Area */}
      <View className="flex-1 px-6 pt-6">
        
        {/* Title Input - Large & Thin */}
        <TextInput
          className="text-4xl font-thin text-white mb-6 tracking-tight"
          placeholder="Title"
          placeholderTextColor="#475569" // Slate-600 for subtle placeholder
          value={title}
          onChangeText={setTitle}
          selectionColor="#22d3ee" // Cyan cursor
        />

        {/* Body Input - Light & Readable */}
        <TextInput
          className="flex-1 text-lg text-slate-300 font-light leading-8"
          placeholder="Start typing your thoughts..."
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