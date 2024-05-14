// models/role.js
const { getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');
const firebase = require('../firebase.js');
const db = getFirestore(firebase);

class RoleModel {
    static async getAllRoles() {
        const rolesRef = collection(db, 'roles');
        const snapshot = await getDocs(rolesRef);
        const roles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return roles;
    }
    static async getTitleByRoleId(roleId) {
        const roleDocRef = doc(db, 'roles', roleId);
        const roleDoc = await getDoc(roleDocRef);
        if (roleDoc.exists()) {
            return roleDoc.data().title; 
        } else {
            throw new Error('Role not found');
        }
    }
}

module.exports = RoleModel;
