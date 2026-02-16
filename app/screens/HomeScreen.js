import {
  collection, deleteDoc, doc, onSnapshot, orderBy, query, where
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  Alert, FlatList,
  StatusBar,
  Text, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../Authcontext";
import { db } from "../firebase";

export default function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const { logout, user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "notes"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotes(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsubscribe;
  }, [user]);

  const deleteNote = async (id) => {
    console.log("Attempting to delete ID:", id);
    
    try {
      const docRef = doc(db, "notes", id);
      await deleteDoc(docRef);
      console.log("✅ Deleted successfully from Firestore");
    } catch (e) {
      // This will print the exact Firebase Error (like 'Permission Denied')
      console.error("❌ Firestore Delete Error:", e.code, e.message);
      Alert.alert("Delete Failed", "Reason: " + e.code);
    }
  };

const renderNote = ({ item }) => (
  <View key={item.id} className="mx-6 mb-3 flex-row items-center justify-between"> 
    {/* Use a View wrapper for the card to prevent touch competition */}
    <View className="flex-1">
      <TouchableOpacity 
        onPress={() => {
          console.log("Opening note:", item.id);
          navigation.navigate("AddNote", { existingNote: item });
        }}
        activeOpacity={0.7}
        className="bg-white p-5 rounded-[20px] shadow-sm shadow-slate-300 border border-slate-100"
      >
        <View>
          {item.title ? (
            <Text className="text-lg font-bold text-slate-800 mb-1" numberOfLines={1}>
              {item.title}
            </Text>
          ) : null}
          <Text className="text-slate-500 leading-5 text-sm" numberOfLines={2}>
            {item.text}
          </Text>
        </View>

        <View className="mt-3 flex-row items-center">
          <View className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2" />
          <Text className="text-slate-300 text-[10px] font-semibold uppercase tracking-tighter">
            {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : "Just now"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>

    {/* SEPARATE DELETE BUTTON */}
    <TouchableOpacity 
      onPress={() => {
        console.log("Delete triggered for:", item.id);
        deleteNote(item.id);
      }}
      // hitSlop is essential for small buttons
      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      className="ml-3 bg-red-100 h-12 w-12 rounded-full items-center justify-center" 
      style={{ zIndex: 999, elevation: 5 }} // Force it to the top layer
    >
      <Text className="text-red-600 font-bold text-xl">✕</Text>
    </TouchableOpacity>
  </View>
);


  return (
    <SafeAreaView className="flex-1 bg-[#FBFBFE]">
      <StatusBar barStyle="dark-content" />
      
      {/* Modern Header */}
      <View className="px-8 pt-4 pb-4 flex-row justify-between items-center">
        <View>
          <Text className="text-3xl font-black text-slate-900 tracking-tight">My Notes</Text>
          <Text className="text-slate-400 text-xs font-medium">{notes.length} saved entries</Text>
        </View>
        <TouchableOpacity 
          onPress={logout}
          className="px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm"
        >
          <Text className="text-[10px] font-black text-slate-500 uppercase">Logout</Text>
        </TouchableOpacity>
      </View>

      {/* List View (Line by Line) */}
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 120 }}
        renderItem={renderNote}
        ListEmptyComponent={
          <View className="mt-32 items-center px-10">
            <Text className="text-slate-300 text-center font-medium">No notes here yet.</Text>
          </View>
        }
      />

      {/* Modern Floating Action Button */}
      <View className="absolute bottom-10 w-full items-center">
        <TouchableOpacity
          onPress={() => navigation.navigate("AddNote")}
          activeOpacity={0.9}
          className="bg-blue-600 h-16 px-8 rounded-3xl flex-row items-center justify-center shadow-xl shadow-blue-400"
        >
          <Text className="text-white text-3xl mr-3">+</Text>
          <Text className="text-white font-extrabold text-sm uppercase tracking-widest">New Entry</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}