const CraftingRecipes = [
    {
        itemName:'stone axe',
        quantity:1,
        ingredients:[
            {itemName:'stone', quantity:1},
            {itemName:'stick', quantity:1}
        ],
        prerequisites:[

        ]
    },
    {
        itemName:'stone pickaxe',
        quantity:1,
        ingredients:[
            {itemName:'stone', quantity:1},
            {itemName:'stick', quantity:1}
        ],
        prerequisites:[
            
        ]
    },
    {
        itemName:'iron axe',
        quantity:1,
        ingredients:[
            {itemName:'iron', quantity:1},
            {itemName:'stick', quantity:1}
        ],
        prerequisites:[
            'discoveredIron'
        ]
    }
]

export default CraftingRecipes;