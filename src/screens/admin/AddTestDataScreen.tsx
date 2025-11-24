/**
 * Add Test Data Screen
 * Screen for administrators to quickly add test data
 */

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { createChild, updateChild } from '../../services/database/childService';
import { register } from '../../services/auth/authService';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { UserRole } from '../../types';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Spacing, FontSizes } from '../../constants/sizes';
import './AddTestDataScreen.css';

export const AddTestDataScreen: React.FC = () => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');

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

  const handleAddTestData = async () => {
    if (!window.confirm('Dette vil legge inn 12 barn og 24 foreldre. Fortsette?')) {
      return;
    }

    setLoading(true);
    setProgress('Starter...\n');

    try {
      // Legg inn barn først
      const childIds: string[] = [];
      setProgress('📝 Legger inn barn...\n');
      
      for (const child of children) {
        try {
          const childId = await createChild({
            firstName: child.firstName,
            lastName: child.lastName,
            dateOfBirth: new Date(child.dateOfBirth),
            parentIds: [],
            allergies: child.allergies || undefined,
            notes: child.notes || undefined,
          });
          childIds.push(childId);
          setProgress(prev => prev + `  ✓ ${child.firstName} ${child.lastName}\n`);
        } catch (error: any) {
          setProgress(prev => prev + `  ✗ Feil ved ${child.firstName} ${child.lastName}: ${error.message}\n`);
        }
      }

      // Legg inn foreldre og knytt dem til barn
      setProgress(prev => prev + '\n👨‍👩 Legger inn foreldre...\n');
      const parentUserIds: { [childIndex: number]: string[] } = {};

      for (const parent of parents) {
        try {
          // Opprett bruker (dette oppretter både Auth og Firestore)
          const user = await register(
            parent.email,
            parent.password,
            parent.name,
            UserRole.PARENT,
            parent.phone
          );
          
          // Lagre bruker-ID for dette barnet
          if (!parentUserIds[parent.childIndex]) {
            parentUserIds[parent.childIndex] = [];
          }
          parentUserIds[parent.childIndex].push(user.id);
          
          setProgress(prev => prev + `  ✓ ${parent.name}\n`);
        } catch (error: any) {
          if (error.message?.includes('already registered') || error.message?.includes('already in use')) {
            // Prøv å finne eksisterende bruker
            try {
              const q = query(collection(db, 'users'), where('email', '==', parent.email));
              const snapshot = await getDocs(q);
              if (!snapshot.empty) {
                const userId = snapshot.docs[0].id;
                if (!parentUserIds[parent.childIndex]) {
                  parentUserIds[parent.childIndex] = [];
                }
                parentUserIds[parent.childIndex].push(userId);
                setProgress(prev => prev + `  ⚠ ${parent.name} finnes allerede, bruker eksisterende\n`);
              }
            } catch (findError) {
              setProgress(prev => prev + `  ⚠ ${parent.name} finnes allerede\n`);
            }
          } else {
            setProgress(prev => prev + `  ✗ Feil ved ${parent.name}: ${error.message}\n`);
          }
        }
      }

      // Knytt foreldre til barn
      setProgress(prev => prev + '\n🔗 Knytter foreldre til barn...\n');
      for (let i = 0; i < childIds.length; i++) {
        const childId = childIds[i];
        const parentIds = parentUserIds[i] || [];
        
        if (parentIds.length > 0) {
          try {
            await updateChild(childId, {
              parentIds: parentIds,
            });
            setProgress(prev => prev + `  ✓ Knyttet ${parentIds.length} foreldre til ${children[i].firstName}\n`);
          } catch (error: any) {
            setProgress(prev => prev + `  ✗ Feil ved knytting: ${error.message}\n`);
          }
        }
      }

      setProgress(prev => prev + '\n✅ Ferdig!\n');
      setProgress(prev => prev + `   - ${children.length} barn lagt til\n`);
      setProgress(prev => prev + `   - ${parents.length} foreldre lagt til\n`);
      setProgress(prev => prev + '\nDu kan nå logge inn med:\n');
      setProgress(prev => prev + 'E-post: kari.hansen@example.com\n');
      setProgress(prev => prev + 'Passord: Test1234!\n');

      window.alert('Testdata er lagt inn! Sjekk output under for detaljer.');
    } catch (error: any) {
      setProgress(prev => prev + `\n❌ Feil: ${error.message}\n`);
      window.alert('Feil ved innlegging av testdata. Sjekk output under.');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: colors.background,
    padding: Spacing.md,
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: 800,
    margin: '0 auto',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: FontSizes.xxl,
    fontWeight: 700,
    marginBottom: Spacing.lg,
    letterSpacing: -0.3,
    lineHeight: FontSizes.xxl * 1.2,
    color: colors.text,
  };

  return (
    <div style={containerStyle} className="add-test-data-screen">
      <div style={contentStyle}>
        <h1 style={titleStyle}>Legg inn testdata</h1>

        <Card style={{ marginBottom: Spacing.md, borderLeft: `4px solid ${colors.primary}` }}>
          <p style={{ fontSize: FontSizes.md, marginBottom: Spacing.md, color: colors.text }}>
            Dette vil legge inn:
          </p>
          <ul style={{ fontSize: FontSizes.md, marginBottom: Spacing.md, color: colors.text, paddingLeft: Spacing.lg }}>
            <li>12 barn med norske navn</li>
            <li>24 foreldre (12 par)</li>
            <li>Alle foreldre får passord: <strong>Test1234!</strong></li>
          </ul>
          <Button
            title="Legg inn testdata"
            onPress={handleAddTestData}
            loading={loading}
            style={{ width: '100%' }}
          />
        </Card>

        {progress && (
          <Card style={{ marginTop: Spacing.md }}>
            <h2 style={{ fontSize: FontSizes.lg, fontWeight: 700, marginBottom: Spacing.sm, color: colors.text }}>
              Output
            </h2>
            <pre
              style={{
                fontSize: FontSizes.sm,
                color: colors.text,
                backgroundColor: colors.surface,
                padding: Spacing.md,
                borderRadius: 8,
                overflow: 'auto',
                maxHeight: '400px',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
              }}
            >
              {progress}
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
};

