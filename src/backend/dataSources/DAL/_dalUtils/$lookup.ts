// $lookup('assets', '_id', 'type_id', 'itemInAssets'),

function $lookup(from: string, localField: string, foreignField: string, as: string, orCondition?: any[]) {
  return {
    $lookup: {
      from: from, // assets
      as: as, // itemInAssets
      let: {
        localVar: `$${localField}` // _id
      },
      pipeline: [
        orCondition && orCondition.length && {
          $match: {
            $or: orCondition
          }
        },
        {
          $match:
            {
              $expr:
                {
                  $and: [
                    {$eq: [`$${foreignField}`, "$$localVar"]}
                  ],
                },
            }
        },
      ].filter(a => a),
    }
  }
}


export {$lookup}
