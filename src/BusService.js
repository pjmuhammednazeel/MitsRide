// BusService.js
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase"; // import from your firebase.js

export async function addBus(bus) {
  return await addDoc(collection(db, "buses"), bus);
}

export async function getAllBuses() {
  const snap = await getDocs(collection(db, "buses"));
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function deleteBus(busId) {
  return await deleteDoc(doc(db, "buses", busId));
}
