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
  // 1. First, show the confirmation dialog
  Alert.alert(
    "Delete Note", // Title
    "Are you sure you want to delete this note? This action cannot be undone.", // Message
    [
      {
        text: "Cancel",
        onPress: () => console.log("Deletion cancelled"),
        style: "cancel", // This makes it look like a secondary action on iOS
      },
      {
        text: "Delete",
        style: "destructive", // This makes the button red on iOS
        onPress: async () => {
          // 2. This only runs if the user clicks "Delete"
          console.log("Attempting to delete ID:", id);
          try {
            const docRef = doc(db, "notes", id);
            await deleteDoc(docRef);
            console.log("✅ Deleted successfully from Firestore");
          } catch (e) {
            console.error("❌ Firestore Delete Error:", e.code, e.message);
            Alert.alert("Delete Failed", "Reason: " + e.code);
          }
        },
      },
    ]
  );
};

const renderNote = ({ item }) => (
  <View key={item.id} className="mx-6 mb-4">
    <TouchableOpacity
      onPress={() => {
        console.log("Opening note:", item.id);
        navigation.navigate("AddNote", { existingNote: item });
      }}
      activeOpacity={0.8}
      className="bg-white p-5 rounded-[24px] shadow-sm shadow-slate-200 border border-slate-100 relative"
    >
      {/* Small Delete Button in Top Corner */}
      <TouchableOpacity
        onPress={() => deleteNote(item.id)}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        className="absolute top-3 right-3 bg-slate-50 h-7 w-7 rounded-full items-center justify-center z-50 border border-slate-100"
      >
        <Text className="text-slate-400 font-bold text-[10px]">✕</Text>
      </TouchableOpacity>

      {/* Content Area */}
      <View className="pr-6"> 
        {/* pr-6 ensures text doesn't overlap the X button */}
        {item.title ? (
          <Text className="text-lg font-bold text-slate-800 mb-1" numberOfLines={1}>
            {item.title}
          </Text>
        ) : null}
        
        <Text className="text-slate-500 leading-5 text-sm" numberOfLines={3}>
          {item.text}
        </Text>
      </View>

      {/* Footer (Date) */}
      <View className="mt-4 flex-row items-center">
        <View className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 shadow-sm shadow-blue-400" />
        <Text className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">
          {item.createdAt?.toDate 
            ? item.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) 
            : "Just now"}
        </Text>
      </View>
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