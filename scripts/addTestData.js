/**
 * Script for å legge inn testdata i Firestore
 * Kjør dette i nettleserens console når du er logget inn i appen
 * 
 * Instruksjoner:
 * 1. Åpne appen i nettleseren (localhost:3000)
 * 2. Logg inn som admin eller staff
 * 3. Åpne Developer Console (F12)
 * 4. Kopier og lim inn hele dette skriptet
 * 5. Trykk Enter
 */

// Fiktive barn (12 stk)
const children = [
  { firstName: 'Emma', lastName: 'Hansen', dateOfBirth: '2019-03-15', allergies: 'Nøtter', notes: 'Liker å tegne' },
  { firstName: 'Noah', lastName: 'Johansen', dateOfBirth: '2020-05-22', allergies: '', notes: 'Aktiv og leker gjerne utendørs' },
  { firstName: 'Olivia', lastName: 'Olsen', dateOfBirth: '2019-08-10', allergies: 'Melk', notes: 'Liker bøker' },
  { firstName: 'Liam', lastName: 'Larsen', dateOfBirth: '2020-11-03', allergies: '', notes: 'Leker gjerne med biler' },
  { firstName: 'Sofia', lastName: 'Andersen', dateOfBirth: '2019-01-20', allergies: 'Egg', notes: 'Kreativ og liker håndverk' },
  { firstName: 'Erik', lastName: 'Pedersen', dateOfBirth: '2020-07-14', allergies: '', notes: 'Sporty og aktiv' },
  { firstName: 'Maja', lastName: 'Nilsen', dateOfBirth: '2019-12-05', allergies: 'Nøtter, melk', notes: 'Liker dyr og natur' },
  { firstName: 'Oskar', lastName: 'Kristiansen', dateOfBirth: '2020-02-28', allergies: '', notes: 'Leker gjerne med lego' },
  { firstName: 'Nora', lastName: 'Jensen', dateOfBirth: '2019-09-18', allergies: '', notes: 'Liker musikk og dans' },
  { firstName: 'Lucas', lastName: 'Karlsen', dateOfBirth: '2020-04-09', allergies: 'Gluten', notes: 'Liker å bygge ting' },
  { firstName: 'Aurora', lastName: 'Solberg', dateOfBirth: '2019-06-25', allergies: '', notes: 'Liker å tegne og male' },
  { firstName: 'Isak', lastName: 'Berg', dateOfBirth: '2020-10-12', allergies: 'Melk', notes: 'Leker gjerne utendørs' },
];

// Fiktive foreldre (24 stk - 12 par)
const parents = [
  { name: 'Kari Hansen', email: 'kari.hansen@example.com', phone: '+4791234567', childIndex: 0 },
  { name: 'Ole Hansen', email: 'ole.hansen@example.com', phone: '+4791234568', childIndex: 0 },
  { name: 'Anne Johansen', email: 'anne.johansen@example.com', phone: '+4791234569', childIndex: 1 },
  { name: 'Per Johansen', email: 'per.johansen@example.com', phone: '+4791234570', childIndex: 1 },
  { name: 'Lisa Olsen', email: 'lisa.olsen@example.com', phone: '+4791234571', childIndex: 2 },
  { name: 'Tom Olsen', email: 'tom.olsen@example.com', phone: '+4791234572', childIndex: 2 },
  { name: 'Maria Larsen', email: 'maria.larsen@example.com', phone: '+4791234573', childIndex: 3 },
  { name: 'Jan Larsen', email: 'jan.larsen@example.com', phone: '+4791234574', childIndex: 3 },
  { name: 'Inger Andersen', email: 'inger.andersen@example.com', phone: '+4791234575', childIndex: 4 },
  { name: 'Bjørn Andersen', email: 'bjorn.andersen@example.com', phone: '+4791234576', childIndex: 4 },
  { name: 'Liv Pedersen', email: 'liv.pedersen@example.com', phone: '+4791234577', childIndex: 5 },
  { name: 'Stein Pedersen', email: 'stein.pedersen@example.com', phone: '+4791234578', childIndex: 5 },
  { name: 'Gunn Nilsen', email: 'gunn.nilsen@example.com', phone: '+4791234579', childIndex: 6 },
  { name: 'Lars Nilsen', email: 'lars.nilsen@example.com', phone: '+4791234580', childIndex: 6 },
  { name: 'Tone Kristiansen', email: 'tone.kristiansen@example.com', phone: '+4791234581', childIndex: 7 },
  { name: 'Geir Kristiansen', email: 'geir.kristiansen@example.com', phone: '+4791234582', childIndex: 7 },
  { name: 'Camilla Jensen', email: 'camilla.jensen@example.com', phone: '+4791234583', childIndex: 8 },
  { name: 'Anders Jensen', email: 'anders.jensen@example.com', phone: '+4791234584', childIndex: 8 },
  { name: 'Hilde Karlsen', email: 'hilde.karlsen@example.com', phone: '+4791234585', childIndex: 9 },
  { name: 'Thomas Karlsen', email: 'thomas.karlsen@example.com', phone: '+4791234586', childIndex: 9 },
  { name: 'Martine Solberg', email: 'martine.solberg@example.com', phone: '+4791234587', childIndex: 10 },
  { name: 'Kristian Solberg', email: 'kristian.solberg@example.com', phone: '+4791234588', childIndex: 10 },
  { name: 'Silje Berg', email: 'silje.berg@example.com', phone: '+4791234589', childIndex: 11 },
  { name: 'Martin Berg', email: 'martin.berg@example.com', phone: '+4791234590', childIndex: 11 },
];

// Funksjon for å legge inn data
async function addTestData() {
  const { db } = await import('../src/services/firebase/config.js');
  const { collection, doc, setDoc, Timestamp } = await import('firebase/firestore');
  
  console.log('Starter å legge inn testdata...');
  
  // Legg inn barn
  const childIds = [];
  for (const child of children) {
    const childRef = doc(collection(db, 'children'));
    const birthDate = new Date(child.dateOfBirth);
    await setDoc(childRef, {
      firstName: child.firstName,
      lastName: child.lastName,
      dateOfBirth: Timestamp.fromDate(birthDate),
      parentIds: [], // Vil bli oppdatert når foreldre legges inn
      allergies: child.allergies || '',
      notes: child.notes || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    childIds.push(childRef.id);
    console.log(`✓ Lagt til barn: ${child.firstName} ${child.lastName}`);
  }
  
  // Legg inn foreldre og knytt dem til barn
  const parentIds = [];
  for (let i = 0; i < parents.length; i++) {
    const parent = parents[i];
    const parentRef = doc(collection(db, 'users'));
    
    // Finn hvilket barn denne forelderen tilhører
    const childIndex = parent.childIndex;
    const childId = childIds[childIndex];
    
    await setDoc(parentRef, {
      name: parent.name,
      email: parent.email,
      phone: parent.phone,
      role: 'parent',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    parentIds.push({ id: parentRef.id, childIndex: childIndex });
    console.log(`✓ Lagt til forelder: ${parent.name}`);
    
    // Oppdater barnet med foreldre-ID
    const { updateDoc } = await import('firebase/firestore');
    const childRef = doc(db, 'children', childId);
    const existingChild = await getDoc(childRef);
    const currentParentIds = existingChild.data()?.parentIds || [];
    await updateDoc(childRef, {
      parentIds: [...currentParentIds, parentRef.id],
      updatedAt: Timestamp.now(),
    });
  }
  
  console.log('✅ Alle testdata er lagt inn!');
  console.log(`- ${children.length} barn lagt til`);
  console.log(`- ${parents.length} foreldre lagt til`);
}

// Kjør funksjonen
addTestData().catch(console.error);

