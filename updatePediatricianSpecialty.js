// updatePediatricianSpecialty.js

const admin = require("firebase-admin");
const serviceAccount = require("./vizion-ai-f9834-firebase-adminsdk-fbsvc-f6b2211c8e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function updateSpecialties() {
  const doctorsRef = db.collection("doctors");
  const snapshot = await doctorsRef.get();

  let updatedCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    let updated = false;

    // Handle both 'specialty' and 'specialization' fields, and both string/array
    ["specialty", "specialization"].forEach((field) => {
      if (data[field]) {
        if (Array.isArray(data[field])) {
          const newArr = data[field].map((s) =>
            s === "Pediatrician" ? "Pediatrics" : s
          );
          if (JSON.stringify(newArr) !== JSON.stringify(data[field])) {
            data[field] = newArr;
            updated = true;
          }
        } else if (typeof data[field] === "string" && data[field] === "Pediatrician") {
          data[field] = "Pediatrics";
          updated = true;
        }
      }
    });

    if (updated) {
      await doc.ref.update(data);
      updatedCount++;
      console.log(`Updated doctor ${doc.id}`);
    }
  }

  console.log(`Done! Updated ${updatedCount} doctor(s).`);
}

updateSpecialties().catch(console.error); 