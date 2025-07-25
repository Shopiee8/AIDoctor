const admin = require("firebase-admin");
// TODO: Update the path below to your actual service account key file
const serviceAccount = require("./vizion-ai-f9834-firebase-adminsdk-fbsvc-f6b2211c8e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// List of allowed general specialties
const GENERAL_SPECIALTIES = [
  "Adult Bone Marrow Transplantation",
  "Adult Intensive Care Unit",
  "Advanced Gynecology Institute",
  "Anesthesiology",
  "Bariatric and Metabolic Surgery",
  "Breast Clinic",
  "Kidney Transplant Center",
  "Cardiac Sciences",
  "Clinical Genetics Clinic",
  "Clinical Nutrition and Dietetics",
  "Co-Lab",
  "Dentistry",
  "Dermatology and Cosmetology",
  "Emergency Medicine",
  "Endocrinology",
  "ENT Head & Neck Institute",
  "Family Medicine",
  "Gastroenterology",
  "Gastrointestinal Surgery",
  "General and Laparoscopic Surgery",
  "General Medicine",
  "Genesis International Fetal Medicine and...",
  "HBOT (Hyperbaric Oxygen Therapy)",
  "Hematology",
  "Hepatopancreatobiliary Surgery and Transplantation",
  "Infectious Diseases",
  "Internal Medicine",
  "Medical Oncology",
  "Naturopathy",
  "Neonatology",
  "Nephrology",
  "Neurology",
  "Neurosurgery",
  "Nuclear Medicine",
  "Obstetrics and Gynecology",
  "Ophthalmology",
  "Oral and Maxillofacial Surgery",
  "Orthopedics and Sports Medicine",
  "Paley Middle East Clinic",
  "Palliative and Supportive Care",
  "Pediatric Bone Marrow Transplantation",
  "Pediatric Cardiology",
  "Pediatric Endocrinology",
  "Pediatric Gastroenterology",
  "Pediatric Hematology",
  "Pediatric Intensive Care Unit",
  "Pediatric Neuroscience",
  "Pediatric Oncology",
  "Pediatric Pulmonology",
  "Pediatric Surgery",
  "Pediatrics",
  "Physical Medicine and Rehabilitation",
  "Physiotherapy, Pain Medicine & Advanced...",
  "Plastic, Reconstructive and Cosmetic Surgery",
  "Psychiatry",
  "Psychology",
  "Pulmonology",
  "Radiation Oncology",
  "Radiology",
  "Rheumatology",
  "Scoliosis Surgery",
  "Sports Injuries & Sports Medicine",
  "Surgical Oncology",
  "Thalassemia & Sickle Cell Center",
  "Thoracic Surgery",
  "Fertility",
  "Urology",
  "Vascular Surgery",
  "Weight Management Clinic"
];

// Create a set for fast lookup
const GENERAL_SET = new Set(GENERAL_SPECIALTIES);
const AI_SET = new Set(GENERAL_SPECIALTIES.map(s => `AI ${s}`));

// Helper to map -ist/-ian to general name
function mapToGeneral(specialty) {
  if (!specialty) return specialty;
  // Remove 'AI ' prefix for mapping
  const isAI = specialty.startsWith('AI ');
  let base = isAI ? specialty.slice(3).trim() : specialty.trim();

  // Try direct match
  if (GENERAL_SET.has(base)) return isAI ? `AI ${base}` : base;

  // Try mapping -ist/-ian endings
  const endings = [
    { from: 'ologist', to: 'ology' },
    { from: 'iatrist', to: 'iatry' },
    { from: 'ian', to: 'ics' },
    { from: 'ist', to: 'y' },
    { from: 'ician', to: 'y' },
    { from: 'surgery', to: 'Surgery' },
    { from: 'medicine', to: 'Medicine' },
  ];
  for (const { from, to } of endings) {
    if (base.toLowerCase().endsWith(from)) {
      let mapped = base.slice(0, -from.length) + to;
      // Try to find the closest match in the list
      for (const gen of GENERAL_SPECIALTIES) {
        if (gen.toLowerCase().includes(mapped.toLowerCase())) {
          return isAI ? `AI ${gen}` : gen;
        }
      }
    }
  }
  // Try to find a general specialty that includes the base
  for (const gen of GENERAL_SPECIALTIES) {
    if (gen.toLowerCase().includes(base.toLowerCase())) {
      return isAI ? `AI ${gen}` : gen;
    }
  }
  // If not found, return original
  return specialty;
}

async function updateSpecialties() {
  const doctorsRef = db.collection("doctors");
  const snapshot = await doctorsRef.get();

  let updatedCount = 0;
  let unmapped = new Set();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    let updated = false;

    ["specialty", "specialization"].forEach((field) => {
      if (data[field]) {
        if (Array.isArray(data[field])) {
          const newArr = data[field].map((s) => {
            const mapped = mapToGeneral(s);
            if (!GENERAL_SET.has(mapped.replace(/^AI /, '')) && !AI_SET.has(mapped)) {
              unmapped.add(s);
            }
            return mapped;
          });
          if (JSON.stringify(newArr) !== JSON.stringify(data[field])) {
            data[field] = newArr;
            updated = true;
          }
        } else if (typeof data[field] === "string") {
          const mapped = mapToGeneral(data[field]);
          if (!GENERAL_SET.has(mapped.replace(/^AI /, '')) && !AI_SET.has(mapped)) {
            unmapped.add(data[field]);
          }
          if (mapped !== data[field]) {
            data[field] = mapped;
            updated = true;
          }
        }
      }
    });

    if (updated) {
      await doc.ref.update(data);
      updatedCount++;
      console.log(`Updated doctor ${doc.id}`);
    }
  }

  if (unmapped.size > 0) {
    console.log("Unmapped specialties:", Array.from(unmapped));
  }
  console.log(`Done! Updated ${updatedCount} doctor(s).`);
}

updateSpecialties().catch(console.error); 