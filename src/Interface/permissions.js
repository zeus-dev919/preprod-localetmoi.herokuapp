export const allowedRolesToEditPartnerFolder = [
    'ROLE_SALESMAN',
    'ROLE_CRP',
    'ROLE_SUPER_ADMIN',
    'ROLE_MANAGER',
    'ROLE_DEV_ADMIN'
];

export const allowedRolesToTransmitPartnerFolder = [
    {
        status: 'salesman',
        step: 1,
        roles: [
            'Commercial',
            'Commercial sédentaire',
            'Directeur Régional',
            'Directrice Régionale',
            'Directeur Commercial',
            'Chef de Groupe',
            'Directeur d\'Agence',
            'Directrice d\'Agence',
            'charge_relations_partenaires',
            'Chargé Relation Partenaires'
        ]
    },
    {
        status: 'assistant',
        step: 2,
        roles: [ 'Assistante Commerciale' ]
    },
    {
        status: 'planning',
        step: 3,
        roles: [ 'Planification' ]
    },
    {
        status: 'cpw',
        step: 4,
        roles: [
            'CPW',
            'CPW & SAV',
            'Chargé de Référencement',
            'Graphiste',
            'Chargé E-commerce',
            'chargée d\'ordonnancement',
            'Coach Graphiste',
            'Coach E-commerce',
            'Coach traffic Manager',
            'Coach CPW',
            'Coach CPW & SAV',
            'Manager'
        ]
    },
]

export const byPassRulesToEditDP = ['SI', 'Marketing', 'Développeur'];
