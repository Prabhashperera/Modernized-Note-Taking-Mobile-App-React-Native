import { addDoc, collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebase";

// CRITICAL: You must import AuthContext to use it
import { AuthContext } from "../Authcontext";

export default function HomeScreen() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  
  // Now this will work because of the import above
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert("Logout Error", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "notes"), (snapshot) => {
      const newNotes = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotes(newNotes);
    });
    return unsubscribe;
  }, []);

  const addNote = async () => {
    if (note.trim() === "") return;
    try {
      await addDoc(collection(db, "notes"), {
        text: note,
        createdAt: new Date()
      });
      setNote("");
    } catch (e) {
      Alert.alert("Error", "Could not save note");
    }
  };

  const deleteNote = async (id) => {
    try {
      await deleteDoc(doc(db, "notes", id));
    } catch (e) {
      Alert.alert("Error", "Could not delete note");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header with Tailwind */}
      <View className="flex-row justify-between items-center p-6 bg-white border-b border-gray-200 shadow-sm">
        <Text className="text-3xl font-bold text-gray-800">My Notes</Text>
        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-red-50 px-4 py-2 rounded-xl border border-red-100"
        >
          <Text className="text-red-500 font-bold text-sm">Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Notes List */}
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-2xl mb-4 flex-row justify-between items-center shadow-sm border border-gray-100">
            <Text className="text-gray-700 text-lg flex-1 mr-4">{item.text}</Text>
            <TouchableOpacity 
              onPress={() => deleteNote(item.id)} 
              className="bg-gray-100 p-2 rounded-lg"
            >
              <Text className="text-red-400 font-bold">Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-400 mt-10">No notes yet. Add one below!</Text>
        }
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="absolute bottom-0 w-full bg-white p-4 border-t border-gray-200 flex-row items-center"
      >
        <TextInput
          className="flex-1 bg-gray-100 rounded-2xl px-5 py-4 text-gray-800 mr-3 text-lg"
          placeholder="Write a new note..."
          placeholderTextColor="#9ca3af"
          value={note}
          onChangeText={setNote}
        />
        <TouchableOpacity 
          onPress={addNote} 
          className="bg-blue-600 w-14 h-14 rounded-2xl justify-center items-center shadow-lg"
        >
          <Text className="text-white text-3xl font-bold">+</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}