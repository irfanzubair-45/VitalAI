import { MedicalReport } from '../types/medical';

export const SAMPLE_REPORTS: MedicalReport[] = [
  {
    id: 'report-lipid-01',
    title: 'Comprehensive Lipid & Cardiovascular Panel',
    reportDate: 'October 12, 2026',
    patientName: 'Alex Mercer (Demo)',
    labName: 'Quest Diagnostics Regional Lab',
    category: 'Cardiovascular / Lipids',
    urgencyLevel: 'follow_up',
    urgencyReason: 'Elevated LDL Cholesterol and Total Cholesterol warrant non-urgent discussion with your primary care physician about diet, exercise, or lipid-lowering therapy.',
    overallSummary: 'Your lipid profile shows elevated LDL ("bad") cholesterol and total cholesterol, while your protective HDL cholesterol is within a healthy range. Your triglycerides are slightly borderline. These patterns suggest an opportunity to discuss cardiovascular wellness and lifestyle adjustments with your doctor.',
    biomarkers: [
      {
        id: 'tc',
        name: 'Total Cholesterol',
        category: 'Lipid Panel',
        value: 238,
        numericValue: 238,
        unit: 'mg/dL',
        referenceRange: { min: 100, max: 199, text: '< 200 mg/dL' },
        status: 'high',
        simpleExplanation: 'Total cholesterol is the overall amount of cholesterol in your bloodstream, including both protective and risk-associated types.',
        clinicalContext: 'A value of 238 mg/dL is moderately elevated. While total cholesterol gives a high-level picture, doctors look closely at the ratio between HDL and LDL to assess cardiovascular health.',
        potentialReasons: [
          'Diet rich in saturated fats or refined carbohydrates',
          'Genetic tendency or family history of hyperlipidemia',
          'Sedentary lifestyle or low physical activity'
        ],
        recommendedQuestions: [
          'What is my estimated 10-year cardiovascular risk score based on this total cholesterol?',
          'Should we retest this after 3 to 6 months of dietary modifications?'
        ]
      },
      {
        id: 'ldl',
        name: 'LDL Cholesterol (Calculated)',
        category: 'Lipid Panel',
        value: 154,
        numericValue: 154,
        unit: 'mg/dL',
        referenceRange: { min: 0, max: 99, text: '< 100 mg/dL' },
        status: 'high',
        simpleExplanation: 'LDL is often nicknamed "bad cholesterol" because excess amounts can slowly build up along artery walls over years.',
        clinicalContext: 'Your level of 154 mg/dL falls in the "borderline high to high" category. Target levels often depend on personal health history, such as blood pressure or diabetes status.',
        potentialReasons: [
          'High intake of trans and saturated fats',
          'Metabolic factors or thyroid underactivity',
          'Familial hypercholesterolemia genetic factors'
        ],
        recommendedQuestions: [
          'What specific LDL target would be ideal for my age and risk factors?',
          'Do you recommend starting medication like a statin, or trying focused lifestyle changes first?'
        ]
      },
      {
        id: 'hdl',
        name: 'HDL Cholesterol',
        category: 'Lipid Panel',
        value: 52,
        numericValue: 52,
        unit: 'mg/dL',
        referenceRange: { min: 40, max: 100, text: '> 40 mg/dL (Male) / > 50 mg/dL (Female)' },
        status: 'normal',
        simpleExplanation: 'HDL is known as "good cholesterol" because it acts like a clean-up crew, carrying excess cholesterol back to your liver for processing.',
        clinicalContext: 'At 52 mg/dL, your HDL is in a favorable protective range, which helps counterbalance circulating cholesterol.',
        potentialReasons: [
          'Regular aerobic exercise',
          'Healthy dietary fats (olive oil, nuts, avocados)'
        ],
        recommendedQuestions: [
          'Are there specific aerobic exercises or foods that can help boost my HDL even higher?'
        ]
      },
      {
        id: 'trig',
        name: 'Triglycerides',
        category: 'Lipid Panel',
        value: 165,
        numericValue: 165,
        unit: 'mg/dL',
        referenceRange: { min: 0, max: 149, text: '< 150 mg/dL' },
        status: 'high',
        simpleExplanation: 'Triglycerides are the most common type of fat in your body, created from excess calories (especially sugars and carbs) that aren\'t immediately burned for energy.',
        clinicalContext: 'A result of 165 mg/dL is borderline high. Elevated triglycerides often respond quickly to reducing added sugars, cutting alcohol, and increasing physical activity.',
        potentialReasons: [
          'Recent meals high in simple sugars or processed carbohydrates',
          'Alcohol consumption prior to testing',
          'Non-fasting blood draw'
        ],
        recommendedQuestions: [
          'Was my fasting window long enough for an accurate triglyceride measurement?',
          'What dietary substitutions (like swapping refined carbs) have the biggest impact?'
        ]
      },
      {
        id: 'non-hdl',
        name: 'Non-HDL Cholesterol',
        category: 'Lipid Panel',
        value: 186,
        numericValue: 186,
        unit: 'mg/dL',
        referenceRange: { min: 0, max: 129, text: '< 130 mg/dL' },
        status: 'high',
        simpleExplanation: 'Non-HDL accounts for all cholesterol types that can contribute to plaque formation, calculated by subtracting HDL from total cholesterol.',
        clinicalContext: '186 mg/dL is elevated, reflecting the combined higher levels of LDL and triglyceride-rich lipoproteins.',
        potentialReasons: ['Elevated atherogenic lipoprotein particles'],
        recommendedQuestions: ['Does non-HDL give a clearer picture than LDL alone for my health profile?']
      }
    ],
    doctorQuestions: [
      {
        id: 'dq-1',
        category: 'Management Strategy',
        priority: 'high',
        question: 'Given my LDL of 154 mg/dL and Total Cholesterol of 238 mg/dL, do you advise a 3-month trial of nutrition and exercise before considering medication?',
        context: 'Clarifies whether lifestyle interventions are sufficient or if pharmaceutical support (like a low-dose statin) is recommended based on overall risk.'
      },
      {
        id: 'dq-2',
        category: 'Risk Stratification',
        priority: 'medium',
        question: 'Would a Coronary Artery Calcium (CAC) scan or ApoB blood test be helpful to assess my actual arterial plaque risk?',
        context: 'ApoB and CAC scans provide more direct visualization of plaque build-up than standard cholesterol calculations alone.'
      },
      {
        id: 'dq-3',
        category: 'Diet & Lifestyle',
        priority: 'routine',
        question: 'Are there specific dietary guidelines you recommend, such as the Mediterranean diet or increasing soluble fiber?',
        context: 'Soluble fiber (oats, psyllium, legumes) actively binds to cholesterol in the digestive tract to lower circulating levels.'
      }
    ]
  },
  {
    id: 'report-cbc-02',
    title: 'Complete Blood Count (CBC) with Differential',
    reportDate: 'October 10, 2026',
    patientName: 'Jordan Lee (Demo)',
    labName: 'Labcorp Diagnostics Center',
    category: 'Hematology / Blood Count',
    urgencyLevel: 'follow_up',
    urgencyReason: 'Low Hemoglobin, Hematocrit, and MCV indicate mild microcytic anemia, typically related to iron deficiency. Needs routine evaluation.',
    overallSummary: 'Your blood count reveals mild anemia characterized by smaller red blood cells (low MCV) and lower total hemoglobin. White blood cells (immune system) and platelets are healthy. This pattern is commonly linked to iron deficiency or dietary factors.',
    biomarkers: [
      {
        id: 'wbc',
        name: 'White Blood Cell Count (WBC)',
        category: 'Complete Blood Count',
        value: 6.8,
        numericValue: 6.8,
        unit: 'x10E3/uL',
        referenceRange: { min: 4.0, max: 10.5, text: '4.0 - 10.5 x10E3/uL' },
        status: 'normal',
        simpleExplanation: 'White blood cells are your body’s frontline immune defense against bacterial, viral, and fungal infections.',
        clinicalContext: 'Your WBC count of 6.8 is completely normal, showing no active signs of acute infection or bone marrow suppression.',
        potentialReasons: ['Normal healthy immune system function']
      },
      {
        id: 'rbc',
        name: 'Red Blood Cell Count (RBC)',
        category: 'Complete Blood Count',
        value: 3.82,
        numericValue: 3.82,
        unit: 'x10E6/uL',
        referenceRange: { min: 4.10, max: 5.60, text: '4.10 - 5.60 x10E6/uL' },
        status: 'low',
        simpleExplanation: 'Red blood cells transport oxygen from your lungs to every organ and muscle in your body.',
        clinicalContext: 'At 3.82, your RBC count is slightly below the standard range, contributing to mild feelings of fatigue or reduced stamina.',
        potentialReasons: [
          'Decreased red blood cell production due to low iron stores',
          'Recent heavy menstrual cycles or blood loss',
          'Nutritional deficiencies (iron, folate, B12)'
        ]
      },
      {
        id: 'hgb',
        name: 'Hemoglobin',
        category: 'Complete Blood Count',
        value: 10.8,
        numericValue: 10.8,
        unit: 'g/dL',
        referenceRange: { min: 12.0, max: 16.0, text: '12.0 - 16.0 g/dL' },
        status: 'low',
        simpleExplanation: 'Hemoglobin is the iron-rich protein inside red blood cells that locks onto oxygen molecules.',
        clinicalContext: 'A hemoglobin of 10.8 g/dL indicates mild anemia. When hemoglobin is low, tissues receive slightly less oxygen during physical exertion.',
        potentialReasons: [
          'Iron deficiency anemia',
          'Blood loss (menstrual or gastrointestinal)',
          'Chronic inflammation'
        ],
        recommendedQuestions: [
          'Should we check my serum Ferritin and Iron Saturation to confirm iron deficiency?'
        ]
      },
      {
        id: 'mcv',
        name: 'Mean Corpuscular Volume (MCV)',
        category: 'Red Blood Cell Indices',
        value: 74.2,
        numericValue: 74.2,
        unit: 'fL',
        referenceRange: { min: 80.0, max: 98.0, text: '80.0 - 98.0 fL' },
        status: 'low',
        simpleExplanation: 'MCV measures the physical average size of your red blood cells.',
        clinicalContext: 'An MCV of 74.2 fL means your red blood cells are smaller than typical ("microcytic"). This classic hallmark points towards iron insufficiency.',
        potentialReasons: [
          'Insufficient iron available during bone marrow cell synthesis',
          'Thalassemia minor trait (genetic carrier state)'
        ]
      },
      {
        id: 'plt',
        name: 'Platelets',
        category: 'Complete Blood Count',
        value: 310,
        numericValue: 310,
        unit: 'x10E3/uL',
        referenceRange: { min: 140, max: 400, text: '140 - 400 x10E3/uL' },
        status: 'normal',
        simpleExplanation: 'Platelets are cellular fragments that help your blood clot properly when you suffer a scrape or cut.',
        clinicalContext: 'A platelet count of 310 is robust and within normal range, indicating good clotting ability.',
        potentialReasons: ['Normal bone marrow platelet production']
      }
    ],
    doctorQuestions: [
      {
        id: 'dq-cbc-1',
        category: 'Iron Testing',
        priority: 'high',
        question: 'Could we order a comprehensive Iron Panel (Ferritin, Total Iron, TIBC) to confirm whether this microcytic anemia is caused by iron depletion?',
        context: 'Ferritin measures deep tissue iron reserves, helping distinguish simple iron deficiency from other causes of low MCV.'
      },
      {
        id: 'dq-cbc-2',
        category: 'Supplementation',
        priority: 'medium',
        question: 'If iron deficiency is confirmed, what type of oral iron supplement (e.g. Ferrous Bisglycinate or Ferrous Sulfate) would be gentlest on my stomach?',
        context: 'Different iron formulations have varying absorption rates and gastrointestinal tolerance.'
      }
    ]
  },
  {
    id: 'report-cmp-03',
    title: 'Comprehensive Metabolic Panel (CMP-14)',
    reportDate: 'October 08, 2026',
    patientName: 'Samira Patel (Demo)',
    labName: 'BioReference Laboratories',
    category: 'Metabolic & Organ Health',
    urgencyLevel: 'routine',
    urgencyReason: 'Minor elevation in fasting glucose and ALT liver enzyme. Kidney function and electrolytes are optimal.',
    overallSummary: 'Your metabolic panel indicates healthy kidney function and electrolyte balance. Fasting glucose is slightly above optimal baseline, and ALT is mildly elevated, suggesting a discussion on metabolic wellness and liver enzyme follow-up.',
    biomarkers: [
      {
        id: 'glu',
        name: 'Fasting Blood Glucose',
        category: 'Metabolism',
        value: 104,
        numericValue: 104,
        unit: 'mg/dL',
        referenceRange: { min: 70, max: 99, text: '70 - 99 mg/dL' },
        status: 'high',
        simpleExplanation: 'Fasting glucose represents the level of sugar circulating in your blood after not eating for at least 8 to 12 hours.',
        clinicalContext: 'A fasting reading of 104 mg/dL falls into the slightly elevated (pre-diabetes screening range: 100-125 mg/dL). Confirming with an HbA1c test gives a 3-month average.',
        potentialReasons: [
          'Incomplete fasting or carbohydrate-heavy dinner before the draw',
          'Acute stress or poor sleep prior to blood draw',
          'Early insulin resistance'
        ]
      },
      {
        id: 'bun',
        name: 'Blood Urea Nitrogen (BUN)',
        category: 'Kidney Function',
        value: 14,
        numericValue: 14,
        unit: 'mg/dL',
        referenceRange: { min: 7, max: 20, text: '7 - 20 mg/dL' },
        status: 'normal',
        simpleExplanation: 'BUN measures nitrogen waste from protein breakdown that is filtered out by your kidneys.',
        clinicalContext: '14 mg/dL is within the ideal zone, reflecting normal protein waste processing.',
        potentialReasons: ['Healthy kidney filtering and good hydration']
      },
      {
        id: 'creat',
        name: 'Creatinine',
        category: 'Kidney Function',
        value: 0.85,
        numericValue: 0.85,
        unit: 'mg/dL',
        referenceRange: { min: 0.60, max: 1.20, text: '0.60 - 1.20 mg/dL' },
        status: 'normal',
        simpleExplanation: 'Creatinine is a steady muscle breakdown byproduct that healthy kidneys consistently clear.',
        clinicalContext: 'Your creatinine level of 0.85 mg/dL is excellent and corresponds to a healthy estimated Glomerular Filtration Rate (eGFR > 90).',
        potentialReasons: ['Optimal kidney filtration ability']
      },
      {
        id: 'alt',
        name: 'Alanine Aminotransferase (ALT)',
        category: 'Liver Enzymes',
        value: 48,
        numericValue: 48,
        unit: 'U/L',
        referenceRange: { min: 7, max: 35, text: '7 - 35 U/L' },
        status: 'high',
        simpleExplanation: 'ALT is an enzyme predominantly found inside liver cells. When liver cells are stressed, small amounts leak into the bloodstream.',
        clinicalContext: 'A value of 48 U/L is mildly elevated. Isolated mild increases can happen after strenuous workouts, over-the-counter medications (like Tylenol/NSAIDs), or mild fatty liver.',
        potentialReasons: [
          'Recent intense physical exercise',
          'Medication or supplement use',
          'Mild hepatic steatosis (metabolic fatty liver)'
        ]
      }
    ],
    doctorQuestions: [
      {
        id: 'dq-cmp-1',
        category: 'Blood Sugar Monitoring',
        priority: 'medium',
        question: 'Should we check a Hemoglobin A1c (HbA1c) test to see if this fasting glucose of 104 reflects my longer-term 3-month sugar average?',
        context: 'HbA1c is not swayed by day-to-day fasting fluctuations.'
      },
      {
        id: 'dq-cmp-2',
        category: 'Liver Health',
        priority: 'routine',
        question: 'Could my mild ALT elevation be related to my recent exercise routine, or should we re-check liver enzymes in a few months?',
        context: 'Temporary muscular exertion or routine medications can cause mild ALT fluctuations.'
      }
    ]
  }
];

