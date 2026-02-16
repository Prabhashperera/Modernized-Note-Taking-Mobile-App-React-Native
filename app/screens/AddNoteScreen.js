import { addDoc, collection, doc, updateDoc } from "firebase/firestore"; // Added updateDoc
import { useContext, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
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
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-gray-400 text-lg">Back</Text>
        </TouchableOpacity>
        
        <Text className="font-bold text-lg">
          {existingNote ? "Edit Note" : "New Note"}
        </Text>

        <TouchableOpacity 
          onPress={saveNote}
          className="bg-blue-600 px-6 py-2 rounded-full"
        >
          <Text className="text-white font-bold">
            {existingNote ? "Update" : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <View className="flex-1 p-6">
        <TextInput
          className="text-3xl font-bold text-gray-800 mb-4"
          placeholder="Title"
          placeholderTextColor="#D1D5DB"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          className="flex-1 text-lg text-gray-600"
          placeholder="Note details..."
          placeholderTextColor="#D1D5DB"
          multiline
          textAlignVertical="top"
          value={text}
          onChangeText={setText}
        />
      </View>
    </SafeAreaView>
  );
}