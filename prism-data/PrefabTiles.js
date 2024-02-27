const prefabTiles = [
    {
        toolName: "Mountain",
        
        data: {
            actions:[],
            tileType: 'Mountain',
            visual: '⛰️'
        }
    },
    {
        toolName: "Woods",
        data: {
            description:'You are in the woods.',
            actions:[
                {
                    name:'collect sticks',
                    cooldown:0,
                    preconditions:[
                    ],
                    results:[
                        {
                            type:'item',
                            itemName: 'stick',
                            quantity:1
                        }
                    ]
                },
                {
                    name:'chop wood',
                    cooldown: 0,
                    preconditions: [
                        {
                            type: 'item',
                            itemType: 'axe',
                            itemWear: 1
                        }
                    ],
                    results:[
                        {
                            type:'item',
                            itemName: 'log',
                            quantity:4
                        }
                    ]
                }
            ],
            tileType: 'Woods',
            visual: '🌲'
        }
    },
    {
        toolName: "Camp",
        data: {
            actions:[],
            tileType: 'Camp',
            visual: '⛺'
        }
    },
    {
        toolName: "Mine",
        data: {
            description:'You are at a quarry.',
            actions:[
                {
                    name:'collect stones',
                    cooldown:1,
                    preconditions: [],
                    results: [
                        {
                            type:'item',
                            itemName:'stone',
                            quantity:'1'
                        }
                    ]
                },
                {
                    name:'mine',
                    cooldown: 0,
                    preconditions: [
                        {
                            type: 'item',
                            itemType: 'pickaxe',
                            itemWear: 1
                        }
                    ],
                    results:[
                        {
                            type:'random-item',
                            possibleDrops:[
                                {
                                    itemName: 'stone',
                                    quantity:4,
                                    probability: 0.5
                                },
                                {
                                    itemName: 'iron',
                                    quantity:4,
                                    probability: 0.3
                                },
                                {
                                    itemName: 'gold',
                                    quantity:4,
                                    probability: 0.15
                                },
                                {
                                    itemName: 'diamond',
                                    quantity:4,
                                    probability: 0.05
                                }
                            ]

                        },
                    ]
                }
            ],
            tileType: 'Mine',
            visual: '🪨'
        }
    },
    {
        toolName: "Blank",
        data:{
            actions:[],
            tileType: 'Blank',
            visual: '⬜'
        }
    }
]

export default prefabTiles;