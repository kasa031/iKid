/**
 * Script for å legge inn testdata i Firestore
 * 
 * INSTRUKSJONER:
 * 1. Åpne appen i nettleseren (localhost:3000)
 * 2. Logg inn som admin eller staff
 * 3. Åpne Developer Console (F12)
 * 4. Kopier og lim inn HELE dette skriptet
 * 5. Trykk Enter
 * 
 * OBS: Dette krever at du er logget inn og at Firebase er lastet
 */

(async function() {
  try {
    // Hent Firebase fra window-objektet eller bruk direkte imports
    const { db } = await import('/src/services/firebase/config.ts');
    const { collection, doc, setDoc, updateDoc, getDoc, Timestamp } = await import('firebase/firestore');
    const { createUserWithEmailAndPassword, getAuth } = await import('firebase/auth');
    const auth = getAuth();
    
    console.log('🚀 Starter å legge inn testdata...');
    
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
      { name: 'Kari Hansen', email: 'kari.hansen@example.com', phone: '+4791234567', password: 'Test1234!', childIndex: 0 },
      { name: 'Ole Hansen', email: 'ole.hansen@example.com', phone: '+4791234568', password: 'Test1234!', childIndex: 0 },
      { name: 'Anne Johansen', email: 'anne.johansen@example.com', phone: '+4791234569', password: 'Test1234!', childIndex: 1 },
      { name: 'Per Johansen', email: 'per.johansen@example.com', phone: '+4791234570', password: 'Test1234!', childIndex: 1 },
      { name: 'Lisa Olsen', email: 'lisa.olsen@example.com', phone: '+4791234571', password: 'Test1234!', childIndex: 2 },
      { name: 'Tom Olsen', email: 'tom.olsen@example.com', phone: '+4791234572', password: 'Test1234!', childIndex: 2 },
      { name: 'Maria Larsen', email: 'maria.larsen@example.com', phone: '+4791234573', password: 'Test1234!', childIndex: 3 },
      { name: 'Jan Larsen', email: 'jan.larsen@example.com', phone: '+4791234574', password: 'Test1234!', childIndex: 3 },
      { name: 'Inger Andersen', email: 'inger.andersen@example.com', phone: '+4791234575', password: 'Test1234!', childIndex: 4 },
      { name: 'Bjørn Andersen', email: 'bjorn.andersen@example.com', phone: '+4791234576', password: 'Test1234!', childIndex: 4 },
      { name: 'Liv Pedersen', email: 'liv.pedersen@example.com', phone: '+4791234577', password: 'Test1234!', childIndex: 5 },
      { name: 'Stein Pedersen', email: 'stein.pedersen@example.com', phone: '+4791234578', password: 'Test1234!', childIndex: 5 },
      { name: 'Gunn Nilsen', email: 'gunn.nilsen@example.com', phone: '+4791234579', password: 'Test1234!', childIndex: 6 },
      { name: 'Lars Nilsen', email: 'lars.nilsen@example.com', phone: '+4791234580', password: 'Test1234!', childIndex: 6 },
      { name: 'Tone Kristiansen', email: 'tone.kristiansen@example.com', phone: '+4791234581', password: 'Test1234!', childIndex: 7 },
      { name: 'Geir Kristiansen', email: 'geir.kristiansen@example.com', phone: '+4791234582', password: 'Test1234!', childIndex: 7 },
      { name: 'Camilla Jensen', email: 'camilla.jensen@example.com', phone: '+4791234583', password: 'Test1234!', childIndex: 8 },
      { name: 'Anders Jensen', email: 'anders.jensen@example.com', phone: '+4791234584', password: 'Test1234!', childIndex: 8 },
      { name: 'Hilde Karlsen', email: 'hilde.karlsen@example.com', phone: '+4791234585', password: 'Test1234!', childIndex: 9 },
      { name: 'Thomas Karlsen', email: 'thomas.karlsen@example.com', phone: '+4791234586', password: 'Test1234!', childIndex: 9 },
      { name: 'Martine Solberg', email: 'martine.solberg@example.com', phone: '+4791234587', password: 'Test1234!', childIndex: 10 },
      { name: 'Kristian Solberg', email: 'kristian.solberg@example.com', phone: '+4791234588', password: 'Test1234!', childIndex: 10 },
      { name: 'Silje Berg', email: 'silje.berg@example.com', phone: '+4791234589', password: 'Test1234!', childIndex: 11 },
      { name: 'Martin Berg', email: 'martin.berg@example.com', phone: '+4791234590', password: 'Test1234!', childIndex: 11 },
    ];
    
    // Legg inn barn først
    const childIds = [];
    console.log('📝 Legger inn barn...');
    for (const child of children) {
      const childRef = doc(collection(db, 'children'));
      const birthDate = new Date(child.dateOfBirth);
      await setDoc(childRef, {
        firstName: child.firstName,
        lastName: child.lastName,
        dateOfBirth: Timestamp.fromDate(birthDate),
        parentIds: [],
        allergies: child.allergies || '',
        notes: child.notes || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      childIds.push(childRef.id);
      console.log(`  ✓ ${child.firstName} ${child.lastName}`);
    }
    
    // Legg inn foreldre og knytt dem til barn
    const parentIds = [];
    console.log('👨‍👩 Legger inn foreldre...');
    for (const parent of parents) {
      try {
        // Opprett bruker i Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, parent.email, parent.password);
        const userId = userCredential.user.uid;
        
        // Opprett brukerdokument i Firestore
        await setDoc(doc(db, 'users', userId), {
          name: parent.name,
          email: parent.email,
          phone: parent.phone,
          role: 'parent',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        
        parentIds.push({ id: userId, childIndex: parent.childIndex });
        console.log(`  ✓ ${parent.name}`);
        
        // Knytt forelder til barn
        const childId = childIds[parent.childIndex];
        const childRef = doc(db, 'children', childId);
        const childDoc = await getDoc(childRef);
        const currentParentIds = childDoc.data()?.parentIds || [];
        
        if (!currentParentIds.includes(userId)) {
          await updateDoc(childRef, {
            parentIds: [...currentParentIds, userId],
            updatedAt: Timestamp.now(),
          });
        }
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`  ⚠ ${parent.name} finnes allerede, hopper over`);
        } else {
          console.error(`  ✗ Feil ved ${parent.name}:`, error.message);
        }
      }
    }
    
    console.log('');
    console.log('✅ Ferdig!');
    console.log(`   - ${children.length} barn lagt til`);
    console.log(`   - ${parentIds.length} foreldre lagt til`);
    console.log('');
    console.log('Du kan nå logge inn med noen av foreldrene:');
    console.log('E-post: kari.hansen@example.com');
    console.log('Passord: Test1234!');
    
  } catch (error) {
    console.error('❌ Feil:', error);
    console.log('');
    console.log('Forsikre deg om at:');
    console.log('1. Du er logget inn i appen');
    console.log('2. Du er på localhost:3000');
    console.log('3. Firebase er lastet');
  }
})();

