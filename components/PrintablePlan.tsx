import React from 'react';
import type { FitnessPlan, UserProfile } from '../types';
import { translations } from '../translations';

interface PrintablePlanProps {
  plan: FitnessPlan;
  profile: UserProfile;
  t: typeof translations.en;
  images: { [key: string]: string | null };
}

const PrintablePlan: React.FC<PrintablePlanProps> = ({ plan, profile, t, images }) => {
  // --- STYLES ---
  const sectionStyle: React.CSSProperties = {
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e2e8f0',
  };
  const h1Style: React.CSSProperties = { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px', color: '#0891B2' };
  const h2Style: React.CSSProperties = { fontSize: '1.8rem', fontWeight: 'bold', marginTop: '16px', marginBottom: '12px', color: '#0e7490' };
  const h3Style: React.CSSProperties = { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '8px' };
  const thStyle: React.CSSProperties = {
    padding: '8px',
    textAlign: 'left',
    borderBottom: '2px solid #cbd5e1',
    backgroundColor: '#f1f5f9',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
  };
  const tdStyle: React.CSSProperties = { padding: '8px', borderBottom: '1px solid #e2e8f0' };
  const exerciseTrStyle: React.CSSProperties = { borderBottom: '1px solid #e2e8f0' };

  return (
    <div style={{ padding: '40px', backgroundColor: 'white', color: '#1f2937', fontFamily: 'sans-serif', width: '210mm' }}>
      <header style={{ textAlign: 'center', marginBottom: '32px', borderBottom: '2px solid #06B6D4', paddingBottom: '16px' }}>
        <h1 style={h1Style}>{t.headerTitle}</h1>
        <p style={{ fontSize: '1.25rem', color: '#475569' }}>Your Personalized Plan for: {profile.goal}</p>
      </header>

      {/* Profile Summary */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>{t.profilePageTitle}</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <tbody>
                <tr>
                    <td style={tdStyle}><strong>{t.ageLabel}:</strong> {profile.age}</td>
                    <td style={tdStyle}><strong>{t.genderLabel}:</strong> {profile.gender}</td>
                </tr>
                <tr>
                    <td style={tdStyle}><strong>{t.weightLabel}:</strong> {profile.weight} kg</td>
                    <td style={tdStyle}><strong>{t.heightLabel}:</strong> {profile.height} cm</td>
                </tr>
                 <tr>
                    <td style={tdStyle}><strong>{t.workoutDaysLabel}:</strong> {profile.workoutDays}</td>
                    <td style={tdStyle}><strong>{t.styleLabel}:</strong> {profile.workoutStyle}</td>
                </tr>
                 <tr>
                    <td colSpan={2} style={tdStyle}><strong>{t.activityLevelLabel}:</strong> {profile.activityLevel}</td>
                </tr>
                 <tr>
                    <td colSpan={2} style={tdStyle}><strong>{t.equipmentLabel}:</strong> {profile.availableEquipment}</td>
                </tr>
                 <tr>
                    <td colSpan={2} style={tdStyle}><strong>{t.dietLabel}:</strong> {profile.dietaryRestrictions || 'None'}</td>
                </tr>
                 <tr>
                    <td colSpan={2} style={tdStyle}><strong>{t.dislikedExercisesLabel}:</strong> {profile.dislikedExercises || 'None'}</td>
                </tr>
            </tbody>
        </table>
      </section>

      {/* Workout Plan */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>{t.workoutTab}</h2>
        {plan.workoutPlan.map((day, index) => (
          <div key={index} style={{ marginBottom: '24px', breakInside: 'avoid-page' }}>
            <h3 style={h3Style}>{day.day} - <span style={{ color: '#0891B2', fontWeight: 'normal' }}>{day.focus}</span></h3>
            <p><strong>{t.warmup}:</strong> {day.warmup}</p>
            <table style={{ width: '100%', marginTop: '12px', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>{t.exercises}</th>
                  <th style={{...thStyle, textAlign: 'center'}}>{t.sets}</th>
                  <th style={{...thStyle, textAlign: 'center'}}>{t.reps}</th>
                  <th style={{...thStyle, textAlign: 'center'}}>{t.rest}</th>
                </tr>
              </thead>
              <tbody>
                {day.exercises.map((ex, exIndex) => (
                   <React.Fragment key={exIndex}>
                        <tr style={!ex.techniqueFocus ? exerciseTrStyle : {}}>
                            <td style={{...tdStyle, borderBottom: 'none', verticalAlign: 'top', paddingTop: '12px', paddingBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {images[ex.name] && (
                                        <img 
                                            src={images[ex.name] as string}
                                            alt={ex.name}
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                                flexShrink: 0
                                            }}
                                        />
                                    )}
                                    <span style={{ fontWeight: 'bold' }}>{ex.name}</span>
                                </div>
                            </td>
                            <td style={{...tdStyle, borderBottom: 'none', textAlign: 'center', verticalAlign: 'top', paddingTop: '12px'}}>{ex.sets}</td>
                            <td style={{...tdStyle, borderBottom: 'none', textAlign: 'center', verticalAlign: 'top', paddingTop: '12px'}}>{ex.reps}</td>
                            <td style={{...tdStyle, borderBottom: 'none', textAlign: 'center', verticalAlign: 'top', paddingTop: '12px'}}>{ex.rest}</td>
                        </tr>
                        {ex.techniqueFocus && (
                            <tr style={exerciseTrStyle}>
                                <td colSpan={4} style={{...tdStyle, paddingTop: '0px', paddingBottom: '12px', fontSize: '0.85rem', color: '#475569', borderBottom: '1px solid #e2e8f0'}}>
                                    <strong style={{color: '#0e7490'}}>{t.techniqueFocus}:</strong> {ex.techniqueFocus}
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: '8px' }}><strong>{t.cooldown}:</strong> {day.cooldown}</p>
          </div>
        ))}
      </section>

      {/* Meal Plan */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>{t.nutritionTab}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center', marginBottom: '24px', backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '8px' }}>
          <div><strong style={{ display: 'block', fontSize: '1.5rem', color: '#0891B2' }}>{plan.mealPlan.totalCalories}</strong><span style={{fontSize: '0.8rem'}}>{t.calories}</span></div>
          <div><strong style={{ display: 'block', fontSize: '1.5rem', color: '#16A34A' }}>{plan.mealPlan.totalProtein}g</strong><span style={{fontSize: '0.8rem'}}>{t.protein}</span></div>
          <div><strong style={{ display: 'block', fontSize: '1.5rem', color: '#EA580C' }}>{plan.mealPlan.totalCarbs}g</strong><span style={{fontSize: '0.8rem'}}>{t.carbs}</span></div>
          <div><strong style={{ display: 'block', fontSize: '1.5rem', color: '#D97706' }}>{plan.mealPlan.totalFat}g</strong><span style={{fontSize: '0.8rem'}}>{t.fat}</span></div>
        </div>
        {[
          { title: t.breakfast, meal: plan.mealPlan.breakfast },
          { title: t.lunch, meal: plan.mealPlan.lunch },
          { title: t.dinner, meal: plan.mealPlan.dinner },
          { title: t.snack, meal: plan.mealPlan.snack },
          { title: t.postWorkout, meal: plan.mealPlan.postWorkoutSnack },
        ].map(({ title, meal }) => meal && (
          <div key={title} style={{ marginBottom: '16px', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px', breakInside: 'avoid' }}>
            <h3 style={h3Style}>{title}: {meal.name}</h3>
            <p style={{marginBottom: '8px', fontSize: '0.9rem', color: '#475569'}}>{meal.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center', fontSize: '0.8rem', backgroundColor: '#f8fafc', padding: '8px', borderRadius: '4px' }}>
                <div><strong style={{display: 'block', fontSize: '1rem'}}>{meal.calories}</strong><span>{t.calories}</span></div>
                <div><strong style={{display: 'block', fontSize: '1rem', color: '#16A34A'}}>{meal.protein}g</strong><span>{t.protein}</span></div>
                <div><strong style={{display: 'block', fontSize: '1rem', color: '#EA580C'}}>{meal.carbs}g</strong><span>{t.carbs}</span></div>
                <div><strong style={{display: 'block', fontSize: '1rem', color: '#D97706'}}>{meal.fat}g</strong><span>{t.fat}</span></div>
            </div>
          </div>
        ))}
        <p><strong>{t.hydration}:</strong> {plan.mealPlan.hydration}</p>
        <p><strong>{t.supplements}:</strong> {plan.mealPlan.supplementSuggestions}</p>
      </section>

      {/* Pro Tips */}
      <section>
        <h2 style={h2Style}>{t.protipsTab}</h2>
        {plan.proTips.map((tip, index) => (
          <div key={index} style={{ marginBottom: '12px' }}>
            <h3 style={h3Style}>{tip.title}</h3>
            <p>{tip.description}</p>
          </div>
        ))}
      </section>

      <footer style={{ marginTop: '32px', paddingTop: '16px', textAlign: 'center', fontSize: '0.8rem', color: '#64748b', borderTop: '1px solid #e2e8f0' }}>
        <p>{t.footerTagline}</p>
      </footer>
    </div>
  );
};

export default PrintablePlan;