// js/crafting/fields/pharmaceuticals.js
// Pharmaceuticals & Medicine Recipes - 80+ recipes for healing, enhancement, and biomaterials
// Tier 1-7: From Basic Medicines to Advanced Gene Therapies

export const PHARMACEUTICALS_RECIPES = {
    
    // ============================================================================
    // TIER 1: BASIC MEDICINES (12 recipes)
    // ============================================================================
    
    'Pain Relievers': [
        {
            id: 'aspirin',
            name: 'Aspirin',
            formula: 'Salicylic Acid + Acetic Anhydride → Acetylsalicylic Acid',
            ingredients: { SalicylicAcid: 5, AceticAnhydride: 3 },
            field: 'pharmaceuticals',
            category: 'Pain Relievers',
            tier: 1,
            skillGain: 2,
            target: 100,
            icon: '💊',
            unlocksAt: 0,
            value: 15,
            description: 'Basic pain reliever and anti-inflammatory.',
            laborMultiplier: 1.1,
            usedIn: ['pain_relief', 'fever_reduction', 'anti_inflammatory']
        },
        {
            id: 'ibuprofen',
            name: 'Ibuprofen',
            formula: 'Isobutylbenzene + Acetylation → C₁₃H₁₈O₂',
            ingredients: { Isobutylbenzene: 5, AcetylChloride: 2, Catalyst: 1 },
            field: 'pharmaceuticals',
            category: 'Pain Relievers',
            tier: 1,
            skillGain: 3,
            target: 100,
            icon: '💊',
            unlocksAt: 50,
            value: 20,
            description: 'NSAID for pain, fever, and inflammation.',
            laborMultiplier: 1.2,
            usedIn: ['pain_relief', 'arthritis', 'menstrual_cramps']
        },
        {
            id: 'acetaminophen',
            name: 'Acetaminophen',
            formula: 'Phenol + Acetic Anhydride → C₈H₉NO₂',
            ingredients: { Phenol: 4, AceticAnhydride: 3, Ammonia: 1 },
            field: 'pharmaceuticals',
            category: 'Pain Relievers',
            tier: 1,
            skillGain: 2,
            target: 100,
            icon: '💊',
            unlocksAt: 25,
            value: 18,
            description: 'Pain reliever and fever reducer (Tylenol).',
            laborMultiplier: 1.1,
            usedIn: ['pain_relief', 'fever', 'headache']
        },
        {
            id: 'lidocaine',
            name: 'Lidocaine',
            formula: '2,6-Dimethylaniline + Chloroacetyl Chloride → Local Anesthetic',
            ingredients: { Dimethylaniline: 4, ChloroacetylChloride: 3, Diethylamine: 2 },
            field: 'pharmaceuticals',
            category: 'Pain Relievers',
            tier: 1,
            skillGain: 4,
            target: 100,
            icon: '💉',
            unlocksAt: 100,
            value: 30,
            description: 'Local anesthetic for minor procedures.',
            laborMultiplier: 1.3,
            usedIn: ['dental', 'minor_surgery', 'topical']
        }
    ],
    
    'Antiseptics': [
        {
            id: 'iodine_solution',
            name: 'Iodine Solution',
            formula: 'Iodine + Potassium Iodide + Alcohol → Antiseptic',
            ingredients: { Iodine: 2, PotassiumIodide: 1, Ethanol: 10 },
            field: 'pharmaceuticals',
            category: 'Antiseptics',
            tier: 1,
            skillGain: 2,
            target: 100,
            icon: '🧴',
            unlocksAt: 0,
            value: 12,
            description: 'Broad-spectrum antiseptic for wound cleaning.',
            laborMultiplier: 1.1,
            usedIn: ['wound_care', 'pre-surgical', 'disinfection']
        },
        {
            id: 'alcohol_swab',
            name: 'Alcohol Swab',
            formula: 'Isopropyl Alcohol + Gauze → Sterile Swab',
            ingredients: { IsopropylAlcohol: 5, Gauze: 2 },
            field: 'pharmaceuticals',
            category: 'Antiseptics',
            tier: 1,
            skillGain: 1,
            target: 100,
            icon: '🧻',
            unlocksAt: 10,
            value: 5,
            description: 'Single-use antiseptic for skin preparation.',
            laborMultiplier: 1.0,
            usedIn: ['injection_prep', 'minor_wounds', 'cleaning']
        },
        {
            id: 'hydrogen_peroxide_medical',
            name: 'Medical Hydrogen Peroxide',
            formula: 'H₂O₂ + Stabilizers → 3% Solution',
            ingredients: { HydrogenPeroxide: 5, PurifiedWater: 15, Stabilizer: 1 },
            field: 'pharmaceuticals',
            category: 'Antiseptics',
            tier: 1,
            skillGain: 2,
            target: 100,
            icon: '💧',
            unlocksAt: 20,
            value: 8,
            description: 'Mild antiseptic for wound cleaning.',
            laborMultiplier: 1.1,
            usedIn: ['wound_care', 'mouthwash', 'disinfection']
        },
        {
            id: 'chlorhexidine',
            name: 'Chlorhexidine',
            formula: 'Biguanide Derivative + Chlorination → Antiseptic',
            ingredients: { Biguanide: 4, Chlorine: 2, PurifiedWater: 10 },
            field: 'pharmaceuticals',
            category: 'Antiseptics',
            tier: 1,
            skillGain: 4,
            target: 100,
            icon: '🧼',
            unlocksAt: 150,
            value: 25,
            description: 'Persistent antiseptic for surgical scrub.',
            laborMultiplier: 1.3,
            usedIn: ['surgical_scrub', 'dental', 'pre-surgical']
        }
    ],
    
    'Antibiotics': [
        {
            id: 'penicillin',
            name: 'Penicillin',
            formula: 'Penicillium Mold + Fermentation → Antibiotic',
            ingredients: { PenicilliumCulture: 1, Sugar: 10, CornSteepLiquor: 5 },
            field: 'pharmaceuticals',
            category: 'Antibiotics',
            tier: 1,
            skillGain: 5,
            target: 100,
            icon: '💊',
            unlocksAt: 200,
            value: 40,
            description: 'First antibiotic, effective against gram-positive bacteria.',
            laborMultiplier: 1.4,
            usedIn: ['bacterial_infections', 'pneumonia', 'strep']
        },
        {
            id: 'amoxicillin',
            name: 'Amoxicillin',
            formula: 'Penicillin + Side Chain Modification → Broad Spectrum',
            ingredients: { Penicillin: 5, Hydroxybenzene: 2, Catalyst: 1 },
            field: 'pharmaceuticals',
            category: 'Antibiotics',
            tier: 1,
            skillGain: 6,
            target: 100,
            icon: '💊',
            unlocksAt: 300,
            value: 50,
            description: 'Broad-spectrum penicillin antibiotic.',
            laborMultiplier: 1.4,
            usedIn: ['respiratory_infections', 'uti', 'ear_infections']
        },
        {
            id: 'tetracycline',
            name: 'Tetracycline',
            formula: 'Streptomyces Fermentation + Purification → Antibiotic',
            ingredients: { StreptomycesCulture: 1, Sugar: 15, NitrogenSource: 5 },
            field: 'pharmaceuticals',
            category: 'Antibiotics',
            tier: 1,
            skillGain: 7,
            target: 100,
            icon: '💊',
            unlocksAt: 400,
            value: 60,
            description: 'Broad-spectrum antibiotic for various infections.',
            laborMultiplier: 1.5,
            usedIn: ['acne', 'respiratory', 'lyme_disease']
        }
    ],
    
    // ============================================================================
    // TIER 2: VACCINES & SERUMS (12 recipes)
    // ============================================================================
    
    'Basic Vaccines': [
        {
            id: 'influenza_vaccine',
            name: 'Influenza Vaccine',
            formula: 'Egg Culture + Virus Inactivation → Flu Shot',
            ingredients: { EmbryonatedEggs: 10, FluVirus: 1, Formaldehyde: 1 },
            field: 'pharmaceuticals',
            category: 'Basic Vaccines',
            tier: 2,
            skillGain: 8,
            target: 200,
            icon: '💉',
            unlocksAt: 600,
            value: 80,
            description: 'Annual vaccine against influenza virus.',
            laborMultiplier: 1.5,
            usedIn: ['flu_prevention', 'seasonal', 'public_health']
        },
        {
            id: 'tetanus_vaccine',
            name: 'Tetanus Vaccine',
            formula: 'Toxoid + Adjuvant → Immunization',
            ingredients: { TetanusToxoid: 2, AluminumHydroxide: 1, Thimerosal: 1 },
            field: 'pharmaceuticals',
            category: 'Basic Vaccines',
            tier: 2,
            skillGain: 7,
            target: 200,
            icon: '💉',
            unlocksAt: 650,
            value: 70,
            description: 'Vaccine against tetanus infection.',
            laborMultiplier: 1.5,
            usedIn: ['tetanus_prevention', 'wound_care', 'routine']
        },
        {
            id: 'diphtheria_vaccine',
            name: 'Diphtheria Vaccine',
            formula: 'Toxoid + Adjuvant → Immunization',
            ingredients: { DiphtheriaToxoid: 2, AluminumHydroxide: 1, Preservative: 1 },
            field: 'pharmaceuticals',
            category: 'Basic Vaccines',
            tier: 2,
            skillGain: 7,
            target: 200,
            icon: '💉',
            unlocksAt: 700,
            value: 70,
            description: 'Vaccine against diphtheria.',
            laborMultiplier: 1.5,
            usedIn: ['diphtheria_prevention', 'childhood']
        },
        {
            id: 'polio_vaccine',
            name: 'Polio Vaccine (IPV)',
            formula: 'Cell Culture + Virus Inactivation → Injectable',
            ingredients: { VeroCells: 5, PolioVirus: 1, Formaldehyde: 1 },
            field: 'pharmaceuticals',
            category: 'Basic Vaccines',
            tier: 2,
            skillGain: 9,
            target: 200,
            icon: '💉',
            unlocksAt: 800,
            value: 90,
            description: 'Inactivated polio vaccine for eradication.',
            laborMultiplier: 1.6,
            usedIn: ['polio_prevention', 'childhood', 'global_health']
        }
    ],
    
    'Antivenoms': [
        {
            id: 'snake_antivenom',
            name: 'Snake Antivenom',
            formula: 'Horse Immunization + Plasma Purification → Antivenom',
            ingredients: { HorsePlasma: 20, SnakeVenom: 1, Pepsin: 2 },
            field: 'pharmaceuticals',
            category: 'Antivenoms',
            tier: 2,
            skillGain: 12,
            target: 200,
            icon: '🐍',
            unlocksAt: 1000,
            value: 200,
            description: 'Life-saving treatment for snake bites.',
            laborMultiplier: 1.8,
            usedIn: ['snake_bites', 'emergency', 'wilderness']
        },
        {
            id: 'spider_antivenom',
            name: 'Spider Antivenom',
            formula: 'Horse Immunization + Plasma Purification → Antivenom',
            ingredients: { HorsePlasma: 15, SpiderVenom: 1, Pepsin: 2 },
            field: 'pharmaceuticals',
            category: 'Antivenoms',
            tier: 2,
            skillGain: 11,
            target: 200,
            icon: '🕷️',
            unlocksAt: 950,
            value: 180,
            description: 'Treatment for venomous spider bites.',
            laborMultiplier: 1.7,
            usedIn: ['spider_bites', 'emergency']
        },
        {
            id: 'scorpion_antivenom',
            name: 'Scorpion Antivenom',
            formula: 'Horse Immunization + Plasma Purification → Antivenom',
            ingredients: { HorsePlasma: 15, ScorpionVenom: 1, Pepsin: 2 },
            field: 'pharmaceuticals',
            category: 'Antivenoms',
            tier: 2,
            skillGain: 11,
            target: 200,
            icon: '🦂',
            unlocksAt: 1050,
            value: 190,
            description: 'Treatment for scorpion stings.',
            laborMultiplier: 1.7,
            usedIn: ['scorpion_stings', 'emergency']
        }
    ],
    
    'Immune Globulins': [
        {
            id: 'ivig',
            name: 'IVIG (Intravenous Immunoglobulin)',
            formula: 'Human Plasma + Fractionation → Antibodies',
            ingredients: { HumanPlasma: 50, Ethanol: 10, Purification: 1 },
            field: 'pharmaceuticals',
            category: 'Immune Globulins',
            tier: 2,
            skillGain: 15,
            target: 200,
            icon: '🩸',
            unlocksAt: 1200,
            value: 300,
            description: 'Concentrated antibodies for immune disorders.',
            laborMultiplier: 2.0,
            usedIn: ['immunodeficiency', 'autoimmune', 'infections']
        },
        {
            id: 'rabies_ig',
            name: 'Rabies Immune Globulin',
            formula: 'Immunized Donors + Fractionation → Post-Exposure',
            ingredients: { ImmunePlasma: 20, Ethanol: 5, Purification: 1 },
            field: 'pharmaceuticals',
            category: 'Immune Globulins',
            tier: 2,
            skillGain: 13,
            target: 200,
            icon: '🦇',
            unlocksAt: 1100,
            value: 250,
            description: 'Immediate protection after rabies exposure.',
            laborMultiplier: 1.9,
            usedIn: ['rabies_prevention', 'animal_bites']
        }
    ],
    
    // ============================================================================
    // TIER 3: HORMONES & STEROIDS (10 recipes)
    // ============================================================================
    
    'Hormones': [
        {
            id: 'insulin',
            name: 'Insulin',
            formula: 'Recombinant DNA + E. coli Fermentation → Human Insulin',
            ingredients: { EColiCulture: 1, Sugar: 20, AminoAcids: 10 },
            field: 'pharmaceuticals',
            category: 'Hormones',
            tier: 3,
            skillGain: 20,
            target: 300,
            icon: '💉',
            unlocksAt: 2000,
            value: 150,
            description: 'Life-saving hormone for diabetes management.',
            laborMultiplier: 2.2,
            usedIn: ['diabetes', 'blood_sugar', 'metabolic']
        },
        {
            id: 'growth_hormone',
            name: 'Growth Hormone',
            formula: 'Recombinant DNA + Mammalian Cell Culture → HGH',
            ingredients: { MammalianCells: 1, GrowthFactors: 5, AminoAcids: 15 },
            field: 'pharmaceuticals',
            category: 'Hormones',
            tier: 3,
            skillGain: 25,
            target: 300,
            icon: '📈',
            unlocksAt: 2500,
            value: 400,
            description: 'Hormone for growth disorders and regeneration.',
            laborMultiplier: 2.5,
            usedIn: ['growth_disorders', 'anti_aging', 'regenerative']
        },
        {
            id: 'thyroxine',
            name: 'Thyroxine (T4)',
            formula: 'Tyrosine + Iodination → Thyroid Hormone',
            ingredients: { Tyrosine: 5, Iodine: 3, Enzymes: 1 },
            field: 'pharmaceuticals',
            category: 'Hormones',
            tier: 3,
            skillGain: 15,
            target: 300,
            icon: '⚕️',
            unlocksAt: 2200,
            value: 80,
            description: 'Thyroid hormone replacement for hypothyroidism.',
            laborMultiplier: 1.8,
            usedIn: ['hypothyroidism', 'metabolic', 'thyroid']
        },
        {
            id: 'estrogen',
            name: 'Estrogen',
            formula: 'Steroid Synthesis → Female Hormone',
            ingredients: { Cholesterol: 10, Enzymes: 3, Purification: 1 },
            field: 'pharmaceuticals',
            category: 'Hormones',
            tier: 3,
            skillGain: 18,
            target: 300,
            icon: '⚧️',
            unlocksAt: 2300,
            value: 120,
            description: 'Primary female sex hormone for HRT.',
            laborMultiplier: 2.0,
            usedIn: ['hormone_therapy', 'contraception', 'menopause']
        },
        {
            id: 'testosterone',
            name: 'Testosterone',
            formula: 'Steroid Synthesis → Male Hormone',
            ingredients: { Cholesterol: 12, Enzymes: 4, Purification: 1 },
            field: 'pharmaceuticals',
            category: 'Hormones',
            tier: 3,
            skillGain: 18,
            target: 300,
            icon: '⚧️',
            unlocksAt: 2400,
            value: 130,
            description: 'Primary male sex hormone for HRT.',
            laborMultiplier: 2.0,
            usedIn: ['hormone_therapy', 'hypogonadism']
        }
    ],
    
    'Corticosteroids': [
        {
            id: 'hydrocortisone',
            name: 'Hydrocortisone',
            formula: 'Steroid Synthesis → Anti-inflammatory',
            ingredients: { Cholesterol: 8, Enzymes: 3, Oxygen: 5 },
            field: 'pharmaceuticals',
            category: 'Corticosteroids',
            tier: 3,
            skillGain: 16,
            target: 300,
            icon: '🧴',
            unlocksAt: 2600,
            value: 90,
            description: 'Anti-inflammatory steroid for skin conditions.',
            laborMultiplier: 1.9,
            usedIn: ['eczema', 'dermatitis', 'inflammation']
        },
        {
            id: 'prednisone',
            name: 'Prednisone',
            formula: 'Hydrocortisone Modification → Potent Steroid',
            ingredients: { Hydrocortisone: 5, Dehydrogenation: 1, Purification: 1 },
            field: 'pharmaceuticals',
            category: 'Corticosteroids',
            tier: 3,
            skillGain: 20,
            target: 300,
            icon: '💊',
            unlocksAt: 2800,
            value: 100,
            description: 'Potent steroid for severe inflammation and autoimmune disorders.',
            laborMultiplier: 2.1,
            usedIn: ['autoimmune', 'allergies', 'inflammation']
        },
        {
            id: 'betamethasone',
            name: 'Betamethasone',
            formula: 'Steroid Synthesis → High-Potency Topical',
            ingredients: { SteroidPrecursor: 6, Fluorination: 1, Purification: 1 },
            field: 'pharmaceuticals',
            category: 'Corticosteroids',
            tier: 3,
            skillGain: 22,
            target: 300,
            icon: '🧴',
            unlocksAt: 3000,
            value: 140,
            description: 'High-potency topical steroid for severe skin conditions.',
            laborMultiplier: 2.2,
            usedIn: ['psoriasis', 'eczema', 'dermatitis']
        }
    ],
    
    // ============================================================================
    // TIER 4: ANESTHETICS & SURGICAL (10 recipes)
    // ============================================================================
    
    'General Anesthetics': [
        {
            id: 'propofol',
            name: 'Propofol',
            formula: 'Phenol Derivative + Emulsion → IV Anesthetic',
            ingredients: { Phenol: 5, Isopropyl: 3, SoybeanOil: 5, EggLecithin: 2 },
            field: 'pharmaceuticals',
            category: 'General Anesthetics',
            tier: 4,
            skillGain: 25,
            target: 400,
            icon: '💉',
            unlocksAt: 4000,
            value: 200,
            description: 'Short-acting IV anesthetic for surgery.',
            laborMultiplier: 2.3,
            usedIn: ['surgery', 'sedation', 'icu']
        },
        {
            id: 'sevoflurane',
            name: 'Sevoflurane',
            formula: 'Fluorinated Ether → Inhalation Anesthetic',
            ingredients: { FluorinatedEther: 10, Purification: 2 },
            field: 'pharmaceuticals',
            category: 'General Anesthetics',
            tier: 4,
            skillGain: 28,
            target: 400,
            icon: '💨',
            unlocksAt: 4500,
            value: 250,
            description: 'Inhalation anesthetic for maintenance of anesthesia.',
            laborMultiplier: 2.4,
            usedIn: ['surgery', 'general_anesthesia']
        },
        {
            id: 'ketamine',
            name: 'Ketamine',
            formula: 'Cyclohexanone Derivative → Dissociative Anesthetic',
            ingredients: { Cyclohexanone: 6, Methylamine: 3, Chlorination: 2 },
            field: 'pharmaceuticals',
            category: 'General Anesthetics',
            tier: 4,
            skillGain: 24,
            target: 400,
            icon: '💊',
            unlocksAt: 4200,
            value: 180,
            description: 'Dissociative anesthetic for emergency and pediatric use.',
            laborMultiplier: 2.2,
            usedIn: ['emergency', 'pediatric', 'pain_management']
        }
    ],
    
    'Muscle Relaxants': [
        {
            id: 'succinylcholine',
            name: 'Succinylcholine',
            formula: 'Succinic Acid + Choline → Depolarizing Relaxant',
            ingredients: { SuccinicAcid: 5, Choline: 5, Acetylation: 2 },
            field: 'pharmaceuticals',
            category: 'Muscle Relaxants',
            tier: 4,
            skillGain: 22,
            target: 400,
            icon: '⚡',
            unlocksAt: 5000,
            value: 160,
            description: 'Short-acting depolarizing muscle relaxant for intubation.',
            laborMultiplier: 2.2,
            usedIn: ['intubation', 'surgery', 'emergency']
        },
        {
            id: 'vecuronium',
            name: 'Vecuronium',
            formula: 'Aminosteroid → Non-depolarizing Relaxant',
            ingredients: { Aminosteroid: 8, QuaternaryAmmonium: 3, Purification: 2 },
            field: 'pharmaceuticals',
            category: 'Muscle Relaxants',
            tier: 4,
            skillGain: 26,
            target: 400,
            icon: '💊',
            unlocksAt: 5500,
            value: 220,
            description: 'Intermediate-acting muscle relaxant for surgery.',
            laborMultiplier: 2.4,
            usedIn: ['surgery', 'mechanical_ventilation']
        }
    ],
    
    'Local Anesthetics': [
        {
            id: 'bupivacaine',
            name: 'Bupivacaine',
            formula: 'Amide Synthesis → Long-Acting Local',
            ingredients: { Amine: 6, AcidChloride: 4, Purification: 2 },
            field: 'pharmaceuticals',
            category: 'Local Anesthetics',
            tier: 4,
            skillGain: 23,
            target: 400,
            icon: '💉',
            unlocksAt: 4800,
            value: 150,
            description: 'Long-acting local anesthetic for spinal and epidural.',
            laborMultiplier: 2.2,
            usedIn: ['spinal', 'epidural', 'nerve_blocks']
        },
        {
            id: 'ropivacaine',
            name: 'Ropivacaine',
            formula: 'Amide Synthesis → Less Cardiotoxic',
            ingredients: { Amine: 6, AcidChloride: 4, Purification: 2, IsomerSeparation: 1 },
            field: 'pharmaceuticals',
            category: 'Local Anesthetics',
            tier: 4,
            skillGain: 25,
            target: 400,
            icon: '💉',
            unlocksAt: 5200,
            value: 180,
            description: 'Local anesthetic with reduced cardiac toxicity.',
            laborMultiplier: 2.3,
            usedIn: ['nerve_blocks', 'labor_analgesia']
        }
    ],
    
    // ============================================================================
    // TIER 5: CHEMOTHERAPY & ONCOLOGY (8 recipes)
    // ============================================================================
    
    'Chemotherapy Agents': [
        {
            id: 'cisplatin',
            name: 'Cisplatin',
            formula: 'Platinum + Ammonia + Chlorine → Pt(NH₃)₂Cl₂',
            ingredients: { Platinum: 5, Ammonia: 4, Chlorine: 4, Purification: 3 },
            field: 'pharmaceuticals',
            category: 'Chemotherapy Agents',
            tier: 5,
            skillGain: 35,
            target: 500,
            icon: '⚕️',
            unlocksAt: 8000,
            value: 500,
            description: 'Platinum-based chemotherapy for various cancers.',
            laborMultiplier: 2.8,
            usedIn: ['testicular_cancer', 'ovarian_cancer', 'lung_cancer']
        },
        {
            id: 'doxorubicin',
            name: 'Doxorubicin',
            formula: 'Streptomyces Fermentation + Glycosylation → Anthracycline',
            ingredients: { StreptomycesCulture: 1, Sugar: 20, Daunorubicin: 5 },
            field: 'pharmaceuticals',
            category: 'Chemotherapy Agents',
            tier: 5,
            skillGain: 40,
            target: 500,
            icon: '💊',
            unlocksAt: 9000,
            value: 600,
            description: 'Anthracycline antibiotic for broad cancer treatment.',
            laborMultiplier: 3.0,
            usedIn: ['breast_cancer', 'leukemia', 'lymphoma']
        },
        {
            id: 'paclitaxel',
            name: 'Paclitaxel (Taxol)',
            formula: 'Yew Tree Extract + Semi-synthesis → Taxane',
            ingredients: { YewExtract: 10, SemiSynthesis: 1, Purification: 3 },
            field: 'pharmaceuticals',
            category: 'Chemotherapy Agents',
            tier: 5,
            skillGain: 45,
            target: 500,
            icon: '🌲',
            unlocksAt: 10000,
            value: 800,
            description: 'Taxane chemotherapy from Pacific yew trees.',
            laborMultiplier: 3.2,
            usedIn: ['breast_cancer', 'ovarian_cancer', 'lung_cancer']
        },
        {
            id: 'methotrexate',
            name: 'Methotrexate',
            formula: 'Folic Acid Analogue → Antimetabolite',
            ingredients: { FolicAcid: 8, Aminopterin: 3, Modification: 2 },
            field: 'pharmaceuticals',
            category: 'Chemotherapy Agents',
            tier: 5,
            skillGain: 30,
            target: 500,
            icon: '💊',
            unlocksAt: 8500,
            value: 350,
            description: 'Antimetabolite for cancer and autoimmune diseases.',
            laborMultiplier: 2.6,
            usedIn: ['leukemia', 'rheumatoid_arthritis', 'psoriasis']
        }
    ],
    
    'Immunotherapy': [
        {
            id: 'interferon',
            name: 'Interferon',
            formula: 'Recombinant DNA + Cell Culture → Immune Modulator',
            ingredients: { EColiCulture: 1, Sugar: 20, AminoAcids: 15, Purification: 3 },
            field: 'pharmaceuticals',
            category: 'Immunotherapy',
            tier: 5,
            skillGain: 38,
            target: 500,
            icon: '🛡️',
            unlocksAt: 11000,
            value: 700,
            description: 'Immune system modulator for cancer and viral infections.',
            laborMultiplier: 3.0,
            usedIn: ['hepatitis', 'multiple_sclerosis', 'cancer']
        },
        {
            id: 'monoclonal_antibody',
            name: 'Monoclonal Antibody',
            formula: 'Hybridoma + Cell Culture → Targeted Therapy',
            ingredients: { HybridomaCells: 1, GrowthMedium: 30, Purification: 5 },
            field: 'pharmaceuticals',
            category: 'Immunotherapy',
            tier: 5,
            skillGain: 50,
            target: 500,
            icon: '🎯',
            unlocksAt: 15000,
            value: 2000,
            description: 'Targeted antibodies for cancer and autoimmune diseases.',
            laborMultiplier: 4.0,
            usedIn: ['cancer', 'autoimmune', 'transplant']
        }
    ],
    
    // ============================================================================
    // TIER 6: GENE THERAPY & BIOLOGICS (8 recipes)
    // ============================================================================
    
    'Gene Therapy': [
        {
            id: 'viral_vector',
            name: 'Viral Vector (AAV)',
            formula: 'Viral Capsid + Therapeutic Gene → Delivery System',
            ingredients: { AAVCapsid: 5, PlasmidDNA: 3, HEK293Cells: 10, Purification: 4 },
            field: 'pharmaceuticals',
            category: 'Gene Therapy',
            tier: 6,
            skillGain: 60,
            target: 600,
            icon: '🧬',
            unlocksAt: 20000,
            value: 3000,
            description: 'Adeno-associated virus vector for gene delivery.',
            laborMultiplier: 4.5,
            usedIn: ['gene_therapy', 'rare_diseases', 'clinical_trials']
        },
        {
            id: 'crispr_cas9',
            name: 'CRISPR-Cas9 Gene Editing',
            formula: 'Cas9 Protein + Guide RNA → Gene Editing System',
            ingredients: { Cas9Protein: 5, GuideRNA: 3, DeliveryVector: 2, Purification: 3 },
            field: 'pharmaceuticals',
            category: 'Gene Therapy',
            tier: 6,
            skillGain: 75,
            target: 600,
            icon: '✂️',
            unlocksAt: 25000,
            value: 5000,
            description: 'Revolutionary gene editing tool for precision medicine.',
            laborMultiplier: 5.0,
            usedIn: ['genetic_disorders', 'research', 'therapeutics']
        },
        {
            id: 'mrna_vaccine',
            name: 'mRNA Vaccine',
            formula: 'mRNA + Lipid Nanoparticle → Vaccine',
            ingredients: { mRNA: 5, LipidNanoparticle: 3, Purification: 2 },
            field: 'pharmaceuticals',
            category: 'Gene Therapy',
            tier: 6,
            skillGain: 55,
            target: 600,
            icon: '🧪',
            unlocksAt: 22000,
            value: 1500,
            description: 'mRNA-based vaccine for rapid development.',
            laborMultiplier: 4.0,
            usedIn: ['covid19', 'emerging_diseases', 'cancer_vaccines']
        }
    ],
    
    'Stem Cell Therapies': [
        {
            id: 'mesenchymal_stem_cells',
            name: 'Mesenchymal Stem Cells',
            formula: 'Bone Marrow Harvest + Culture + Differentiation → Therapy',
            ingredients: { BoneMarrow: 20, GrowthFactors: 10, CultureMedia: 30 },
            field: 'pharmaceuticals',
            category: 'Stem Cell Therapies',
            tier: 6,
            skillGain: 65,
            target: 600,
            icon: '🩺',
            unlocksAt: 23000,
            value: 4000,
            description: 'Multipotent stem cells for regenerative medicine.',
            laborMultiplier: 4.8,
            usedIn: ['arthritis', 'cartilage_repair', 'autoimmune']
        },
        {
            id: 'ipsc',
            name: 'Induced Pluripotent Stem Cells',
            formula: 'Somatic Cells + Reprogramming Factors → Pluripotent',
            ingredients: { SkinCells: 10, YamanakaFactors: 5, CultureMedia: 40 },
            field: 'pharmaceuticals',
            category: 'Stem Cell Therapies',
            tier: 6,
            skillGain: 80,
            target: 600,
            icon: '🔬',
            unlocksAt: 28000,
            value: 6000,
            description: 'Patient-specific pluripotent stem cells for therapy.',
            laborMultiplier: 5.5,
            usedIn: ['regenerative', 'disease_modeling', 'drug_testing']
        }
    ],
    
    'Blood Products': [
        {
            id: 'factor_viii',
            name: 'Factor VIII (Hemophilia Treatment)',
            formula: 'Recombinant DNA + Cell Culture → Clotting Factor',
            ingredients: { CHO_Cells: 10, GrowthMedium: 30, Purification: 5 },
            field: 'pharmaceuticals',
            category: 'Blood Products',
            tier: 6,
            skillGain: 58,
            target: 600,
            icon: '🩸',
            unlocksAt: 21000,
            value: 3500,
            description: 'Clotting factor for hemophilia A treatment.',
            laborMultiplier: 4.5,
            usedIn: ['hemophilia', 'bleeding_disorders']
        },
        {
            id: 'albumin',
            name: 'Human Serum Albumin',
            formula: 'Plasma Fractionation → Blood Volume Expander',
            ingredients: { HumanPlasma: 50, Fractionation: 3, Pasteurization: 1 },
            field: 'pharmaceuticals',
            category: 'Blood Products',
            tier: 6,
            skillGain: 40,
            target: 600,
            icon: '💧',
            unlocksAt: 19000,
            value: 800,
            description: 'Blood volume expander for critical care.',
            laborMultiplier: 3.5,
            usedIn: ['shock', 'burns', 'hypoalbuminemia']
        }
    ],
    
    // ============================================================================
    // TIER 7: ADVANCED THERAPEUTICS (8 recipes)
    // ============================================================================
    
    'Nanomedicine': [
        {
            id: 'liposomal_doxorubicin',
            name: 'Liposomal Doxorubicin',
            formula: 'Doxorubicin + Liposome Encapsulation → Targeted Therapy',
            ingredients: { Doxorubicin: 5, Liposomes: 10, Pegylation: 2 },
            field: 'pharmaceuticals',
            category: 'Nanomedicine',
            tier: 7,
            skillGain: 70,
            target: 800,
            icon: '💊',
            unlocksAt: 35000,
            value: 4000,
            description: 'Encapsulated chemotherapy with reduced side effects.',
            laborMultiplier: 5.0,
            usedIn: ['breast_cancer', 'ovarian_cancer', 'reduced_cardiotoxicity']
        },
        {
            id: 'gold_nanoparticles',
            name: 'Gold Nanoparticles for Drug Delivery',
            formula: 'Gold + Surface Coating + Drug Conjugation → Theranostic',
            ingredients: { Gold: 5, PEG: 3, DrugMolecule: 2, TargetingLigand: 1 },
            field: 'pharmaceuticals',
            category: 'Nanomedicine',
            tier: 7,
            skillGain: 75,
            target: 800,
            icon: '✨',
            unlocksAt: 40000,
            value: 6000,
            description: 'Multifunctional nanoparticles for imaging and therapy.',
            laborMultiplier: 5.5,
            usedIn: ['cancer_therapy', 'imaging', 'targeted_delivery']
        },
        {
            id: 'quantum_dot_imaging',
            name: 'Quantum Dot Imaging Agent',
            formula: 'CdSe + ZnS Coating + Bioconjugation → Fluorescent Probe',
            ingredients: { Cadmium: 3, Selenium: 3, Zinc: 2, TargetingAntibody: 1 },
            field: 'pharmaceuticals',
            category: 'Nanomedicine',
            tier: 7,
            skillGain: 72,
            target: 800,
            icon: '🔬',
            unlocksAt: 38000,
            value: 5000,
            description: 'Fluorescent nanoparticles for cellular imaging.',
            laborMultiplier: 5.2,
            usedIn: ['imaging', 'diagnostics', 'research']
        }
    ],
    
    'Personalized Medicine': [
        {
            id: 'car_t_cells',
            name: 'CAR-T Cells',
            formula: 'T Cells + Viral Vector + Expansion → Cancer Immunotherapy',
            ingredients: { PatientTCells: 20, ViralVector: 5, ActivationBeads: 3, CultureMedia: 50 },
            field: 'pharmaceuticals',
            category: 'Personalized Medicine',
            tier: 7,
            skillGain: 100,
            target: 800,
            icon: '🛡️',
            unlocksAt: 50000,
            value: 20000,
            description: 'Patient-specific T cells engineered to fight cancer.',
            laborMultiplier: 8.0,
            usedIn: ['leukemia', 'lymphoma', 'liquid_tumors']
        },
        {
            id: 'personalized_cancer_vaccine',
            name: 'Personalized Cancer Vaccine',
            formula: 'Tumor Sequencing + Neoantigen Identification + Vaccine Formulation',
            ingredients: { TumorBiopsy: 1, Sequencing: 1, NeoantigenPeptides: 5, Adjuvant: 2 },
            field: 'pharmaceuticals',
            category: 'Personalized Medicine',
            tier: 7,
            skillGain: 95,
            target: 800,
            icon: '🧬',
            unlocksAt: 55000,
            value: 15000,
            description: 'Tailored vaccine based on patient-specific tumor mutations.',
            laborMultiplier: 7.5,
            usedIn: ['personalized_oncology', 'immunotherapy']
        }
    ],
    
    'Regenerative Medicine': [
        {
            id: 'bioink',
            name: 'Bioink for 3D Bioprinting',
            formula: 'Hydrogel + Living Cells + Growth Factors → Printable Tissue',
            ingredients: { Alginate: 5, Collagen: 5, StemCells: 10, GrowthFactors: 3 },
            field: 'pharmaceuticals',
            category: 'Regenerative Medicine',
            tier: 7,
            skillGain: 80,
            target: 800,
            icon: '🖨️',
            unlocksAt: 45000,
            value: 8000,
            description: 'Printable material containing living cells for tissue engineering.',
            laborMultiplier: 6.0,
            usedIn: ['tissue_engineering', 'organ_printing', 'research']
        },
        {
            id: 'organoid',
            name: 'Organoid Culture',
            formula: 'Stem Cells + Matrix + Growth Factors → Mini-Organ',
            ingredients: { StemCells: 15, Matrigel: 10, GrowthFactors: 8, CultureMedia: 40 },
            field: 'pharmaceuticals',
            category: 'Regenerative Medicine',
            tier: 7,
            skillGain: 90,
            target: 800,
            icon: '🧫',
            unlocksAt: 48000,
            value: 10000,
            description: '3D organ-like structures for drug testing and transplantation.',
            laborMultiplier: 7.0,
            usedIn: ['drug_testing', 'development', 'transplant']
        }
    ],
    
    // ============================================================================
    // ADDITIONAL: VITAMINS & SUPPLEMENTS (Helper recipes)
    // ============================================================================
    
    'Vitamins': [
        {
            id: 'vitamin_c',
            name: 'Vitamin C (Ascorbic Acid)',
            formula: 'Glucose → Sorbitol → Sorbose → Ascorbic Acid',
            ingredients: { Glucose: 20, Fermentation: 1, ChemicalSynthesis: 2 },
            field: 'pharmaceuticals',
            category: 'Vitamins',
            tier: 2,
            skillGain: 5,
            target: 200,
            icon: '🍊',
            unlocksAt: 500,
            value: 20,
            description: 'Essential vitamin for immune function and collagen synthesis.',
            laborMultiplier: 1.3,
            usedIn: ['supplements', 'antioxidant', 'immune_support']
        },
        {
            id: 'vitamin_b12',
            name: 'Vitamin B12',
            formula: 'Bacterial Fermentation + Purification → Cyanocobalamin',
            ingredients: { BacterialCulture: 1, Cobalt: 1, Sugar: 15, Purification: 3 },
            field: 'pharmaceuticals',
            category: 'Vitamins',
            tier: 3,
            skillGain: 12,
            target: 300,
            icon: '💊',
            unlocksAt: 1500,
            value: 60,
            description: 'Essential vitamin for nerve function and red blood cells.',
            laborMultiplier: 1.6,
            usedIn: ['supplements', 'anemia', 'neurological']
        },
        {
            id: 'vitamin_d3',
            name: 'Vitamin D3 (Cholecalciferol)',
            formula: 'Lanolin + UV Light → Vitamin D3',
            ingredients: { Lanolin: 10, UVLight: 1, Purification: 2 },
            field: 'pharmaceuticals',
            category: 'Vitamins',
            tier: 2,
            skillGain: 6,
            target: 200,
            icon: '☀️',
            unlocksAt: 600,
            value: 25,
            description: 'Essential vitamin for calcium absorption and bone health.',
            laborMultiplier: 1.4,
            usedIn: ['supplements', 'bone_health', 'immune']
        }
    ],
    
    'Diagnostics': [
        {
            id: 'pcr_test',
            name: 'PCR Test Kit',
            formula: 'Primers + Polymerase + Buffer → Detection System',
            ingredients: { Primers: 3, TaqPolymerase: 1, Buffer: 5, dNTPs: 2 },
            field: 'pharmaceuticals',
            category: 'Diagnostics',
            tier: 4,
            skillGain: 20,
            target: 400,
            icon: '🧪',
            unlocksAt: 3500,
            value: 100,
            description: 'Polymerase chain reaction test for disease detection.',
            laborMultiplier: 1.8,
            usedIn: ['covid_testing', 'disease_diagnosis', 'research']
        },
        {
            id: 'rapid_antigen_test',
            name: 'Rapid Antigen Test',
            formula: 'Antibodies + Gold Nanoparticles → Lateral Flow Assay',
            ingredients: { Antibodies: 3, GoldNanoparticles: 2, Nitrocellulose: 2 },
            field: 'pharmaceuticals',
            category: 'Diagnostics',
            tier: 4,
            skillGain: 22,
            target: 400,
            icon: '📋',
            unlocksAt: 3800,
            value: 80,
            description: 'Rapid diagnostic test for point-of-care use.',
            laborMultiplier: 1.9,
            usedIn: ['rapid_testing', 'field_diagnostics', 'home_testing']
        }
    ]
};

// ============================================================================
// EXPORT ALL PHARMACEUTICALS RECIPES
// ============================================================================

export default PHARMACEUTICALS_RECIPES;
